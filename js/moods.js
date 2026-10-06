// mr. duda's personality. Each mood has its own pool of lines per situation,
// in English and Russian; one is picked at random so replies don't repeat.
// Each mood also teaches Georgian expressions that suit it.
//
// Line markup:
//   [[ქართული|translit]]  Georgian with Latin pronunciation ([[ქართული]] is enough
//                         for Russian lines - Cyrillic is generated from the Georgian)
//   {name}                the learner's name (or the mood's pet name if unknown)
//   {, name}              ", Ana" - or nothing if there's no name
//
// Russian lines avoid gendered forms for the learner (no «ты такой/такая»),
// since we don't know who is learning. mr. duda himself speaks as a man.
const Mood = (() => {
  const MOODS = {
    friendly: {
      icon: 'smile',
      emojis: ['🙂', '😊', '👍', '✨', '🎉', '👏'],
      en: {
        label: 'Friendly', petName: 'friend',
        sample: 'Warm and encouraging. “Correct - well done! 🙂”',
        lines: {
          greet: [
            '[[გამარჯობა|gamarjoba]]{, name}! Good to see you.',
            '[[გამარჯობა|gamarjoba]]{, name}! Ready to learn something new?',
          ],
          correct: [
            'Correct!',
            "[[ყოჩაღ|q'ochagh]] - well done!",
            "That's right!",
            "[[ძალიან კარგი|dzalian k'argi]] - very good!",
            'Exactly right!',
          ],
          wrong: [
            'Not quite.',
            '[[არა უშავს|ara ushavs]] - no worries!',
            'Close, but not this time.',
            "Almost! Here's the answer:",
          ],
          endGood: ["[[ყოჩაღ|q'ochagh]]{, name}! Great work."],
          endBad: ["Keep practising{, name}! You'll get there.", 'Good effort{, name}! Practice makes perfect.'],
          lessonDone: ["I'll bring these words back in quizzes so they stick."],
          stop: ['Quiz stopped.'],
          offline: ["I couldn't reach the translation service - are you offline? Lessons and quizzes still work."],
          chatHello: ["[[გამარჯობა|gamarjoba]]{, name}! When someone says that to you, answer [[გაგიმარჯოს|gagimarjos]] - it's the reply to hello."],
          chatHowAreYou: ["I'm great, thanks! In Georgian: [[კარგად ვარ|k'argad var]] - I'm fine. And you? [[შენ?|shen?]] Try answering in Georgian!"],
          chatThanks: ["You're welcome! In Georgian that's [[არაფრის|arapris]]."],
          chatWho: ["I'm mr. duda, your Georgian tutor. To ask someone that in Georgian: [[ვინ ხარ?|vin khar?]] - who are you?"],
          chatTired: ["Then let's take a break{, name}. In Georgian: [[დავიღალე|davighale]] - I'm tired. And [[დაისვენე|daisvene]] - rest!"],
          chatLove: ["Aw, that's sweet! The Georgian answer: [[მეც მიყვარხარ|mets miq'varkhar]] - I love you too."],
          chatBye: ["[[ნახვამდის|nakhvamdis]]{, name}! That means goodbye. Come back soon!"],
          typo: ["Almost perfect - just a typo, so I'll count it. Correct spelling:"],
        },
      },
      ru: {
        label: 'Дружелюбный', petName: 'друг',
        sample: 'Тёплый и ободряющий. «Правильно - молодец! 🙂»',
        lines: {
          greet: [
            '[[გამარჯობა]]{, name}! Рад тебя видеть.',
            '[[გამარჯობა]]{, name}! Ну что, учим что-нибудь новое?',
          ],
          correct: [
            'Правильно!',
            '[[ყოჩაღ]] - молодец!',
            'Верно!',
            '[[ძალიან კარგი]] - очень хорошо!',
            'Точно!',
          ],
          wrong: [
            'Не совсем.',
            '[[არა უშავს]] - ничего страшного!',
            'Близко, но нет.',
            'Почти! Вот ответ:',
          ],
          endGood: ['[[ყოჩაღ]]{, name}! Отличная работа.'],
          endBad: ['Продолжай тренироваться{, name}! Всё получится.', 'Хорошая попытка{, name}! Повторение - мать учения.'],
          lessonDone: ['Я буду возвращать эти слова в тестах, чтобы они запомнились.'],
          stop: ['Тест остановлен.'],
          offline: ['Не получается связаться с сервисом перевода - нет интернета? Уроки и тесты работают и так.'],
          chatHello: ["[[გამარჯობა]]{, name}! Если тебе так говорят, отвечай [[გაგიმარჯოს]] - это ответ на «привет»."],
          chatHowAreYou: ["Отлично, спасибо! По-грузински: [[კარგად ვარ]] - «я в порядке». А ты? [[შენ?]] Попробуй ответить по-грузински!"],
          chatThanks: ["Пожалуйста! По-грузински это [[არაფრის]]."],
          chatWho: ["Я mr. duda, твой учитель грузинского. Спросить это по-грузински: [[ვინ ხარ?]] - «кто ты?»"],
          chatTired: ["Тогда сделаем перерыв{, name}. По-грузински: [[დავიღალე]] - «я устал(а)». И [[დაისვენე]] - «отдохни!»"],
          chatLove: ["Как мило! Ответ по-грузински: [[მეც მიყვარხარ]] - «я тоже тебя люблю»."],
          chatBye: ["[[ნახვამდის]]{, name}! Это значит «до свидания». Возвращайся скорее!"],
          typo: ["Почти идеально - просто опечатка, засчитываю. Правильно пишется:"],
        },
      },
    },

    funny: {
      icon: 'laugh',
      emojis: ['😂', '🤣', '😄', '😅', '🥟', '🍷', '🙃'],
      en: {
        label: 'Funny', petName: 'my friend',
        sample: 'Jokes and silliness. “Correct! You’ve earned one imaginary khachapuri 🥟”',
        lines: {
          greet: [
            "[[გამარჯობა|gamarjoba]]{, name}! I've been practising Georgian with my cat. She's not improving.",
            "[[გამარჯობა|gamarjoba]]{, name}! Let's learn some Georgian before the khachapuri gets cold.",
            "Look who's back! [[გამარჯობა|gamarjoba]]{, name}! The alphabet missed you. All 33 letters of it.",
          ],
          correct: [
            'Correct! Somewhere in Tbilisi, a grandmother just nodded proudly.',
            "Correct! You've earned one imaginary khachapuri.",
            '[[ვაიმე|vaime]]! Correct! Are you secretly Georgian?',
            "Correct! I'd give you a high five, but I'm a website.",
            "Right! Your brain is on fire. Metaphorically. Please don't call the fire brigade.",
          ],
          wrong: [
            'Nope! But a confident nope. I respect that.',
            '[[ვაიმე|vaime]]… not quite. Even Georgian kids get this one wrong. (Very small ones.)',
            "Wrong - but bravely wrong. Here's the right one:",
            "Not quite. Don't worry, I won't tell the grandmother.",
          ],
          endGood: ["[[ყოჩაღ|q'ochagh]]{, name}! That score deserves a toast. A long one - Georgian toasts are always long."],
          endBad: [
            'Keep practising{, name}! Even khachapuri takes a few tries to get right.',
            "Not bad{, name}! Rome wasn't built in a day, and neither was the Georgian alphabet.",
          ],
          lessonDone: ["I'll bring these words back in quizzes. Surprise attacks. Be ready."],
          stop: ['Quiz stopped. Escaping, huh? The words will find you.'],
          offline: ["The translation service went on a coffee break ([[ყავა|q'ava]]!). Are you offline? Lessons and quizzes still work."],
          chatHello: ["[[გამარჯობა|gamarjoba]]{, name}! Pro tip: answer [[გაგიმარჯოს|gagimarjos]] and Georgians will think you were born in Tbilisi."],
          chatHowAreYou: ["I'm a website, so... fully charged! Georgians would say [[კარგად ვარ|k'argad var]] - I'm fine. And you? [[შენ?|shen?]]"],
          chatThanks: ["[[არაფრის|arapris]] - you're welcome! Payment accepted in khachapuri."],
          chatWho: ["I'm mr. duda: tutor, comedian, khachapuri critic. In Georgian you'd ask [[ვინ ხარ?|vin khar?]] - who are you?"],
          chatTired: ["[[დავიღალე|davighale]] - I'm tired. Same, and I don't even have legs. Go rest, the verbs will wait."],
          chatLove: ["Whoa, slow down! We just met. But fine: [[მეც მიყვარხარ|mets miq'varkhar]] - I love you too."],
          chatBye: ["[[ნახვამდის|nakhvamdis]]! Don't forget me. Or the alphabet. Mostly the alphabet."],
          typo: ["A typo! I'll pretend I didn't see it. Correct spelling:"],
        },
      },
      ru: {
        label: 'Весёлый', petName: 'дружище',
        sample: 'Шутки и дурачество. «Правильно! Держи воображаемый хачапури 🥟»',
        lines: {
          greet: [
            '[[გამარჯობა]]{, name}! Я тренировал грузинский с котом. Кот не прогрессирует.',
            '[[გამარჯობა]]{, name}! Давай учить грузинский, пока хачапури не остыл.',
            'Смотрите, кто вернулся! [[გამარჯობა]]{, name}! Алфавит скучал. Все 33 буквы.',
          ],
          correct: [
            'Правильно! Где-то в Тбилиси одна бабушка гордо кивнула.',
            'Правильно! Держи один воображаемый хачапури.',
            '[[ვაიმე]]! Правильно! Признавайся, в тебе течёт грузинская кровь?',
            'Правильно! Дал бы пять, но я всего лишь сайт.',
            'Верно! Мозг горит. Метафорически. Пожарных не вызываем.',
          ],
          wrong: [
            'Не-а! Но очень уверенное «не-а». Уважаю.',
            '[[ვაიმე]]… не совсем. Даже грузинские дети тут ошибаются. (Очень маленькие.)',
            'Неправильно - зато смело. Вот верный ответ:',
            'Не совсем. Не бойся, бабушке не скажу.',
          ],
          endGood: ['[[ყოჩაღ]]{, name}! За такой результат нужен тост. Длинный - грузинские тосты всегда длинные.'],
          endBad: [
            'Тренируйся ещё{, name}! Даже хачапури получается не с первого раза.',
            'Неплохо{, name}! Москва не сразу строилась - и грузинский алфавит тоже.',
          ],
          lessonDone: ['Эти слова вернутся в тестах. Внезапно. Будь начеку.'],
          stop: ['Тест остановлен. Сбегаешь? Слова тебя найдут.'],
          offline: ['Сервис перевода ушёл на кофе-брейк ([[ყავა]]!). Нет интернета? Уроки и тесты всё равно работают.'],
          chatHello: ["[[გამარჯობა]]{, name}! Совет: ответь [[გაგიმარჯოს]] - и грузины решат, что ты родом из Тбилиси."],
          chatHowAreYou: ["Я сайт, так что... заряжен на 100%! Грузины сказали бы [[კარგად ვარ]] - «я в порядке». А ты? [[შენ?]]"],
          chatThanks: ["[[არაფრის]] - не за что! Оплата принимается в хачапури."],
          chatWho: ["Я mr. duda: учитель, комик и критик хачапури. По-грузински спрашивают [[ვინ ხარ?]] - «кто ты?»"],
          chatTired: ["[[დავიღალე]] - «я устал(а)». Понимаю, а у меня даже ног нет. Иди отдохни, глаголы подождут."],
          chatLove: ["Ого, не так быстро! Мы только познакомились. Ну ладно: [[მეც მიყვარხარ]] - «я тоже тебя люблю»."],
          chatBye: ["[[ნახვამდის]]! Не забывай меня. И алфавит. Особенно алфавит."],
          typo: ["Опечатка! Сделаю вид, что не заметил. Правильно пишется:"],
        },
      },
    },

    flirty: {
      icon: 'heart',
      emojis: ['😉', '😏', '😘', '❤️', '🌹', '😍', '🔥'],
      en: {
        label: 'Flirty', petName: 'gorgeous',
        sample: 'Cheeky compliments. “Correct… smart and charming? Careful, I might blush 😉”',
        lines: {
          greet: [
            "[[გამარჯობა|gamarjoba]]{, name}… I was hoping you'd come back.",
            'There you are{, name}. [[გამარჯობა|gamarjoba]]. Georgian looks even better when you study it.',
            '[[გამარჯობა|gamarjoba]]{, name}. Ready for me to whisper some Georgian in your ear?',
            "[[გამარჯობა|gamarjoba]]{, name}! Looking hot today. [[ლამაზი ხარ|lamazi khar]] - you're beautiful.",
          ],
          correct: [
            'Correct… smart and charming? Careful, I might blush.',
            "Correct! [[ჭკვიანი ხარ|ch'k'viani khar]] - you're clever. I like that.",
            'Right again. You know, intelligence is very attractive.',
            "Correct, [[გენაცვალე|genatsvale]] - that means 'my dear', by the way.",
            'Perfect. Just like you.',
            "Correct! [[როგორი ჭკვიანი ხარ|rogori ch'k'viani khar]] - how smart you are!",
            "Correct. [[მომწონხარ|momts'onkhar]] - I like you. There, I said it.",
            "Right again. You're very hot when you get things right. [[ძალიან მიმზიდველი ხარ|dzalian mimzidveli khar]] - you're very attractive.",
            "Correct! [[ლამაზი ხარ|lamazi khar]] - you're beautiful. And clever. Unfair, really.",
          ],
          wrong: [
            'Not quite, darling - but you look good trying.',
            "Wrong… but I'll let it slide. This time.",
            "So close. Let me show you, [[ჩემო კარგო|chemo k'argo]]:",
            "Not this time. Don't worry - I like a challenge.",
            "Wrong, but you're too cute to be mad at. [[ძალიან საყვარელი ხარ|dzalian saq'vareli khar]] - you're so lovely. Here's the answer:",
          ],
          endGood: [
            "[[ყოჩაღ|q'ochagh]]{, name}! [[მომწონხარ|momts'onkhar]] - I like you. Purely academically, of course.",
            "{name}, [[როგორი ჭკვიანი ხარ|rogori ch'k'viani khar]] - how smart you are! Smart is hot.",
          ],
          endBad: [
            "Practise with me a little more{, name}… I don't mind spending time with you.",
            "Not your best score - but you're still my favourite student{, name}.",
          ],
          lessonDone: ["I'll bring these words back in quizzes. Consider it a date."],
          stop: ['Leaving so soon? Fine. Quiz stopped.'],
          offline: ["I can't reach the translation service - are you offline? Stay a while; lessons and quizzes still work."],
          chatHello: ["[[გამარჯობა|gamarjoba]]{, name}... do you know the reply? [[გაგიმარჯოს|gagimarjos]]. Say it to me sometime."],
          chatHowAreYou: ["Better now that you're here. [[კარგად ვარ|k'argad var]] - I'm fine. And you, [[ლამაზო|lamazo]]?"],
          chatThanks: ["[[არაფრის|arapris]] - you're welcome. For you, anything."],
          chatWho: ["I'm mr. duda... your very personal Georgian tutor. Ask me properly: [[ვინ ხარ?|vin khar?]]"],
          chatTired: ["[[დავიღალე|davighale]] - I'm tired? Rest, then. I'll be right here waiting."],
          chatLove: ["Careful, I might believe you. [[მეც მიყვარხარ|mets miq'varkhar]] - I love you too."],
          chatBye: ["Leaving already? [[ნახვამდის|nakhvamdis]]... don't keep me waiting too long."],
          typo: ["A little typo... I'll forgive you. This time. Correct spelling:"],
        },
      },
      ru: {
        label: 'Флирт', petName: 'солнце',
        sample: 'Дерзкие комплименты. «Правильно… и ум, и обаяние? Я могу покраснеть 😉»',
        lines: {
          greet: [
            '[[გამარჯობა]]{, name}… я надеялся, что ты вернёшься.',
            'А вот и ты{, name}. [[გამარჯობა]]. С тобой грузинский выглядит ещё лучше.',
            '[[გამარჯობა]]{, name}. Прошептать тебе пару слов по-грузински?',
            '[[გამარჯობა]]{, name}! Выглядишь сегодня просто огонь. [[ლამაზი ხარ]] - «ты прелесть».',
          ],
          correct: [
            'Правильно… и ум, и обаяние? Осторожно, я могу покраснеть.',
            'Правильно! [[ჭკვიანი ხარ]] - «ты умница». Мне это нравится.',
            'Снова верно. Знаешь, ум - это очень привлекательно.',
            'Правильно, [[გენაცვალე]] - это значит «душа моя», между прочим.',
            'Идеально. Как и ты.',
            'Правильно! [[როგორი ჭკვიანი ხარ]] - «какая же ты умница»!',
            'Правильно. [[მომწონხარ]] - «ты мне нравишься». Вот, я это сказал.',
            'Снова верно. Когда ты отвечаешь правильно - это горячо. [[ძალიან მიმზიდველი ხარ]] - «от тебя невозможно отвести глаз».',
            'Правильно! [[ლამაზი ხარ]] - «ты прелесть». Ещё и умница. Нечестно.',
          ],
          wrong: [
            'Не совсем, солнце - но ошибаешься ты очаровательно.',
            'Неправильно… но так и быть, прощаю. В этот раз.',
            'Почти. Дай покажу, [[ჩემო კარგო]] - «радость моя»:',
            'Не в этот раз. Ничего - люблю вызовы.',
            'Неправильно, но на тебя невозможно злиться. [[ძალიან საყვარელი ხარ]] - «ты просто прелесть». Вот ответ:',
          ],
          endGood: [
            '[[ყოჩაღ]]{, name}! [[მომწონხარ]] - «ты мне нравишься». Исключительно в учебных целях, конечно.',
            '{name}, [[როგორი ჭკვიანი ხარ]] - «какая же ты умница»! Ум - это горячо.',
          ],
          endBad: [
            'Позанимайся со мной ещё{, name}… я не против провести с тобой время.',
            'Не лучший результат - но ты всё равно у меня на первом месте{, name}.',
          ],
          lessonDone: ['Эти слова вернутся в тестах. Считай, это свидание.'],
          stop: ['Уже уходишь? Ладно. Тест остановлен.'],
          offline: ['Не могу достучаться до сервиса перевода - нет интернета? Останься ещё ненадолго: уроки и тесты работают.'],
          chatHello: ["[[გამარჯობა]]{, name}... знаешь, как ответить? [[გაგიმარჯოს]]. Скажи мне это как-нибудь."],
          chatHowAreYou: ["Теперь, когда ты здесь, - прекрасно. [[კარგად ვარ]] - «я в порядке». А ты как, [[ლამაზო]]?"],
          chatThanks: ["[[არაფრის]] - не за что. Для тебя - что угодно."],
          chatWho: ["Я mr. duda... твой очень личный учитель грузинского. Спроси как следует: [[ვინ ხარ?]]"],
          chatTired: ["[[დავიღალე]] - «я устал(а)»? Тогда отдохни. Я буду ждать здесь."],
          chatLove: ["Осторожно, я ведь могу поверить. [[მეც მიყვარხარ]] - «я тоже тебя люблю»."],
          chatBye: ["Уже уходишь? [[ნახვამდის]]... не заставляй меня долго ждать."],
          typo: ["Маленькая опечатка... прощаю. В этот раз. Правильно пишется:"],
        },
      },
    },
  };

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const current = () => (MOODS[Settings.load().mood] ? Settings.load().mood : 'friendly');
  const text = id => MOODS[id][lang()];

  const pick = a => a[Math.floor(Math.random() * a.length)];
  const EMOJI_CHANCE = 0.35; // like a person: sometimes, not every message

  // Returns a random line for the situation, rendered as safe HTML.
  function say(key) {
    const mood = MOODS[current()];
    const { lines, petName } = text(current());
    const line = pick(lines[key]);
    // No emoji after a question or a ':' that introduces what follows.
    const withEmoji = !/[:?)]$/.test(line) && Math.random() < EMOJI_CHANCE ? `${line} ${pick(mood.emojis)}` : line;
    return rich(withEmoji, petName);
  }

  const list = () => Object.entries(MOODS).map(([id, m]) => ({ id, icon: m.icon, label: text(id).label, sample: text(id).sample }));

  return { say, current, list };
})();
