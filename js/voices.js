/*
 * Voices: who can read a book aloud, and their recordings.
 *
 * Two kinds of voice:
 *  - built-in narration shipped with the app: audio/narration.js lists the
 *    recordings kept under audio/ (added with tools/import-narration.js);
 *  - family voices recorded in the app (buvi, dada...), kept on this device
 *    in IndexedDB and passed between phones as one ".json" voice pack. JSON,
 *    not zip, because the phone share sheet (and so Telegram) accepts it.
 *
 * A clip is one story page read aloud:
 *   { voice, book, page, blob | src, mime, duration, marks, sig }
 * marks[i] is the second at which piece i (the title, then each sentence)
 * starts; sig fingerprints the text it was read from (see Narrator.sig).
 */
(function (root) {
    'use strict';

    const DB_NAME = 'ertaklar-olami-ovoz';
    const PACK_FORMAT = 'ertaklar-ovoz';
    let opening = null;

    function db() {
        if (!opening) {
            opening = new Promise((resolve, reject) => {
                const req = root.indexedDB.open(DB_NAME, 1);
                req.onupgradeneeded = () => {
                    const d = req.result;
                    d.createObjectStore('voices', { keyPath: 'id' });
                    const clips = d.createObjectStore('clips', { keyPath: ['voice', 'book', 'page'] });
                    clips.createIndex('book', 'book');
                    clips.createIndex('voice', 'voice');
                };
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            });
        }
        return opening;
    }

    // Runs fn(objectStore) in one transaction; resolves with the last request's result.
    function run(store, mode, fn) {
        return db().then((d) => new Promise((resolve, reject) => {
            const t = d.transaction(store, mode);
            let result;
            const req = fn(t.objectStore(store));
            if (req) req.onsuccess = () => { result = req.result; };
            t.oncomplete = () => resolve(result);
            t.onerror = t.onabort = () => reject(t.error);
        }));
    }

    // ---------- built-in narration ----------

    function builtinVoices() {
        const data = root.narrationData;
        return data && Array.isArray(data.voices) ? data.voices : [];
    }

    function builtinClip(v, book, page) {
        const c = v.books && v.books[book] && v.books[book][page];
        return c ? Object.assign({ voice: v.id, book, page: +page }, c) : null;
    }

    // ---------- helpers ----------

    const newId = () => 'v' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(String(r.result).split(',')[1] || '');
            r.onerror = () => reject(r.error);
            r.readAsDataURL(blob);
        });
    }

    function base64ToBlob(b64, mime) {
        const bin = root.atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new Blob([bytes], { type: mime });
    }

    const Voices = {
        // Whether this browser can play a recording of the given type.
        canPlay(mime) {
            const [type, ...params] = String(mime || '').split(';');
            const codecs = params.map((p) => p.trim()).find((p) => p.startsWith('codecs='));
            const probe = codecs ? `${type}; codecs="${codecs.slice(7).replace(/"/g, '')}"` : type;
            return !!document.createElement('audio').canPlayType(probe);
        },

        // All voices: family ones (oldest first), then built-in narration.
        async list() {
            const family = await run('voices', 'readonly', (s) => s.getAll()).catch(() => []) || [];
            family.sort((a, b) => a.created - b.created);
            return family.concat(builtinVoices().map((v) => ({ id: v.id, name: v.name, avatar: v.avatar, builtin: true })));
        },

        // Voices that have read at least one page of this book, with the pages they read.
        async forBook(book) {
            const keys = await run('clips', 'readonly', (s) => s.index('book').getAllKeys(book)).catch(() => []) || [];
            const pages = {};
            keys.forEach(([voice, , page]) => (pages[voice] = pages[voice] || []).push(page));
            const out = [];
            (await this.list()).forEach((v) => {
                const own = v.builtin
                    ? Object.keys((builtinVoices().find((b) => b.id === v.id).books || {})[book] || {}).map(Number)
                    : pages[v.id] || [];
                if (own.length) out.push(Object.assign({}, v, { pages: own.sort((a, b) => a - b) }));
            });
            return out;
        },

        async clip(voiceId, book, page) {
            const b = builtinVoices().find((v) => v.id === voiceId);
            if (b) return builtinClip(b, book, page);
            return (await run('clips', 'readonly', (s) => s.get([voiceId, book, +page])).catch(() => null)) || null;
        },

        async createVoice(name, avatar) {
            const v = { id: newId(), name: String(name).trim() || 'Ovoz', avatar: avatar || '🎙️', created: Date.now() };
            await run('voices', 'readwrite', (s) => s.put(v));
            // Ask the browser not to clear these recordings when space runs low.
            if (root.navigator.storage && root.navigator.storage.persist) root.navigator.storage.persist().catch(() => {});
            return v;
        },

        async updateVoice(id, fields) {
            const v = await run('voices', 'readonly', (s) => s.get(id));
            if (!v) return null;
            Object.assign(v, fields);
            await run('voices', 'readwrite', (s) => s.put(v));
            return v;
        },

        async deleteVoice(id) {
            const keys = await run('clips', 'readonly', (s) => s.index('voice').getAllKeys(id)) || [];
            await run('clips', 'readwrite', (s) => { keys.forEach((k) => s.delete(k)); });
            await run('voices', 'readwrite', (s) => s.delete(id));
        },

        saveClip(clip) {
            return run('clips', 'readwrite', (s) => s.put(clip));
        },

        deleteClip(voiceId, book, page) {
            return run('clips', 'readwrite', (s) => s.delete([voiceId, book, +page]));
        },

        // Pages of a book this family voice has recorded.
        async pages(voiceId, book) {
            const keys = await run('clips', 'readonly', (s) => s.index('voice').getAllKeys(voiceId)) || [];
            return keys.filter((k) => k[1] === book).map((k) => k[2]).sort((a, b) => a - b);
        },

        // ---------- voice packs ----------

        // One file holding a family voice's recordings (of one book, or all).
        async exportPack(voiceId, book) {
            const voice = await run('voices', 'readonly', (s) => s.get(voiceId));
            if (!voice) throw new Error('no such voice');
            const all = await run('clips', 'readonly', (s) => s.index('voice').getAll(voiceId)) || [];
            const clips = all.filter((c) => !book || c.book === book).sort((a, b) => (a.book < b.book ? -1 : a.book > b.book ? 1 : a.page - b.page));
            const out = [];
            for (const c of clips) {
                out.push({ book: c.book, page: c.page, mime: c.mime, duration: c.duration, marks: c.marks, sig: c.sig, audio: await blobToBase64(c.blob) });
            }
            const pack = { format: PACK_FORMAT, version: 1, voice: { id: voice.id, name: voice.name, avatar: voice.avatar }, created: new Date().toISOString(), clips: out };
            const slug = String(voice.name).replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'ovoz';
            return new File([JSON.stringify(pack)], `ovoz-${slug}-${book || 'hammasi'}.json`, { type: 'application/json' });
        },

        // Adds (or updates) the voice in a pack file; returns { voice, count, unplayable }.
        async importPack(file) {
            let pack;
            try {
                pack = JSON.parse(await file.text());
            } catch (e) {
                throw new Error('not-a-pack');
            }
            if (!pack || pack.format !== PACK_FORMAT || pack.version !== 1 || !pack.voice || !Array.isArray(pack.clips)) throw new Error('not-a-pack');
            const id = /^v[a-z0-9]{6,24}$/.test(pack.voice.id) ? pack.voice.id : newId();
            const existing = await run('voices', 'readonly', (s) => s.get(id));
            const voice = Object.assign(existing || { id, created: Date.now() }, {
                name: String(pack.voice.name || 'Ovoz').slice(0, 30),
                avatar: String(pack.voice.avatar || '🎙️').slice(0, 8),
            });
            const clips = pack.clips.filter((c) => c && typeof c.book === 'string' && Number.isInteger(c.page) && c.page > 0 &&
                /^audio\//.test(c.mime) && typeof c.audio === 'string' && Array.isArray(c.marks));
            await run('voices', 'readwrite', (s) => s.put(voice));
            for (const c of clips) {
                await this.saveClip({ voice: id, book: c.book, page: c.page, mime: c.mime, duration: +c.duration || 0,
                    marks: c.marks.map(Number), sig: String(c.sig || ''), blob: base64ToBlob(c.audio, c.mime), created: Date.now() });
            }
            if (root.navigator.storage && root.navigator.storage.persist) root.navigator.storage.persist().catch(() => {});
            const unplayable = clips.length > 0 && !this.canPlay(clips[0].mime);
            return { voice, count: clips.length, unplayable };
        },
    };

    root.Voices = Voices;
})(window);
