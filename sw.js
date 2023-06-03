// Чтобы обновить кеш, измени значение CacheKey
const CacheKey = "03/06/2023";

const initCache = () => {
    return caches.open(CacheKey)
        .then(cache => {
            return cache.addAll(([
                "./index.html",
                "./js/main.js",
                "./js/dict.js",
                "./css/style.css",
                "./css/media.css",
                "./sound/HP_GRIFFINDOR.mp3",
            ]));
        }, (error) => {
            console.log(error);
        })
};

const tryNetwork = (req, timeout) => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout((reject, timeout));
        fetch(req)
            .then((res) => {
                clearTimeout(timeoutId);
                const responseClone = res.clone();
                caches.open(CacheKey)
                    .then((cache) => {
                        cache.put(req, responseClone)
                    })
                resolve(res)
            }, reject)

    })
};

const getFromCache = (req) => {
    return caches.open(CacheKey)
        .then((cache) => {
            return cache.match(req)
                .then((result) => {
                    return result || Promise.reject("no-match");
                });
        });
};

self.addEventListener("install", (e) => {
    e.waitUntil(initCache());
})

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys()
            .then(keyList => {
                return Promise.all(keyList.map(key => {
                    if (key !== CacheKey) {
                        return caches.delete(key);
                    }
                }))
            })
    );
});

// Сработает, когда браузер пытается загрузить удаленный ресурс
self.addEventListener("fetch", (e) => {
    // Try network and if it fails, go to cached copy
    e.respondWith(
        tryNetwork(e.request, 400).catch(() => getFromCache(e.request))
    );
})