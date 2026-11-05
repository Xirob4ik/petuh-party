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
    "id": "y-001",
    "name": "Запретные женские желания",
    "file": "y-001.svg",
    "category": "adult",
    "tags": [
      "18+",
      "запретные женские желания"
    ]
  },
  {
    "id": "y-002",
    "name": "Я теку",
    "file": "y-002.svg",
    "category": "adult",
    "tags": [
      "18+",
      "я теку"
    ]
  },
  {
    "id": "y-003",
    "name": "Только не в рот",
    "file": "y-003.svg",
    "category": "adult",
    "tags": [
      "18+",
      "только не в рот"
    ]
  },
  {
    "id": "y-004",
    "name": "Параметры?",
    "file": "y-004.svg",
    "category": "adult",
    "tags": [
      "18+",
      "параметры"
    ]
  },
  {
    "id": "y-005",
    "name": "Страпон хочешь?",
    "file": "y-005.svg",
    "category": "adult",
    "tags": [
      "18+",
      "страпон хочешь"
    ]
  },
  {
    "id": "y-006",
    "name": "Презервативы купи к чаю!",
    "file": "y-006.svg",
    "category": "adult",
    "tags": [
      "18+",
      "презервативы купи к чаю"
    ]
  },
  {
    "id": "y-007",
    "name": "Хочу на глаза повязку",
    "file": "y-007.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хочу на глаза повязку"
    ]
  },
  {
    "id": "y-008",
    "name": "Я была плохой девочкой",
    "file": "y-008.svg",
    "category": "adult",
    "tags": [
      "18+",
      "я была плохой девочкой"
    ]
  },
  {
    "id": "y-009",
    "name": "Кончи на лицо",
    "file": "y-009.svg",
    "category": "adult",
    "tags": [
      "18+",
      "кончи на лицо"
    ]
  },
  {
    "id": "y-010",
    "name": "Обижаешь меня постоянно...",
    "file": "y-010.svg",
    "category": "adult",
    "tags": [
      "18+",
      "обижаешь меня постоянно"
    ]
  },
  {
    "id": "y-011",
    "name": "Будь груб со мной",
    "file": "y-011.svg",
    "category": "adult",
    "tags": [
      "18+",
      "будь груб со мной"
    ]
  },
  {
    "id": "y-012",
    "name": "Ласкай мои груди",
    "file": "y-012.svg",
    "category": "adult",
    "tags": [
      "18+",
      "ласкай мои груди"
    ]
  },
  {
    "id": "y-013",
    "name": "Стенки моего влагалища — хотят твой член",
    "file": "y-013.svg",
    "category": "adult",
    "tags": [
      "18+",
      "стенки моего влагалища  хотят твой член"
    ]
  },
  {
    "id": "y-014",
    "name": "Губами ласкай мои ножки",
    "file": "y-014.svg",
    "category": "adult",
    "tags": [
      "18+",
      "губами ласкай мои ножки"
    ]
  },
  {
    "id": "y-015",
    "name": "Ласкай мою киску",
    "file": "y-015.svg",
    "category": "adult",
    "tags": [
      "18+",
      "ласкай мою киску"
    ]
  },
  {
    "id": "y-016",
    "name": "Обращайся, как с проституткой",
    "file": "y-016.svg",
    "category": "adult",
    "tags": [
      "18+",
      "обращайся как с проституткой"
    ]
  },
  {
    "id": "y-017",
    "name": "Мои половые губы — обуздают тебя",
    "file": "y-017.svg",
    "category": "adult",
    "tags": [
      "18+",
      "мои половые губы  обуздают тебя"
    ]
  },
  {
    "id": "y-018",
    "name": "Оседлаю тебя!",
    "file": "y-018.svg",
    "category": "adult",
    "tags": [
      "18+",
      "оседлаю тебя"
    ]
  },
  {
    "id": "y-019",
    "name": "Моя пизда — маленькое озеро",
    "file": "y-019.svg",
    "category": "adult",
    "tags": [
      "18+",
      "моя пизда  маленькое озеро"
    ]
  },
  {
    "id": "y-020",
    "name": "Еби меня",
    "file": "y-020.svg",
    "category": "adult",
    "tags": [
      "18+",
      "еби меня"
    ]
  },
  {
    "id": "y-021",
    "name": "Хочу твой большой член!",
    "file": "y-021.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хочу твой большой член"
    ]
  },
  {
    "id": "y-022",
    "name": "Мой рот примет всё",
    "file": "y-022.svg",
    "category": "adult",
    "tags": [
      "18+",
      "мой рот примет всё"
    ]
  },
  {
    "id": "y-023",
    "name": "У меня много тайных фантазий...",
    "file": "y-023.svg",
    "category": "adult",
    "tags": [
      "18+",
      "у меня много тайных фантазий"
    ]
  },
  {
    "id": "y-024",
    "name": "Жене не скажем...",
    "file": "y-024.svg",
    "category": "adult",
    "tags": [
      "18+",
      "жене не скажем"
    ]
  },
  {
    "id": "y-025",
    "name": "Захвати друга",
    "file": "y-025.svg",
    "category": "adult",
    "tags": [
      "18+",
      "захвати друга"
    ]
  },
  {
    "id": "y-026",
    "name": "Буду бесстыжей",
    "file": "y-026.svg",
    "category": "adult",
    "tags": [
      "18+",
      "буду бесстыжей"
    ]
  },
  {
    "id": "y-027",
    "name": "Я лучшее, что с тобой произошло",
    "file": "y-027.svg",
    "category": "adult",
    "tags": [
      "18+",
      "я лучшее что с тобой произошло"
    ]
  },
  {
    "id": "y-028",
    "name": "Заслужи секс со мной!",
    "file": "y-028.svg",
    "category": "adult",
    "tags": [
      "18+",
      "заслужи секс со мной"
    ]
  },
  {
    "id": "y-029",
    "name": "Думаю о тебе",
    "file": "y-029.svg",
    "category": "adult",
    "tags": [
      "18+",
      "думаю о тебе"
    ]
  },
  {
    "id": "y-030",
    "name": "Ты мой самец",
    "file": "y-030.svg",
    "category": "adult",
    "tags": [
      "18+",
      "ты мой самец"
    ]
  },
  {
    "id": "y-031",
    "name": "Возьми меня...",
    "file": "y-031.svg",
    "category": "adult",
    "tags": [
      "18+",
      "возьми меня"
    ]
  },
  {
    "id": "y-032",
    "name": "Я согласна на всё!",
    "file": "y-032.svg",
    "category": "adult",
    "tags": [
      "18+",
      "я согласна на всё"
    ]
  },
  {
    "id": "y-033",
    "name": "Покорна только тебе!",
    "file": "y-033.svg",
    "category": "adult",
    "tags": [
      "18+",
      "покорна только тебе"
    ]
  },
  {
    "id": "y-034",
    "name": "Завоюй меня!",
    "file": "y-034.svg",
    "category": "adult",
    "tags": [
      "18+",
      "завоюй меня"
    ]
  },
  {
    "id": "y-035",
    "name": "Лучше на животик",
    "file": "y-035.svg",
    "category": "adult",
    "tags": [
      "18+",
      "лучше на животик"
    ]
  },
  {
    "id": "y-036",
    "name": "Нравится сперма",
    "file": "y-036.svg",
    "category": "adult",
    "tags": [
      "18+",
      "нравится сперма"
    ]
  },
  {
    "id": "y-037",
    "name": "Губами целуй попу",
    "file": "y-037.svg",
    "category": "adult",
    "tags": [
      "18+",
      "губами целуй попу"
    ]
  },
  {
    "id": "y-038",
    "name": "Меня это не возбуждает",
    "file": "y-038.svg",
    "category": "adult",
    "tags": [
      "18+",
      "меня это не возбуждает"
    ]
  },
  {
    "id": "y-039",
    "name": "Секс в необычном месте...",
    "file": "y-039.svg",
    "category": "adult",
    "tags": [
      "18+",
      "секс в необычном месте"
    ]
  },
  {
    "id": "y-040",
    "name": "С тобой и твоим другом",
    "file": "y-040.svg",
    "category": "adult",
    "tags": [
      "18+",
      "с тобой и твоим другом"
    ]
  },
  {
    "id": "y-041",
    "name": "Бери друга к нам!",
    "file": "y-041.svg",
    "category": "adult",
    "tags": [
      "18+",
      "бери друга к нам"
    ]
  },
  {
    "id": "y-042",
    "name": "У меня есть вибратор...",
    "file": "y-042.svg",
    "category": "adult",
    "tags": [
      "18+",
      "у меня есть вибратор"
    ]
  },
  {
    "id": "y-043",
    "name": "Хочу разнообразия в сексе!!!",
    "file": "y-043.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хочу разнообразия в сексе"
    ]
  },
  {
    "id": "y-044",
    "name": "Родителей дома нет!",
    "file": "y-044.svg",
    "category": "adult",
    "tags": [
      "18+",
      "родителей дома нет"
    ]
  },
  {
    "id": "y-045",
    "name": "Целуй мои ушки",
    "file": "y-045.svg",
    "category": "adult",
    "tags": [
      "18+",
      "целуй мои ушки"
    ]
  },
  {
    "id": "y-046",
    "name": "Ласкай мочки...",
    "file": "y-046.svg",
    "category": "adult",
    "tags": [
      "18+",
      "ласкай мочки"
    ]
  },
  {
    "id": "y-047",
    "name": "Хочу массаж",
    "file": "y-047.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хочу массаж"
    ]
  },
  {
    "id": "y-048",
    "name": "Сделаю тебе массаж",
    "file": "y-048.svg",
    "category": "adult",
    "tags": [
      "18+",
      "сделаю тебе массаж"
    ]
  },
  {
    "id": "y-049",
    "name": "Это ножки — королевы! Заслужи их!",
    "file": "y-049.svg",
    "category": "adult",
    "tags": [
      "18+",
      "это ножки  королевы заслужи их"
    ]
  },
  {
    "id": "y-050",
    "name": "Сядь задницей на лицо",
    "file": "y-050.svg",
    "category": "adult",
    "tags": [
      "18+",
      "сядь задницей на лицо"
    ]
  },
  {
    "id": "y-051",
    "name": "Пальцами поиграй",
    "file": "y-051.svg",
    "category": "adult",
    "tags": [
      "18+",
      "пальцами поиграй"
    ]
  },
  {
    "id": "y-052",
    "name": "Будь нежнее со мной...",
    "file": "y-052.svg",
    "category": "adult",
    "tags": [
      "18+",
      "будь нежнее со мной"
    ]
  },
  {
    "id": "y-053",
    "name": "Обзывай меня грубо",
    "file": "y-053.svg",
    "category": "adult",
    "tags": [
      "18+",
      "обзывай меня грубо"
    ]
  },
  {
    "id": "y-054",
    "name": "Поиграем...?",
    "file": "y-054.svg",
    "category": "adult",
    "tags": [
      "18+",
      "поиграем"
    ]
  },
  {
    "id": "y-055",
    "name": "Сожги мои калории!",
    "file": "y-055.svg",
    "category": "adult",
    "tags": [
      "18+",
      "сожги мои калории"
    ]
  },
  {
    "id": "y-056",
    "name": "Ты ещё узнаешь мой ротик",
    "file": "y-056.svg",
    "category": "adult",
    "tags": [
      "18+",
      "ты ещё узнаешь мой ротик"
    ]
  },
  {
    "id": "y-057",
    "name": "Подрочи мой клитор",
    "file": "y-057.svg",
    "category": "adult",
    "tags": [
      "18+",
      "подрочи мой клитор"
    ]
  },
  {
    "id": "y-058",
    "name": "Слегка подуши!",
    "file": "y-058.svg",
    "category": "adult",
    "tags": [
      "18+",
      "слегка подуши"
    ]
  },
  {
    "id": "y-059",
    "name": "Целуй пупок...",
    "file": "y-059.svg",
    "category": "adult",
    "tags": [
      "18+",
      "целуй пупок"
    ]
  },
  {
    "id": "y-060",
    "name": "Раздевай меня медленно",
    "file": "y-060.svg",
    "category": "adult",
    "tags": [
      "18+",
      "раздевай меня медленно"
    ]
  },
  {
    "id": "y-061",
    "name": "Целуй грудь сквозь бельё",
    "file": "y-061.svg",
    "category": "adult",
    "tags": [
      "18+",
      "целуй грудь сквозь бельё"
    ]
  },
  {
    "id": "y-062",
    "name": "Я твоя госпожа",
    "file": "y-062.svg",
    "category": "adult",
    "tags": [
      "18+",
      "я твоя госпожа"
    ]
  },
  {
    "id": "y-063",
    "name": "Ты мой раб!",
    "file": "y-063.svg",
    "category": "adult",
    "tags": [
      "18+",
      "ты мой раб"
    ]
  },
  {
    "id": "y-064",
    "name": "Выпори меня",
    "file": "y-064.svg",
    "category": "adult",
    "tags": [
      "18+",
      "выпори меня"
    ]
  },
  {
    "id": "y-065",
    "name": "Я буду тебя пороть...",
    "file": "y-065.svg",
    "category": "adult",
    "tags": [
      "18+",
      "я буду тебя пороть"
    ]
  },
  {
    "id": "y-066",
    "name": "Отшлёпай",
    "file": "y-066.svg",
    "category": "adult",
    "tags": [
      "18+",
      "отшлёпай"
    ]
  },
  {
    "id": "y-067",
    "name": "Трахай, как суку",
    "file": "y-067.svg",
    "category": "adult",
    "tags": [
      "18+",
      "трахай как суку"
    ]
  },
  {
    "id": "y-068",
    "name": "Сисечки помни",
    "file": "y-068.svg",
    "category": "adult",
    "tags": [
      "18+",
      "сисечки помни"
    ]
  },
  {
    "id": "y-069",
    "name": "Клитор ласкай",
    "file": "y-069.svg",
    "category": "adult",
    "tags": [
      "18+",
      "клитор ласкай"
    ]
  },
  {
    "id": "y-070",
    "name": "Хочу кусать тебя везде",
    "file": "y-070.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хочу кусать тебя везде"
    ]
  },
  {
    "id": "y-071",
    "name": "Я кусаюсь...",
    "file": "y-071.svg",
    "category": "adult",
    "tags": [
      "18+",
      "я кусаюсь"
    ]
  },
  {
    "id": "y-072",
    "name": "Засосов будет много...",
    "file": "y-072.svg",
    "category": "adult",
    "tags": [
      "18+",
      "засосов будет много"
    ]
  },
  {
    "id": "y-073",
    "name": "Я же любовница...",
    "file": "y-073.svg",
    "category": "adult",
    "tags": [
      "18+",
      "я же любовница"
    ]
  },
  {
    "id": "y-074",
    "name": "Хочу реализовать...",
    "file": "y-074.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хочу реализовать"
    ]
  },
  {
    "id": "y-075",
    "name": "Тебе в ротик",
    "file": "y-075.svg",
    "category": "adult",
    "tags": [
      "18+",
      "тебе в ротик"
    ]
  },
  {
    "id": "y-076",
    "name": "Еби так, чтоб очко не закрывалось",
    "file": "y-076.svg",
    "category": "adult",
    "tags": [
      "18+",
      "еби так чтоб очко не закрывалось"
    ]
  },
  {
    "id": "y-077",
    "name": "Развальцуй очко",
    "file": "y-077.svg",
    "category": "adult",
    "tags": [
      "18+",
      "развальцуй очко"
    ]
  },
  {
    "id": "y-078",
    "name": "Оближи мои ноги",
    "file": "y-078.svg",
    "category": "adult",
    "tags": [
      "18+",
      "оближи мои ноги"
    ]
  },
  {
    "id": "y-079",
    "name": "В позе монахини",
    "file": "y-079.svg",
    "category": "adult",
    "tags": [
      "18+",
      "в позе монахини"
    ]
  },
  {
    "id": "y-080",
    "name": "Ты снизу",
    "file": "y-080.svg",
    "category": "adult",
    "tags": [
      "18+",
      "ты снизу"
    ]
  },
  {
    "id": "y-081",
    "name": "Ты сверху",
    "file": "y-081.svg",
    "category": "adult",
    "tags": [
      "18+",
      "ты сверху"
    ]
  },
  {
    "id": "y-082",
    "name": "Ты давалка?",
    "file": "y-082.svg",
    "category": "adult",
    "tags": [
      "18+",
      "ты давалка"
    ]
  },
  {
    "id": "y-083",
    "name": "Сегодня не дам",
    "file": "y-083.svg",
    "category": "adult",
    "tags": [
      "18+",
      "сегодня не дам"
    ]
  },
  {
    "id": "y-084",
    "name": "Я не такая...",
    "file": "y-084.svg",
    "category": "adult",
    "tags": [
      "18+",
      "я не такая"
    ]
  },
  {
    "id": "y-085",
    "name": "Сначала мусор вынеси — потом поебёмся",
    "file": "y-085.svg",
    "category": "adult",
    "tags": [
      "18+",
      "сначала мусор вынеси  потом поебёмся"
    ]
  },
  {
    "id": "y-086",
    "name": "Хочу секс в душе",
    "file": "y-086.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хочу секс в душе"
    ]
  },
  {
    "id": "y-087",
    "name": "Ой всё",
    "file": "y-087.svg",
    "category": "adult",
    "tags": [
      "18+",
      "ой всё"
    ]
  },
  {
    "id": "y-088",
    "name": "А ты сможешь трахать пару часов?",
    "file": "y-088.svg",
    "category": "adult",
    "tags": [
      "18+",
      "а ты сможешь трахать пару часов"
    ]
  },
  {
    "id": "y-089",
    "name": "Все мужики одинаковые",
    "file": "y-089.svg",
    "category": "adult",
    "tags": [
      "18+",
      "все мужики одинаковые"
    ]
  },
  {
    "id": "y-090",
    "name": "Сделаю из тебя мужчину!",
    "file": "y-090.svg",
    "category": "adult",
    "tags": [
      "18+",
      "сделаю из тебя мужчину"
    ]
  },
  {
    "id": "y-091",
    "name": "В жопу дам",
    "file": "y-091.svg",
    "category": "adult",
    "tags": [
      "18+",
      "в жопу дам"
    ]
  },
  {
    "id": "y-092",
    "name": "Хочешь анал?",
    "file": "y-092.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хочешь анал"
    ]
  },
  {
    "id": "y-093",
    "name": "Куннилингус любишь делать?",
    "file": "y-093.svg",
    "category": "adult",
    "tags": [
      "18+",
      "куннилингус любишь делать"
    ]
  },
  {
    "id": "y-094",
    "name": "Хочу куни",
    "file": "y-094.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хочу куни"
    ]
  },
  {
    "id": "y-095",
    "name": "Хочу большой",
    "file": "y-095.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хочу большой"
    ]
  },
  {
    "id": "y-096",
    "name": "В ротик или на животик?",
    "file": "y-096.svg",
    "category": "adult",
    "tags": [
      "18+",
      "в ротик или на животик"
    ]
  },
  {
    "id": "y-097",
    "name": "Я за деньги",
    "file": "y-097.svg",
    "category": "adult",
    "tags": [
      "18+",
      "я за деньги"
    ]
  },
  {
    "id": "y-098",
    "name": "Ищу нежадного мужчину",
    "file": "y-098.svg",
    "category": "adult",
    "tags": [
      "18+",
      "ищу нежадного мужчину"
    ]
  },
  {
    "id": "y-099",
    "name": "Приглашу поебаться",
    "file": "y-099.svg",
    "category": "adult",
    "tags": [
      "18+",
      "приглашу поебаться"
    ]
  },
  {
    "id": "y-100",
    "name": "Приеду на секс",
    "file": "y-100.svg",
    "category": "adult",
    "tags": [
      "18+",
      "приеду на секс"
    ]
  },
  {
    "id": "y-101",
    "name": "Сосу с проглотом",
    "file": "y-101.svg",
    "category": "adult",
    "tags": [
      "18+",
      "сосу с проглотом"
    ]
  },
  {
    "id": "y-102",
    "name": "Хуем до горла",
    "file": "y-102.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хуем до горла"
    ]
  },
  {
    "id": "y-103",
    "name": "Вылижу тебе задницу",
    "file": "y-103.svg",
    "category": "adult",
    "tags": [
      "18+",
      "вылижу тебе задницу"
    ]
  },
  {
    "id": "y-104",
    "name": "Ищу только XL",
    "file": "y-104.svg",
    "category": "adult",
    "tags": [
      "18+",
      "ищу только xl"
    ]
  },
  {
    "id": "y-105",
    "name": "Больше 20",
    "file": "y-105.svg",
    "category": "adult",
    "tags": [
      "18+",
      "больше 20"
    ]
  },
  {
    "id": "y-106",
    "name": "В рот и в зад",
    "file": "y-106.svg",
    "category": "adult",
    "tags": [
      "18+",
      "в рот и в зад"
    ]
  },
  {
    "id": "y-107",
    "name": "Фистинг",
    "file": "y-107.svg",
    "category": "adult",
    "tags": [
      "18+",
      "фистинг"
    ]
  },
  {
    "id": "y-108",
    "name": "3Д",
    "file": "y-108.svg",
    "category": "adult",
    "tags": [
      "18+",
      "3д"
    ]
  },
  {
    "id": "y-109",
    "name": "Хочу анальные шарики",
    "file": "y-109.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хочу анальные шарики"
    ]
  },
  {
    "id": "y-110",
    "name": "Попробуем с девайсами?",
    "file": "y-110.svg",
    "category": "adult",
    "tags": [
      "18+",
      "попробуем с девайсами"
    ]
  },
  {
    "id": "y-111",
    "name": "Свяжи меня",
    "file": "y-111.svg",
    "category": "adult",
    "tags": [
      "18+",
      "свяжи меня"
    ]
  },
  {
    "id": "y-112",
    "name": "Хочу в два члена",
    "file": "y-112.svg",
    "category": "adult",
    "tags": [
      "18+",
      "хочу в два члена"
    ]
  },
  {
    "id": "y-113",
    "name": "Фото во время секса",
    "file": "y-113.svg",
    "category": "adult",
    "tags": [
      "18+",
      "фото во время секса"
    ]
  },
  {
    "id": "y-114",
    "name": "Не даю",
    "file": "y-114.svg",
    "category": "adult",
    "tags": [
      "18+",
      "не даю"
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
