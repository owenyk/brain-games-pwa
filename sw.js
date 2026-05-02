const CACHE_NAME = 'brain-games-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/klotski-v3.html',
  '/sudoku.html',  // 注意：如果文件名是中文，这里可能会出问题，建议用英文
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});