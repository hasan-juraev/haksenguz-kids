/*
 * Men o'qidim, "I read it" (ROADMAP Phase 4, item 22). A child records
 * themselves reading a page aloud, keeps it, and sends it to their
 * grandparents. Reading the same page again later, they hear their first
 * reading next to the newest one, and how much they have grown. Recordings
 * stay on this device (IndexedDB, apart from the family voices of
 * js/voices.js) until the child sends one. The microphone is
 * Narrator.Recorder (js/narrator.js); the screen is app.openMyReading
 * (js/app.js).
 *
 * A reading: { id, profile, book, page, blob, mime, duration, created }.
 */
(function (root) {
    'use strict';

    const DB_NAME = 'ertaklar-olami-oqidim';
    const DAY = 864e5;
    let opening = null;

    function db() {
        if (!opening) {
            opening = new Promise((resolve, reject) => {
                const req = root.indexedDB.open(DB_NAME, 1);
                req.onupgradeneeded = () => {
                    const s = req.result.createObjectStore('readings', { keyPath: 'id' });
                    s.createIndex('page', ['profile', 'book', 'page']);
                    s.createIndex('profile', 'profile');
                };
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            });
        }
        return opening;
    }

    async function run(mode, fn) {
        const d = await db();
        return new Promise((resolve, reject) => {
            const tx = d.transaction('readings', mode);
            const req = fn(tx.objectStore('readings'));
            tx.oncomplete = () => resolve(req && req.result);
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error);
        });
    }

    const byTime = (a, b) => a.created - b.created;

    // How long ago, in words a child knows: bugun, kecha, 3 kun oldin,
    // 2 hafta oldin, 3 oy oldin, 1 yil oldin. Counted in calendar days.
    function ago(then, now = Date.now()) {
        const day = (t) => {
            const d = new Date(t);
            return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
        };
        const days = Math.round((day(now) - day(then)) / DAY);
        if (days <= 0) return 'bugun';
        if (days === 1) return 'kecha';
        if (days < 14) return `${days} kun oldin`;
        if (days < 60) return `${Math.floor(days / 7)} hafta oldin`;
        if (days < 365) return `${Math.floor(days / 30)} oy oldin`;
        return `${Math.floor(days / 365)} yil oldin`;
    }

    // A recording's file extension by its type.
    const ext = (mime) => (/mp4|aac|m4a/i.test(mime) ? 'm4a' : /ogg/i.test(mime) ? 'ogg' : /wav/i.test(mime) ? 'wav' : 'webm');

    // The file a reading is sent as: "Asal - Zumrad va Qimmat, 3-sahifa.webm".
    // Apostrophes become ʼ (a letter, safe in a file name: Oʼgay).
    function fileName(child, title, page, mime) {
        const tidy = (s) => String(s || '').replace(/['‘’`]/g, 'ʼ').replace(/[^\p{L}\p{N}ʼ ,.-]+/gu, ' ').replace(/\s+/g, ' ').trim();
        const who = tidy(child) || 'Bolajon';
        return `${who} - ${tidy(title) || 'Ertak'}, ${page}-sahifa.${ext(mime)}`;
    }

    const MyReading = {
        ago,
        ext,
        fileName,

        // Keeps a reading; returns it with its id and time.
        async save(r) {
            const rec = Object.assign({ id: `r${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`, created: Date.now() }, r);
            await run('readwrite', (s) => s.put(rec));
            if (root.navigator.storage && root.navigator.storage.persist) root.navigator.storage.persist().catch(() => {});
            return rec;
        },

        // This child's readings of one page, the first first.
        async list(profile, book, page) {
            const all = await run('readonly', (s) => s.index('page').getAll([profile, book, +page])).catch(() => []);
            return (all || []).sort(byTime);
        },

        // All this child's readings, the first first.
        async all(profile) {
            const all = await run('readonly', (s) => s.index('profile').getAll(profile)).catch(() => []);
            return (all || []).sort(byTime);
        },

        remove(id) {
            return run('readwrite', (s) => s.delete(id));
        },
    };

    root.MyReading = MyReading;
})(window);
