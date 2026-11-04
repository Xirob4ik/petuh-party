import type { VideoState } from '../../shared/types';
import type { AdapterEvent, PlayerAdapter } from './types';

export type SyncStatus = 'loading' | 'synced' | 'syncing' | 'blocked' | 'ad' | 'error' | 'unsynced';

export interface SyncInfo {
  status: SyncStatus;
  error?: string;
  drift: number;
  time: number;
  duration: number;
  playing: boolean;
  mutedAutoplay: boolean;
}

interface Options {
  /** серверное время, мс */
  now: () => number;
  /** действие пользователя, которое нужно разослать всем */
  send: (action: 'play' | 'pause' | 'seek', pos: number) => void;
  onInfo: (info: SyncInfo) => void;
}

const TICK_MS = 250;

// Журнал решений движка: localStorage.setItem('pp.debug', '1') и перезагрузить страницу
const DEBUG = (() => {
  try {
    return localStorage.getItem('pp.debug') === '1';
  } catch {
    return false;
  }
})();
const log = (...a: unknown[]) => DEBUG && console.log('[sync]', ...a);

/**
 * Сводит плеер к состоянию комнаты.
 *
 * Правило одно: сервер хранит {playing, pos, at}. Ожидаемая позиция
 * = pos + (сейчас − at), если видео идёт. Раз в полсекунды движок
 * сравнивает плеер с ожидаемым и поправляет (play/pause/seek, а для файлов —
 * мягко подкручивает скорость).
 *
 * События плеера считаются действием пользователя, только если они
 * расходятся с состоянием комнаты и не вызваны нашей же командой.
 */
export class SyncEngine {
  private state: VideoState;
  private ready = false;
  private error: string | undefined;
  private adOn = false;
  private mutedAutoplay = false;
  private timer: number;
  private ticks = 0;
  private destroyed = false;

  private lastPlayCmd = { at: -1e9, play: false };
  private lastSeekCmd = -1e9;
  private readyAt = 0;
  private playAttempts = 0;

  // адаптивный допуск: если плеер «не дотягивает» точной перемоткой
  private tol: number;
  private tolV = -1;
  private correctiveSeeks = 0;
  private rate = 1;

  // детектор перемоток по скачкам времени
  private jumpT: number | null = null;
  private jumpWall = 0;
  private pendingSeek: { t: number; wall: number } | null = null;
  private lastDuration = 0;
  private durationChangedAt = 0;
  private progressT: number | null = null;
  private lastProgressAt = 0;

  constructor(
    private adapter: PlayerAdapter,
    initial: VideoState,
    private opt: Options,
  ) {
    this.state = initial;
    this.tol = adapter.tolerance;
    adapter.emit = (e) => this.onEvent(e);
    this.timer = window.setInterval(() => this.tick(), TICK_MS);
  }

  async mount(host: HTMLElement) {
    try {
      await this.adapter.mount(host);
    } catch (err) {
      if (this.destroyed) return;
      this.error = (err as Error).message || 'Плеер не загрузился';
      this.publish();
    }
  }

  destroy() {
    this.destroyed = true;
    clearInterval(this.timer);
    this.adapter.destroy();
  }

  /** Новое состояние от сервера. */
  setState(s: VideoState) {
    log('state', s.v, s.playing ? 'playing' : 'paused', s.pos.toFixed(2), s.last?.action);
    const changed = s.v !== this.state.v || s.playing !== this.state.playing || s.pos !== this.state.pos;
    this.state = s;
    if (changed) {
      this.resetTolerance();
      if (this.ticks > 0) this.reconcile();
    }
  }

  // ── действия из интерфейса ───────────────────────
  togglePlay() {
    if (!this.ready || !this.adapter.synced) return;
    this.userAction(this.state.playing ? 'pause' : 'play', this.currentTime());
    this.reconcile();
  }

  seekBy(delta: number) {
    if (!this.ready || !this.adapter.synced) return;
    const dur = this.adapter.getDuration();
    let t = Math.max(0, this.expected() + delta);
    if (dur > 0) t = Math.min(t, dur - 0.5);
    this.userAction('seek', t);
    this.reconcile();
  }

  private muted = false;

  /** Выключить/включить звук в плеере. Возвращает новое состояние. */
  toggleMute(): boolean {
    this.muted = !this.muted;
    this.adapter.setMuted(this.muted);
    if (!this.muted) this.mutedAutoplay = false;
    return this.muted;
  }

  /** Принудительно подтянуться к комнате. */
  resync() {
    this.resetTolerance();
    this.lastSeekCmd = -1e9;
    this.lastPlayCmd.at = -1e9;
    this.playAttempts = 0;
    this.reconcile(true);
  }

  /** Нажатие пользователя, чтобы браузер разрешил звук/автозапуск. */
  unblock() {
    this.adapter.unmute();
    this.mutedAutoplay = false;
    this.playAttempts = 0;
    if (this.state.playing) this.adapter.play();
    this.publish();
  }

  /** Позиция для отчёта другим участникам. */
  report() {
    return {
      pos: this.currentTime(),
      playing: this.ready ? !this.adapter.isPaused() : false,
      state: this.error
        ? ('error' as const)
        : !this.ready
          ? ('loading' as const)
          : this.adOn
            ? ('ad' as const)
            : this.isBlocked()
              ? ('blocked' as const)
              : ('ok' as const),
    };
  }

  // ── внутреннее ───────────────────────────────────
  private currentTime() {
    return this.ready ? this.adapter.getTime() : this.expected();
  }

  expected(now = this.opt.now()) {
    const s = this.state;
    let t = s.playing ? s.pos + (now - s.at) / 1000 : s.pos;
    const dur = this.ready ? this.adapter.getDuration() : 0;
    if (dur > 0) t = Math.min(t, dur);
    return Math.max(0, t);
  }

  private resetTolerance() {
    this.tol = this.adapter.tolerance;
    this.tolV = this.state.v;
    this.correctiveSeeks = 0;
  }

  private userAction(action: 'play' | 'pause' | 'seek', pos: number) {
    const now = this.opt.now();
    // оптимистично считаем, что сервер примет — чтобы не «откатить» себя до ответа
    this.state = {
      ...this.state,
      playing: action === 'play' ? true : action === 'pause' ? false : this.state.playing,
      pos,
      at: now,
    };
    this.resetTolerance();
    this.jumpT = null;
    log('user', action, pos.toFixed(2));
    this.opt.send(action, pos);
  }

  private isOwnPlayCmd(play: boolean) {
    return this.lastPlayCmd.play === play && performance.now() - this.lastPlayCmd.at < 2500;
  }

  private atEnd() {
    const dur = this.adapter.getDuration();
    return dur > 0 && this.expected() >= dur - 0.6;
  }

  private isBlocked() {
    return this.state.playing && this.adapter.isPaused() && this.playAttempts >= 2 && !this.atEnd();
  }

  private onEvent(e: AdapterEvent) {
    if (this.destroyed) return;
    log('event', e.type, 'time' in e ? e.time : '', 'room', this.state.playing ? 'playing' : 'paused');
    switch (e.type) {
      case 'ready':
        this.ready = true;
        this.readyAt = performance.now();
        this.error = undefined;
        this.reconcile();
        break;
      case 'error':
        this.error = e.message;
        break;
      case 'ad':
        this.adOn = e.on;
        if (!e.on) this.resync();
        break;
      case 'muted-autoplay':
        this.mutedAutoplay = true;
        break;
      case 'play':
        this.playAttempts = 0;
        if (!this.ready || !this.adapter.synced) break;
        // некоторые плееры сами стартуют после программной перемотки или сразу после загрузки
        if (this.recentlyCommanded()) break;
        if (!this.state.playing && !this.isOwnPlayCmd(true)) this.userAction('play', this.adapter.getTime());
        break;
      case 'pause':
        if (!this.ready || !this.adapter.synced) break;
        // свёрнутая вкладка на телефоне ставит видео на паузу — это не решение пользователя
        if (document.visibilityState === 'hidden') break;
        if (this.recentlyCommanded()) break;
        if (this.state.playing && !this.isOwnPlayCmd(false) && !this.atEnd()) {
          this.userAction('pause', this.adapter.getTime());
        }
        break;
      case 'ended':
        if (this.ready && this.state.playing && !this.isOwnPlayCmd(false)) {
          this.userAction('pause', this.adapter.getDuration() || this.adapter.getTime());
        }
        break;
      case 'seeked':
        this.onUserSeek(e.time);
        break;
    }
    this.publish();
  }

  /** Сразу после нашей перемотки события плеера — побочный эффект, а не человек. */
  private recentlyCommanded() {
    return performance.now() - this.lastSeekCmd < 2000;
  }

  private onUserSeek(t: number) {
    if (!this.ready || !this.adapter.synced) return;
    if (performance.now() - this.lastSeekCmd < 1500) return; // это мы перематывали
    const exp = this.expected();
    if (Math.abs(t - exp) <= this.tol + 0.5) return; // и так на месте
    // «прыжок в самое начало» посреди фильма — почти всегда реклама или перезапуск плеера
    if (!this.adapter.reportsSeeks && t < 1.5 && exp > 10) return;
    this.userAction('seek', t);
  }

  /** Следим, идёт ли время в плеере: если стоит при воспроизведении — это буферизация. */
  private trackProgress() {
    const t = this.adapter.getTime();
    const wall = performance.now();
    if (this.progressT === null || Math.abs(t - this.progressT) > 0.01 || this.adapter.isPaused()) {
      this.lastProgressAt = wall;
    }
    this.progressT = t;
  }

  private isStalled() {
    const since = performance.now() - this.lastProgressAt;
    // не дольше 8 секунд: если плеер завис совсем, всё-таки пробуем перемотать
    return since > 1300 && since < 8000;
  }

  private tick() {
    if (this.destroyed) return;
    this.ticks++;
    if (this.ready && this.adapter.synced && !this.adOn) this.trackProgress();
    if (this.ready && this.adapter.synced && !this.adOn) {
      if (!this.adapter.reportsSeeks) this.detectJump();
      if (this.ticks % 2 === 0) this.reconcile();
    }
    if (this.ticks % 2 === 0) this.publish();
  }

  /** Плееры VK/YouTube/Rutube не сообщают о перемотке — ловим скачок времени. */
  private detectJump() {
    const wall = performance.now();
    const t = this.adapter.getTime();
    const playing = !this.adapter.isPaused();
    // смена длительности = в плеере сменился ролик (реклама ↔ фильм): скачки времени не в счёт
    const dur = this.adapter.getDuration();
    if (Math.abs(dur - this.lastDuration) > 1) {
      this.lastDuration = dur;
      this.durationChangedAt = wall;
    }
    const quiet =
      wall - this.lastSeekCmd < 1800 ||
      wall - this.lastPlayCmd.at < 2500 ||
      wall - this.readyAt < 3000 ||
      wall - this.durationChangedAt < 3000;

    if (this.pendingSeek) {
      // подтверждаем: время продолжилось от новой точки, а не мигнуло
      const p = this.pendingSeek;
      const elapsed = playing ? (wall - p.wall) / 1000 : 0;
      if (!quiet && Math.abs(t - (p.t + elapsed)) < 1.5) this.onUserSeek(t);
      else log('jump dropped', { quiet, t, pt: p.t });
      this.pendingSeek = null;
    } else if (this.jumpT !== null && !quiet) {
      const dt = (wall - this.jumpWall) / 1000;
      const dp = t - this.jumpT;
      const jumped = playing && dt < 2 ? Math.abs(dp) > Math.max(1.2, 2.5 * dt) : Math.abs(dp) > 1.2;
      if (jumped) {
        log('jump?', this.jumpT.toFixed(2), '→', t.toFixed(2));
        this.pendingSeek = { t, wall };
      }
    }
    this.jumpT = t;
    this.jumpWall = wall;
  }

  private reconcile(force = false) {
    const a = this.adapter;
    if (!this.ready || !a.synced || this.adOn || this.destroyed) return;
    if (this.tolV !== this.state.v) this.resetTolerance();

    const now = performance.now();
    const want = this.state.playing;
    const paused = a.isPaused();
    const ended = this.atEnd();

    // 1. play / pause
    if (want && paused && !ended) {
      if (now - this.lastPlayCmd.at > 2500 || force) {
        this.seekTo(this.expected() + 0.2);
        log('cmd play');
        a.play();
        this.lastPlayCmd = { at: now, play: true };
        this.playAttempts++;
      }
      return;
    }
    if (!want && !paused) {
      if (now - this.lastPlayCmd.at > 1200 || force) {
        log('cmd pause');
        a.pause();
        this.lastPlayCmd = { at: now, play: false };
      }
      return;
    }
    this.playAttempts = 0;
    if (ended && want) return;

    // 2. позиция
    const drift = a.getTime() - this.expected();
    const abs = Math.abs(drift);
    const tol = want ? this.tol : Math.min(this.tol, 0.6);

    if (abs > tol) {
      // похоже, пользователь только что перемотал — ждём подтверждения, а не откатываем
      if (this.pendingSeek && !force) return;
      if (now - this.lastSeekCmd < a.seekCooldown && !force) return;
      // плеер догружает видео (в том числе после перемотки самим пользователем) — не мешаем
      if (want && this.isStalled() && !force) return;
      // плеер не попадает точно — после пары попыток расширяем допуск, чтобы не дёргать
      if (this.correctiveSeeks >= 2 && abs < 4) {
        this.tol = Math.min(4, abs + 0.4);
        return;
      }
      this.correctiveSeeks++;
      const lead = want && !a.supportsRate ? 0.35 : 0;
      this.seekTo(this.expected() + lead);
      return;
    }

    // 3. мягкая подстройка скорости для файлов: без рывков
    if (a.supportsRate) {
      let rate = 1;
      if (want && abs > 0.12) rate = 1 - Math.max(-0.08, Math.min(0.08, drift * 0.25));
      else if (want && abs > 0.04 && this.rate !== 1) rate = this.rate;
      if (rate !== this.rate) {
        this.rate = rate;
        a.setRate(rate);
      }
    }
  }

  private seekTo(t: number) {
    const dur = this.adapter.getDuration();
    if (dur > 0) t = Math.min(t, Math.max(0, dur - 0.3));
    t = Math.max(0, t);
    if (Math.abs(this.adapter.getTime() - t) < 0.25) return;
    this.lastSeekCmd = performance.now();
    this.jumpT = null;
    this.pendingSeek = null;
    log('seekTo', t.toFixed(2), 'from', this.adapter.getTime().toFixed(2));
    this.adapter.seek(t);
  }

  private publish() {
    if (this.destroyed) return;
    const a = this.adapter;
    let status: SyncStatus;
    const drift = this.ready && a.synced ? a.getTime() - this.expected() : 0;
    if (this.error) status = 'error';
    else if (!this.ready) status = 'loading';
    else if (!a.synced) status = 'unsynced';
    else if (this.adOn) status = 'ad';
    else if (this.isBlocked()) status = 'blocked';
    else if (Math.abs(drift) > this.tol || (this.state.playing === a.isPaused() && !this.atEnd())) status = 'syncing';
    else status = 'synced';

    this.opt.onInfo({
      status,
      error: this.error,
      drift,
      time: this.ready ? a.getTime() : this.expected(),
      duration: this.ready ? a.getDuration() : 0,
      playing: this.state.playing,
      mutedAutoplay: this.mutedAutoplay,
    });
  }
}
