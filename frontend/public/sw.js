self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Pass-through fetch handler for PWA installation requirements
  e.respondWith(fetch(e.request));
});
