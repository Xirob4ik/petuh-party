// Файл создан скриптом tools/stickers.py — правьте скрипт, а не этот файл.
// Все стикеры нарисованы для Petuh Party и лежат в /public/stickers.

export type StickerCategory = 'petya' | 'cinema' | 'phrases' | 'chicks' | 'classic';

export interface Sticker {
  id: string;
  name: string;
  file: string;
  category: StickerCategory;
  tags: string[];
}

export const STICKER_CATEGORIES: { id: 'all' | StickerCategory; name: string }[] = [{"id": "all", "name": "Все"}, {"id": "petya", "name": "Петя"}, {"id": "cinema", "name": "Кино"}, {"id": "phrases", "name": "Фразы"}, {"id": "chicks", "name": "Цыпа"}, {"id": "classic", "name": "Классика"}];

export const STICKERS: Sticker[] = [
  {
    "id": "petya-hi",
    "name": "Привет",
    "file": "petya-hi.svg",
    "category": "petya",
    "tags": [
      "привет",
      "хай",
      "здарова",
      "hello",
      "hi"
    ]
  },
  {
    "id": "petya-lol",
    "name": "Ору",
    "file": "petya-lol.svg",
    "category": "petya",
    "tags": [
      "ор",
      "ору",
      "смех",
      "ахаха",
      "лол",
      "кек",
      "lol",
      "laugh"
    ]
  },
  {
    "id": "petya-ahaha",
    "name": "Ахаха",
    "file": "petya-ahaha.svg",
    "category": "petya",
    "tags": [
      "ахаха",
      "смешно",
      "хаха",
      "смех",
      "lol"
    ]
  },
  {
    "id": "petya-cry",
    "name": "Шедевр",
    "file": "petya-cry.svg",
    "category": "petya",
    "tags": [
      "шедевр",
      "плачу",
      "рыдаю",
      "слёзы",
      "трогательно",
      "cry",
      "tears"
    ]
  },
  {
    "id": "petya-sad",
    "name": "Грустно",
    "file": "petya-sad.svg",
    "category": "petya",
    "tags": [
      "грустно",
      "печаль",
      "sad",
      "эх"
    ]
  },
  {
    "id": "petya-shock",
    "name": "Что?!",
    "file": "petya-shock.svg",
    "category": "petya",
    "tags": [
      "что",
      "шок",
      "чтооо",
      "ужас",
      "omg",
      "what",
      "shock"
    ]
  },
  {
    "id": "petya-angry",
    "name": "Бесит",
    "file": "petya-angry.svg",
    "category": "petya",
    "tags": [
      "бесит",
      "злой",
      "злюсь",
      "angry",
      "гнев"
    ]
  },
  {
    "id": "petya-love",
    "name": "Люблю",
    "file": "petya-love.svg",
    "category": "petya",
    "tags": [
      "люблю",
      "любовь",
      "краш",
      "сердечки",
      "love",
      "heart"
    ]
  },
  {
    "id": "petya-cool",
    "name": "База",
    "file": "petya-cool.svg",
    "category": "petya",
    "tags": [
      "база",
      "крутой",
      "очки",
      "гигачад",
      "сигма",
      "cool",
      "chad"
    ]
  },
  {
    "id": "petya-think",
    "name": "Хмм",
    "file": "petya-think.svg",
    "category": "petya",
    "tags": [
      "хмм",
      "думаю",
      "подозрительно",
      "think",
      "hmm"
    ]
  },
  {
    "id": "petya-cringe",
    "name": "Кринж",
    "file": "petya-cringe.svg",
    "category": "petya",
    "tags": [
      "кринж",
      "испанский стыд",
      "фейспалм",
      "cringe",
      "стыдно"
    ]
  },
  {
    "id": "petya-dead",
    "name": "Всё",
    "file": "petya-dead.svg",
    "category": "petya",
    "tags": [
      "всё",
      "умер",
      "помер",
      "dead",
      "rip",
      "капут"
    ]
  },
  {
    "id": "petya-wink",
    "name": "Хе-хе",
    "file": "petya-wink.svg",
    "category": "petya",
    "tags": [
      "хехе",
      "подмигнул",
      "хитрый",
      "wink"
    ]
  },
  {
    "id": "petya-awkward",
    "name": "Неловко",
    "file": "petya-awkward.svg",
    "category": "petya",
    "tags": [
      "неловко",
      "упс",
      "awkward",
      "oops",
      "ой"
    ]
  },
  {
    "id": "petya-sleep",
    "name": "Скучно",
    "file": "petya-sleep.svg",
    "category": "petya",
    "tags": [
      "скучно",
      "сплю",
      "сон",
      "zzz",
      "boring",
      "sleep"
    ]
  },
  {
    "id": "petya-yuck",
    "name": "Фу",
    "file": "petya-yuck.svg",
    "category": "petya",
    "tags": [
      "фу",
      "мерзко",
      "отстой",
      "yuck",
      "гадость"
    ]
  },
  {
    "id": "petya-scream",
    "name": "Кукареку",
    "file": "petya-scream.svg",
    "category": "petya",
    "tags": [
      "кукареку",
      "крик",
      "ура",
      "ору",
      "scream"
    ]
  },
  {
    "id": "petya-top",
    "name": "Топ",
    "file": "petya-top.svg",
    "category": "petya",
    "tags": [
      "топ",
      "лайк",
      "класс",
      "одобряю",
      "like",
      "top"
    ]
  },
  {
    "id": "petya-star",
    "name": "Вау",
    "file": "petya-star.svg",
    "category": "petya",
    "tags": [
      "вау",
      "восторг",
      "звёзды",
      "wow",
      "amazing"
    ]
  },
  {
    "id": "cinema-popcorn",
    "name": "Где попкорн",
    "file": "cinema-popcorn.svg",
    "category": "cinema",
    "tags": [
      "попкорн",
      "кино",
      "еда",
      "popcorn",
      "snack"
    ]
  },
  {
    "id": "cinema-scared",
    "name": "Страшно",
    "file": "cinema-scared.svg",
    "category": "cinema",
    "tags": [
      "страшно",
      "хоррор",
      "ужас",
      "боюсь",
      "scary",
      "horror"
    ]
  },
  {
    "id": "cinema-pause",
    "name": "Пауза!",
    "file": "cinema-pause.svg",
    "category": "cinema",
    "tags": [
      "пауза",
      "стоп",
      "подожди",
      "pause",
      "wait"
    ]
  },
  {
    "id": "cinema-play",
    "name": "Го смотреть",
    "file": "cinema-play.svg",
    "category": "cinema",
    "tags": [
      "го",
      "смотреть",
      "погнали",
      "старт",
      "play",
      "go"
    ]
  },
  {
    "id": "cinema-ff",
    "name": "Перемотай",
    "file": "cinema-ff.svg",
    "category": "cinema",
    "tags": [
      "перемотай",
      "скучно",
      "дальше",
      "промотай",
      "skip",
      "forward"
    ]
  },
  {
    "id": "cinema-spoiler",
    "name": "Без спойлеров",
    "file": "cinema-spoiler.svg",
    "category": "cinema",
    "tags": [
      "спойлер",
      "тихо",
      "тсс",
      "не говори",
      "spoiler",
      "shh"
    ]
  },
  {
    "id": "cinema-next",
    "name": "Ещё серию",
    "file": "cinema-next.svg",
    "category": "cinema",
    "tags": [
      "ещё серию",
      "следующая",
      "сериал",
      "next episode",
      "ещё"
    ]
  },
  {
    "id": "cinema-remote",
    "name": "Пульт мой",
    "file": "cinema-remote.svg",
    "category": "cinema",
    "tags": [
      "пульт",
      "мой",
      "главный",
      "remote",
      "управление"
    ]
  },
  {
    "id": "cinema-tissues",
    "name": "Дайте салфетку",
    "file": "cinema-tissues.svg",
    "category": "cinema",
    "tags": [
      "салфетки",
      "плачу",
      "трогательно",
      "tissue",
      "слёзы"
    ]
  },
  {
    "id": "cinema-ticket",
    "name": "Билет",
    "file": "cinema-ticket.svg",
    "category": "cinema",
    "tags": [
      "билет",
      "кино",
      "сеанс",
      "ticket",
      "cinema"
    ]
  },
  {
    "id": "cinema-clapper",
    "name": "Дубль",
    "file": "cinema-clapper.svg",
    "category": "cinema",
    "tags": [
      "хлопушка",
      "дубль",
      "мотор",
      "снято",
      "clapper"
    ]
  },
  {
    "id": "cinema-3d",
    "name": "3D",
    "file": "cinema-3d.svg",
    "category": "cinema",
    "tags": [
      "3d",
      "очки",
      "кино",
      "imax",
      "эффекты"
    ]
  },
  {
    "id": "cinema-fire",
    "name": "Огонь",
    "file": "cinema-fire.svg",
    "category": "cinema",
    "tags": [
      "огонь",
      "жара",
      "топ",
      "fire",
      "lit",
      "имба"
    ]
  },
  {
    "id": "cinema-heart",
    "name": "Сердечко",
    "file": "cinema-heart.svg",
    "category": "cinema",
    "tags": [
      "сердце",
      "любовь",
      "мило",
      "heart",
      "love"
    ]
  },
  {
    "id": "cinema-broken",
    "name": "Разбитое сердце",
    "file": "cinema-broken.svg",
    "category": "cinema",
    "tags": [
      "разбитое сердце",
      "больно",
      "грусть",
      "broken heart",
      "обидно"
    ]
  },
  {
    "id": "cinema-skull",
    "name": "Череп",
    "file": "cinema-skull.svg",
    "category": "cinema",
    "tags": [
      "череп",
      "умер",
      "кринж",
      "смешно",
      "skull",
      "dead"
    ]
  },
  {
    "id": "cinema-ghost",
    "name": "Бу",
    "file": "cinema-ghost.svg",
    "category": "cinema",
    "tags": [
      "призрак",
      "бу",
      "страшно",
      "хоррор",
      "ghost",
      "boo"
    ]
  },
  {
    "id": "sync-lag",
    "name": "Лагает",
    "file": "sync-lag.svg",
    "category": "phrases",
    "tags": [
      "лагает",
      "тормозит",
      "грузится",
      "буфер",
      "lag",
      "loading"
    ]
  },
  {
    "id": "sync-catchup",
    "name": "Догоняю",
    "file": "sync-catchup.svg",
    "category": "phrases",
    "tags": [
      "догоняю",
      "отстаю",
      "бегу",
      "подожди",
      "catch up"
    ]
  },
  {
    "id": "sync-where",
    "name": "Ты где?",
    "file": "sync-where.svg",
    "category": "phrases",
    "tags": [
      "ты где",
      "где ты",
      "на какой минуте",
      "where"
    ]
  },
  {
    "id": "sync-wait",
    "name": "Жду",
    "file": "sync-wait.svg",
    "category": "phrases",
    "tags": [
      "жду",
      "подожди",
      "скоро",
      "wait",
      "ждём"
    ]
  },
  {
    "id": "sync-ready",
    "name": "Готов",
    "file": "sync-ready.svg",
    "category": "phrases",
    "tags": [
      "готов",
      "я тут",
      "погнали",
      "ready",
      "здесь"
    ]
  },
  {
    "id": "sync-sound",
    "name": "Нет звука",
    "file": "sync-sound.svg",
    "category": "phrases",
    "tags": [
      "звук",
      "не слышно",
      "громче",
      "sound",
      "mute"
    ]
  },
  {
    "id": "sync-sleep",
    "name": "Спать",
    "file": "sync-sleep.svg",
    "category": "phrases",
    "tags": [
      "спать",
      "спокойной ночи",
      "ночь",
      "sleep",
      "night"
    ]
  },
  {
    "id": "sync-gg",
    "name": "ГГ",
    "file": "sync-gg.svg",
    "category": "phrases",
    "tags": [
      "гг",
      "конец",
      "всё",
      "финал",
      "gg",
      "the end"
    ]
  },
  {
    "id": "sync-again",
    "name": "Ещё раз",
    "file": "sync-again.svg",
    "category": "phrases",
    "tags": [
      "ещё раз",
      "повтори",
      "не понял",
      "replay",
      "again"
    ]
  },
  {
    "id": "sync-party",
    "name": "Пати",
    "file": "sync-party.svg",
    "category": "phrases",
    "tags": [
      "пати",
      "вечеринка",
      "праздник",
      "party",
      "ура"
    ]
  },
  {
    "id": "chick-hatch",
    "name": "Вылупился",
    "file": "chick-hatch.svg",
    "category": "chicks",
    "tags": [
      "цыплёнок",
      "вылупился",
      "привет",
      "новенький",
      "chick",
      "hatch"
    ]
  },
  {
    "id": "chick-cute",
    "name": "Мимими",
    "file": "chick-cute.svg",
    "category": "chicks",
    "tags": [
      "мимими",
      "мило",
      "цыплёнок",
      "cute",
      "aww"
    ]
  },
  {
    "id": "chick-cry",
    "name": "Плачет",
    "file": "chick-cry.svg",
    "category": "chicks",
    "tags": [
      "цыплёнок",
      "плачу",
      "грустно",
      "cry",
      "sad"
    ]
  },
  {
    "id": "chick-shock",
    "name": "Ой",
    "file": "chick-shock.svg",
    "category": "chicks",
    "tags": [
      "ой",
      "шок",
      "испугался",
      "oh",
      "shock"
    ]
  },
  {
    "id": "chick-love",
    "name": "Обнимашки",
    "file": "chick-love.svg",
    "category": "chicks",
    "tags": [
      "обнимашки",
      "обнять",
      "люблю",
      "hug",
      "love"
    ]
  },
  {
    "id": "chick-angry",
    "name": "Злюка",
    "file": "chick-angry.svg",
    "category": "chicks",
    "tags": [
      "злой",
      "злюка",
      "бесит",
      "angry"
    ]
  },
  {
    "id": "petuh-cool",
    "name": "Petuh Boss",
    "file": "petuh-cool.svg",
    "category": "classic",
    "tags": [
      "петух",
      "босс",
      "очки",
      "крутой",
      "boss",
      "cool"
    ]
  },
  {
    "id": "petuh-popcorn",
    "name": "Петух-киноман",
    "file": "petuh-popcorn.svg",
    "category": "classic",
    "tags": [
      "петух",
      "попкорн",
      "киноман",
      "фильм"
    ]
  },
  {
    "id": "petuh-shock",
    "name": "Петух в шоке",
    "file": "petuh-shock.svg",
    "category": "classic",
    "tags": [
      "петух",
      "шок",
      "чтооо",
      "ужас"
    ]
  },
  {
    "id": "petuh-cry",
    "name": "Шедевр",
    "file": "petuh-cry.svg",
    "category": "classic",
    "tags": [
      "петух",
      "шедевр",
      "слёзы",
      "плач"
    ]
  },
  {
    "id": "petuh-cringe",
    "name": "Петух-кринж",
    "file": "petuh-cringe.svg",
    "category": "classic",
    "tags": [
      "петух",
      "кринж",
      "испанский стыд"
    ]
  },
  {
    "id": "petuh-party",
    "name": "Petuh Party",
    "file": "petuh-party.svg",
    "category": "classic",
    "tags": [
      "петух",
      "пати",
      "праздник",
      "вечеринка"
    ]
  },
  {
    "id": "petuh-sleep",
    "name": "Петух заснул",
    "file": "petuh-sleep.svg",
    "category": "classic",
    "tags": [
      "петух",
      "заснул",
      "сон",
      "скучно"
    ]
  },
  {
    "id": "petuh-chad",
    "name": "Гигачад-петух",
    "file": "petuh-chad.svg",
    "category": "classic",
    "tags": [
      "петух",
      "база",
      "гигачад",
      "сигма"
    ]
  },
  {
    "id": "petuh-dj",
    "name": "DJ Петух",
    "file": "petuh-dj.svg",
    "category": "classic",
    "tags": [
      "петух",
      "dj",
      "музыка",
      "трек"
    ]
  },
  {
    "id": "popcorn-gold",
    "name": "Топ контент",
    "file": "popcorn-gold.svg",
    "category": "classic",
    "tags": [
      "попкорн",
      "топ контент",
      "огонь",
      "кино"
    ]
  }
];

const BY_ID = new Map(STICKERS.map((x) => [x.id, x]));

export const getSticker = (id: string | undefined) => (id ? BY_ID.get(id) : undefined);
export const stickerUrl = (x: Sticker) => `/stickers/${x.file}`;

export function searchStickers(query: string, category: 'all' | StickerCategory): Sticker[] {
  const q = query.trim().toLowerCase();
  return STICKERS.filter(
    (x) =>
      (category === 'all' || x.category === category) &&
      (!q || x.name.toLowerCase().includes(q) || x.tags.some((t) => t.includes(q))),
  );
}
