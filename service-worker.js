const CACHE_NAME = 'robo-spelling-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './game_mode.html',
  './game01_spelling.html',
  './game02_fishing.html',
  './game03_ghost_maze.html',
  './game04_racing.html',
  './game05_whack_a_mole.html',
  './game06_fill_blank.html',
  './gift.html',
  './story.html',
  './assets/common.js',
  './assets/game-lifecycle.js',
  './assets/mode.js',
  './assets/words.js',
  './assets/story.js',
  './assets/styles.css',
  './assets/game.css',
  './assets/game01_spelling.css',
  './assets/game04_racing.css',
  './site.webmanifest',
  './apple-touch-icon.png',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './android-chrome-192x192.png',
  './android-chrome-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
