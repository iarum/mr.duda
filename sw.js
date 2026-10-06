// Offline support. The app's own files are cached on install and served
// cache-first, refreshed in the background (stale-while-revalidate), so the app
// opens instantly offline and picks up updates on the next launch.
// Translation requests (other origins) always go to the network.
const CACHE = 'mr-duda-v5';
const APP_FILES = [
  './',
  'index.html',
  'styles.css',
  'manifest.webmanifest',
  'js/icons.js',
  'js/data.js',
  'js/storage.js',
  'js/i18n.js',
  'js/srs.js',
  'js/lookup.js',
  'js/moods.js',
  'js/grammar.js',
  'js/offline.js',
  'js/app.js',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;

  event.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(request, { ignoreSearch: true });
    const fresh = fetch(request)
      .then(res => { if (res.ok) cache.put(request, res.clone()); return res; })
      .catch(() => cached);
    event.waitUntil(fresh.catch(() => {}));
    return cached || fresh;
  }));
});
