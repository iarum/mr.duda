// Online dictionary: unofficial Google Translate endpoint for translations,
// Wiktionary for human-written definitions of Georgian words (English only).
// Results are cached in localStorage so a word is only ever fetched once.
//
// Direction: Georgian input → the learner's language. Anything else
// (English, Russian, …) is auto-detected and translated into Georgian.
const Lookup = (() => {
  const GEO = /[Ⴀ-ჿᲐ-Ჿ]/;
  const TR_MAP = Object.fromEntries(ALPHABET.map(([k, t]) => [k, t]));
  const CACHE_MAX = 500;

  // Georgian → Latin is a fixed letter-by-letter mapping, no API needed.
  const transliterate = s => [...s].map(c => TR_MAP[c] ?? c).join('');
  const isGeorgian = s => GEO.test(s);

  const cache = {
    get: key => Store.get('dict', {})[key],
    set(key, val) {
      const d = Store.get('dict', {});
      d[key] = val;
      const keys = Object.keys(d);
      if (keys.length > CACHE_MAX) keys.slice(0, keys.length - CACHE_MAX).forEach(k => delete d[k]);
      Store.set('dict', d);
    },
  };

  async function getJson(url) {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  // Returns { translation, detected, dict: [{ pos, terms: [] }] }. `hl` sets the
  // language of part-of-speech labels (noun / существительное).
  async function google(text, sl, tl, hl) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&hl=${hl}&dt=t&dt=bd&q=${encodeURIComponent(text)}`;
    const data = await getJson(url);
    const translation = (data[0] || []).map(seg => seg?.[0] || '').join('').trim();
    const dict = (data[1] || []).map(e => ({ pos: e[0], terms: (e[1] || []).slice(0, 5) }));
    if (!translation) throw new Error('Empty translation');
    return { translation, detected: data[2], dict };
  }

  // Returns [{ pos, defs: [] }] for a single Georgian word, or [] if none.
  async function wiktionary(word) {
    try {
      const data = await getJson(`https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word)}`);
      const strip = h => new DOMParser().parseFromString(h, 'text/html').body.textContent.trim();
      return (data.ka || []).map(e => ({
        pos: e.partOfSpeech,
        defs: [...new Set(e.definitions.map(d => strip(d.definition)).filter(Boolean))].slice(0, 3),
      })).filter(e => e.defs.length);
    } catch { return []; }
  }

  // Result: { query, fromKa, ka, tr, meaning, alts: [{ka, tr, pos}] | [{text, pos}], wikt: [...] }
  async function find(query, lang) {
    const q = query.trim();
    const fromKa = isGeorgian(q);
    const key = `${lang}:${fromKa ? 'ka' : 'x'}:${q.toLowerCase()}`;
    const hit = cache.get(key);
    if (hit) return hit;

    const g = fromKa ? await google(q, 'ka', lang, lang) : await google(q, 'auto', 'ka', lang);
    const ka = fromKa ? q : g.translation;
    const result = {
      query: q, fromKa, ka, tr: transliterate(ka), meaning: fromKa ? g.translation : q,
      alts: fromKa
        ? g.dict.flatMap(d => d.terms.map(text => ({ text, pos: d.pos })))
        : g.dict.flatMap(d => d.terms.map(k => ({ ka: k, tr: transliterate(k), pos: d.pos }))),
      wikt: [],
    };
    // Wiktionary definitions are English, and only exist for single words / short phrases.
    if (lang === 'en' && ka.split(/\s+/).length <= 2) result.wikt = await wiktionary(ka);
    cache.set(key, result);
    return result;
  }

  // Example sentences from Tatoeba (tatoeba.org, CC BY 2.0 FR): short Georgian
  // sentences containing the word, with a translation in the learner's language.
  // Returns up to 3 [{ ka, tr, meaning }], shortest first (easiest for beginners).
  async function examples(word, lang) {
    const key = `ex:${lang}:${word}`;
    const hit = cache.get(key);
    if (hit) return hit;
    const tl = lang === 'ru' ? 'rus' : 'eng';
    const data = await getJson(`https://api.tatoeba.org/unstable/sentences?lang=kat&q=${encodeURIComponent(word)}&trans:lang=${tl}&sort=relevance&limit=20`);
    const out = (data.data || [])
      .map(s => ({ ka: s.text, tr: transliterate(s.text), meaning: (s.translations || []).flat().find(x => x.lang === tl)?.text }))
      // Skip one-word exclamations (often game or idiom entries) and long sentences.
      .filter(x => x.meaning && x.ka.trim().split(/\s+/).length >= 2 && x.ka.length <= 80)
      .sort((a, b) => a.ka.length - b.ka.length)
      .slice(0, 3);
    cache.set(key, out);
    return out;
  }

  return { find, examples, transliterate, isGeorgian };
})();
