// Leitner-style spaced repetition. Each card lives in a box 0–5;
// a correct answer moves it up (longer interval), a miss sends it back to box 0.
const SRS = (() => {
  const INTERVAL_DAYS = [0, 1, 2, 4, 8, 16];
  const DAY = 864e5;

  const deck = () => Store.get('deck', {});
  const save = d => Store.set('deck', d);

  // card: { ka, tr, en?, ru?, box, due } - meanings in whichever languages are known
  function add(word) {
    const d = deck();
    if (d[word.ka]) return false;
    d[word.ka] = { ka: word.ka, tr: word.tr, en: word.en, ru: word.ru, box: 0, due: Date.now() };
    save(d);
    return true;
  }
  const has = ka => Boolean(deck()[ka]);
  function remove(ka) {
    const d = deck();
    delete d[ka];
    save(d);
  }

  function grade(ka, correct) {
    const d = deck();
    const c = d[ka];
    if (!c) return;
    c.box = correct ? Math.min(c.box + 1, INTERVAL_DAYS.length - 1) : 0;
    c.due = Date.now() + INTERVAL_DAYS[c.box] * DAY;
    save(d);
  }

  const due = () => Object.values(deck()).filter(c => c.due <= Date.now());
  const all = () => Object.values(deck());
  const mastered = () => all().filter(c => c.box >= 4).length;

  return { add, has, remove, grade, due, all, mastered };
})();
