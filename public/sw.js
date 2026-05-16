// ─────────────────────────────────────────────────────────────
//  public/sw.js — Service Worker for DDD Community PWA
//  Caches core assets for offline use
// ─────────────────────────────────────────────────────────────

const CACHE_NAME = "ddd-community-v1";

const STATIC_ASSETS = [
  "/ddd-community/",
  "/ddd-community/index.html",
  "/ddd-community/manifest.json",
  "/ddd-community/icons/icon-192.png",
  "/ddd-community/icons/icon-512.png",
];

// ── Install — cache static assets ────────────────────────────
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[SW] Caching static assets");
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ── Activate — clean old caches ──────────────────────────────
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log("[SW] Deleting old cache:", key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

// ── Fetch — network first, fallback to cache ─────────────────
self.addEventListener("fetch", event => {
  // Skip non-GET and Firebase/external requests
  if (event.request.method !== "GET") return;
  if (event.request.url.includes("firestore.googleapis.com")) return;
  if (event.request.url.includes("firebase")) return;
  if (event.request.url.includes("emailjs")) return;
  if (event.request.url.includes("fonts.googleapis.com")) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // Return index.html for navigation requests (SPA fallback)
          if (event.request.mode === "navigate") {
            return caches.match("/ddd-community/index.html");
          }
        });
      })
  );
});
