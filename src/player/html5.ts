import { loadScript, makeIframe, PlayerAdapter } from './types';

declare global {
  interface Window {
    Hls?: any;
  }
}

const HLS_CDN = [
  'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.20/hls.min.js',
  'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js',
];

/** Прямые ссылки на .mp4/.webm и потоки .m3u8. */
export class Html5Adapter extends PlayerAdapter {
  readonly reportsSeeks = true;
  readonly supportsRate = true;
  readonly tolerance = 1.0;
  readonly seekCooldown = 1200;
  private video: HTMLVideoElement | null = null;
  private hls: any = null;
  private commandedSeek = -1e9;

  constructor(private src: { url: string; hls: boolean }) {
    super();
  }

  async mount(host: HTMLElement) {
    const v = document.createElement('video');
    v.className = 'player-frame';
    v.controls = true;
    v.playsInline = true;
    v.preload = 'auto';
    this.video = v;
    host.appendChild(v);

    v.addEventListener('play', () => this.emit({ type: 'play' }));
    v.addEventListener('pause', () => {
      if (!v.ended) this.emit({ type: 'pause' });
    });
    v.addEventListener('ended', () => this.emit({ type: 'ended' }));
    v.addEventListener('seeked', () => {
      if (performance.now() - this.commandedSeek > 800) this.emit({ type: 'seeked', time: v.currentTime });
    });

    const ready = new Promise<void>((resolve, reject) => {
      v.addEventListener('loadedmetadata', () => resolve(), { once: true });
      v.addEventListener(
        'error',
        () => reject(new Error('Не удалось открыть файл. Нужна прямая ссылка на .mp4, .webm или .m3u8, доступная без входа')),
        { once: true },
      );
      setTimeout(() => reject(new Error('Файл не загружается. Проверьте ссылку')), 30000);
    });

    if (this.src.hls && !v.canPlayType('application/vnd.apple.mpegurl')) {
      let loaded = false;
      for (const cdn of HLS_CDN) {
        try {
          await loadScript(cdn, () => !!window.Hls);
          loaded = true;
          break;
        } catch {
          /* следующий CDN */
        }
      }
      if (!loaded || !window.Hls?.isSupported()) throw new Error('Браузер не умеет играть поток .m3u8');
      this.hls = new window.Hls({ maxBufferLength: 30 });
      this.hls.on(window.Hls.Events.ERROR, (_: unknown, data: any) => {
        if (data?.fatal) this.emit({ type: 'error', message: 'Поток .m3u8 не загружается' });
      });
      this.hls.loadSource(this.src.url);
      this.hls.attachMedia(v);
    } else {
      v.src = this.src.url;
    }

    await ready;
    this.emit({ type: 'ready' });
  }

  play() {
    const v = this.video;
    if (!v) return;
    v.play().catch((err: DOMException) => {
      // автозапуск со звуком запрещён — пробуем без звука и просим включить
      if (err?.name === 'NotAllowedError' && !v.muted) {
        v.muted = true;
        v.play()
          .then(() => this.emit({ type: 'muted-autoplay' }))
          .catch(() => {});
      }
    });
  }
  pause() {
    this.video?.pause();
  }
  seek(t: number) {
    if (!this.video) return;
    this.commandedSeek = performance.now();
    this.video.currentTime = t;
  }
  getTime() {
    return this.video?.currentTime ?? 0;
  }
  getDuration() {
    const d = this.video?.duration;
    return d && Number.isFinite(d) ? d : 0;
  }
  isPaused() {
    return this.video ? this.video.paused : true;
  }
  setRate(r: number) {
    if (this.video && Math.abs(this.video.playbackRate - r) > 0.001) this.video.playbackRate = r;
  }
  unmute() {
    if (this.video) this.video.muted = false;
  }
  setMuted(m: boolean) {
    if (this.video) this.video.muted = m;
  }
  destroy() {
    this.hls?.destroy();
    if (this.video) {
      this.video.pause();
      this.video.removeAttribute('src');
      this.video.load();
      this.video.remove();
    }
  }
}

/** Чужой плеер во фрейме: показываем, но управлять им нельзя. */
export class IframeAdapter extends PlayerAdapter {
  readonly synced = false;
  private iframe: HTMLIFrameElement | null = null;
  constructor(private url: string) {
    super();
  }
  async mount(host: HTMLElement) {
    this.iframe = makeIframe(this.url, 'Видео');
    host.appendChild(this.iframe);
    this.emit({ type: 'ready' });
  }
  play() {}
  pause() {}
  seek() {}
  getTime() {
    return 0;
  }
  getDuration() {
    return 0;
  }
  isPaused() {
    return true;
  }
  destroy() {
    this.iframe?.remove();
  }
}
