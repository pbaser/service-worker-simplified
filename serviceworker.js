const CACHE_NAME = "my-app-cache-v4";
const urlsToCache = [
  "/",
  "./dowork1.js",
  "./main.css",
  "./test.html",
  "./test.css"
];

self.addEventListener("install", event => {
  console.info("Service worker installed!");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        // Cache successfully opened
        console.info("Cache opened");
        cache.addAll(urlsToCache).then(res => {
          // Files successfully added to cache;
          console.info("Files successfully added to cache");
        });
      })
      .then(() => self.skipWaiting())
      .catch(error => console.error(error))
  );
});

self.addEventListener("activate", event => {
  console.info("Service worker activated!");
  event.waitUntil(
    caches.keys().then(res => {
      return Promise.all(
        res.map(cache => {
          if (CACHE_NAME.indexOf(cache) === -1) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

/** Network proxy */
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(res => {
        const resClone = res.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, resClone);
        });
        return res;
      })
      .catch(error => {
        caches
          .match(event.request)
          .then(res => {
            // Cache matched with request, return response
            console.info("Request matched for - " + event.request.url);
            if (res) {
              return res;
            }
          })
          .catch(error => console.error(error));
      })
  );
});

self.addEventListener("push", event => {
  console.info("Received a Push notification!");
  if (event.data) {
    console.log(event.data.text());
  } else {
    console.log("This push notificatio has no data");
  }
});
