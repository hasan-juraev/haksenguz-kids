/*
 * Narrator — reads pages aloud and reports what it is reading, word by word.
 *
 * A reading is a list of parts:
 *   { type: 'tts',   segs }                       speech synthesis, sentence by sentence
 *   { type: 'audio', segs, src, fine, durationMs, marks }
 *                                                 a recording or narration file
 * where segs = [{ s, q, kind, prefix?, words: [{ w, t }] }] (see Speech.markup).
 *
 * Speech synthesis picks the best voice for Uzbek (a natural uz-UZ voice such
 * as Microsoft Madina/Sardor when the browser has one; otherwise a related
 * language with respelled words). Sentences are spoken one at a time, which
 * sidesteps browser bugs with long utterances, gives accurate sentence
 * highlighting, and lets dialogue «...» use a slightly different voice.
 * Word highlighting follows the voice's boundary events, or an estimated
 * pace for voices that don't report them.
 *
 * Pausing cancels the current sentence and repeats it on resume (pause() of
 * speechSynthesis is unreliable across browsers).
 */
(function (root) {
    'use strict';

    const Speech = () => root.Speech;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const BASE_RATE = 0.92;
    const SPEEDS = { slow: 0.8, normal: 1, fast: 1.18 };

    class Narrator {
        constructor(opts = {}) {
            this.opts = opts;
            this.synth = root.speechSynthesis || null;
            this.voices = [];
            this.voiceId = 'auto';
            this.speed = 'normal';
            this.characterVoices = true;
            this.state = 'idle';
            this.gen = 0;
            this.paused = false;
            this.waiters = [];
            this.audio = null;
            this.audioPart = null;
            this.current = null;
            if (this.synth && typeof root.SpeechSynthesisUtterance === 'function') {
                const refresh = () => this.refreshVoices();
                if (this.synth.addEventListener) this.synth.addEventListener('voiceschanged', refresh);
                else this.synth.onvoiceschanged = refresh;
                refresh();
                // Some browsers never fire voiceschanged: look again for a few seconds.
                let tries = 0;
                const poll = setInterval(() => {
                    refresh();
                    if (this.voices.length || ++tries > 20) clearInterval(poll);
                }, 250);
            } else {
                this.synth = null;
            }
        }

        // ---------- voices ----------

        refreshVoices() {
            const list = (this.synth && this.synth.getVoices()) || [];
            const infos = list.map((v) => Speech().voiceInfo(v)).filter(Boolean).sort((a, b) => b.score - a.score);
            const same = infos.length === this.voices.length && infos.every((x, i) => x.id === this.voices[i].id);
            this.voices = infos;
            if (!same && this.opts.onVoices) this.opts.onVoices(infos);
        }

        get voice() {
            if (!this.voices.length) return null;
            if (this.voiceId !== 'auto') {
                const chosen = this.voices.find((x) => x.id === this.voiceId);
                if (chosen) return chosen;
            }
            return this.voices[0];
        }

        canSpeak() {
            return !!(this.synth && this.voice);
        }

        rate(dialogue) {
            return Math.min(2, Math.max(0.5, BASE_RATE * (SPEEDS[this.speed] || 1) * (dialogue ? 1.05 : 1)));
        }

        // ---------- state ----------

        setState(s) {
            if (this.state === s) return;
            this.state = s;
            if (this.opts.onState) this.opts.onState(s);
        }

        highlight(h) {
            if (this.opts.onHighlight) this.opts.onHighlight(h);
        }

        stop() {
            this.gen++;
            this.paused = false;
            this.waiters.splice(0).forEach((r) => r());
            if (this.synth && (this.synth.speaking || this.synth.pending)) {
                this.interrupted = false;
                this.synth.cancel();
            }
            if (this.audioPart) this.audioPart.done('stopped');
            if (this.audio) this.audio.pause();
            this.setState('idle');
            this.highlight(null);
        }

        pause() {
            if (this.state !== 'playing') return;
            this.paused = true;
            this.setState('paused');
            if (this.audioPart) {
                this.audio.pause();
            } else if (this.current && this.synth) {
                this.interrupted = true;
                this.synth.cancel();
            }
        }

        resume() {
            if (this.state !== 'paused') return;
            this.paused = false;
            this.setState('playing');
            if (this.audioPart) {
                const p = this.audio.play();
                if (p && p.catch) p.catch(() => this.audioPart && this.audioPart.done('blocked'));
            }
            this.waiters.splice(0).forEach((r) => r());
        }

        untilResumed() {
            if (!this.paused) return Promise.resolve();
            return new Promise((r) => this.waiters.push(r));
        }

        // ---------- reading ----------

        // Resolves 'done' | 'stopped' | 'blocked' | 'error'.
        async play(parts) {
            const wasBusy = this.synth && (this.synth.speaking || this.synth.pending);
            this.stop();
            const gen = this.gen;
            this.setState('playing');
            // Chrome can drop an utterance queued right after cancel().
            if (wasBusy) await sleep(60);
            let errors = 0;
            for (let p = 0; p < parts.length; p++) {
                const part = parts[p];
                if (part.type === 'audio') {
                    await this.untilResumed();
                    if (gen !== this.gen) return 'stopped';
                    const r = await this.playAudio(part, gen);
                    if (gen !== this.gen) return 'stopped';
                    if (r === 'blocked') return this.fail('blocked');
                    if (r === 'error' && part.fallback && this.canSpeak()) parts.splice(p + 1, 0, { type: 'tts', segs: part.segs });
                } else {
                    if (!this.canSpeak()) continue;
                    for (let i = 0; i < part.segs.length; i++) {
                        const seg = part.segs[i];
                        let r;
                        do {
                            await this.untilResumed();
                            if (gen !== this.gen) return 'stopped';
                            r = await this.speakSeg(seg, gen);
                            if (gen !== this.gen) return 'stopped';
                        } while (r === 'paused');
                        if (r === 'blocked') return this.fail('blocked');
                        if (r === 'error') {
                            if (++errors >= 2) return this.fail('error');
                        } else {
                            errors = 0;
                        }
                        await sleep(this.gap(seg, part.segs[i + 1] || (parts[p + 1] && parts[p + 1].segs[0])));
                    }
                }
                if (gen !== this.gen) return 'stopped';
            }
            this.setState('idle');
            this.highlight(null);
            return 'done';
        }

        fail(reason) {
            this.stop();
            if (this.opts.onError) this.opts.onError(reason);
            return reason;
        }

        // Pauses between sentences: longer after a title or before a question.
        gap(seg, next) {
            if (!next) return 0;
            if (seg.kind !== next.kind) return seg.kind === 'title' ? 650 : 520;
            if (seg.q !== next.q) return 220;
            const last = seg.words[seg.words.length - 1];
            return last && Speech().SENTENCE_END.test(last.t) ? 320 : 170;
        }

        speakSeg(seg, gen) {
            const sp = Speech();
            const info = this.voice;
            const toks = seg.words.map((w) => sp.respell(w.t, info.lang));
            let text = seg.prefix ? sp.respell(seg.prefix, info.lang) + ' ' : '';
            const offsets = toks.map((t) => {
                const at = text.length;
                text += t + ' ';
                return at;
            });
            text = text.trim();
            if (!sp.hasSound(text)) return Promise.resolve('end');
            const dialogue = !!seg.q && this.characterVoices;
            const u = new root.SpeechSynthesisUtterance(text);
            u.voice = info.voice;
            u.lang = info.voice.lang;
            u.rate = this.rate(dialogue);
            u.pitch = dialogue ? 1.18 : 1;
            u.volume = 1;
            const est = sp.estimateMs(text, u.rate);
            return new Promise((resolve) => {
                let settled = false;
                let boundary = false;
                let pace = null;
                const done = (r) => {
                    if (settled) return;
                    settled = true;
                    clearTimeout(watchdog);
                    clearTimeout(pace);
                    if (this.current === u) this.current = null;
                    resolve(r);
                };
                const mark = (i) => {
                    if (!settled && gen === this.gen && seg.words[i]) this.highlight({ s: seg.s, w: seg.words[i].w });
                };
                // Voices without word boundaries: walk the words at an estimated pace.
                const walk = () => {
                    const weights = toks.map((t) => t.length + 1);
                    const sum = weights.reduce((a, b) => a + b, 0) || 1;
                    let i = 0;
                    const step = () => {
                        if (settled || boundary) return;
                        mark(i);
                        const d = (est - 400) * (weights[i] / sum);
                        if (++i < toks.length) pace = setTimeout(step, d);
                    };
                    step();
                };
                u.onstart = () => {
                    if (gen !== this.gen) return;
                    this.highlight({ s: seg.s, w: seg.prefix ? null : seg.words[0] && seg.words[0].w });
                    pace = setTimeout(() => { if (!boundary) walk(); }, seg.prefix ? 700 : 450);
                };
                u.onboundary = (e) => {
                    if (gen !== this.gen || (e.name && e.name !== 'word')) return;
                    boundary = true;
                    clearTimeout(pace);
                    if (e.charIndex < offsets[0]) return;
                    let i = 0;
                    while (i + 1 < offsets.length && offsets[i + 1] <= e.charIndex) i++;
                    mark(i);
                };
                u.onend = () => done(this.interrupted ? 'paused' : 'end');
                u.onerror = (e) => {
                    if (this.interrupted) return done('paused');
                    const err = e && e.error;
                    done(err === 'interrupted' || err === 'canceled' ? 'stopped' : err === 'not-allowed' ? 'blocked' : 'error');
                };
                // Some engines never fire onend: move on after a generous delay.
                const watchdog = setTimeout(() => {
                    if (settled) return;
                    if (this.synth.speaking) this.synth.cancel();
                    done('end');
                }, est * 2.5 + 4000);
                this.interrupted = false;
                this.current = u;
                this.synth.speak(u);
            });
        }

        // Recordings and narration files: highlight by position in the audio.
        playAudio(part, gen) {
            const a = this.audio || (this.audio = new root.Audio());
            a.preload = 'auto';
            a.src = part.src;
            a.playbackRate = part.kind === 'recording' ? 1 : (SPEEDS[this.speed] || 1);
            const segs = part.segs.map((sg) => {
                let acc = 0;
                const words = sg.words.map((w, wi) => {
                    let weight = w.t.length + 1;
                    if (/[.!?…]["»”]*[,]?$/.test(w.t)) weight += 6;
                    else if (/[,;:—]$/.test(w.t)) weight += 3;
                    if (wi === sg.words.length - 1 && sg.kind === 'title') weight += 9;
                    const at = acc;
                    acc += weight;
                    return { w: w.w, at };
                });
                return { s: sg.s, words, total: acc || 1 };
            });
            // Files made by tools/generate-narration.mjs carry where each
            // sentence starts and stops ([startMs, endMs] marks), so the
            // highlight follows the voice sentence by sentence. Without marks
            // the whole file is shared out by estimated word lengths.
            const marks = Array.isArray(part.marks) && part.marks.length === segs.length ? part.marks : null;
            const grand = segs.reduce((n, sg) => n + sg.total, 0) || 1;
            const locate = (ms, dur) => {
                let si = 0;
                let frac;
                if (marks) {
                    while (si + 1 < segs.length && marks[si + 1][0] <= ms) si++;
                    frac = (ms - marks[si][0]) / Math.max(1, marks[si][1] - marks[si][0]);
                } else {
                    let pos = Math.min(0.999, ms / dur) * grand;
                    while (si + 1 < segs.length && pos >= segs[si].total) {
                        pos -= segs[si].total;
                        si++;
                    }
                    frac = pos / segs[si].total;
                }
                const sg = segs[si];
                const target = Math.min(0.999, Math.max(0, frac)) * sg.total;
                let wi = 0;
                while (wi + 1 < sg.words.length && sg.words[wi + 1].at <= target) wi++;
                return { s: sg.s, w: sg.words.length ? sg.words[wi].w : null };
            };
            return new Promise((resolve) => {
                let settled = false;
                let raf = 0;
                const done = (r) => {
                    if (settled) return;
                    settled = true;
                    cancelAnimationFrame(raf);
                    a.onended = null;
                    a.onerror = null;
                    this.audioPart = null;
                    if (part.onDone) part.onDone();
                    resolve(r);
                };
                const tick = () => {
                    if (settled || gen !== this.gen) return;
                    const dur = isFinite(a.duration) && a.duration > 0 ? a.duration * 1000 : part.durationMs || 0;
                    if (!a.paused && segs.length && (marks || dur > 0)) {
                        const x = locate(a.currentTime * 1000, dur);
                        this.highlight(part.fine ? x : { s: x.s, w: null });
                    }
                    raf = requestAnimationFrame(tick);
                };
                a.onended = () => done('end');
                a.onerror = () => done('error');
                this.audioPart = { done };
                raf = requestAnimationFrame(tick);
                if (this.paused) return;
                const p = a.play();
                if (p && p.catch) p.catch((err) => done(err && err.name === 'NotAllowedError' ? 'blocked' : 'error'));
            });
        }

        // Short phrases outside a reading (a tapped word, praise, instructions).
        say(text, opts = {}) {
            if (!this.canSpeak() || this.state !== 'idle') return false;
            const info = this.voice;
            const phrase = Speech().norm(text).split(/\s+/).map((t) => Speech().respell(t, info.lang)).join(' ');
            if (!Speech().hasSound(phrase)) return false;
            this.synth.cancel();
            const u = new root.SpeechSynthesisUtterance(phrase);
            u.voice = info.voice;
            u.lang = info.voice.lang;
            u.rate = this.rate(false) * (opts.slow ? 0.85 : 1);
            u.pitch = opts.pitch || 1;
            this.synth.speak(u);
            return true;
        }

        // A plain text reading (instructions), without page highlighting.
        readText(text) {
            const segs = Speech().segment(text).map((sg) => ({ s: -1, q: sg.q, kind: 'text', words: sg.toks.map((t) => ({ w: -1, t })) }));
            return this.play([{ type: 'tts', segs }]);
        }
    }

    Narrator.SPEEDS = SPEEDS;
    root.Narrator = Narrator;
})(window);
