// Service Worker لتطبيق Simply AI Pro 2026
const CACHE_NAME = 'simply-ai-pro-v2.0';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap'
];

// التثبيت
self.addEventListener('install', event => {
  console.log('[Service Worker] تثبيت');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] جاري تخزين الملفات في الكاش');
        return cache.addAll(urlsToCache);
      })
  );
});

// التنشيط
self.addEventListener('activate', event => {
  console.log('[Service Worker] تنشيط');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] حذف الكاش القديم:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// التقاط الطلبات
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
