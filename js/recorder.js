/*
 * FamilyVoice — a parent or grandparent records a page in their own voice.
 * Recordings stay on this device (IndexedDB) and are played instead of the
 * synthetic voice whenever that page is read aloud.
 *
 * Keys are "<story>:<view>", the same keys narration files use.
 */
(function (root) {
    'use strict';

    const DB_NAME = 'ertaklar-olami';
    const STORE = 'recordings';
    const MAX_MS = 3 * 60 * 1000;

    function pickMime() {
        if (!root.MediaRecorder || !root.MediaRecorder.isTypeSupported) return '';
        return ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'].find((t) => root.MediaRecorder.isTypeSupported(t)) || '';
    }

    const FamilyVoice = {
        supported: !!(root.navigator && root.navigator.mediaDevices && root.navigator.mediaDevices.getUserMedia && root.MediaRecorder && root.indexedDB),
        recording: null,

        db() {
            if (!this.dbp) {
                this.dbp = new Promise((resolve, reject) => {
                    const req = root.indexedDB.open(DB_NAME, 1);
                    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = () => reject(req.error);
                });
            }
            return this.dbp;
        },

        async tx(mode, fn) {
            const db = await this.db();
            return new Promise((resolve, reject) => {
                const t = db.transaction(STORE, mode);
                const req = fn(t.objectStore(STORE));
                t.oncomplete = () => resolve(req && req.result);
                t.onerror = () => reject(t.error);
            });
        },

        async get(key) {
            if (!root.indexedDB) return null;
            try {
                return (await this.tx('readonly', (s) => s.get(key))) || null;
            } catch (e) {
                return null;
            }
        },

        put(key, rec) {
            return this.tx('readwrite', (s) => s.put(rec, key));
        },

        remove(key) {
            return this.tx('readwrite', (s) => s.delete(key));
        },

        async keys(prefix) {
            if (!root.indexedDB) return [];
            try {
                const all = (await this.tx('readonly', (s) => s.getAllKeys())) || [];
                return all.filter((k) => String(k).startsWith(prefix));
            } catch (e) {
                return [];
            }
        },

        // Starts recording; resolves once the microphone is live. onLimit runs
        // when the time limit is reached (the caller stops and saves).
        async start(onTick, onLimit) {
            if (this.recording) return;
            const stream = await root.navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
            const mimeType = pickMime();
            const rec = new root.MediaRecorder(stream, mimeType ? { mimeType } : undefined);
            const chunks = [];
            rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
            const t0 = Date.now();
            this.recording = { rec, stream, chunks, t0, mimeType: rec.mimeType || mimeType || 'audio/webm' };
            const timer = setInterval(() => {
                const ms = Date.now() - t0;
                if (onTick) onTick(ms);
                if (ms >= MAX_MS) {
                    clearInterval(timer);
                    if (onLimit) onLimit();
                    else this.stop();
                }
            }, 250);
            this.recording.timer = timer;
            rec.start(250);
        },

        // Stops recording; resolves { blob, type, ms } (or null if nothing was captured).
        stop() {
            const r = this.recording;
            if (!r) return Promise.resolve(null);
            this.recording = null;
            clearInterval(r.timer);
            return new Promise((resolve) => {
                r.rec.onstop = () => {
                    r.stream.getTracks().forEach((t) => t.stop());
                    const blob = new Blob(r.chunks, { type: r.mimeType });
                    resolve(blob.size ? { blob, type: r.mimeType, ms: Date.now() - r.t0, at: Date.now() } : null);
                };
                try {
                    r.rec.stop();
                } catch (e) {
                    r.stream.getTracks().forEach((t) => t.stop());
                    resolve(null);
                }
            });
        },

        cancel() {
            const r = this.recording;
            if (!r) return;
            this.recording = null;
            clearInterval(r.timer);
            try { r.rec.stop(); } catch (e) { /* already stopped */ }
            r.stream.getTracks().forEach((t) => t.stop());
        },
    };

    root.FamilyVoice = FamilyVoice;
})(window);
