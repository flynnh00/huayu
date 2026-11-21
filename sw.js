// Service worker (written to dist/sw.js by vite.config.ts). Caches the whole site on install so the
// app works offline; serves from the cache first. A new build has a new cache name: it installs in
// the background and takes over the next time the app is opened.
const CACHE = "huayu-708b974178cd";
const FILES = ["./","android/notes.json","assets/index-SfICaFRp.css","assets/index-VSZe_8hP.js","data/beginner.json","data/compounds.json","data/grammar.json","data/history.json","data/reading.json","data/sentences.json","data/specialized.json","data/taigi_guide.json","data/topics.json","data/words.json","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","manifest.webmanifest"];

self.addEventListener("install", (e) => {
  // cache: "reload" skips the browser's HTTP cache: GitHub Pages lets files be cached for 10 minutes, so
  // without it a new version could be stored with the previous version's data files (same names).
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).catch(() => caches.match("./"))),
  );
});
