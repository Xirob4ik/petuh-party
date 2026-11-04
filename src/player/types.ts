export type AdapterEvent =
  | { type: 'ready' }
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'ended' }
  /** плеер сам сообщил о перемотке (HTML5) */
  | { type: 'seeked'; time: number }
  | { type: 'ad'; on: boolean }
  | { type: 'muted-autoplay' }
  | { type: 'error'; message: string };

export abstract class PlayerAdapter {
  /** Можно ли управлять плеером (у чужих iframe — нельзя). */
  readonly synced: boolean = true;
  /** Сообщает ли плеер о перемотке сам; иначе движок ловит скачки времени. */
  readonly reportsSeeks: boolean = false;
  /** Умеет ли плавно менять скорость (для мягкой подстройки). */
  readonly supportsRate: boolean = false;
  /** Допустимое расхождение (сек) при воспроизведении, после которого перематываем. */
  readonly tolerance: number = 1.5;
  /** Сколько ждать после перемотки, прежде чем снова мерить расхождение (мс). */
  readonly seekCooldown: number = 3000;

  emit: (e: AdapterEvent) => void = () => {};

  abstract mount(host: HTMLElement): Promise<void>;
  abstract play(): void;
  abstract pause(): void;
  abstract seek(t: number): void;
  abstract getTime(): number;
  abstract getDuration(): number;
  abstract isPaused(): boolean;
  abstract destroy(): void;
  setRate(_r: number): void {}
  unmute(): void {}
  /** Выключить/включить звук в плеере (клавиша M). */
  setMuted(_m: boolean): void {}
}

const scripts = new Map<string, Promise<void>>();

export function loadScript(src: string, ready: () => boolean, timeoutMs = 15000): Promise<void> {
  if (ready()) return Promise.resolve();
  const existing = scripts.get(src);
  if (existing) return existing;
  const p = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    const started = Date.now();
    const check = () => {
      if (ready()) return resolve();
      if (Date.now() - started > timeoutMs) return reject(new Error('timeout'));
      setTimeout(check, 50);
    };
    s.onload = check;
    s.onerror = () => reject(new Error('load error'));
    document.head.appendChild(s);
  }).catch((e) => {
    scripts.delete(src);
    throw e;
  });
  scripts.set(src, p);
  return p;
}

export function makeIframe(src: string, title: string): HTMLIFrameElement {
  const f = document.createElement('iframe');
  f.src = src;
  f.title = title;
  f.className = 'player-frame';
  f.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock; clipboard-write';
  f.allowFullscreen = true;
  f.setAttribute('frameborder', '0');
  f.referrerPolicy = 'strict-origin-when-cross-origin';
  return f;
}
