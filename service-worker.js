let cacheName = 'v3';
let cacheFiles = [
  './',
  './index.html',
  './restaurant.html',
  './css/styles.css',
  './js/dbhelper.js',
  './js/restaurant_info.js',
  './js/main.js',
  './img/1.jpg',
  './img/2.jpg',
  './img/3.jpg',
  './img/4.jpg',
  './img/5.jpg',
  './img/6.jpg',
  './img/7.jpg',
  './img/8.jpg',
  './img/9.jpg',
  './img/10.jpg',
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
