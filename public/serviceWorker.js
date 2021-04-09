let PRECACHE_URLS = [
  "/sounds/notification.mp3",
  "/js/app.js",
  "/serviceWorker.js",
  "/images/bg-image.jpg",
];

self.addEventListener("push", (e) => {
  const data = e.data.json();
  self.registration.showNotification(data.title);
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open("precache-v1")
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  const currentCaches = ["precache-v1"];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName)
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
      .catch(function (err) {
        // fallback mechanism
        return caches.open(CACHE_CONTAINING_ERROR_MESSAGES);
        // .then(function (cache) {
        //   return cache.match("/offline.html");
        // });
      })
  );
});

// self.addEventListener("fetch", (event) => {
//   if (event.request.url.startsWith(self.location.origin)) {
//     event.respondWith(
//       caches.match(event.request).then((cachedResponse) => {
//         if (cachedResponse) {
//           return cachedResponse;
//         }
//         // return caches.open("runtime").then((cache) => {
//         // if (event.request.method == "GET") {
//         //   return fetch(event.request).then((response) => {
//         //     return cache.put(event.request, response.clone()).then(() => {
//         //       return response;
//         //     });
//         //   });
//         // } else {
//         return fetch(event.request);
//         // }
//         // });
//       })
//     );
//   }
// });

self.addEventListener("fetch", (event) => {
  // Prevent the default, and handle the request ourselves.
  event.respondWith(
    (async function () {
      // Try to get the response from a cache.
      const cachedResponse = await caches.match(event.request);
      // Return it if we found one.
      if (cachedResponse) return cachedResponse;
      // If we didn't find a match in the cache, use the network.
      return fetch(event.request);
    })()
  );
});
