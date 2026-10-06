// Rule-based tutor: lessons, alphabet, quizzes, spaced-repetition review and a
// dictionary lookup. `reply(text)` returns an array of bot messages (or a
// Promise of one, for online lookups): { html, actions?: [{ label, icon?, send | add, ka? }] }.
// All text comes from i18n.js (English / Russian); Georgian is always the target.
const Offline = (() => {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ka = s => `<span class="ka">${esc(s)}</span>`;
  // Pronunciation after a Georgian word: Latin or Cyrillic depending on the interface language.
  const tr = (kaText, latin) => {
    const p = pron(kaText, latin);
    return Settings.load().showTranslit && p ? ` <span class="tr">${esc(p)}</span>` : '';
  };
  const speak = s => `<button class="speak" data-speak="${esc(s)}" title="Listen" aria-label="Listen">${icon('volume-2')}</button>`;
  const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
  // Lowercase, drop punctuation/ellipses; apostrophes are optional in transliteration.
  const norm = s => s.toLowerCase().replace(/[’'`?!.,…«»"]/g, '').replace(/ё/g, 'е').replace(/\s+/g, ' ').trim();
  const bare = s => s.toLowerCase().replace(/^(the|a|an|to) /, '').trim();
  const title = l => (lang() === 'ru' ? l.titleRu : l.title);
  const saveAction = w => ({ icon: 'plus', label: t('save', { x: w.ka }), add: w, ka: true });

  const mainActions = () => [
    { icon: 'book-open', label: t('lessons'), send: 'lessons' },
    { icon: 'languages', label: t('alphabet'), send: 'alphabet' },
    { icon: 'target', label: t('quiz'), send: 'quiz' },
  ];

  // Quiz session is persisted so a page reload doesn't lose your place.
  const session = {
    get: () => Store.get('quiz', null),
    set: q => Store.set('quiz', q),
    clear: () => Store.remove('quiz'),
  };

  // ---------- Greeting & mood (name, mood, colour, language come from the setup wizard) ----------
  const say = Mood.say;
  const moodActions = () => Mood.list().map(m => ({ icon: m.icon, label: m.label, send: `mood ${m.id}` }));

  function welcome() {
    return [{ html: `${say('greet')}\n\n${t('howTo')}`, actions: mainActions() }];
  }

  function setMood(id) {
    const mood = Mood.list().find(m => m.id === id || m.label.toLowerCase() === id);
    if (!mood) return [{ html: t('pickMood'), actions: moodActions() }];
    Settings.save({ ...Settings.load(), mood: mood.id });
    return [{ html: `${icon(mood.icon)} <b>${esc(t('moodSet', { label: mood.label }))}</b> ${say('greet')}\n\n${t('howTo')}`, actions: mainActions() }];
  }

  // ---------- Small talk ----------
  // Everyday messages get a reply in mr. duda's mood (teaching the Georgian for it)
  // instead of being translated. Only short messages count, so "translate: how are
  // you doing today at work" still goes to the translator.
  const SMALL_TALK = [
    ['chatHowAreYou', /\b(how are you|how're you|how r u|how is it going|how's it going|what'?s up)\b|как (у тебя )?дела|как ты(\s|\?|$)|как поживаешь|როგორ ხარ/],
    ['chatWho', /\b(who are you|what are you|what'?s your name)\b|кто ты|как тебя зовут|ვინ ხარ/],
    ['chatLove', /\b(i love you|love you|luv u)\b|люблю тебя|მიყვარხარ/],
    ['chatThanks', /^(thanks|thank you|thx|ty)\b|^(спасибо|спс|благодарю)|^მადლობა/],
    ['chatTired', /\b(i'?m tired|i am tired|so tired)\b|^tired\b|устал|сил нет|დავიღალე/],
    ['chatBye', /^(bye|goodbye|see you|see ya|good night)\b|^(пока|до свидания|до встречи|спокойной ночи)|^ნახვამდის/],
    ['chatHello', /^(hi|hello|hey|hiya|good (morning|afternoon|evening))\b|^(привет|здравствуй|добрый (день|вечер)|доброе утро)|^(gamarjoba|გამარჯობა)/],
  ];

  function smallTalk(lower) {
    if (lower.length > 40) return null;
    const hit = SMALL_TALK.find(([, re]) => re.test(lower));
    return hit ? [{ html: say(hit[0]), actions: mainActions() }] : null;
  }

  function help() {
    return [{ html: `<h3>${t('helpTitle')}</h3>${t('help')}`, actions: mainActions() }];
  }

  // ---------- Lessons ----------
  function lessonsList() {
    const done = Stats.load().lessonsDone;
    return [{
      html: `<h3>${t('lessons')}</h3>` + LESSONS.map(l =>
        `${icon(l.icon)} <b>${esc(title(l))}</b> - ${t('words', { n: l.words.length })}${done.includes(l.id) ? ` ${icon('circle-check', 'ok')}` : ''}`).join('\n'),
      actions: [
        ...LESSONS.map(l => ({ icon: l.icon, label: title(l), send: `lesson ${l.id}` })),
        { icon: 'book-open-text', label: t('grammarTips'), send: 'grammar' },
      ],
    }];
  }

  // ---------- Grammar tips ----------
  const grammarText = g => g[lang()] || g.en;

  function grammarList() {
    return [{
      html: `<h3>${icon('book-open-text')} ${t('grammarTips')}</h3>${t('grammarIntro')}`,
      actions: GRAMMAR.map(g => ({ icon: g.icon, label: grammarText(g).title, send: `grammar ${g.id}` })),
    }];
  }

  function grammarTopic(id) {
    const g = GRAMMAR.find(x => x.id === id);
    if (!g) return grammarList();
    const { title: heading, body } = grammarText(g);
    const others = GRAMMAR.filter(x => x !== g);
    const next = others[(GRAMMAR.indexOf(g)) % others.length]; // the topic after this one
    return [{
      html: `<h3>${icon(g.icon)} ${esc(heading)}</h3>${rich(body)}`,
      actions: [
        { icon: next.icon, label: grammarText(next).title, send: `grammar ${next.id}` },
        { icon: 'list', label: t('grammarTips'), send: 'grammar' },
      ],
    }];
  }

  // ---------- Example sentences (Tatoeba) ----------
  const examplesAction = w => ({ icon: 'quote', label: t('examplesBtn'), send: `examples ${w}` });

  async function examples(word) {
    let list;
    try {
      list = await Lookup.examples(word, lang());
    } catch {
      return [{ html: say('offline') }];
    }
    if (!list.length) return [{ html: esc(t('noExamples', { x: word })) }];
    return [{
      html: `<h3>${icon('quote')} ${esc(t('examplesTitle', { x: word }))}</h3>` +
        list.map(s => `${ka(s.ka)}${tr(s.ka, s.tr)}\n= ${esc(s.meaning)}`).join('\n\n') +
        `\n<small class="tr">${esc(t('examplesCredit'))}</small>`,
      actions: [saveAction({ ka: word, tr: Lookup.transliterate(word), ...wordMeaning(word) })].filter(a => a.add[lang()]),
    }];
  }

  // Known meanings for a word (built-in list or the learner's saved cards), for the Save button.
  function wordMeaning(ka) {
    const w = ALL_WORDS.find(x => x.ka === ka) || SRS.all().find(x => x.ka === ka);
    return w ? { en: w.en, ru: w.ru } : {};
  }

  function findLesson(q) {
    q = norm(q);
    return LESSONS.find(l => l.id === q || norm(l.title).includes(q) || norm(l.titleRu).includes(q));
  }

  function lesson(id) {
    const l = findLesson(id);
    if (!l) return [{ html: esc(t('noLesson', { x: id })), actions: [mainActions()[0]] }];
    const words = ALL_WORDS.filter(w => w.lesson === l.id);
    let added = 0;
    words.forEach(w => { if (SRS.add(w)) added++; });
    const ru = lang() === 'ru';
    // Notes get their own full-width row so they don't squeeze the meaning column.
    const rows = words.map(w => {
      const note = ru ? w.noteRu : w.note;
      return `<tr${note ? ' class="has-note"' : ''}><td>${ka(w.ka)} ${speak(w.ka)}</td><td class="tr">${esc(pron(w.ka, w.tr))}</td><td>${esc(meaning(w))}</td></tr>` +
        (note ? `<tr class="note-row"><td colspan="3">${esc(note)}</td></tr>` : '');
    }).join('');
    const intro = ru ? l.introRu : l.intro;
    return [{
      html: `<h3>${icon(l.icon)} ${esc(title(l))}</h3>${intro ? esc(intro) : ''}<table class="word-table">${rows}</table>` +
        (added ? say('lessonDone') : ''),
      actions: [
        { icon: 'target', label: t('quizLesson', { x: title(l) }), send: `quiz ${l.id}` },
        { icon: 'list', label: t('otherLessons'), send: 'lessons' },
      ],
    }];
  }

  // ---------- Alphabet ----------
  const soundOf = L => letterSound(L[0], L[1]);

  function alphabet() {
    const cells = ALPHABET.map(L =>
      `<button class="letter" data-send="letter ${esc(L[0])}"><span class="ka">${esc(L[0])}</span><small>${esc(soundOf(L))}</small></button>`).join('');
    return [{
      html: `<h3>${t('alphabetTitle')}</h3>${t('alphabetIntro')}<div class="letters">${cells}</div>`,
      actions: [{ icon: 'target', label: t('alphabetQuiz'), send: 'quiz alphabet' }],
    }];
  }

  function letter(ch) {
    const L = ALPHABET.find(a => a[0] === ch.trim() || norm(a[1]) === norm(ch) || norm(CYR_LETTER[a[0]]) === norm(ch));
    if (!L) return [{ html: t('notLetter') }];
    const examples = ALL_WORDS.filter(w => w.ka.includes(L[0])).slice(0, 3)
      .map(w => `${ka(w.ka)}${tr(w.ka, w.tr)} - ${esc(meaning(w))}`).join('\n');
    return [{
      html: `<span class="ka big">${esc(L[0])}</span> ${speak(L[0])}\n${t('sound')}: <b>${esc(soundOf(L))}</b> - ${esc(lang() === 'ru' ? L[3] : L[2])}` +
        (examples ? `\n\n${t('examples')}:\n${examples}` : ''),
      actions: [{ icon: 'arrow-left', label: t('backToAlphabet'), send: 'alphabet' }],
    }];
  }

  // ---------- Quiz ----------
  // Question: { prompt (html), answers: [accepted strings], options: [labels], word }
  function makeQuestion(item, pool, kind) {
    if (kind === 'letter') {
      const opts = shuffle([item, ...sample(pool.filter(p => p !== item), 3)].map(soundOf));
      return {
        prompt: t('whichSound', { x: ka(item[0]) }), answers: [item[1], soundOf(item)], options: opts,
        reveal: `${item[0]} = ${soundOf(item)}`,
      };
    }
    const m = meaning(item);
    const p = pron(item.ka, item.tr);
    const others = sample(pool.filter(o => o.ka !== item.ka && meaning(o) && meaning(o) !== m), 3);
    if (Math.random() < 0.6) {
      return {
        prompt: t('whatMean', { x: ka(item.ka) + tr(item.ka, item.tr) }),
        // Accept the full meaning or any of its parts ("sorry / excuse me", "child (son/daughter)").
        answers: [m, ...m.split(/\s*[/(]\s*/).map(s => s.replace(/\)$/, ''))],
        options: shuffle([m, ...others.map(meaning)]), word: item.ka,
        reveal: `${item.ka} (${p}) = ${m}`,
      };
    }
    return {
      prompt: t('howSay', { x: esc(m) }),
      answers: [item.ka, item.tr, toCyrillic(item.ka)], options: shuffle([item.ka, ...others.map(o => o.ka)]), kaOptions: true,
      word: item.ka, reveal: `${m} = ${item.ka} (${p})`,
    };
  }

  // The smart quiz: words due for review first (including saved translations),
  // then the least-practised words you've studied, then new lesson words.
  function pickQuizWords(n) {
    const deck = SRS.all();
    const due = shuffle(SRS.due());
    const dueSet = new Set(due.map(c => c.ka));
    const practising = shuffle(deck.filter(c => !dueSet.has(c.ka))).sort((a, b) => a.box - b.box);
    const unseen = shuffle(ALL_WORDS.filter(w => !SRS.has(w.ka)));
    return [...due, ...practising, ...unseen].filter(w => meaning(w)).slice(0, n);
  }

  function startQuiz(arg) {
    let questions;
    let heading;
    if (!arg) {
      const pool = [...ALL_WORDS, ...SRS.all()];
      questions = pickQuizWords(10).map(w => makeQuestion(w, pool));
      heading = t('quiz');
    } else if (norm(arg) === 'alphabet') {
      questions = sample(ALPHABET, 10).map(L => makeQuestion(L, ALPHABET, 'letter'));
      heading = t('alphabetQuiz');
    } else {
      const l = findLesson(arg);
      if (!l) return [{ html: esc(t('noLesson', { x: arg })), actions: lessonsList()[0].actions }];
      const words = ALL_WORDS.filter(w => w.lesson === l.id);
      questions = sample(words, 8).map(w => makeQuestion(w, words.length >= 4 ? words : ALL_WORDS));
      heading = t('quizLesson', { x: title(l) });
    }
    const q = { questions, i: 0, score: 0, lesson: arg ? findLesson(arg)?.id : null };
    session.set(q);
    return [{ html: `<h3>${icon('target')} ${esc(heading)}</h3>${t('quizIntro')}` }, ask(q)];
  }

  function ask(q) {
    const cur = q.questions[q.i];
    return {
      html: `<b>${q.i + 1}/${q.questions.length}.</b> ${cur.prompt}`,
      actions: cur.options.map(o => ({ label: o, send: o, ka: cur.kaOptions })),
    };
  }

  // Edit distance, for forgiving typos in typed answers.
  function levenshtein(a, b) {
    const row = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) {
      let prev = row[0];
      row[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const tmp = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = tmp;
      }
    }
    return row[b.length];
  }

  // A typed answer that's one letter off (two for longer words) counts as a typo,
  // unless it's exactly one of the other options.
  function isTypo(text, cur) {
    const n = norm(text);
    if (n.length < 3 || cur.options.some(o => norm(o) === n)) return false;
    return cur.answers.some(a => {
      const m = norm(a);
      const d = levenshtein(n, m);
      return d > 0 && d <= (m.length <= 6 ? 1 : 2);
    });
  }

  function answer(q, text) {
    const cur = q.questions[q.i];
    const exact = cur.answers.some(a => norm(a) === norm(text));
    const typo = !exact && isTypo(text, cur);
    const ok = exact || typo;
    if (ok) q.score++;
    if (cur.word && SRS.has(cur.word)) SRS.grade(cur.word, ok);
    const out = [{
      html: exact ? `${icon('circle-check', 'ok')} ${say('correct')} <span class="tr">${esc(cur.reveal)}</span>`
          : typo ? `${icon('circle-check', 'ok')} ${say('typo')} <b>${esc(cur.reveal)}</b>`
          : `${icon('circle-x', 'bad')} ${say('wrong')} <b>${esc(cur.reveal)}</b>`,
    }];
    q.i++;
    if (q.i < q.questions.length) {
      session.set(q);
      out.push(ask(q));
    } else {
      session.clear();
      const pct = Math.round((q.score / q.questions.length) * 100);
      if (q.lesson && pct >= 80) {
        const s = Stats.load();
        if (!s.lessonsDone.includes(q.lesson)) { s.lessonsDone.push(q.lesson); Stats.save(s); }
      }
      out.push({
        html: `<h3>${pct >= 80 ? `${icon('party-popper')} ${say('endGood')}` : say('endBad')}</h3>` +
          t('score', { s: q.score, n: q.questions.length, p: pct }),
        actions: mainActions(),
      });
    }
    return out;
  }

  // ---------- Dictionary ----------
  // Built-in words first: match Georgian, Latin/Cyrillic pronunciation, or a word of the meaning.
  function lookup(text) {
    const n = norm(text);
    if (!n) return null;
    const hits = ALL_WORDS.filter(w =>
      norm(w.ka) === n || norm(w.tr) === n || norm(toCyrillic(w.ka)) === n ||
      [w.en, w.ru].some(m => norm(m) === n || norm(m).split(/[^\p{L}']+/u).includes(n)));
    if (!hits.length) return null;
    const ru = lang() === 'ru';
    return [{
      html: hits.slice(0, 5).map(w => {
        const note = ru ? w.noteRu : w.note;
        return `${ka(w.ka)} ${speak(w.ka)}${tr(w.ka, w.tr)} - ${esc(meaning(w))}${note ? ` <small class="tr">(${esc(note)})</small>` : ''}`;
      }).join('\n'),
      actions: [...hits.slice(0, 3).map(saveAction), examplesAction(hits[0].ka.replace(/[?!…,.]/g, '').trim())],
    }];
  }

  // Not in the built-in list: translate online (Google + Wiktionary).
  async function online(text) {
    if (text.length > 300) return [{ html: t('tooLong') }];
    const l = lang();
    let r;
    try {
      r = await Lookup.find(text, l);
    } catch {
      return [{ html: say('offline'), actions: mainActions() }];
    }
    let html = `${ka(r.ka)} ${speak(r.ka)}${tr(r.ka, r.tr)}\n= <b>${esc(r.meaning)}</b>`;
    if (r.wikt.length) {
      html += `\n\n<b>${t('dictionary')}</b>\n` + r.wikt.map(e => `<i>${esc(e.pos.toLowerCase())}</i>: ${e.defs.map(esc).join('; ')}`).join('\n');
    }
    const alts = r.fromKa
      ? r.alts.filter(a => bare(a.text) !== bare(r.meaning)).slice(0, 5)
      : r.alts.filter(a => a.ka !== r.ka).slice(0, 4);
    if (alts.length) {
      html += `\n\n<b>${t('otherMeanings')}</b>\n` + (r.fromKa
        ? alts.map(a => `<i>${esc(a.pos)}</i>: ${esc(a.text)}`).join('\n')
        : alts.map(a => `${ka(a.ka)} ${speak(a.ka)}${tr(a.ka, a.tr)} <i>(${esc(a.pos)})</i>`).join('\n'));
    }
    // Saved cards keep the meaning in the learner's language.
    const cards = [{ ka: r.ka, tr: r.tr, [l]: r.meaning }];
    if (!r.fromKa) alts.forEach(a => cards.push({ ka: a.ka, tr: a.tr, [l]: `${r.meaning} (${a.pos})` }));
    const actions = cards.filter(c => c.ka.length <= 40).slice(0, 3).map(saveAction);
    // Example sentences make sense for single words and short phrases.
    if (r.ka.split(/\s+/).length <= 2) actions.push(examplesAction(r.ka.replace(/[?!…,.]/g, '').trim()));
    return [{ html, actions }];
  }

  // ---------- Router ----------
  // Commands work in English and Russian (buttons always send the English form).
  const CMD = {
    stop: /^(stop|quit|exit|cancel|стоп|выход|хватит)$/,
    menu: /^(help|menu|lessons?|lesson .+|alphabet|review|quiz.*|mood.*|grammar.*|examples .+|помощь|уроки|алфавит|тест|викторина|грамматика|примеры .+)$/,
    grammar: /^(?:grammar|грамматика)(?:\s+(.+))?$/,
    examples: /^(?:examples|example|примеры|пример)\s+(.+)$/,
    help: /^(help|\?|menu|commands|помощь|справка|меню)$/,
    lessons: /^(lessons?|уроки)$/,
    alphabet: /^(alphabet|letters|abc|алфавит|буквы)$/,
    review: /^(review|flashcards|cards|повтор|повторение)$/,
    quiz: /^(?:quiz|test|тест|викторина)(?:\s+(.+))?$/,
  };

  function reply(text) {
    const txt = text.trim();
    const lower = txt.toLowerCase();
    const q = session.get();

    if (q) {
      if (CMD.stop.test(lower)) {
        session.clear();
        return [{ html: `${say('stop')} ${t('scoreSoFar', { s: q.score, n: q.i })}`, actions: mainActions() }];
      }
      // Menu commands abandon the quiz rather than being graded as answers.
      if (!CMD.menu.test(lower)) return answer(q, txt);
      session.clear();
    }

    let m;
    if (CMD.help.test(lower)) return help();
    if ((m = lower.match(/^mood(?:\s+(.+))?$/))) return setMood((m[1] || '').trim());
    if ((m = lower.match(CMD.grammar))) return m[1] ? grammarTopic(m[1].trim()) : grammarList();
    if ((m = txt.match(CMD.examples))) return examples(m[1].trim());
    if (/grammar|грамматик/.test(lower) && lower.length <= 60) return grammarList();
    if (CMD.lessons.test(lower)) return lessonsList();
    if ((m = lower.match(/^lesson\s+(.+)$/))) return lesson(m[1]);
    if (CMD.alphabet.test(lower)) return alphabet();
    if ((m = txt.match(/^letter\s+(.+)$/i))) return letter(m[1]);
    if (CMD.review.test(lower)) return startQuiz(null);
    if ((m = lower.match(CMD.quiz))) return startQuiz(m[1]);
    if ((m = lower.match(/^(?:translate|what is|what's|how do you say|define|переведи|как будет|что значит)\s+(.+?)\??$/))) {
      return lookup(m[1]) || online(m[1]);
    }
    if (ALPHABET.some(a => a[0] === txt)) return letter(txt);
    return smallTalk(lower) || lookup(txt) || online(txt);
  }

  return { reply, welcome, mainActions };
})();
