/*
 * Narrator: reading a book aloud, lighting up each sentence as it is read.
 *
 * A recording covers one story page: its title, then its sentences (the
 * "pieces" of BookEngine.segments). Nobody marks where each piece starts;
 * Narrator.marks() finds it from the pauses in the recording.
 *
 *  - Player plays one clip and reports which piece is being read.
 *  - ReadAlong drives the open book: plays the page on screen, lights up the
 *    piece being read, turns the page when it ends, and at an unanswered
 *    question waits for the child's answer before going on.
 *  - Recorder records one page from the microphone.
 */
(function (root) {
    'use strict';

    const FRAME = 0.02; // seconds per loudness frame
    const MIN_GAP = 0.12; // shortest silence that counts as a pause
    const DRIFT = 40; // how strongly a sentence break must stay near its expected place

    const round2 = (n) => Math.round(n * 100) / 100;

    const Narrator = {
        FRAME,

        // Fingerprint of the text a clip was read from; highlighting is only
        // trusted while the page text still matches.
        sig(segments) {
            const s = segments.join('\n');
            let h = 2166136261;
            for (let i = 0; i < s.length; i++) {
                h ^= s.charCodeAt(i);
                h = Math.imul(h, 16777619);
            }
            return (h >>> 0).toString(36);
        },

        // Loudness (dB) of each FRAME-long slice of a decoded recording.
        energies(buffer) {
            const size = Math.max(1, Math.floor(buffer.sampleRate * FRAME));
            const n = Math.floor(buffer.length / size);
            const chans = Array.from({ length: buffer.numberOfChannels }, (_, c) => buffer.getChannelData(c));
            const out = new Float32Array(n);
            for (let f = 0; f < n; f++) {
                let sum = 0;
                for (let i = f * size; i < (f + 1) * size; i++) {
                    let v = 0;
                    for (const ch of chans) v += ch[i];
                    v /= chans.length;
                    sum += v * v;
                }
                out[f] = 10 * Math.log10(sum / size + 1e-10);
            }
            return out;
        },

        // Start time (s) of each piece, given per-frame loudness and the text
        // length of each piece. Breaks go at pauses: long ones near where an
        // evenly paced reader would reach the next piece win.
        marks(db, lengths, frame = FRAME) {
            const n = lengths.length;
            if (!n) return [];
            const duration = db.length * frame;
            const total = lengths.reduce((a, b) => a + b, 0) || 1;
            const spread = (t0, t1) => {
                let acc = 0;
                return lengths.slice(0, -1).map((len) => t0 + (t1 - t0) * ((acc += len) / total));
            };

            const sorted = Array.from(db).sort((a, b) => a - b);
            const at = (p) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
            const quiet = at(0.05);
            const loud = at(0.95);
            // Voice is well above the quietest moments and not far below the
            // loudest: room noise that gets through before the phone's noise
            // filter settles stays out.
            const floor = Math.max(quiet + Math.max(6, (loud - quiet) * 0.3), loud - 22);
            const voiced = Array.from(db, (v) => v > floor);
            // Speech starts and ends with a real stretch of voice, not a tap on the screen.
            const run = (i, step) => {
                let n = 0;
                for (let j = i; j >= 0 && j < voiced.length && voiced[j]; j += step) n++;
                return n;
            };
            let first = -1;
            let last = -1;
            for (let i = 0; i < voiced.length && first < 0; i++) if (voiced[i] && run(i, 1) * frame >= 0.1) first = i;
            for (let i = voiced.length - 1; i >= 0 && last < 0; i--) if (voiced[i] && run(i, -1) * frame >= 0.1) last = i;
            if (first < 0 || loud - quiet < 6) return [0, ...spread(0, duration)].map(round2);

            const t0 = first * frame;
            const t1 = (last + 1) * frame;
            const gaps = [];
            for (let i = first; i <= last;) {
                if (voiced[i]) {
                    i++;
                    continue;
                }
                let j = i;
                while (j <= last && !voiced[j]) j++;
                if ((j - i) * frame >= MIN_GAP) gaps.push({ from: i * frame, to: j * frame, len: (j - i) * frame });
                i = j;
            }

            const expect = spread(t0, t1);
            const chosen = align(gaps, expect, Math.max(t1 - t0, 1));
            // The title lights up as soon as the page starts playing.
            const marks = [0];
            chosen.forEach((g, k) => marks.push(g ? Math.max(g.to - 0.12, (g.from + g.to) / 2) : expect[k]));
            // Keep them in order and apart, whatever happened above.
            for (let k = 1; k < n; k++) marks[k] = Math.min(Math.max(marks[k], marks[k - 1] + 0.3), duration);
            return marks.map(round2);
        },

        // Index of the piece being read at time t.
        segAt(marks, t) {
            let i = 0;
            while (i + 1 < marks.length && marks[i + 1] <= t + 0.05) i++;
            return i;
        },
    };

    // Picks, for each expected break (in order), a later pause than the one
    // before, or none; maximises pause length minus distance from expectation.
    function align(gaps, expect, span) {
        const m = expect.length;
        const G = gaps.length;
        if (!m) return [];
        const score = (k, j) => {
            const g = gaps[j];
            const off = ((g.from + g.to) / 2 - expect[k]) / span;
            return Math.log2(g.len / MIN_GAP) + 1 - DRIFT * off * off;
        };
        // state s = index of the last pause used + 1 (0: none yet)
        let best = new Array(G + 1).fill(-Infinity);
        best[0] = 0;
        const back = [];
        for (let k = 0; k < m; k++) {
            const next = new Array(G + 1).fill(-Infinity);
            const from = new Array(G + 1).fill(null);
            for (let s = 0; s <= G; s++) {
                if (best[s] === -Infinity) continue;
                if (best[s] > next[s]) {
                    next[s] = best[s];
                    from[s] = { s, use: -1 };
                }
                for (let j = s; j < G; j++) {
                    const v = best[s] + score(k, j);
                    if (v > next[j + 1]) {
                        next[j + 1] = v;
                        from[j + 1] = { s, use: j };
                    }
                }
            }
            back.push(from);
            best = next;
        }
        let s = best.indexOf(Math.max(...best));
        const out = new Array(m);
        for (let k = m - 1; k >= 0; k--) {
            const f = back[k][s];
            out[k] = f.use < 0 ? null : gaps[f.use];
            s = f.s;
        }
        return out;
    }

    // A moment of silence, played on the first tap so phones allow the
    // narration that starts a little later (after it is fetched) to play.
    function silence() {
        const n = 800;
        const buf = new ArrayBuffer(44 + n * 2);
        const v = new DataView(buf);
        const str = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
        str(0, 'RIFF');
        v.setUint32(4, 36 + n * 2, true);
        str(8, 'WAVEfmt ');
        v.setUint32(16, 16, true);
        v.setUint16(20, 1, true);
        v.setUint16(22, 1, true);
        v.setUint32(24, 8000, true);
        v.setUint32(28, 16000, true);
        v.setUint16(32, 2, true);
        v.setUint16(34, 16, true);
        str(36, 'data');
        v.setUint32(40, n * 2, true);
        return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
    }

    // ---------- Player ----------

    class Player {
        constructor() {
            this.audio = new Audio();
            this.audio.preload = 'auto';
            this.url = null;
            this.raf = 0;
            this.clip = null;
            this.unlocked = false;
            this.audio.addEventListener('ended', () => this.finish());
            this.audio.addEventListener('timeupdate', () => this.check());
        }

        get playing() {
            return !!this.clip;
        }

        unlock() {
            if (this.unlocked) return;
            this.unlocked = true;
            const a = this.audio;
            const src = silence();
            a.src = src;
            a.play().then(() => {
                if (a.src === src) a.pause();
            }).catch(() => {});
        }

        // Plays a clip, or just from..to seconds of it. onSeg(i) is called on
        // every frame with the piece being read; onEnd(error?) once at the end.
        play(clip, { from = 0, to = null, onSeg = null, onEnd = null } = {}) {
            this.stop();
            this.clip = clip;
            this.to = to;
            this.onSeg = onSeg;
            this.onEnd = onEnd;
            if (clip.blob) {
                this.url = URL.createObjectURL(clip.blob);
                this.audio.src = this.url;
            } else {
                this.audio.src = clip.src;
            }
            if (from > 0) this.audio.currentTime = from;
            const tick = () => {
                this.check();
                if (this.clip) this.raf = requestAnimationFrame(tick);
            };
            this.raf = requestAnimationFrame(tick);
            return this.audio.play().catch((e) => this.finish(e));
        }

        check() {
            if (!this.clip) return;
            const t = this.audio.currentTime;
            if (this.onSeg) this.onSeg(Narrator.segAt(this.clip.marks || [0], t));
            if (this.to !== null && t >= this.to) this.finish();
        }

        seek(t) {
            if (this.clip) this.audio.currentTime = Math.max(0, t);
        }

        finish(err) {
            if (!this.clip) return;
            const done = this.onEnd;
            this.stop();
            if (done) done(err);
        }

        stop() {
            cancelAnimationFrame(this.raf);
            if (!this.audio.paused) this.audio.pause();
            this.clip = null;
            this.onSeg = this.onEnd = null;
            if (this.url) {
                URL.revokeObjectURL(this.url);
                this.url = null;
            }
        }
    }

    // ---------- ReadAlong ----------

    class ReadAlong {
        // book: the BookEngine; opts.onState({ on, waiting }), opts.toast(text)
        constructor(book, opts = {}) {
            this.book = book;
            this.opts = opts;
            this.player = new Player();
            this.on = false;
            this.waiting = 0; // the page waiting for its question to be answered (0: none)
            this.view = null; // the page being read
            this.token = 0;
            this.timer = 0;
            this.voice = null;
            this.key = null;
        }

        // A new book or voice: stop whatever was playing.
        use(key, voiceId) {
            if (key !== this.key || voiceId !== this.voice) this.stop();
            this.key = key;
            this.voice = voiceId;
        }

        toggle() {
            if (this.on) this.stop();
            else this.start();
        }

        start() {
            if (!this.voice) return;
            this.player.unlock();
            this.on = true;
            this.waiting = 0;
            this.emit();
            const s = this.book.state();
            if (s.busy) return; // the turn in progress reports back through onChange
            if (s.view >= 1 && s.view <= s.pages) this.playView(s.view);
            else if (s.end) this.book.goTo(1);
            else this.book.next();
        }

        stop() {
            this.on = false;
            this.waiting = 0;
            this.view = null;
            this.token++;
            clearTimeout(this.timer);
            this.player.stop();
            this.highlight(-1);
            this.emit();
        }

        // The book moved (or was redrawn).
        onChange(s) {
            if (!this.on || s.busy) return;
            // the same page redrawn (script switch, answer): carry on as we were
            if (s.view === this.view && (this.player.playing || (this.waiting && this.waiting === s.view))) return;
            clearTimeout(this.timer);
            this.waiting = 0;
            if (s.view >= 1 && s.view <= s.pages) this.playView(s.view);
            else if (s.view <= 0) this.later(500);
            else this.stop(); // the end
            this.emit();
        }

        onAnswer(ok) {
            if (this.on && ok && this.waiting) {
                this.waiting = 0;
                this.emit();
                this.later(1300);
            }
        }

        // Tap on a sentence: read just that one (or jump to it while reading).
        async say(seg) {
            const view = this.book.view;
            if (!this.voice || view < 1) return;
            if (this.on) {
                if (this.player.playing && this.view === view && this.player.clip.marks[seg] !== undefined) this.player.seek(this.player.clip.marks[seg]);
                return;
            }
            this.player.unlock();
            const token = ++this.token;
            const clip = await root.Voices.clip(this.voice, this.key, view);
            if (token !== this.token || !clip || !this.fits(clip, view) || clip.marks[seg] === undefined) return;
            this.player.play(clip, {
                from: clip.marks[seg],
                to: clip.marks[seg + 1] !== undefined ? clip.marks[seg + 1] : null,
                onSeg: () => this.highlight(seg),
                onEnd: () => this.highlight(-1),
            });
        }

        async playView(view) {
            const token = ++this.token;
            this.player.stop();
            this.highlight(-1);
            this.view = view;
            const clip = await root.Voices.clip(this.voice, this.key, view);
            if (token !== this.token || !this.on) return;
            if (!clip) {
                this.stop();
                if (this.opts.toast) this.opts.toast("🎙️ Bu sahifa hali o'qib berilmagan");
                return;
            }
            const fits = this.fits(clip, view);
            this.player.play(clip, {
                onSeg: (i) => fits && this.highlight(i),
                onEnd: (err) => this.pageDone(view, token, err),
            });
        }

        pageDone(view, token, err) {
            if (token !== this.token || !this.on) return;
            this.highlight(-1);
            if (err) {
                this.stop();
                return;
            }
            const p = this.book.story.pages[view - 1];
            const answered = !p.question || (this.book.record.answers[view] || {}).done;
            if (!answered) {
                this.waiting = view;
                this.emit();
                if (this.opts.toast) this.opts.toast('💡 Endi savolga javob bering!');
                return;
            }
            this.later(900);
        }

        later(ms) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                if (this.on && !this.book.isBusy()) this.book.next();
            }, ms);
        }

        // The clip was read from the text now on the page (else no highlighting).
        fits(clip, view) {
            const segs = root.BookEngine.segments(this.book.story.pages[view - 1]);
            return (clip.marks || []).length === segs.length && (!clip.sig || clip.sig === Narrator.sig(segs));
        }

        // Lights up piece i on the page (-1: none). Cheap enough to call every frame.
        highlight(i) {
            const page = this.book.right;
            const cur = page.querySelector('.is-reading');
            const want = i >= 0 ? page.querySelector(`[data-seg="${i}"]`) : null;
            if (cur === want) return;
            if (cur) cur.classList.remove('is-reading');
            if (want) want.classList.add('is-reading');
        }

        emit() {
            if (this.opts.onState) this.opts.onState({ on: this.on, waiting: this.waiting });
        }
    }

    // ---------- Recorder ----------

    class Recorder {
        static supported() {
            return !!(root.navigator.mediaDevices && root.navigator.mediaDevices.getUserMedia && root.MediaRecorder);
        }

        // AAC in MP4 plays on every phone; otherwise Opus, best supported in WebM
        // (a plain "audio/mp4" recording may hold Opus too).
        static mime() {
            const types = ['audio/mp4;codecs=mp4a.40.2', 'audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
            return types.find((t) => root.MediaRecorder.isTypeSupported(t)) || '';
        }

        // onLevel(0..1, seconds) is called on every frame while recording.
        async start(onLevel) {
            this.stream = await root.navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
            try {
                const mime = Recorder.mime();
                this.rec = new root.MediaRecorder(this.stream, mime ? { mimeType: mime, audioBitsPerSecond: 48000 } : undefined);
                this.chunks = [];
                this.rec.ondataavailable = (e) => {
                    if (e.data && e.data.size) this.chunks.push(e.data);
                };
                this.stopped = new Promise((resolve) => { this.rec.onstop = resolve; });
                this.rec.start(250);
            } catch (e) {
                this.stream.getTracks().forEach((t) => t.stop()); // don't leave the microphone on
                throw e;
            }
            const t0 = performance.now();
            try {
                this.ctx = new (root.AudioContext || root.webkitAudioContext)();
                const analyser = this.ctx.createAnalyser();
                analyser.fftSize = 1024;
                this.ctx.createMediaStreamSource(this.stream).connect(analyser);
                const data = new Float32Array(analyser.fftSize);
                const loop = () => {
                    analyser.getFloatTimeDomainData(data);
                    let sum = 0;
                    for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
                    if (onLevel) onLevel(Math.min(1, Math.sqrt(sum / data.length) * 5), (performance.now() - t0) / 1000);
                    this.raf = requestAnimationFrame(loop);
                };
                loop();
            } catch (e) {
                /* the level meter is optional */
            }
        }

        // Ends the recording; resolves with { blob, mime, duration, energies }.
        async stop() {
            cancelAnimationFrame(this.raf);
            if (this.rec.state !== 'inactive') this.rec.stop();
            await this.stopped;
            this.stream.getTracks().forEach((t) => t.stop());
            const mime = this.rec.mimeType || Recorder.mime() || 'audio/webm';
            const blob = new Blob(this.chunks, { type: mime });
            const ctx = this.ctx || new (root.AudioContext || root.webkitAudioContext)();
            try {
                const buffer = await ctx.decodeAudioData(await blob.arrayBuffer());
                return { blob, mime, duration: buffer.duration, energies: Narrator.energies(buffer) };
            } finally {
                ctx.close().catch(() => {});
                this.ctx = null;
            }
        }

        cancel() {
            cancelAnimationFrame(this.raf);
            if (this.rec && this.rec.state !== 'inactive') this.rec.stop();
            if (this.stream) this.stream.getTracks().forEach((t) => t.stop());
            if (this.ctx) this.ctx.close().catch(() => {});
            this.ctx = null;
        }
    }

    Object.assign(Narrator, { Player, ReadAlong, Recorder, align });
    root.Narrator = Narrator;
})(typeof window !== 'undefined' ? window : globalThis);
