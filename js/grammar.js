// Short grammar tips for beginners, in English and Russian. Bodies use the
// rich() markup from i18n.js: [[ქართული|translit]] for Georgian (Russian text
// gets Cyrillic pronunciation generated automatically).
const GRAMMAR = [
  {
    id: 'basics', icon: 'sparkles',
    en: {
      title: 'No "the", no gender',
      body: 'Georgian has no articles (no "a" or "the") and no grammatical gender. [[ის|is]] means he, she and it - one word for all.\n' +
        "[[კატა|k'at'a]] - a cat / the cat\n[[ის აქ არის|is ak aris]] - he / she / it is here",
    },
    ru: {
      title: 'Без артиклей и без рода',
      body: 'В грузинском нет артиклей и нет грамматического рода. [[ის]] - это и «он», и «она», и «оно».\n' +
        '[[კატა]] - кошка\n[[ის აქ არის]] - он / она / оно здесь',
    },
  },
  {
    id: 'pronouns', icon: 'users',
    en: {
      title: 'Pronouns',
      body: '[[მე|me]] - I\n[[შენ|shen]] - you\n[[ის|is]] - he / she / it\n[[ჩვენ|chven]] - we\n[[თქვენ|tkven]] - you (plural or polite)\n[[ისინი|isini]] - they',
    },
    ru: {
      title: 'Местоимения',
      body: '[[მე]] - я\n[[შენ]] - ты\n[[ის]] - он / она / оно\n[[ჩვენ]] - мы\n[[თქვენ]] - вы (много людей или вежливо)\n[[ისინი]] - они',
    },
  },
  {
    id: 'tobe', icon: 'person-standing',
    en: {
      title: 'To be',
      body: '[[ვარ|var]] - I am\n[[ხარ|khar]] - you are\n[[არის|aris]] - he / she / it is\n' +
        "[[მე სტუდენტი ვარ|me st'udent'i var]] - I am a student\n" +
        "In speech [[არის|aris]] often shrinks to -ა on the word before: [[ეს წყალია|es ts'q'alia]] - this is water.",
    },
    ru: {
      title: 'Глагол «быть»',
      body: 'В отличие от русского, в грузинском «быть» обязательно:\n[[ვარ]] - я (есть)\n[[ხარ]] - ты (есть)\n[[არის]] - он / она / оно (есть)\n' +
        '[[მე სტუდენტი ვარ]] - я студент(ка)\n' +
        'В разговоре [[არის]] часто сокращается до -ა в конце слова: [[ეს წყალია]] - это вода.',
    },
  },
  {
    id: 'questions', icon: 'message-circle',
    en: {
      title: 'Asking questions',
      body: 'Word order stays the same - just add a question word or raise your voice.\n' +
        "[[რა|ra]] - what\n[[ვინ|vin]] - who\n[[სად|sad]] - where\n[[როდის|rodis]] - when\n[[რატომ|rat'om]] - why\n[[როგორ|rogor]] - how\n" +
        "[[სად არის ბანკი?|sad aris bank'i?]] - where is the bank?",
    },
    ru: {
      title: 'Вопросы',
      body: 'Порядок слов не меняется - просто добавь вопросительное слово или интонацию.\n' +
        '[[რა]] - что\n[[ვინ]] - кто\n[[სად]] - где\n[[როდის]] - когда\n[[რატომ]] - почему\n[[როგორ]] - как\n' +
        '[[სად არის ბანკი?]] - где банк?',
    },
  },
  {
    id: 'plural', icon: 'list',
    en: {
      title: 'Plural',
      body: 'Add [[-ები|-ebi]], dropping a final -ი or -ა:\n' +
        "[[სახლი|sakhli]] → [[სახლები|sakhlebi]] - houses\n[[კატა|k'at'a]] → [[კატები|k'at'ebi]] - cats\n" +
        "After a number the noun stays singular: [[სამი კატა|sami k'at'a]] - three cats.",
    },
    ru: {
      title: 'Множественное число',
      body: 'Добавь [[-ები]], убирая конечное -ი или -ა:\n' +
        '[[სახლი]] → [[სახლები]] - дома\n[[კატა]] → [[კატები]] - кошки\n' +
        'После числа существительное остаётся в единственном числе: [[სამი კატა]] - три кошки.',
    },
  },
  {
    id: 'order', icon: 'signpost',
    en: {
      title: 'Word order',
      body: 'Usually subject - object - verb, but it is flexible:\n' +
        "[[მე ყავა მინდა|me q'ava minda]] - I want coffee (literally \"I coffee want\")\n" +
        "[[მე ქართულს ვსწავლობ|me kartuls vsts'avlob]] - I am learning Georgian",
    },
    ru: {
      title: 'Порядок слов',
      body: 'Обычно подлежащее - дополнение - глагол, но порядок свободный:\n' +
        '[[მე ყავა მინდა]] - я хочу кофе (дословно «я кофе хочу»)\n' +
        '[[მე ქართულს ვსწავლობ]] - я учу грузинский',
    },
  },
  {
    id: 'postpositions', icon: 'house',
    en: {
      title: '"In", "on", "at" are endings',
      body: 'Georgian puts these at the end of the word:\n' +
        '[[-ში|-shi]] - in: [[სახლში|sakhlshi]] - in the house\n' +
        '[[-ზე|-ze]] - on: [[მაგიდაზე|magidaze]] - on the table\n' +
        "[[-თან|-tan]] - at / by: [[მეგობართან|megobartan]] - at a friend's\n" +
        'A final -ი drops: სახლი → სახლში.',
    },
    ru: {
      title: '«В», «на», «у» - это окончания',
      body: 'В грузинском они ставятся в конец слова:\n' +
        '[[-ში]] - в: [[სახლში]] - в доме\n' +
        '[[-ზე]] - на: [[მაგიდაზე]] - на столе\n' +
        '[[-თან]] - у, возле: [[მეგობართან]] - у друга\n' +
        'Конечное -ი выпадает: სახლი → სახლში.',
    },
  },
  {
    id: 'verbs', icon: 'zap',
    en: {
      title: 'Verbs change with the person',
      body: 'The "I" form often starts with ვ- (v-):\n' +
        '[[ვსვამ|vsvam]] - I drink\n[[სვამ|svam]] - you drink\n[[სვამს|svams]] - he / she drinks\n' +
        'Some verbs work "backwards": [[მინდა|minda]] (I want) is literally "it is wanted to me", ' +
        "and [[მომწონს|momts'ons]] (I like) is \"it pleases me\".",
    },
    ru: {
      title: 'Глаголы меняются по лицам',
      body: 'Форма «я» часто начинается с ვ-:\n' +
        '[[ვსვამ]] - я пью\n[[სვამ]] - ты пьёшь\n[[სვამს]] - он / она пьёт\n' +
        'Некоторые глаголы работают «наоборот», как русское «мне нравится»: ' +
        '[[მომწონს]] - мне нравится, [[მინდა]] - мне хочется / я хочу.',
    },
  },
  {
    id: 'polite', icon: 'hand',
    en: {
      title: 'Polite "you"',
      body: 'Like French "vous" or Russian "вы", Georgian has a polite you: [[თქვენ|tkven]]. Polite verb forms often end in -თ (-t):\n' +
        '[[გთხოვ|gtkhov]] - please (to a friend)\n[[გთხოვთ|gtkhovt]] - please (polite)',
    },
    ru: {
      title: 'Вежливое «вы»',
      body: 'Как и в русском, есть вежливое «вы»: [[თქვენ]]. Вежливые формы глагола часто оканчиваются на -თ:\n' +
        '[[გთხოვ]] - пожалуйста (другу)\n[[გთხოვთ]] - пожалуйста (вежливо)',
    },
  },
];
