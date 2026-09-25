/*
 * ReadAloud — "O'qib ber": reads the open spread aloud and highlights each
 * word, then (in auto mode) turns the page and carries on, like an audiobook
 * that waits for the child to answer the page's question.
 *
 * What is read, in order: the page title and text, the "Yangi so'z" card,
 * and the question with its answers (skipped once answered). For each page
 * the voice comes from, in order of preference:
 *   1. a family recording of that page (FamilyVoice, this device only),
 *   2. a narration file listed in audio/manifest.js,
 *   3. speech synthesis (Narrator picks the best voice for Uzbek).
 */
(function (root) {
    'use strict';

    const ORDINALS = ['Birinchi javob:', 'Ikkinchi javob:', 'Uchinchi javob:', "To'rtinchi javob:"];
    const SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
    const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
    const clock = (ms) => `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}`;

    class ReadAloud {
        constructor({ book, narrator, family, settings, ui }) {
            this.book = book;
            this.narrator = narrator;
            this.family = family;
            this.settings = Object.assign({ voiceId: 'auto', speed: 'normal', characters: true, auto: false, feedback: true, useFamily: true }, settings);
            this.ui = ui;
            this.active = false;
            this.waiting = null;
            this.readToken = 0;
            this.hl = null;
            this.warned = false;
            this.recKey = null;
            this.applySettings();

            this.btn = document.getElementById('readBtn');
            this.autoBtn = document.getElementById('autoBtn');
            this.panel = document.getElementById('readerPanel');
            this.pill = document.getElementById('recPill');
            this.fab = document.getElementById('readFab');
            if (this.fab && this.btn && root.IntersectionObserver) {
                // Once the story bar scrolls away (on phones the page follows
                // the sentence being read), a floating button keeps play/pause
                // at hand.
                new root.IntersectionObserver(([e]) => this.showFab(!e.isIntersecting && !!this.btn.offsetParent)).observe(this.btn);
            }
            if (this.panel) {
                this.panel.addEventListener('click', (e) => this.onPanelClick(e));
                this.panel.addEventListener('change', (e) => this.onPanelChange(e));
                document.addEventListener('pointerdown', (e) => {
                    if (!this.panel.hidden && !this.panel.contains(e.target) && !e.target.closest('#readerSettingsBtn, #recPill')) this.closePanel();
                });
            }
            if (this.pill) this.pill.addEventListener('click', (e) => { if (e.target.closest('[data-rec-stop]')) this.stopRecording(); });
            this.update();
        }

        applySettings() {
            this.narrator.voiceId = this.settings.voiceId;
            this.narrator.speed = this.settings.speed;
            this.narrator.characterVoices = this.settings.characters;
        }

        saveSettings() {
            this.applySettings();
            if (this.ui.saveSettings) this.ui.saveSettings(this.settings);
        }

        get key() {
            return this.book.key;
        }

        pageKey(view = this.book.view) {
            return `${this.book.key}:${view}`;
        }

        // ---------- session ----------

        toggle() {
            const st = this.narrator.state;
            if (st === 'playing') this.narrator.pause();
            else if (st === 'paused') this.narrator.resume();
            else if (this.active) this.stop();
            else this.start();
            this.update();
        }

        // Must run inside the tap that started reading: iOS only lets speech
        // and audio start from a user gesture.
        unlock() {
            if (this.unlocked) return;
            this.unlocked = true;
            try {
                if (this.narrator.synth) {
                    const u = new root.SpeechSynthesisUtterance(' ');
                    u.volume = 0;
                    this.narrator.synth.speak(u);
                }
                const a = this.narrator.audio || (this.narrator.audio = new root.Audio());
                a.src = SILENT_WAV;
                const p = a.play();
                if (p && p.catch) p.catch(() => {});
            } catch (e) {
                /* best effort */
            }
        }

        start() {
            if (!this.book.story) return;
            if (this.family && this.family.recording) this.stopRecording();
            this.unlock();
            this.active = true;
            this.waiting = null;
            // Pressing play on the cover or title page carries on into the story.
            this.carryOn = this.book.view <= 0;
            this.update();
            if (this.book.view === -1) {
                this.autoTurn = true;
                this.book.next();
            } else {
                this.readCurrent();
            }
        }

        stop() {
            this.active = false;
            this.waiting = null;
            this.readToken++;
            clearTimeout(this.advanceTimer);
            this.narrator.stop();
            this.update();
        }

        async readCurrent() {
            const token = ++this.readToken;
            const v = this.book.view;
            this.waiting = null;
            this.answeredWhileReading = null;
            clearTimeout(this.advanceTimer);
            const parts = await this.buildParts(v);
            if (token !== this.readToken || !this.active || this.book.view !== v || this.book.isBusy()) return;
            if (!parts.length) {
                this.stop();
                this.ui.notice("🔇 Ovoz topilmadi", "Bu qurilmada o'zbekcha (yoki unga yaqin tildagi) ovoz yo'q. Eng tabiiy o'zbekcha ovozlar (Madina, Sardor) Microsoft Edge brauzerida bepul — kitobni Edge'da oching. Yoki ⚙️ sozlamalarida sahifani o'z ovozingiz bilan yozib qo'ying.");
                return;
            }
            this.maybeWarnVoice(parts);
            let r = await this.narrator.play(parts);
            if (token !== this.readToken) return;
            if (r === 'stopped' && this.answeredWhileReading === v) r = 'done';
            if (r === 'blocked') {
                this.stop();
                this.ui.toast("▶ tugmasini yana bir bor bosing — ovoz shunda yoqiladi");
                return;
            }
            if (r !== 'done' || !this.active || this.book.view !== v) return;
            const carry = this.carryOn && v <= 0;
            if (v >= 1) this.carryOn = false;
            if ((!this.settings.auto && !carry) || v >= this.book.lastView) {
                this.active = false;
                this.update();
                return;
            }
            if (this.needsAnswer(v)) {
                this.waiting = v;
                this.update();
                return;
            }
            // After an answer, leave time for the spoken praise.
            const answered = this.answeredWhileReading === v;
            this.advanceTimer = setTimeout(() => this.advance(), v <= 0 ? 700 : answered ? 1700 : 1100);
        }

        advance() {
            if (!this.active || this.book.isBusy()) return;
            this.waiting = null;
            this.autoTurn = true;
            if (!this.book.next()) {
                this.autoTurn = false;
                this.active = false;
            }
            this.update();
        }

        needsAnswer(v) {
            const p = this.book.story.pages[v - 1];
            const a = this.book.answers[this.key] && this.book.answers[this.key][v];
            return !!(p && p.question && !(a && a.done));
        }

        maybeWarnVoice(parts) {
            const v = this.narrator.voice;
            if (this.warned || !v || v.lang === 'uz' || !parts.some((p) => p.type === 'tts')) return;
            this.warned = true;
            this.ui.toast(`O'zbekcha ovoz topilmadi — ${v.langName} ovoz o'zbekchaga moslab o'qiydi (⚙️)`);
        }

        // ---------- what to read ----------

        segs(scope, filter) {
            return [...scope.querySelectorAll('.s')].filter(filter).map((el) => {
                const host = el.closest('[data-prefix]');
                const option = el.closest('.choice');
                let prefix;
                if (option && option.querySelector('.s') === el) prefix = ORDINALS[[...option.parentElement.children].indexOf(option)];
                else if (host && host.querySelector('.s') === el) prefix = host.dataset.prefix;
                const kind = option ? 'option'
                    : el.closest('.page-question') ? 'question'
                        : el.closest('.word-card') ? 'vocab'
                            : el.closest('.page-title, .title-name, .finale-title') ? 'title' : 'text';
                return {
                    s: +el.dataset.s,
                    q: el.dataset.q === '1',
                    kind,
                    prefix,
                    words: [...el.querySelectorAll('.w')].map((w) => ({ w: +w.dataset.w, t: w.textContent })),
                };
            });
        }

        // → { src, marks? } for a page in audio/manifest.js. Entries are a
        // path, or { src, marks } as written by tools/generate-narration.mjs.
        manifestFile(key) {
            const m = root.narrationManifest;
            const f = m && m.files && m.files[key];
            if (!f) return null;
            const entry = typeof f === 'string' ? { src: f } : f;
            return entry.src ? { src: (m.base || '') + entry.src, marks: entry.marks } : null;
        }

        async buildParts(v) {
            const right = this.book.right.querySelector('.page-content');
            const left = this.book.left.querySelector('.page-content');
            const main = this.segs(right, (el) => !el.closest('.page-question'));
            const vocab = v >= 1 ? this.segs(left, (el) => !!el.closest('.word-card')) : [];
            const quiz = this.needsAnswer(v) ? this.segs(right, (el) => !!el.closest('.page-question')) : [];
            const key = this.pageKey(v);
            const tts = this.narrator.canSpeak();
            const parts = [];
            // "▶ Tinglash" in the panel plays the recording even if recordings are switched off.
            const useFamily = this.settings.useFamily || this.forceFamily;
            this.forceFamily = false;
            if (main.length) {
                const rec = useFamily && this.family ? await this.family.get(key) : null;
                const file = this.manifestFile(key);
                if (rec && rec.blob) {
                    const url = URL.createObjectURL(rec.blob);
                    parts.push({ type: 'audio', kind: 'recording', src: url, durationMs: rec.ms, segs: main, fallback: true, onDone: () => URL.revokeObjectURL(url) });
                } else if (file) {
                    parts.push({ type: 'audio', kind: 'file', src: file.src, marks: file.marks, segs: main, fine: true, fallback: true });
                } else if (tts) {
                    parts.push({ type: 'tts', segs: main });
                }
            }
            if (vocab.length && tts) parts.push({ type: 'tts', segs: vocab });
            if (quiz.length) {
                const file = this.manifestFile(key + ':q');
                if (file) parts.push({ type: 'audio', kind: 'file', src: file.src, marks: file.marks, segs: quiz, fine: true, fallback: true });
                else if (tts) parts.push({ type: 'tts', segs: quiz });
            }
            return parts;
        }

        // ---------- highlighting ----------

        applyHighlight(h) {
            const scope = this.book.el;
            const q = (sel) => scope.querySelector(`.book-page .page-content ${sel}`);
            if (h && this.hl && h.s === this.hl.s && h.w === this.hl.w) {
                const el = h.w != null ? q(`[data-w="${h.w}"]`) : q(`[data-s="${h.s}"]`);
                if (el && el.classList.contains(h.w != null ? 'w--on' : 's--on')) return;
            }
            scope.querySelectorAll('.book-page .s--on, .book-page .w--on, .book-page .choice--reading').forEach((el) => el.classList.remove('s--on', 'w--on', 'choice--reading'));
            const sentenceChanged = !this.hl || !h || this.hl.s !== h.s;
            this.hl = h ? { s: h.s, w: h.w } : null;
            if (!h || h.s == null || h.s < 0) return;
            const s = q(`[data-s="${h.s}"]`);
            if (s) {
                s.classList.add('s--on');
                const choice = s.closest('.choice');
                if (choice) choice.classList.add('choice--reading');
                // On phones the page scrolls: keep the sentence being read in view.
                if (sentenceChanged && !this.book.spread) {
                    const r = s.getBoundingClientRect();
                    if (r.top < 70 || r.bottom > root.innerHeight - 20) s.scrollIntoView({ block: 'center', behavior: 'smooth' });
                }
            }
            if (h.w != null && h.w >= 0) {
                const w = q(`[data-w="${h.w}"]`);
                if (w) w.classList.add('w--on');
            }
        }

        // ---------- book events ----------

        onTurnStart() {
            if (this.family && this.family.recording) this.stopRecording();
            if (!this.active) return;
            clearTimeout(this.advanceTimer);
            this.readToken++;
            this.waiting = null;
            this.narrator.stop();
            if (!this.autoTurn && !this.settings.auto) this.active = false;
            this.autoTurn = false;
            this.update();
        }

        onTurnEnd() {
            if (this.active) this.readCurrent();
            this.refreshFamilyBadge();
            if (this.panel && !this.panel.hidden) this.renderPanel();
        }

        // The book jumped without turning (restart, resume).
        onJump() {
            if (this.family && this.family.recording) this.stopRecording();
            this.refreshFamilyBadge();
            if (!this.active) return;
            this.narrator.stop();
            this.readCurrent();
        }

        onLeave() {
            if (this.family && this.family.recording) this.stopRecording();
            this.stop();
            this.closePanel();
            this.showFab(false);
        }

        onAnswer(ok, praise) {
            const v = this.book.view;
            if (ok && this.active && this.narrator.state !== 'idle') {
                // Answered while the question was being read: that part is done.
                this.answeredWhileReading = v;
                this.narrator.stop();
            }
            if (this.settings.feedback) {
                setTimeout(() => this.narrator.say(ok ? praise : "Yana bir o'ylab ko'ring!", { pitch: 1.1 }), 80);
            }
            if (ok && this.active && this.settings.auto && this.waiting === v) {
                this.waiting = null;
                this.advanceTimer = setTimeout(() => this.advance(), 1700);
            }
            this.update();
        }

        onWord(el) {
            el.classList.remove('w--tap');
            void el.offsetWidth;
            el.classList.add('w--tap');
            setTimeout(() => el.classList.remove('w--tap'), 700);
            if (this.active || this.narrator.state !== 'idle') return;
            let text = el.textContent.replace(/[«»"“”.,!?;:()…—]/g, '').trim();
            if (el.classList.contains('w--vocab')) {
                const p = this.book.story.pages[this.book.view - 1];
                if (p && p.word) text = `${p.word[0]}. ${p.word[1]}`;
            }
            if (!this.narrator.say(text, { slow: true })) this.noVoiceToast();
        }

        onSayCard() {
            const p = this.book.story.pages[this.book.view - 1];
            if (!p || !p.word || this.active) return;
            if (!this.narrator.say(`Yangi so'z: ${p.word[0]}. ${p.word[1]}`)) this.noVoiceToast();
        }

        noVoiceToast() {
            if (!this.narrator.canSpeak()) this.ui.toast("🔇 Bu qurilmada o'zbekcha ovoz topilmadi (⚙️)");
        }

        onNarratorError(reason) {
            if (reason === 'error') {
                this.active = false;
                this.update();
                this.ui.toast("Ovoz ishlamadi — ⚙️ da boshqa ovozni tanlab ko'ring");
            }
        }

        // ---------- toolbar ----------

        toggleAuto() {
            this.settings.auto = !this.settings.auto;
            this.saveSettings();
            this.ui.toast(this.settings.auto ? "🔁 Sahifalar o'zi varaqlanadi" : "🔁 Avtomatik varaqlash o'chirildi");
            this.update();
            this.renderPanel();
        }

        showFab(on) {
            if (!this.fab) return;
            this.fab.hidden = !on;
            document.body.classList.toggle('fab-on', on);
        }

        update() {
            const b = this.btn;
            if (!b) return;
            const st = this.narrator.state;
            let icon = '▶';
            let label = "O'qib ber";
            let cls = '';
            if (st === 'playing') {
                icon = '⏸';
                label = 'Pauza';
                cls = 'is-playing';
            } else if (st === 'paused') {
                label = 'Davom';
                cls = 'is-paused';
            } else if (this.active) {
                icon = '⏹';
                label = this.waiting != null ? 'Javobni kuting' : "To'xtatish";
                cls = 'is-waiting';
            }
            b.className = `read-btn ${cls}${this.hasFamily ? ' has-family' : ''}`;
            b.setAttribute('aria-pressed', String(st !== 'idle' || this.active));
            b.querySelector('.read-icon').textContent = icon;
            b.querySelector('.read-label').textContent = label;
            if (this.fab) {
                this.fab.firstElementChild.textContent = icon;
                this.fab.setAttribute('aria-label', label);
                this.fab.classList.toggle('is-playing', st === 'playing');
            }
            if (this.autoBtn) this.autoBtn.setAttribute('aria-pressed', String(!!this.settings.auto));
            this.book.el.classList.toggle('is-reading', st === 'playing');
        }

        async refreshFamilyBadge() {
            if (!this.family || !this.book.story || this.book.view < 0) {
                this.hasFamily = false;
            } else {
                this.hasFamily = !!(await this.family.get(this.pageKey()));
            }
            this.update();
        }

        // ---------- settings panel ----------

        openPanel() {
            if (!this.panel) return;
            if (!this.panel.hidden) {
                this.closePanel();
                return;
            }
            this.panel.hidden = false;
            this.renderPanel();
            const btn = document.getElementById('readerSettingsBtn');
            if (btn) btn.setAttribute('aria-expanded', 'true');
        }

        closePanel() {
            if (!this.panel || this.panel.hidden) return;
            this.panel.hidden = true;
            const btn = document.getElementById('readerSettingsBtn');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }

        voiceStatus() {
            const n = this.narrator;
            const v = n.voice;
            const tip = "Eng tabiiy o'zbekcha ovozlar (Madina, Sardor) Microsoft Edge brauzerida bepul. Yoki pastda sahifalarni o'z ovozingiz bilan yozib qo'ying.";
            if (!n.synth) return { cls: 'warn', html: `🔇 Bu brauzerda ovozli o'qish yo'q.<small>${tip}</small>` };
            if (!v) return { cls: 'warn', html: `🔇 Bu qurilmada o'zbekcha (yoki unga yaqin) ovoz topilmadi.<small>${tip}</small>` };
            if (v.lang === 'uz') return { cls: 'ok', html: `✅ ${v.natural ? 'Tabiiy o\'zbekcha' : 'O\'zbekcha'} ovoz: <b>${esc(v.short)}</b>` };
            return { cls: 'warn', html: `⚠️ O'zbekcha ovoz yo'q — <b>${esc(v.short)}</b> (${v.langName}) o'zbekcha talaffuzga moslab o'qiydi.<small>${tip}</small>` };
        }

        async renderPanel() {
            const p = this.panel;
            if (!p || p.hidden) return;
            const token = (this.panelToken = (this.panelToken || 0) + 1);
            const n = this.narrator;
            const view = this.book.story ? this.book.view : -1;
            const key = this.book.story ? this.pageKey(view) : '';
            let hasRec = null;
            let count = 0;
            if (this.family && this.family.supported && this.book.story) {
                [hasRec, count] = await Promise.all([view >= 0 ? this.family.get(key) : null, this.family.keys(`${this.key}:`).then((k) => k.length)]);
            }
            if (token !== this.panelToken || p.hidden) return;
            const status = this.voiceStatus();
            const s = this.settings;
            const voices = n.voices.map((v) => `<option value="${esc(v.id)}"${s.voiceId === v.id ? ' selected' : ''}>${esc(v.short)} — ${v.langName}${v.natural ? ' ✨' : ''}</option>`).join('');
            const speeds = [['slow', '🐢 Sekin'], ['normal', "🙂 O'rtacha"], ['fast', '🐇 Tez']]
                .map(([id, label]) => `<button type="button" data-rp="speed" data-v="${id}" aria-pressed="${s.speed === id}">${label}</button>`).join('');
            const sw = (id, on, label) => `<label class="rp-switch"><input type="checkbox" data-rp="${id}"${on ? ' checked' : ''}><span class="rp-toggle" aria-hidden="true"></span><span>${label}</span></label>`;
            const recording = !!(this.family && this.family.recording);
            let family;
            if (!this.family || !this.family.supported) {
                family = `<p class="rp-note">Bu brauzer ovoz yozishni qo'llab-quvvatlamaydi.</p>`;
            } else if (view < 0) {
                family = `<p class="rp-note">Yozish uchun avval kitobni oching.</p>`;
            } else {
                const where = view === 0 ? 'sarlavha sahifasini' : view > this.book.story.pages.length ? 'yakun sahifasini' : `${view}-sahifani`;
                family = `<div class="rp-row">
                        ${recording
                            ? `<button type="button" class="rp-btn rp-btn--rec is-on" data-rp="rec-stop">⏹ Yozishni tugatish</button>`
                            : `<button type="button" class="rp-btn rp-btn--rec" data-rp="rec-start">🎙 ${where} yozish</button>`}
                        ${hasRec && !recording ? `<button type="button" class="rp-btn" data-rp="rec-play">▶ Tinglash</button><button type="button" class="rp-btn" data-rp="rec-del" aria-label="Yozuvni o'chirish">🗑</button>` : ''}
                    </div>
                    <p class="rp-note">${hasRec ? `✔ Bu sahifa yozilgan (${clock(hasRec.ms || 0)}). ` : ''}Bu kitobda ${count} ta sahifa yozilgan.</p>
                    ${sw('family', s.useFamily, 'Yozilgan ovozni ishlatish')}`;
            }
            p.innerHTML = `
                <div class="rp-head"><h3>🔊 Ovozli o'qish</h3><button type="button" class="rp-close" data-rp="close" aria-label="Yopish">✕</button></div>
                <div class="rp-status rp-status--${status.cls}">${status.html}</div>
                ${n.voices.length ? `<label class="rp-field"><span>Ovoz</span><select data-rp="voice"><option value="auto"${s.voiceId === 'auto' ? ' selected' : ''}>Avtomatik — eng yaxshisi</option>${voices}</select></label>` : ''}
                <div class="rp-field"><span>Tezlik</span><div class="rp-seg">${speeds}</div></div>
                <div class="rp-row"><button type="button" class="rp-btn" data-rp="test"${n.canSpeak() ? '' : ' disabled'}>🔊 Sinab ko'rish</button></div>
                ${sw('characters', s.characters, "🎭 Qahramonlar ovozi — so'zlashuvlar boshqa ohangda")}
                ${sw('auto', s.auto, "🔁 O'qib bo'lgach, sahifani o'zi varaqlasin")}
                ${sw('feedback', s.feedback, '💬 Javoblarga ovozli maqtov')}
                <section class="rp-family">
                    <h4>👵 Oila ovozi</h4>
                    <p>Sahifani o'z ovozingiz bilan yozib qo'ying — bolajon ertakni sizning ovozingizda tinglaydi. Yozuvlar faqat shu qurilmada saqlanadi.</p>
                    ${family}
                </section>`;
        }

        onPanelClick(e) {
            const b = e.target.closest('[data-rp]');
            if (!b || b.tagName === 'INPUT' || b.tagName === 'SELECT') return;
            const act = b.dataset.rp;
            if (act === 'close') this.closePanel();
            else if (act === 'speed') {
                this.settings.speed = b.dataset.v;
                this.saveSettings();
                this.renderPanel();
            } else if (act === 'test') {
                if (this.narrator.state !== 'idle') this.stop();
                this.narrator.say("Salom, bolajonlar! Keling, birga ertak o'qiymiz.");
            } else if (act === 'rec-start') this.startRecording();
            else if (act === 'rec-stop') this.stopRecording();
            else if (act === 'rec-play') {
                this.closePanel();
                this.stop();
                this.forceFamily = true;
                this.start();
            } else if (act === 'rec-del') this.deleteRecording();
        }

        onPanelChange(e) {
            const el = e.target;
            const act = el.dataset.rp;
            if (act === 'voice') this.settings.voiceId = el.value;
            else if (act === 'characters') this.settings.characters = el.checked;
            else if (act === 'auto') this.settings.auto = el.checked;
            else if (act === 'feedback') this.settings.feedback = el.checked;
            else if (act === 'family') this.settings.useFamily = el.checked;
            else return;
            this.saveSettings();
            this.update();
            if (act === 'voice') this.renderPanel();
        }

        // ---------- family recording ----------

        async startRecording() {
            if (!this.family || !this.family.supported || this.family.recording) return;
            const view = this.book.view;
            if (view < 0) return;
            this.stop();
            const key = this.pageKey(view);
            try {
                await this.family.start((ms) => this.updatePill(ms), () => this.stopRecording());
            } catch (e) {
                this.ui.toast('🎙 Mikrofonga ruxsat berilmadi');
                return;
            }
            this.recKey = key;
            this.updatePill(0);
            if (this.pill) this.pill.hidden = false;
            this.renderPanel();
        }

        updatePill(ms) {
            if (!this.pill) return;
            this.pill.innerHTML = `<span class="rec-dot"></span><b>Yozilmoqda ${clock(ms)}</b><span class="rec-hint">Sahifani ovoz chiqarib o'qing</span><button type="button" data-rec-stop>⏹ Tugatish</button>`;
        }

        async stopRecording() {
            const key = this.recKey;
            this.recKey = null;
            const rec = await this.family.stop();
            if (this.pill) this.pill.hidden = true;
            if (rec && key) {
                try {
                    await this.family.put(key, rec);
                    this.ui.toast(`✔ Ovozingiz saqlandi (${clock(rec.ms)})`);
                } catch (e) {
                    this.ui.toast("Yozuvni saqlab bo'lmadi");
                }
            }
            this.refreshFamilyBadge();
            this.renderPanel();
        }

        async deleteRecording() {
            await this.family.remove(this.pageKey());
            this.ui.toast('🗑 Yozuv o\'chirildi');
            this.refreshFamilyBadge();
            this.renderPanel();
        }
    }

    root.ReadAloud = ReadAloud;
})(window);
