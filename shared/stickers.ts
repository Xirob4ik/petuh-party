// Файл создан скриптом tools/stickers.py — правьте скрипт, а не этот файл.
// Все стикеры нарисованы для Petuh Party и лежат в /public/stickers.

export type StickerCategory = 'petya' | 'cinema' | 'phrases' | 'chicks' | 'classic' | 'adult';

export interface Sticker {
  id: string;
  name: string;
  file: string;
  category: StickerCategory;
  tags: string[];
}

export const STICKER_CATEGORIES: { id: 'all' | StickerCategory; name: string }[] = [{"id": "all", "name": "Все"}, {"id": "petya", "name": "Петя"}, {"id": "cinema", "name": "Кино"}, {"id": "phrases", "name": "Фразы"}, {"id": "chicks", "name": "Цыпа"}, {"id": "classic", "name": "Классика"}, {"id": "adult", "name": "18+"}];

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
    "id": "x-001",
    "name": "Разорву на тебе бельё",
    "file": "x-001.svg",
    "category": "adult",
    "tags": [
      "18+",
      "разорву на тебе бельё"
    ]
  },
  {
    "id": "x-002",
    "name": "Кончу на твою одежду",
    "file": "x-002.svg",
    "category": "adult",
    "tags": [
      "18+",
      "кончу на твою одежду"
    ]
  },
  {
    "id": "x-003",
    "name": "Кончу на лицо",
    "file": "x-003.svg",
    "category": "adult",
    "tags": [
      "18+",
      "кончу на лицо"
    ]
  },
  {
    "id": "x-004",
    "name": "Кончу на жопу",
    "file": "x-004.svg",
    "category": "adult",
    "tags": [
      "18+",
      "кончу на жопу"
    ]
  },
  {
    "id": "x-005",
    "name": "Ебля будет долгой",
    "file": "x-005.svg",
    "category": "adult",
    "tags": [
      "18+",
      "ебля будет долгой"
    ]
  },
  {
    "id": "x-006",
    "name": "Придушу немного",
    "file": "x-006.svg",
    "category": "adult",
    "tags": [
      "18+",
      "придушу немного"
    ]
  },
  {
    "id": "x-007",
    "name": "Отлуплю",
    "file": "x-007.svg",
    "category": "adult",
    "tags": [
      "18+",
      "отлуплю"
    ]
  },
  {
    "id": "x-008",
    "name": "Размажу сперму по лицу",
    "file": "x-008.svg",
    "category": "adult",
    "tags": [
      "18+",
      "размажу сперму по лицу"
    ]
  },
  {
    "id": "x-009",
    "name": "Накачаю спермой",
    "file": "x-009.svg",
    "category": "adult",
    "tags": [
      "18+",
      "накачаю спермой"
    ]
  },
  {
    "id": "x-010",
    "name": "Будешь вещью",
    "file": "x-010.svg",
    "category": "adult",
    "tags": [
      "18+",
      "будешь вещью"
    ]
  },
  {
    "id": "x-011",
    "name": "Выебу на столе",
    "file": "x-011.svg",
    "category": "adult",
    "tags": [
      "18+",
      "выебу на столе"
    ]
  },
  {
    "id": "x-012",
    "name": "Трахну в душе",
    "file": "x-012.svg",
    "category": "adult",
    "tags": [
      "18+",
      "трахну в душе"
    ]
  },
  {
    "id": "x-013",
    "name": "Куни для начала",
    "file": "x-013.svg",
    "category": "adult",
    "tags": [
      "18+",
      "куни для начала"
    ]
  },
  {
    "id": "x-014",
    "name": "Поиграю пальцами с пиздой",
    "file": "x-014.svg",
    "category": "adult",
    "tags": [
      "18+",
      "поиграю пальцами с пиздой"
    ]
  },
  {
    "id": "x-015",
    "name": "Обматерю",
    "file": "x-015.svg",
    "category": "adult",
    "tags": [
      "18+",
      "обматерю"
    ]
  },
  {
    "id": "x-016",
    "name": "Засуну пальцы в рот",
    "file": "x-016.svg",
    "category": "adult",
    "tags": [
      "18+",
      "засуну пальцы в рот"
    ]
  },
  {
    "id": "x-017",
    "name": "Трусы сними губами",
    "file": "x-017.svg",
    "category": "adult",
    "tags": [
      "18+",
      "трусы сними губами"
    ]
  },
  {
    "id": "x-018",
    "name": "Порву твои трусы",
    "file": "x-018.svg",
    "category": "adult",
    "tags": [
      "18+",
      "порву твои трусы"
    ]
  },
  {
    "id": "x-019",
    "name": "Трахну в машине",
    "file": "x-019.svg",
    "category": "adult",
    "tags": [
      "18+",
      "трахну в машине"
    ]
  },
  {
    "id": "x-020",
    "name": "Ебу неспеша",
    "file": "x-020.svg",
    "category": "adult",
    "tags": [
      "18+",
      "ебу неспеша"
    ]
  },
  {
    "id": "x-021",
    "name": "Ебу в три захода",
    "file": "x-021.svg",
    "category": "adult",
    "tags": [
      "18+",
      "ебу в три захода"
    ]
  },
  {
    "id": "x-022",
    "name": "Кончишь от анала",
    "file": "x-022.svg",
    "category": "adult",
    "tags": [
      "18+",
      "кончишь от анала"
    ]
  },
  {
    "id": "x-023",
    "name": "Кончаем одновре- менно?",
    "file": "x-023.svg",
    "category": "adult",
    "tags": [
      "18+",
      "кончаем одновре- менно"
    ]
  },
  {
    "id": "x-024",
    "name": "Я свингер",
    "file": "x-024.svg",
    "category": "adult",
    "tags": [
      "18+",
      "я свингер"
    ]
  },
  {
    "id": "x-025",
    "name": "Смена партнёров?",
    "file": "x-025.svg",
    "category": "adult",
    "tags": [
      "18+",
      "смена партнёров"
    ]
  },
  {
    "id": "x-026",
    "name": "Пущу тебя по кругу",
    "file": "x-026.svg",
    "category": "adult",
    "tags": [
      "18+",
      "пущу тебя по кругу"
    ]
  },
  {
    "id": "x-027",
    "name": "Ебаться и кричать!",
    "file": "x-027.svg",
    "category": "adult",
    "tags": [
      "18+",
      "ебаться и кричать"
    ]
  },
  {
    "id": "x-028",
    "name": "Люблю орать",
    "file": "x-028.svg",
    "category": "adult",
    "tags": [
      "18+",
      "люблю орать"
    ]
  },
  {
    "id": "x-029",
    "name": "Буду кусать",
    "file": "x-029.svg",
    "category": "adult",
    "tags": [
      "18+",
      "буду кусать"
    ]
  },
  {
    "id": "x-030",
    "name": "Я страстный",
    "file": "x-030.svg",
    "category": "adult",
    "tags": [
      "18+",
      "я страстный"
    ]
  },
  {
    "id": "x-031",
    "name": "Вылижу твою попку",
    "file": "x-031.svg",
    "category": "adult",
    "tags": [
      "18+",
      "вылижу твою попку"
    ]
  },
  {
    "id": "x-032",
    "name": "Хочу ласкать киску",
    "file": "x-032.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хочу ласкать киску"
    ]
  },
  {
    "id": "x-033",
    "name": "Пальцами в киску",
    "file": "x-033.svg",
    "category": "adult",
    "tags": [
      "18+",
      "пальцами в киску"
    ]
  },
  {
    "id": "x-034",
    "name": "Мои пальцы — умелые",
    "file": "x-034.svg",
    "category": "adult",
    "tags": [
      "18+",
      "мои пальцы  умелые"
    ]
  },
  {
    "id": "x-035",
    "name": "Люблю жёстко",
    "file": "x-035.svg",
    "category": "adult",
    "tags": [
      "18+",
      "люблю жёстко"
    ]
  },
  {
    "id": "x-036",
    "name": "Кончу на грудь",
    "file": "x-036.svg",
    "category": "adult",
    "tags": [
      "18+",
      "кончу на грудь"
    ]
  },
  {
    "id": "x-037",
    "name": "Буду трахать и любоваться",
    "file": "x-037.svg",
    "category": "adult",
    "tags": [
      "18+",
      "буду трахать и любоваться"
    ]
  },
  {
    "id": "x-038",
    "name": "Не закрывай глаза...",
    "file": "x-038.svg",
    "category": "adult",
    "tags": [
      "18+",
      "не закрывай глаза"
    ]
  },
  {
    "id": "x-039",
    "name": "Хуй большой примешь?",
    "file": "x-039.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хуй большой примешь"
    ]
  },
  {
    "id": "x-040",
    "name": "У меня не маленький",
    "file": "x-040.svg",
    "category": "adult",
    "tags": [
      "18+",
      "у меня не маленький"
    ]
  },
  {
    "id": "x-041",
    "name": "Будешь рабочей глоткой",
    "file": "x-041.svg",
    "category": "adult",
    "tags": [
      "18+",
      "будешь рабочей глоткой"
    ]
  },
  {
    "id": "x-042",
    "name": "Привяжу тебя к кровати...",
    "file": "x-042.svg",
    "category": "adult",
    "tags": [
      "18+",
      "привяжу тебя к кровати"
    ]
  },
  {
    "id": "x-043",
    "name": "Люблю горячих штучек",
    "file": "x-043.svg",
    "category": "adult",
    "tags": [
      "18+",
      "люблю горячих штучек"
    ]
  },
  {
    "id": "x-044",
    "name": "Буду мучать соски",
    "file": "x-044.svg",
    "category": "adult",
    "tags": [
      "18+",
      "буду мучать соски"
    ]
  },
  {
    "id": "x-045",
    "name": "Люблю делать больно",
    "file": "x-045.svg",
    "category": "adult",
    "tags": [
      "18+",
      "люблю делать больно"
    ]
  },
  {
    "id": "x-046",
    "name": "Доминант",
    "file": "x-046.svg",
    "category": "adult",
    "tags": [
      "18+",
      "доминант"
    ]
  },
  {
    "id": "x-047",
    "name": "Так тебя ещё не ебали",
    "file": "x-047.svg",
    "category": "adult",
    "tags": [
      "18+",
      "так тебя ещё не ебали"
    ]
  },
  {
    "id": "x-048",
    "name": "Лижи хуй",
    "file": "x-048.svg",
    "category": "adult",
    "tags": [
      "18+",
      "лижи хуй"
    ]
  },
  {
    "id": "x-049",
    "name": "Посасывай член",
    "file": "x-049.svg",
    "category": "adult",
    "tags": [
      "18+",
      "посасывай член"
    ]
  },
  {
    "id": "x-050",
    "name": "Заткну тебе рот",
    "file": "x-050.svg",
    "category": "adult",
    "tags": [
      "18+",
      "заткну тебе рот"
    ]
  },
  {
    "id": "x-051",
    "name": "Подрочу тобой",
    "file": "x-051.svg",
    "category": "adult",
    "tags": [
      "18+",
      "подрочу тобой"
    ]
  },
  {
    "id": "x-052",
    "name": "Твоя дыра только моя",
    "file": "x-052.svg",
    "category": "adult",
    "tags": [
      "18+",
      "твоя дыра только моя"
    ]
  },
  {
    "id": "x-053",
    "name": "Мой член тебе по размеру",
    "file": "x-053.svg",
    "category": "adult",
    "tags": [
      "18+",
      "мой член тебе по размеру"
    ]
  },
  {
    "id": "x-054",
    "name": "Вылизывай мне жопу",
    "file": "x-054.svg",
    "category": "adult",
    "tags": [
      "18+",
      "вылизывай мне жопу"
    ]
  },
  {
    "id": "x-055",
    "name": "Лижи яйца",
    "file": "x-055.svg",
    "category": "adult",
    "tags": [
      "18+",
      "лижи яйца"
    ]
  },
  {
    "id": "x-056",
    "name": "Буду плевать на тебя...",
    "file": "x-056.svg",
    "category": "adult",
    "tags": [
      "18+",
      "буду плевать на тебя"
    ]
  },
  {
    "id": "x-057",
    "name": "Вылижешь мои трусы",
    "file": "x-057.svg",
    "category": "adult",
    "tags": [
      "18+",
      "вылижешь мои трусы"
    ]
  },
  {
    "id": "x-058",
    "name": "Ношу бельё несколько дней",
    "file": "x-058.svg",
    "category": "adult",
    "tags": [
      "18+",
      "ношу бельё несколько дней"
    ]
  },
  {
    "id": "x-059",
    "name": "Буду орать на тебя",
    "file": "x-059.svg",
    "category": "adult",
    "tags": [
      "18+",
      "буду орать на тебя"
    ]
  },
  {
    "id": "x-060",
    "name": "Проси прощения на коленях",
    "file": "x-060.svg",
    "category": "adult",
    "tags": [
      "18+",
      "проси прощения на коленях"
    ]
  },
  {
    "id": "x-061",
    "name": "Выебу в позе монашки",
    "file": "x-061.svg",
    "category": "adult",
    "tags": [
      "18+",
      "выебу в позе монашки"
    ]
  },
  {
    "id": "x-062",
    "name": "Проси чтоб трахал глубже",
    "file": "x-062.svg",
    "category": "adult",
    "tags": [
      "18+",
      "проси чтоб трахал глубже"
    ]
  },
  {
    "id": "x-063",
    "name": "Хочу кончить, когда ты плачешь",
    "file": "x-063.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хочу кончить когда ты плачешь"
    ]
  },
  {
    "id": "x-064",
    "name": "Кончаю на лицо — не закрывай глаза",
    "file": "x-064.svg",
    "category": "adult",
    "tags": [
      "18+",
      "кончаю на лицо  не закрывай глаза"
    ]
  },
  {
    "id": "x-065",
    "name": "Жди голой в кровати",
    "file": "x-065.svg",
    "category": "adult",
    "tags": [
      "18+",
      "жди голой в кровати"
    ]
  },
  {
    "id": "x-066",
    "name": "Побрею твою киску",
    "file": "x-066.svg",
    "category": "adult",
    "tags": [
      "18+",
      "побрею твою киску"
    ]
  },
  {
    "id": "x-067",
    "name": "Сядь киской на лицо",
    "file": "x-067.svg",
    "category": "adult",
    "tags": [
      "18+",
      "сядь киской на лицо"
    ]
  },
  {
    "id": "x-068",
    "name": "Отфистингую рукой",
    "file": "x-068.svg",
    "category": "adult",
    "tags": [
      "18+",
      "отфистингую рукой"
    ]
  },
  {
    "id": "x-069",
    "name": "Выебу фаллосом",
    "file": "x-069.svg",
    "category": "adult",
    "tags": [
      "18+",
      "выебу фаллосом"
    ]
  },
  {
    "id": "x-070",
    "name": "Сфоткаемся во время секса?",
    "file": "x-070.svg",
    "category": "adult",
    "tags": [
      "18+",
      "сфоткаемся во время секса"
    ]
  },
  {
    "id": "x-071",
    "name": "Хочу ласкать твои ушки",
    "file": "x-071.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хочу ласкать твои ушки"
    ]
  },
  {
    "id": "x-072",
    "name": "Засосов будет много",
    "file": "x-072.svg",
    "category": "adult",
    "tags": [
      "18+",
      "засосов будет много"
    ]
  },
  {
    "id": "x-073",
    "name": "Можешь орать — меня это возбуждает",
    "file": "x-073.svg",
    "category": "adult",
    "tags": [
      "18+",
      "можешь орать  меня это возбуждает"
    ]
  },
  {
    "id": "x-074",
    "name": "Обслуживай послушно",
    "file": "x-074.svg",
    "category": "adult",
    "tags": [
      "18+",
      "обслуживай послушно"
    ]
  },
  {
    "id": "x-075",
    "name": "Сжимай мой член внутри себя",
    "file": "x-075.svg",
    "category": "adult",
    "tags": [
      "18+",
      "сжимай мой член внутри себя"
    ]
  },
  {
    "id": "x-076",
    "name": "Ебу на вылет",
    "file": "x-076.svg",
    "category": "adult",
    "tags": [
      "18+",
      "ебу на вылет"
    ]
  },
  {
    "id": "x-077",
    "name": "Ебу по подливе",
    "file": "x-077.svg",
    "category": "adult",
    "tags": [
      "18+",
      "ебу по подливе"
    ]
  },
  {
    "id": "x-078",
    "name": "Хочу секс",
    "file": "x-078.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хочу секс"
    ]
  },
  {
    "id": "x-079",
    "name": "Терпи — не захлеб- нёшься",
    "file": "x-079.svg",
    "category": "adult",
    "tags": [
      "18+",
      "терпи  не захлеб- нёшься"
    ]
  },
  {
    "id": "x-080",
    "name": "Попрыгаешь на мне?",
    "file": "x-080.svg",
    "category": "adult",
    "tags": [
      "18+",
      "попрыгаешь на мне"
    ]
  },
  {
    "id": "x-081",
    "name": "Подрочу на тебя",
    "file": "x-081.svg",
    "category": "adult",
    "tags": [
      "18+",
      "подрочу на тебя"
    ]
  },
  {
    "id": "x-082",
    "name": "Расскажи свои фантазии",
    "file": "x-082.svg",
    "category": "adult",
    "tags": [
      "18+",
      "расскажи свои фантазии"
    ]
  },
  {
    "id": "x-083",
    "name": "Голое фото жду...",
    "file": "x-083.svg",
    "category": "adult",
    "tags": [
      "18+",
      "голое фото жду"
    ]
  },
  {
    "id": "x-084",
    "name": "Возбуди меня",
    "file": "x-084.svg",
    "category": "adult",
    "tags": [
      "18+",
      "возбуди меня"
    ]
  },
  {
    "id": "x-085",
    "name": "Заслужи мой хуй",
    "file": "x-085.svg",
    "category": "adult",
    "tags": [
      "18+",
      "заслужи мой хуй"
    ]
  },
  {
    "id": "x-086",
    "name": "Обслужишь нас с другом?",
    "file": "x-086.svg",
    "category": "adult",
    "tags": [
      "18+",
      "обслужишь нас с другом"
    ]
  },
  {
    "id": "x-087",
    "name": "Продержишься долго... дам денег",
    "file": "x-087.svg",
    "category": "adult",
    "tags": [
      "18+",
      "продержишься долго дам денег"
    ]
  },
  {
    "id": "x-088",
    "name": "Люблю продажных",
    "file": "x-088.svg",
    "category": "adult",
    "tags": [
      "18+",
      "люблю продажных"
    ]
  },
  {
    "id": "x-089",
    "name": "Сегодня ты шлюха",
    "file": "x-089.svg",
    "category": "adult",
    "tags": [
      "18+",
      "сегодня ты шлюха"
    ]
  },
  {
    "id": "x-090",
    "name": "Я очень плохой парень",
    "file": "x-090.svg",
    "category": "adult",
    "tags": [
      "18+",
      "я очень плохой парень"
    ]
  },
  {
    "id": "x-091",
    "name": "Я жиголо",
    "file": "x-091.svg",
    "category": "adult",
    "tags": [
      "18+",
      "я жиголо"
    ]
  },
  {
    "id": "x-092",
    "name": "Исполню твои фантазии",
    "file": "x-092.svg",
    "category": "adult",
    "tags": [
      "18+",
      "исполню твои фантазии"
    ]
  },
  {
    "id": "x-093",
    "name": "Хуй широкий",
    "file": "x-093.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хуй широкий"
    ]
  },
  {
    "id": "x-094",
    "name": "Хуй толстый",
    "file": "x-094.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хуй толстый"
    ]
  },
  {
    "id": "x-095",
    "name": "Хуй длинный",
    "file": "x-095.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хуй длинный"
    ]
  },
  {
    "id": "x-096",
    "name": "Стоит долго",
    "file": "x-096.svg",
    "category": "adult",
    "tags": [
      "18+",
      "стоит долго"
    ]
  },
  {
    "id": "x-097",
    "name": "Возбуди прикосно- вениями",
    "file": "x-097.svg",
    "category": "adult",
    "tags": [
      "18+",
      "возбуди прикосно- вениями"
    ]
  },
  {
    "id": "x-098",
    "name": "Хочу гладить твои коленки",
    "file": "x-098.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хочу гладить твои коленки"
    ]
  },
  {
    "id": "x-love-anal",
    "name": "I love anal",
    "file": "x-love-anal.svg",
    "category": "adult",
    "tags": [
      "18+",
      "i love anal",
      "люблю анал",
      "анал"
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
      (category === 'all' ? x.category !== 'adult' : x.category === category) &&
      (!q || x.name.toLowerCase().includes(q) || x.tags.some((t) => t.includes(q))),
  );
}
