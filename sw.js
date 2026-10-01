/*
 * Offline support: files the app loads from its own site are kept here and
 * used when there's no internet (on the subway, on the plane to Tashkent).
 *
 * Online, the network comes first, so a new book or a fix shows up on the
 * next visit; if the network is slow (WAIT_MS) a kept copy is used instead.
 * Audio is left to the browser: playback asks for parts of a file, and a
 * kept whole file breaks that on iPhones. A book's built-in recordings are
 * saved for offline use in IndexedDB instead (js/voices.js, saveBook).
 */
'use strict';

const CACHE = 'ertaklar-olami-v1';
const WAIT_MS = 4000;
const AUDIO = /\/audio\/.+\.(m4a|mp4|webm|ogg|opus|mp3|wav|aac)$/;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys()
        .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
        .then(() => self.clients.claim()));
});

// The page lists the files it loaded before this worker was in charge.
self.addEventListener('message', (e) => {
    const data = e.data || {};
    if (data.type !== 'keep' || !Array.isArray(data.urls)) return;
    e.waitUntil(caches.open(CACHE).then((cache) => Promise.all(data.urls
        .filter((u) => new URL(u, self.location.href).origin === self.location.origin)
        .map((u) => cache.add(u).catch(() => {})))));
});

function keep(req, res) {
    if (res.status !== 200) return;
    const copy = res.clone();
    caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
}

function kept(req) {
    return caches.match(req, { ignoreSearch: req.mode === 'navigate' })
        .then((hit) => hit || (req.mode === 'navigate' ? caches.match('./') : undefined));
}

self.addEventListener('fetch', (e) => {
    const req = e.request;
    const url = new URL(req.url);
    if (req.method !== 'GET' || req.headers.has('range') || url.origin !== self.location.origin || AUDIO.test(url.pathname)) return;
    e.respondWith((async () => {
        const net = fetch(req).then((res) => {
            keep(req, res);
            return res;
        });
        net.catch(() => {});
        try {
            const first = await Promise.race([net, new Promise((resolve) => setTimeout(resolve, WAIT_MS, 'slow'))]);
            if (first !== 'slow') return first;
            return (await kept(req)) || net; // slow, but nothing kept yet: keep waiting
        } catch (err) {
            const hit = await kept(req);
            if (hit) return hit;
            throw err;
        }
    })());
});
