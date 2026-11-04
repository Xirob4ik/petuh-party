import { loadScript, PlayerAdapter } from './types';

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export class YouTubeAdapter extends PlayerAdapter {
  readonly tolerance = 1.2;
  readonly seekCooldown = 2500;
  readonly supportsRate = false;
  private player: any = null;
  private holder: HTMLDivElement | null = null;
  private destroyed = false;

  constructor(private videoId: string) {
    super();
  }

  async mount(host: HTMLElement) {
    try {
      await loadScript('https://www.youtube.com/iframe_api', () => !!window.YT?.Player);
    } catch {
      throw new Error('Не удалось загрузить плеер YouTube. Проверьте, что youtube.com открывается');
    }
    if (this.destroyed) return;
    const YT = window.YT;
    this.holder = document.createElement('div');
    this.holder.className = 'player-frame';
    host.appendChild(this.holder);

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('YouTube-плеер не ответил')), 20000);
      this.player = new YT.Player(this.holder, {
        videoId: this.videoId,
        width: '100%',
        height: '100%',
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1, origin: location.origin },
        events: {
          onReady: () => {
            clearTimeout(timer);
            this.player.getIframe()?.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
            resolve();
          },
          onStateChange: (e: { data: number }) => {
            if (e.data === YT.PlayerState.PLAYING) this.emit({ type: 'play' });
            else if (e.data === YT.PlayerState.PAUSED) this.emit({ type: 'pause' });
            else if (e.data === YT.PlayerState.ENDED) this.emit({ type: 'ended' });
          },
          onError: (e: { data: number }) => {
            const msg =
              e.data === 101 || e.data === 150
                ? 'Владелец ролика запретил показывать его на других сайтах'
                : 'YouTube не может воспроизвести это видео';
            clearTimeout(timer);
            this.emit({ type: 'error', message: msg });
            reject(new Error(msg));
          },
        },
      });
    });
    if (!this.destroyed) this.emit({ type: 'ready' });
  }

  play() {
    this.player?.playVideo?.();
  }
  pause() {
    this.player?.pauseVideo?.();
  }
  seek(t: number) {
    this.player?.seekTo?.(t, true);
  }
  getTime() {
    const t = this.player?.getCurrentTime?.();
    return Number.isFinite(t) ? t : 0;
  }
  getDuration() {
    const d = this.player?.getDuration?.();
    return Number.isFinite(d) ? d : 0;
  }
  isPaused() {
    const s = this.player?.getPlayerState?.();
    // буферизация во время игры — не пауза
    return !(s === 1 || s === 3);
  }
  unmute() {
    this.player?.unMute?.();
  }
  setMuted(m: boolean) {
    if (m) this.player?.mute?.();
    else this.player?.unMute?.();
  }
  destroy() {
    this.destroyed = true;
    try {
      this.player?.destroy?.();
    } catch {
      /* ignore */
    }
    this.holder?.remove();
  }
}
