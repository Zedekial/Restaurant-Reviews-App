let cacheName = 'v3';
let cacheFiles = [
  './',
  './index.html',
  './restaurant.html',
  './css/styles.css',
  './js/dbhelper.js',
  './js/restaurant_info.js',
  './js/main.js',
  './img/1_1x.jpg',
  './img/2_1x.jpg',
  './img/3_1x.jpg',
  './img/4_1x.jpg',
  './img/5_1x.jpg',
  './img/6_1x.jpg',
  './img/7_1x.jpg',
  './img/8_1x.jpg',
  './img/9_1x.jpg',
  './img/10_1x.jpg',
  './img/1_2x.jpg',
  './img/2_2x.jpg',
  './img/3_2x.jpg',
  './img/4_2x.jpg',
  './img/5_2x.jpg',
  './img/6_2x.jpg',
  './img/7_2x.jpg',
  './img/8_2x.jpg',
  './img/9_2x.jpg',
  './img/10_2x.jpg',
  './data/restaurants.json'
]

self.addEventListener('install', function(e) {
  console.log("[ServiceWorker] Installed")

  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log("[ServiceWorker] Caching cacheFiles");
      return cache.addAll(cacheFiles);
    })
  )
})

self.addEventListener('activate', function(e) {
  console.log("[ServiceWorker] Activated")

  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(thisCacheName) {
        if(thisCacheName !== cacheName) {
          console.log("[ServiceWorker] Removing cached files from ", thisCacheName);
          return caches.delete(thisCacheName);
        }
      }))
    })
  )
})

self.addEventListener('fetch', function(e) {
  console.log("[ServiceWorker] Fetching", e.request.url);

  if(navigator.onLine) {
      return(e.request);
  }

  e.respondWith(
    caches.match(e.request).then(function(response) {
      if(response) {
        console.log('[ServiceWorker] Found in cache', e.request.url);
        return response;
      }

      let requestClone = e.request.clone();

      fetch(requestClone).then(function(response) {
        if(!response) {
          console.log('[ServiceWorker] No response from fetch');
        }

        let responseClone = response.clone();

        caches.open(cacheName).then(function(cache) {
          cache.put(e.request, responseClone);
          return response;
        });
      })
      .catch(function(err) {
        console.log('[ServiceWorker] Error fetching and caching data', err);
      })

    })
  )
})
