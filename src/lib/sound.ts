import { storage } from './storage';

const KEY = 'pp.sound';
let ctx: AudioContext | null = null;

export const isSoundOn = () => storage.get(KEY) !== 'off';
export const setSoundOn = (on: boolean) => storage.set(KEY, on ? 'on' : 'off');

/** Короткий тихий щелчок о новом сообщении. */
export function playChime() {
  if (!isSoundOn()) return;
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const t = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.05, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    gain.connect(ctx.destination);
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(990, t);
    osc.frequency.exponentialRampToValueAtTime(1480, t + 0.07);
    osc.connect(gain);
    osc.start(t);
    osc.stop(t + 0.18);
  } catch {
    /* звук — не главное */
  }
}

/** Мягкий «поп», когда пролетает реакция. Для петуха — звук посмешнее. */
export function playPop(emoji?: string) {
  if (!isSoundOn()) return;
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const t = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    const osc = ctx.createOscillator();
    osc.connect(gain);
    const rooster = emoji === '🐔' || emoji === '🐓';
    const len = rooster ? 0.09 : 0.07;
    osc.type = rooster ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(rooster ? 650 : 420, t);
    osc.frequency.exponentialRampToValueAtTime(rooster ? 880 : 740, t + len * 0.45);
    osc.frequency.exponentialRampToValueAtTime(rooster ? 520 : 260, t + len);
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + len);
    osc.start(t);
    osc.stop(t + len);
  } catch {
    /* звук — не главное */
  }
}
