// Thin localStorage wrapper. All keys are namespaced and JSON-encoded;
// every access is guarded because storage can be disabled or full.
const Store = (() => {
  const NS = 'tako:';
  const get = (key, fallback) => {
    try {
      const raw = localStorage.getItem(NS + key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch { return fallback; }
  };
  const set = (key, value) => {
    try { localStorage.setItem(NS + key, JSON.stringify(value)); return true; }
    catch (e) { console.warn('Storage write failed', e); return false; }
  };
  const remove = key => { try { localStorage.removeItem(NS + key); } catch {} };
  const keys = () => {
    try { return Object.keys(localStorage).filter(k => k.startsWith(NS)).map(k => k.slice(NS.length)); }
    catch { return []; }
  };
  const exportAll = () => Object.fromEntries(keys().filter(k => k !== 'settings').map(k => [k, get(k)]));
  const importAll = data => Object.entries(data).forEach(([k, v]) => k !== 'settings' && set(k, v));
  const clearAll = () => keys().forEach(remove);
  return { get, set, remove, exportAll, importAll, clearAll };
})();

const DEFAULT_SETTINGS = {
  showTranslit: true, name: '', accent: '#eab308', mood: 'friendly', setupDone: false,
  // Interface language: Russian if the browser is set to Russian, otherwise English.
  lang: typeof navigator !== 'undefined' && /^ru\b/i.test(navigator.language || '') ? 'ru' : 'en',
};
const Settings = {
  load: () => ({ ...DEFAULT_SETTINGS, ...Store.get('settings', {}) }),
  save: s => Store.set('settings', s),
};

// Which lessons have been passed (shown with a check in the lesson list).
const Stats = {
  load: () => ({ lessonsDone: [], ...Store.get('stats', {}) }),
  save: s => Store.set('stats', s),
};
