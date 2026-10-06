// Interface language (English or Russian). The app always teaches Georgian;
// this only changes the language the learner reads explanations in.
//   t(key, vars)   UI string; {var} placeholders are filled from vars (caller escapes)
//   meaning(word)  a word's meaning in the learner's language
//   pron(ka, tr)   pronunciation: Latin for English speakers, Cyrillic for Russian
const LANGS = [
  { id: 'en', label: 'English' },
  { id: 'ru', label: 'Русский' },
];

const I18N = {
  en: {
    subtitle: 'Your Georgian tutor',
    placeholder: 'Type a word or sentence…',
    send: 'Send',
    settings: 'Settings',
    lessons: 'Lessons', alphabet: 'Alphabet', quiz: 'Quiz',
    howTo: '<b>Just type any word or sentence</b> - English, Russian or Georgian - and I\'ll translate it.\n\nOr tap a button below to start a lesson or a quiz.',
    moodSet: '{label} mode.',
    pickMood: 'Pick one of my moods:',
    helpTitle: 'What I can do',
    help: '<code>lessons</code> - list all lessons\n<code>lesson food</code> - study a lesson\n<code>alphabet</code> - the 33 letters of Mkhedruli\n<code>letter ღ</code> - details about one letter\n<code>quiz</code> - practise; words you\'re due to review come first\n<code>quiz numbers</code> - quiz one lesson\n<code>grammar</code> - short grammar tips\n<code>examples წყალი</code> - example sentences with a word\n<code>stop</code> - end the current quiz\n<code>mood funny</code> - change my mood (friendly, funny or flirty)\nAnything else - I\'ll translate it.',
    words: n => `${n} words`,
    noLesson: 'I don\'t have a lesson called “{x}”.',
    quizLesson: 'Quiz: {x}',
    otherLessons: 'Other lessons',
    alphabetTitle: 'The Georgian alphabet (Mkhedruli)',
    alphabetIntro: '33 letters, one sound each - Georgian is written exactly as it\'s pronounced. There are no capital letters. Tap a letter for details.',
    alphabetQuiz: 'Alphabet quiz',
    notLetter: 'That isn\'t one of the 33 Mkhedruli letters.',
    sound: 'Sound',
    examples: 'Examples',
    backToAlphabet: 'Back to alphabet',
    whichSound: 'Which sound does {x} make?',
    whatMean: 'What does {x} mean?',
    howSay: 'How do you say <b>“{x}”</b> in Georgian?',
    quizIntro: 'Tap an option or type your answer. Type <code>stop</code> to quit.',
    score: 'Score: <b>{s}/{n}</b> ({p}%)',
    scoreSoFar: 'Score so far: {s}/{n}.',
    tooLong: 'That\'s a bit long - try a shorter phrase (under 300 characters).',
    dictionary: 'Dictionary',
    otherMeanings: 'Other meanings',
    save: 'Save {x}',
    saved: 'Saved {x}',
    translating: 'Translating…',
    grammarTips: 'Grammar tips',
    grammarIntro: 'Short explanations of how Georgian works. Pick a topic:',
    examplesBtn: 'Examples',
    examplesTitle: 'Examples with {x}',
    noExamples: 'I couldn\'t find example sentences for {x} yet.',
    examplesCredit: 'Sentences from Tatoeba',
    // Settings
    language: 'Language',
    yourName: 'Your name',
    namePlaceholder: 'What should I call you?',
    mood: 'mr. duda\'s mood',
    colour: 'Colour',
    customColour: 'Custom colour',
    showPron: 'Show pronunciation in Latin letters',
    myWords: 'My words',
    noWords: 'No words yet - open a lesson or save a translation.',
    remove: 'Remove',
    learned: 'Learned {n}/5',
    storageHint: 'Your saved words live only in this browser. Back them up to move them to another device.',
    backup: 'Back up my words',
    restore: 'Restore backup',
    invalidFile: 'Invalid file',
    reset: 'Reset everything',
    confirmReset: 'Click again to confirm',
    done: 'Done',
    // Setup wizard
    setupLangTitle: 'Choose your language',
    setupLangText: 'I\'ll explain Georgian in this language.',
    setupNameText: 'I\'m mr. duda, your Georgian tutor. What should I call you?',
    nameInGeorgian: 'In Georgian: {ka} - “my name is {name}”',
    canSkip: 'You can skip this if you like.',
    setupMoodTitle: 'Pick my mood',
    setupMoodText: 'How should I talk to you? You can change this later in Settings.',
    setupColourTitle: 'Pick a colour',
    setupColourText: 'Make the app yours.',
    next: 'Next', skip: 'Skip', back: 'Back', start: 'Let\'s start',
  },

  ru: {
    subtitle: 'Твой учитель грузинского',
    placeholder: 'Напиши слово или фразу…',
    send: 'Отправить',
    settings: 'Настройки',
    lessons: 'Уроки', alphabet: 'Алфавит', quiz: 'Тест',
    howTo: '<b>Просто напиши любое слово или фразу</b> - по-русски, по-английски или по-грузински - и я переведу.\n\nИли нажми кнопку ниже, чтобы начать урок или тест.',
    moodSet: 'Режим: {label}.',
    pickMood: 'Выбери моё настроение:',
    helpTitle: 'Что я умею',
    help: '<code>уроки</code> - список уроков\n<code>грамматика</code> - коротко о грамматике\n<code>примеры წყალი</code> - примеры предложений со словом\n<code>алфавит</code> - 33 буквы мхедрули\n<code>тест</code> - тренировка; сначала слова, которые пора повторить\n<code>стоп</code> - закончить тест\nВсё остальное - я переведу.',
    words: n => {
      const m10 = n % 10, m100 = n % 100;
      const w = m10 === 1 && m100 !== 11 ? 'слово' : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 'слова' : 'слов';
      return `${n} ${w}`;
    },
    noLesson: 'У меня нет урока «{x}».',
    quizLesson: 'Тест: {x}',
    otherLessons: 'Другие уроки',
    alphabetTitle: 'Грузинский алфавит (мхедрули)',
    alphabetIntro: '33 буквы, каждая - один звук: по-грузински пишут ровно так, как говорят. Заглавных букв нет. Нажми на букву, чтобы узнать больше.',
    alphabetQuiz: 'Тест по алфавиту',
    notLetter: 'Это не одна из 33 букв мхедрули.',
    sound: 'Звук',
    examples: 'Примеры',
    backToAlphabet: 'Назад к алфавиту',
    whichSound: 'Какой звук у буквы {x}?',
    whatMean: 'Что значит {x}?',
    howSay: 'Как сказать <b>«{x}»</b> по-грузински?',
    quizIntro: 'Нажми на вариант или напиши ответ. Напиши <code>стоп</code>, чтобы выйти.',
    score: 'Результат: <b>{s}/{n}</b> ({p}%)',
    scoreSoFar: 'Пока что: {s}/{n}.',
    tooLong: 'Длинновато - попробуй фразу покороче (до 300 символов).',
    dictionary: 'Словарь',
    otherMeanings: 'Другие значения',
    save: 'Сохранить {x}',
    saved: 'Сохранено: {x}',
    translating: 'Перевожу…',
    grammarTips: 'Грамматика',
    grammarIntro: 'Коротко о том, как устроен грузинский. Выбери тему:',
    examplesBtn: 'Примеры',
    examplesTitle: 'Примеры с {x}',
    noExamples: 'Пока не нашёл примеров для {x}.',
    examplesCredit: 'Предложения из Tatoeba',
    language: 'Язык',
    yourName: 'Твоё имя',
    namePlaceholder: 'Как к тебе обращаться?',
    mood: 'Настроение mr. duda',
    colour: 'Цвет',
    customColour: 'Свой цвет',
    showPron: 'Показывать произношение русскими буквами',
    myWords: 'Мои слова',
    noWords: 'Пока нет слов - открой урок или сохрани перевод.',
    remove: 'Удалить',
    learned: 'Выучено {n}/5',
    storageHint: 'Сохранённые слова хранятся только в этом браузере. Сделай резервную копию, чтобы перенести их на другое устройство.',
    backup: 'Сохранить копию',
    restore: 'Восстановить',
    invalidFile: 'Неверный файл',
    reset: 'Сбросить всё',
    confirmReset: 'Нажми ещё раз',
    done: 'Готово',
    setupLangTitle: 'Выбери язык',
    setupLangText: 'На этом языке я буду объяснять грузинский.',
    setupNameText: 'Я mr. duda, твой учитель грузинского. Как к тебе обращаться?',
    nameInGeorgian: 'По-грузински: {ka} - «меня зовут {name}»',
    canSkip: 'Можно пропустить.',
    setupMoodTitle: 'Выбери моё настроение',
    setupMoodText: 'Как мне с тобой общаться? Это можно поменять потом в настройках.',
    setupColourTitle: 'Выбери цвет',
    setupColourText: 'Сделай приложение своим.',
    next: 'Далее', skip: 'Пропустить', back: 'Назад', start: 'Начнём',
  },
};

const lang = () => (Settings.load().lang === 'ru' ? 'ru' : 'en');

function t(key, vars = {}) {
  const s = I18N[lang()][key] ?? I18N.en[key] ?? key;
  if (typeof s === 'function') return s(vars.n ?? vars);
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
}

const meaning = w => (lang() === 'ru' ? w.ru || w.en : w.en || w.ru) || '';

// Georgian → Cyrillic, letter by letter, the way Russian speakers usually write
// Georgian words (хачапури, квели): ejectives aren't marked - the alphabet lesson
// explains those sounds.
const KA_CYR = {
  'ა': 'а', 'ბ': 'б', 'გ': 'г', 'დ': 'д', 'ვ': 'в', 'ზ': 'з', 'თ': 'т', 'ი': 'и',
  'კ': 'к', 'ლ': 'л', 'მ': 'м', 'ნ': 'н', 'ო': 'о', 'პ': 'п', 'ჟ': 'ж', 'რ': 'р', 'ს': 'с',
  'ტ': 'т', 'უ': 'у', 'ფ': 'п', 'ქ': 'к', 'ღ': 'г', 'ყ': 'к', 'შ': 'ш', 'ჩ': 'ч', 'ც': 'ц',
  'ძ': 'дз', 'წ': 'ц', 'ჭ': 'ч', 'ხ': 'х', 'ჯ': 'дж', 'ჰ': 'х',
};
const KA_VOWELS = 'აეიოუ';
function toCyrillic(ka) {
  let out = '';
  [...ka].forEach((c, i, all) => {
    // ე sounds like Russian «э»: write э at the start of a word or after a vowel.
    if (c === 'ე') out += (i === 0 || !/[ა-ჰ]/.test(all[i - 1]) || KA_VOWELS.includes(all[i - 1])) ? 'э' : 'е';
    else out += KA_CYR[c] ?? c;
  });
  return out;
}

const pron = (ka, tr) => (lang() === 'ru' ? toCyrillic(ka) : tr || '');

// Renders text with markup as safe HTML:
//   [[ქართული|translit]]  Georgian + pronunciation (Cyrillic is generated for Russian,
//                         so Russian text may write just [[ქართული]])
//   {name} / {, name}     the learner's name (or `fallbackName`) / ", Ana" or nothing
function rich(text, fallbackName = '') {
  const escHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const settings = Settings.load();
  const name = settings.name;
  return text.split(/(\[\[[^\]]+\]\])/).map(part => {
    const m = part.match(/^\[\[([^|\]]+)(?:\|([^\]]+))?\]\]$/);
    if (!m) {
      return escHtml(part).replace(/\{, name\}/g, name ? `, ${escHtml(name)}` : '').replace(/\{name\}/g, escHtml(name || fallbackName));
    }
    const p = pron(m[1], m[2]);
    return `<span class="ka">${escHtml(m[1])}</span>${settings.showTranslit && p ? ` <span class="tr">${escHtml(p)}</span>` : ''}`;
  }).join('');
}

// Single letters in the alphabet lesson need distinct labels (კ / ქ / ყ are all «к»
// in words), so ejectives get ' and the throat sounds get ъ.
const CYR_LETTER = {
  ...KA_CYR, 'ე': 'э', 'კ': "к'", 'პ': "п'", 'ტ': "т'", 'წ': "ц'", 'ჭ': "ч'", 'ყ': 'къ', 'ღ': 'гъ', 'ჰ': 'h',
};
const letterSound = (letter, latin) => (lang() === 'ru' ? CYR_LETTER[letter] : latin);
