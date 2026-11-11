// DJ Петух — ведущий комнаты. Следит за тем, что происходит, и иногда коротко комментирует.
// Работает у каждого зрителя в браузере, сервер не нужен. Реплики редкие: общий интервал,
// свой интервал у каждого события и очередь, в которой старые реплики выбрасываются.
import { useEffect, useRef, useState } from 'react';
import type { Message, Person, Position, VideoState } from '../../shared/types';
import type { SyncInfo } from '../player/sync';
import { storage } from './storage';
import { formatTime } from './util';

export type DjMood = 'hi' | 'hype' | 'party' | 'cry' | 'laugh' | 'shock' | 'sleep' | 'think' | 'love' | 'wink' | 'cool';

export interface DjLine {
  id: number;
  text: string;
  mood: DjMood;
}

const KEY = 'pp.dj';
export const isDjOn = () => storage.get(KEY) !== 'off';
export const setDjOn = (on: boolean) => storage.set(KEY, on ? 'on' : 'off');

/** 0 — болтовня, 1 — обычное событие, 2 — важное (кто-то пришёл, новое видео) */
type Prio = 0 | 1 | 2;

interface Pending {
  key: string;
  text: string;
  mood: DjMood;
  prio: Prio;
  at: number;
}

interface Inputs {
  loaded: boolean;
  meId: string;
  video: VideoState;
  people: Person[];
  positions: Record<string, Position>;
  messages: Message[];
  floats: { id: string; emoji: string }[];
  info: SyncInfo | null;
  serverNow: () => number;
}

const MIN = 60_000;
const GAP_AFTER_LINE = 2500; // пауза между репликами
const CHATTER_GAP = 50_000; // болтовня — не чаще раза в 50 с
const STALE = 20_000; // реплика, которая ждала дольше, уже не к месту

const CRY = ['😭', '😢', '🥲', '😿'];
const LAUGH = ['😂', '🤣', '💀', '😹', '😆'];
const LOVE = ['😍', '❤️', '🥰', '💜', '😘', '❤'];
const SHOCK = ['😱', '😳', '🤯', '😨', '🫢'];

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
const fill = (t: string, vars: Record<string, string | number>) => t.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
const isAdultSticker = (id?: string) => !!id && /^[xy]-/.test(id);

function roomPos(v: VideoState, at: number) {
  return v.playing ? v.pos + (at - v.at) / 1000 : v.pos;
}

function fmtDelta(sec: number) {
  const s = Math.round(Math.abs(sec));
  if (s < 60) return `${s} с`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r ? `${m} мин ${r} с` : `${m} мин`;
}

// ── реплики ───────────────────────────────────────────────
const L = {
  hello: {
    morning: ['Доброе утро! Кино с утра — это сильно ☕', 'Утренний сеанс открыт. Кукареку! 🌅'],
    day: ['Добрый день! За пультом DJ Петух 🎧', 'Йо! DJ Петух на связи, сеанс начинается'],
    evening: ['Добрый вечер! Свет гасим, звук погромче 🎧', 'Вечерний сеанс! DJ Петух за пультом'],
    night: ['Доброй ночи, ночные петухи 🌙', 'Ночной сеанс? Уважаю. DJ Петух с вами 🌙'],
  },
  aloneFirst: ['Ты тут первый — кидай друзьям ссылку на комнату', 'Пока пусто. Скопируй код комнаты сверху и зови своих'],
  crowdHello: ['В комнате уже {n}. Погнали!', 'Нас {n} — можно начинать 🍿'],
  join: [
    '{name} в здании! 🎉',
    'К нам присоединяется {name}',
    'Встречайте: {name} 👋',
    '{name} залетает на сеанс',
    'О, {name}! Садись, попкорн справа 🍿',
  ],
  leave: ['{name} покидает зал. Возвращайся!', 'Минус один: {name} вышел из комнаты', '{name} ушёл за чаем? Ждём 🫖'],
  crowd: {
    4: ['Нас уже четверо! Почти полный зал 🎟'],
    6: ['Шестеро в комнате! Это уже вечеринка 🪩'],
    10: ['Десять человек! Петух в шоке. Аншлаг! 🎟'],
  } as Record<number, string[]>,
  alone: ['Скучно одному? Позови друзей — код комнаты сверху', 'Тут только мы с тобой. Может, позовём кого-нибудь?'],
  source: [
    'Включаем «{title}». Попкорн готов? 🍿',
    'На экране — «{title}». Поехали!',
    'Свежий выбор: «{title}». Устраивайтесь поудобнее',
    '«{title}» — хороший выбор, одобряю 🎧',
  ],
  sourceNoTitle: ['Новое видео! Поехали 🍿', 'Меняем пластинку — новое видео на экране 🎧'],
  indecisive: ['Третье видео за пару минут. Выбираем дольше, чем смотрим 😅', 'Никак не определимся? Классика вечера 😄'],
  backFromPause: ['С возвращением! Продолжаем ▶️', 'Все на местах? Поехали дальше', 'Перерыв окончен, кино продолжается'],
  breakAfterLong: ['Перерыв? Заслуженно. Я подожду ⏸', 'Пауза после долгого просмотра — разомните ноги'],
  pauseSpam: ['Кто там балуется с паузой? 👀', 'Пауза, плей, пауза… DJ тоже так умеет 🎛'],
  longPause5: ['Пауза уже 5 минут. Вы там живы? 👀', 'Пять минут тишины… Кто ушёл за едой?'],
  longPause15: ['Кукареку! Пауза уже 15 минут, все ушли за чаем? 🐓', 'Я тут всё ещё жду. Продолжим? ⏰'],
  seekFwd: ['{who} перематывает на {d} вперёд. Скучная сцена? ⏩', '{who}: +{d}. Надеюсь, ничего важного не пропустили', 'Прыжок на {d} вперёд! Спойлеры на подходе ⏩'],
  seekBack: ['{who} отматывает на {d} назад — пересматриваем момент ⏪', 'Назад на {d}? Понимаю, такое надо увидеть дважды'],
  fromStart: ['С самого начала! Классика ⏮', 'Начинаем заново. Второй круг — лучший'],
  lag: ['{name} отстаёт на {d}. Сейчас подтянется — я слежу 👀', 'У {name} задержка {d}. Интернет, держись!'],
  synced: ['Все снова смотрят вместе ✓', 'Синхрон восстановлен, вы молодцы ✓'],
  ad: ['{name} смотрит рекламу ВК. Держись, скоро вернёшься!', 'У {name} реклама. Поддержим морально 🫡'],
  blocked: ['{name}, нажми на видео — браузер не дал его запустить', 'У {name} не запустилось видео. Одно нажатие по плееру — и всё ок'],
  cry: ['Уже {n} 😭 за минуту. Хороший фильм, значит', 'Плачем всем залом. Платочки раздаю 🤧', 'Кто-то режет лук? 😭'],
  laugh: ['Зал лежит 💀', 'Вот это вы ржёте! 😂', 'Смех на весь район 🤣'],
  hype: ['Вот это движ! 🔥', 'Экран в огне! 🔥🔥', 'Реакций больше, чем кадров 🪩'],
  love: ['Сколько любви в зале 💜', 'Ой, тут романтика 😍'],
  shock: ['Все в шоке. Я тоже 😱', 'ЧТО. ТОЛЬКО. ЧТО. ПРОИЗОШЛО 🤯'],
  chatBurst: ['Чат кипит! Фильм тоже идёт, если что 😏', 'Столько сообщений — я не успеваю читать 💬'],
  stickerWar: ['Стикерная война! ⚔️', 'Стикеров больше, чем слов. Одобряю'],
  adult: ['Ого. Я ничего не видел 🙈', 'Тут дети… а, нет, только петухи. Продолжайте 🙈', 'Кхм. DJ Петух делает вид, что занят пультом 🎛'],
  image: ['Покажите и мне! А, вижу 👀', 'Фотограф в зале 📸'],
  called: ['Кто звал DJ Петуха? 🎧', 'Я тут! Пульт под контролем 🎛', 'Кукареку! Слушаю 🐓'],
  spoiler: ['Без спойлеров, а то клюну! 🐓', 'Кто сказал «спойлер»? Я слежу 👀'],
  bored: ['Скучно? Киньте 🔥 на экран — оживим зал', 'Скука — это когда нет попкорна. Проверьте запасы 🍿'],
  left: ['До конца — {d}', 'Осталось {d}. Держимся!'],
  silence: ['Тишина в чате… Всем норм? 🤫', 'Все так увлеклись, что забыли про чат. Хороший знак'],
  watch: {
    60: ['Час пролетел незаметно ⏱', 'Уже час смотрим. Нормальный темп!'],
    120: ['Два часа! Разомните шеи 🙆', 'Два часа вместе. Красиво'],
    180: ['Три часа. Может, водички? 💧', 'Три часа — марафонцы в зале 🏃'],
    240: ['Четыре часа! Вы легенды 🏆', 'Четыре часа подряд. DJ Петух гордится'],
    300: ['Пять часов… Я начинаю засыпать 😴', 'Пять часов! Это уже рекорд комнаты'],
  } as Record<number, string[]>,
  nearEnd: ['Финишная прямая! Последние минуты 🏁', 'Скоро финал. Не отвлекаемся!'],
  ended: ['Финал! 👏 Что смотрим дальше?', 'Конец! Аплодисменты 👏 Ставим следующее?'],
  midnight: ['Полночь. Самое время для ужастика 🕛', 'Двенадцать часов! Карета превращается в тыкву 🎃'],
  late: ['Три часа ночи. Настоящие ночные петухи 🌙', 'Три ночи… Завтра будет тяжело, но оно того стоит'],
  dawn: ['Светает! Вы смотрели всю ночь? 🌅', 'Пять утра. Скоро мне кукарекать по работе 🐓'],
} as const;

export function useDjHost(inp: Inputs) {
  const [line, setLine] = useState<DjLine | null>(null);
  const inpRef = useRef(inp);
  inpRef.current = inp;

  // общее состояние движка — в одном ref, чтобы не дёргать React
  const st = useRef({
    seq: 0,
    showing: null as (Pending & { until: number }) | null,
    queue: [] as Pending[],
    lastSpoke: 0,
    lastEnd: 0,
    lastByKey: new Map<string, number>(),
    lastText: new Map<string, string>(),
    timer: 0 as unknown as ReturnType<typeof setTimeout>,
    // наблюдение
    greeted: false,
    prevOnline: null as Set<string> | null,
    crowdSaid: new Set<number>(),
    aloneSince: 0,
    prevVideo: null as VideoState | null,
    sourceChanges: [] as number[],
    toggles: [] as number[],
    playingSince: 0,
    pausedSince: 0,
    pauseSaid: new Set<number>(),
    lagging: new Set<string>(),
    seenFloats: new Set<string>(),
    emojiHits: [] as { kind: string; t: number }[],
    prevReactCount: new Map<string, number>(),
    seenMsgs: new Set<string>(),
    msgTimes: [] as number[],
    stickerTimes: [] as number[],
    lastMsgAt: Date.now(),
    watchedSec: 0,
    watchSaid: new Set<number>(),
    endSaidFor: '',
    nearSaidFor: '',
    clockSaid: new Set<string>(),
  });

  // ── показ реплик ─────────────────────────────────────
  const pump = () => {
    const s = st.current;
    if (s.showing) return;
    const now = Date.now();
    s.queue = s.queue.filter((p) => now - p.at < STALE);
    if (!s.queue.length) return;
    const wait = s.lastEnd + GAP_AFTER_LINE - now;
    if (wait > 0) {
      clearTimeout(s.timer);
      s.timer = setTimeout(pump, wait);
      return;
    }
    s.queue.sort((a, b) => b.prio - a.prio || a.at - b.at);
    const next = s.queue.shift()!;
    show(next);
  };

  const show = (p: Pending) => {
    const s = st.current;
    const dur = Math.min(9000, 4200 + p.text.length * 45);
    s.showing = { ...p, until: Date.now() + dur };
    s.lastSpoke = Date.now();
    setLine({ id: ++s.seq, text: p.text, mood: p.mood });
    clearTimeout(s.timer);
    s.timer = setTimeout(hide, dur);
  };

  const hide = () => {
    const s = st.current;
    s.showing = null;
    s.lastEnd = Date.now();
    setLine(null);
    clearTimeout(s.timer);
    s.timer = setTimeout(pump, GAP_AFTER_LINE);
  };

  /** Предложить реплику. cooldown — сколько молчать об этом событии после. */
  const say = (key: string, variants: readonly string[], mood: DjMood, prio: Prio, cooldown: number, vars: Record<string, string | number> = {}) => {
    if (!isDjOn()) return;
    const s = st.current;
    const now = Date.now();
    if (now - (s.lastByKey.get(key) ?? -Infinity) < cooldown) return;
    if (prio === 0 && now - s.lastSpoke < CHATTER_GAP) return;
    if (s.queue.some((q) => q.key === key)) return;
    const prev = s.lastText.get(key);
    const pool = variants.length > 1 ? variants.filter((v) => v !== prev) : variants;
    const tpl = pick(pool as string[]);
    s.lastText.set(key, tpl);
    s.lastByKey.set(key, now);
    const p: Pending = { key, text: fill(tpl, vars), mood, prio, at: now };
    // важное перебивает болтовню на экране
    if (s.showing && prio === 2 && s.showing.prio === 0) {
      s.showing = null;
      s.lastEnd = 0;
      show(p);
      return;
    }
    s.queue.push(p);
    if (s.queue.length > 4) s.queue = s.queue.sort((a, b) => b.prio - a.prio || b.at - a.at).slice(0, 4);
    pump();
  };

  const dismiss = () => {
    if (st.current.showing) hide();
  };

  useEffect(() => () => clearTimeout(st.current.timer), []);

  const nameOf = (id: string) => inpRef.current.people.find((p) => p.id === id)?.name ?? 'Кто-то';

  // ── приветствие ─────────────────────────────────────
  useEffect(() => {
    const s = st.current;
    if (!inp.loaded || s.greeted) return;
    s.greeted = true;
    const t = setTimeout(() => {
      const h = new Date().getHours();
      const part = h >= 5 && h < 12 ? 'morning' : h >= 12 && h < 18 ? 'day' : h >= 18 ? 'evening' : 'night';
      say('hello', L.hello[part], 'hi', 2, 10 * MIN);
      const n = inpRef.current.people.filter((p) => p.online).length;
      if (n <= 1) say('aloneFirst', L.aloneFirst, 'think', 1, 10 * MIN);
      else say('crowdHello', L.crowdHello, 'party', 1, 10 * MIN, { n });
    }, 1400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inp.loaded]);

  // ── кто пришёл, кто ушёл ─────────────────────────────
  useEffect(() => {
    const s = st.current;
    if (!inp.loaded) return;
    const online = new Set(inp.people.filter((p) => p.online).map((p) => p.id));
    if (s.prevOnline) {
      for (const id of online)
        if (!s.prevOnline.has(id) && id !== inp.meId) say(`join:${id}`, L.join, 'party', 2, 2 * MIN, { name: nameOf(id) });
      for (const id of s.prevOnline)
        if (!online.has(id) && id !== inp.meId) say(`leave:${id}`, L.leave, 'cry', 1, 2 * MIN, { name: nameOf(id) });
      for (const n of [10, 6, 4])
        if (online.size >= n && !s.crowdSaid.has(n)) {
          s.crowdSaid.add(n);
          say(`crowd${n}`, L.crowd[n], 'shock', 1, 30 * MIN);
          break;
        }
    }
    s.prevOnline = online;
    if (online.size > 1) s.aloneSince = 0;
    else if (!s.aloneSince) s.aloneSince = Date.now();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inp.people, inp.loaded]);

  // ── видео: смена, пауза, перемотка ───────────────────
  useEffect(() => {
    const s = st.current;
    const v = inp.video;
    const prev = s.prevVideo;
    s.prevVideo = v;
    if (!inp.loaded) return;
    const now = Date.now();
    const playingSince = s.playingSince;
    const pausedSince = s.pausedSince;
    s.playingSince = v.playing ? playingSince || now : 0;
    s.pausedSince = v.playing ? 0 : pausedSince || now;
    if (!prev) return;

    if (v.source && v.source.url !== prev.source?.url) {
      s.sourceChanges = [...s.sourceChanges.filter((t) => now - t < 3 * MIN), now];
      s.endSaidFor = '';
      s.nearSaidFor = '';
      if (s.sourceChanges.length >= 3) say('indecisive', L.indecisive, 'laugh', 1, 10 * MIN);
      else if (v.source.title) say('source', L.source, 'cool', 2, 20_000, { title: v.source.title.slice(0, 60) });
      else say('source', L.sourceNoTitle, 'cool', 2, 20_000);
      s.pausedSince = v.playing ? 0 : now;
      s.pauseSaid.clear();
      return;
    }
    if (!v.last || v.last.at === prev.last?.at || !v.source) return;
    const who = v.last.by === inp.meId ? 'Ты' : v.last.name;

    if (v.last.action === 'play' || v.last.action === 'pause') {
      s.toggles = [...s.toggles.filter((t) => now - t < 20_000), now];
      if (s.toggles.length >= 5) {
        s.toggles = [];
        say('pauseSpam', L.pauseSpam, 'wink', 1, 5 * MIN);
        return;
      }
    }
    if (v.last.action === 'play' && !prev.playing) {
      const pausedFor = pausedSince ? now - pausedSince : 0;
      s.pauseSaid.clear();
      if (pausedFor > 90_000) say('back', L.backFromPause, 'hype', 1, 3 * MIN);
    } else if (v.last.action === 'pause' && prev.playing) {
      const playedFor = playingSince ? now - playingSince : 0;
      if (playedFor > 20 * MIN) say('break', L.breakAfterLong, 'sleep', 1, 10 * MIN);
    } else if (v.last.action === 'seek') {
      const before = roomPos(prev, v.at);
      const delta = v.pos - before;
      if (v.pos < 5 && before > 120) say('fromStart', L.fromStart, 'wink', 1, 3 * MIN);
      else if (delta > 90) say('seekFwd', L.seekFwd, 'shock', 1, 2 * MIN, { who, d: fmtDelta(delta) });
      else if (delta < -15) say('seekBack', L.seekBack, 'think', 0, 2 * MIN, { who, d: fmtDelta(delta) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inp.video, inp.loaded]);

  // ── кто отстаёт, у кого реклама ──────────────────────
  useEffect(() => {
    const s = st.current;
    const v = inp.video;
    if (!inp.loaded || !v.source || v.source.kind === 'iframe') return;
    const online = new Set(inp.people.filter((p) => p.online).map((p) => p.id));
    let allOk = true;
    for (const [id, pos] of Object.entries(inp.positions)) {
      if (id === inp.meId || !online.has(id)) continue;
      if (pos.state === 'ad') say(`ad:${id}`, L.ad, 'think', 1, 6 * MIN, { name: nameOf(id) });
      else if (pos.state === 'blocked') say(`blocked:${id}`, L.blocked, 'shock', 1, 4 * MIN, { name: nameOf(id) });
      if (pos.state !== 'ok' || !v.playing) {
        if (pos.state !== 'ok') allOk = false;
        continue;
      }
      const drift = pos.pos - roomPos(v, pos.at);
      if (drift < -6) {
        allOk = false;
        if (!s.lagging.has(id)) {
          s.lagging.add(id);
          say(`lag:${id}`, L.lag, 'think', 1, 4 * MIN, { name: nameOf(id), d: fmtDelta(drift) });
        }
      } else if (Math.abs(drift) > 2) allOk = false;
    }
    if (allOk && s.lagging.size) {
      s.lagging.clear();
      say('synced', L.synced, 'cool', 0, 3 * MIN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inp.positions]);

  // ── реакции на экране и под сообщениями ──────────────
  const hit = (emoji: string, n = 1) => {
    const s = st.current;
    const kind = CRY.includes(emoji) ? 'cry' : LAUGH.includes(emoji) ? 'laugh' : LOVE.includes(emoji) ? 'love' : SHOCK.includes(emoji) ? 'shock' : 'other';
    const t = Date.now();
    for (let i = 0; i < n; i++) s.emojiHits.push({ kind, t });
    s.emojiHits = s.emojiHits.filter((h) => t - h.t < 40_000);
    const count = (k: string, win: number) => s.emojiHits.filter((h) => h.kind === k && t - h.t < win).length;
    const cry = count('cry', 40_000);
    if (cry >= 3) say('cry', L.cry, 'cry', 1, 4 * MIN, { n: cry });
    else if (count('laugh', 30_000) >= 4) say('laugh', L.laugh, 'laugh', 1, 4 * MIN);
    else if (count('love', 30_000) >= 3) say('love', L.love, 'love', 1, 5 * MIN);
    else if (count('shock', 30_000) >= 3) say('shock', L.shock, 'shock', 1, 4 * MIN);
    else if (s.emojiHits.filter((h) => t - h.t < 15_000).length >= 7) say('hype', L.hype, 'hype', 1, 4 * MIN);
  };

  useEffect(() => {
    const s = st.current;
    for (const f of inp.floats) {
      if (s.seenFloats.has(f.id)) continue;
      s.seenFloats.add(f.id);
      hit(f.emoji);
    }
    if (s.seenFloats.size > 300) s.seenFloats = new Set([...s.seenFloats].slice(-150));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inp.floats]);

  // ── чат ─────────────────────────────────────────────
  useEffect(() => {
    const s = st.current;
    const first = s.seenMsgs.size === 0;
    const now = Date.now();
    for (const m of inp.messages) {
      // реакции под сообщениями
      for (const r of m.reactions) {
        const k = `${m.id}:${r.emoji}`;
        const before = s.prevReactCount.get(k) ?? (first ? r.users.length : 0);
        if (r.users.length > before) hit(r.emoji, r.users.length - before);
        s.prevReactCount.set(k, r.users.length);
      }
      if (s.seenMsgs.has(m.id)) continue;
      s.seenMsgs.add(m.id);
      if (first || m.user === 'system') continue;
      s.lastMsgAt = now;
      s.msgTimes = [...s.msgTimes.filter((t) => now - t < MIN), now];
      if (m.sticker) {
        s.stickerTimes = [...s.stickerTimes.filter((t) => now - t < MIN), now];
        if (m.sticker === 'photo-cry') hit('😭');
        if (s.stickerTimes.length >= 5) say('stickers', L.stickerWar, 'party', 0, 5 * MIN);
        else if (isAdultSticker(m.sticker) && Math.random() < 0.3) say('adult', L.adult, 'wink', 0, 4 * MIN);
      }
      if (m.image && Math.random() < 0.25) say('image', L.image, 'wink', 0, 6 * MIN);
      if (s.msgTimes.length >= 10) say('chatBurst', L.chatBurst, 'shock', 0, 6 * MIN);
      const text = m.text.toLowerCase();
      if (/петух|петя|диджей|dj/.test(text)) say('called', L.called, 'hi', 1, MIN);
      else if (/спойлер/.test(text)) say('spoiler', L.spoiler, 'shock', 1, 3 * MIN);
      else if (/сколько (ещё |еще )?осталось|долго (ещё|еще)/.test(text)) {
        const i = inpRef.current.info;
        if (i && i.duration > 0) say('left', L.left, 'think', 1, 30_000, { d: formatTime(Math.max(0, i.duration - i.time)) });
      } else if (/скучн/.test(text)) say('bored', L.bored, 'think', 1, 4 * MIN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inp.messages]);

  // ── таймеры: долгая пауза, одиночество, часы просмотра, финал, время суток ─
  useEffect(() => {
    const TICK = 5000;
    const iv = setInterval(() => {
      const s = st.current;
      const { video: v, info, loaded } = inpRef.current;
      if (!loaded) return;
      const now = Date.now();

      if (v.source && !v.playing && s.pausedSince) {
        const p = now - s.pausedSince;
        if (p > 15 * MIN && !s.pauseSaid.has(15)) {
          s.pauseSaid.add(15);
          say('pause15', L.longPause15, 'sleep', 1, 10 * MIN);
        } else if (p > 5 * MIN && !s.pauseSaid.has(5)) {
          s.pauseSaid.add(5);
          say('pause5', L.longPause5, 'think', 0, 10 * MIN);
        }
      }

      if (s.aloneSince && now - s.aloneSince > 3 * MIN) say('alone', L.alone, 'think', 0, 12 * MIN);

      if (v.source && v.playing) {
        s.watchedSec += TICK / 1000;
        const m = Math.floor(s.watchedSec / 60);
        for (const mark of [300, 240, 180, 120, 60])
          if (m >= mark && !s.watchSaid.has(mark)) {
            s.watchSaid.add(mark);
            say(`watch${mark}`, L.watch[mark], mark >= 180 ? 'sleep' : 'party', 1, 30 * MIN);
            break;
          }
        if (now - s.lastMsgAt > 25 * MIN) {
          s.lastMsgAt = now;
          say('silence', L.silence, 'think', 0, 25 * MIN);
        }
      }

      if (v.source && info && info.duration > 600) {
        const url = v.source.url;
        if (info.time / info.duration > 0.95 && info.time < info.duration - 5 && s.nearSaidFor !== url) {
          s.nearSaidFor = url;
          say('nearEnd', L.nearEnd, 'hype', 1, 10 * MIN);
        }
        if (info.time >= info.duration - 2 && !info.playing && s.endSaidFor !== url) {
          s.endSaidFor = url;
          say('ended', L.ended, 'party', 2, 5 * MIN);
        }
      }

      const d = new Date();
      const day = d.toDateString();
      const hm = d.getHours() * 60 + d.getMinutes();
      const clock = (key: string, at: number, lines: readonly string[], mood: DjMood) => {
        if (hm >= at && hm < at + 2 && !s.clockSaid.has(key + day)) {
          s.clockSaid.add(key + day);
          say(key, lines, mood, 1, 60 * MIN);
        }
      };
      clock('midnight', 0, L.midnight, 'shock');
      clock('late', 180, L.late, 'sleep');
      clock('dawn', 300, L.dawn, 'hi');
    }, TICK);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { line, dismiss };
}
