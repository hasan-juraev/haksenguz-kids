/*
 * Studio: where grown-ups record a book aloud, page by page.
 *
 * A narrator (or a grandparent) picks their voice, reads each page — the
 * title, then the text, with a short pause between sentences — and sends the
 * whole book as one voice-pack file (Voices.exportPack) through the phone's
 * share sheet, e.g. to Telegram. Packs received that way are added here too.
 * A small sum keeps young children out (gate()).
 */
(function (root) {
    'use strict';

    const AVATARS = ['👵', '👴', '👩', '👨', '🧕', '👧', '👦', '🎙️'];
    const GATE_MINUTES = 15;
    const MAX_SECONDS = 180;

    const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
    const $ = (id) => document.getElementById(id);
    const clock = (sec) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;

    function download(file) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            URL.revokeObjectURL(a.href);
            a.remove();
        }, 1000);
    }

    // Hands a voice pack to the share sheet (Telegram etc.), or downloads it.
    async function share(file, text) {
        if (root.navigator.canShare && root.navigator.canShare({ files: [file] })) {
            try {
                await root.navigator.share({ files: [file], title: file.name, text });
                return;
            } catch (e) {
                if (e.name === 'AbortError') return;
            }
        }
        download(file);
    }

    class Studio {
        constructor(app) {
            this.app = app;
            this.key = null;
            this.story = null;
            this.page = 1;
            this.voice = null;
            this.recorded = new Set();
            this.recorder = null;
            this.recording = false;
            this.busy = false;
            this.player = new root.Narrator.Player();
            this.editing = null;
            this.pickedAvatar = AVATARS[0];
            this.gateUntil = 0;

            $('studioDots').addEventListener('click', (e) => {
                const dot = e.target.closest('[data-page]');
                if (dot) this.goTo(+dot.dataset.page);
            });
            $('voiceList').addEventListener('click', (e) => this.onVoiceListClick(e));
            $('voiceAvatars').addEventListener('click', (e) => {
                const b = e.target.closest('[data-avatar]');
                if (!b) return;
                this.pickedAvatar = b.dataset.avatar;
                this.renderAvatars();
            });
            $('voiceImport').addEventListener('change', (e) => this.importFile(e.target.files[0]));
            const modal = $('voiceModal');
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeVoices();
            });
        }

        // ---------- grown-ups gate ----------

        gate(then) {
            if (Date.now() < this.gateUntil) {
                then();
                return;
            }
            this.afterGate = then;
            this.newSum();
            $('gateModal').classList.remove('hidden');
            $('gateAnswer').focus();
        }

        newSum() {
            this.sum = [3 + Math.floor(Math.random() * 7), 3 + Math.floor(Math.random() * 7)];
            $('gateQuestion').textContent = `${this.sum[0]} × ${this.sum[1]} = ?`;
            $('gateAnswer').value = '';
        }

        checkGate(e) {
            e.preventDefault();
            if (+$('gateAnswer').value === this.sum[0] * this.sum[1]) {
                this.gateUntil = Date.now() + GATE_MINUTES * 60 * 1000;
                this.closeGate();
                if (this.afterGate) this.afterGate();
                return;
            }
            $('gateHint').textContent = "Yana bir urinib ko'ring";
            this.newSum();
            $('gateAnswer').focus();
        }

        closeGate() {
            $('gateModal').classList.add('hidden');
            $('gateHint').textContent = '';
        }

        // ---------- studio view ----------

        async open(key, view) {
            this.key = key;
            this.story = this.app.db[key];
            this.page = Math.min(Math.max(view || 1, 1), this.story.pages.length);
            this.voice = null;
            this.recorded = new Set();
            this.status('');
            this.app.show('studioView');
            const voices = (await root.Voices.list()).filter((v) => !v.builtin);
            const last = voices.find((v) => v.id === this.app.store.settings.recVoice);
            if (last) await this.useVoice(last);
            else this.render();
            if (!last) this.openVoices();
        }

        // Leaving the studio: nothing keeps recording or playing.
        close() {
            if (this.recorder) this.recorder.cancel();
            this.recorder = null;
            this.recording = false;
            this.busy = false;
            clearTimeout(this.limit);
            this.player.stop();
        }

        async useVoice(v) {
            this.voice = v;
            this.app.store.setSetting('recVoice', v.id);
            this.recorded = new Set(await root.Voices.pages(v.id, this.key));
            this.render();
        }

        segments() {
            return root.BookEngine.segments(this.story.pages[this.page - 1]);
        }

        render() {
            const st = this.story;
            const n = st.pages.length;
            const p = st.pages[this.page - 1];
            $('studioBook').textContent = st.title;
            $('studioVoiceAvatar').textContent = this.voice ? this.voice.avatar : '🎙️';
            $('studioVoiceName').textContent = this.voice ? this.voice.name : 'Ovoz tanlang';
            $('studioArt').innerHTML = root.Art ? root.Art.render(p.scene, { still: true, seed: `${this.key}:${this.page}:studio` }) : '';
            $('studioPageNo').textContent = `${this.page} / ${n} sahifa`;
            $('studioText').innerHTML = this.segments().map((t, i) => i === 0
                ? `<li data-seg="0" class="px-2 py-1 font-bold text-xl text-amber-900">${esc(t)}</li>`
                : `<li data-seg="${i}" class="px-2 py-1 text-gray-800"><span class="studio-num">${i}</span>${esc(t)}</li>`).join('');
            $('studioDots').innerHTML = st.pages.map((_, i) => {
                const k = i + 1;
                const cls = ['studio-dot', this.recorded.has(k) ? 'is-done' : '', k === this.page ? 'is-current' : ''].join(' ');
                return `<button type="button" class="${cls}" data-page="${k}" aria-label="${k}-sahifa${this.recorded.has(k) ? ' (yozilgan)' : ''}"${k === this.page ? ' aria-current="true"' : ''}>${k}</button>`;
            }).join('');
            $('studioPrev').disabled = this.page <= 1 || this.recording;
            $('studioNext').disabled = this.page >= n || this.recording;
            $('studioCount').textContent = `${this.recorded.size} / ${n} sahifa yozildi`;
            $('studioSend').disabled = !this.recorded.size || this.recording;
            this.renderButtons();
        }

        renderButtons() {
            const has = this.recorded.has(this.page);
            const btn = $('recBtn');
            btn.classList.toggle('is-recording', this.recording);
            btn.disabled = this.busy || !this.voice;
            btn.setAttribute('aria-label', this.recording ? "Yozishni to'xtatish" : 'Yozishni boshlash');
            $('recIcon').className = this.recording ? 'fa-solid fa-stop' : 'fa-solid fa-microphone';
            $('recTools').classList.toggle('hidden', !has || this.recording || this.busy);
            $('recPlay').innerHTML = this.player.playing
                ? `<i class="fa-solid fa-pause"></i> To'xtatish`
                : `<i class="fa-solid fa-play"></i> Tinglab ko'rish`;
            if (!this.recording && !this.busy && !this.statusText) {
                $('recStatus').textContent = !this.voice
                    ? 'Avval ovozni tanlang'
                    : has ? '✓ Bu sahifa yozilgan' : 'Qizil tugmani bosing va sahifani o\'qing';
            }
        }

        status(text) {
            this.statusText = text;
            $('recStatus').textContent = text;
        }

        goTo(page) {
            if (this.recording || this.busy) return;
            this.player.stop();
            this.page = Math.min(Math.max(page, 1), this.story.pages.length);
            this.status('');
            this.render();
        }

        go(delta) {
            this.goTo(this.page + delta);
        }

        async toggleRecord() {
            if (this.busy) return;
            if (!this.voice) {
                this.openVoices();
                return;
            }
            if (this.recording) {
                this.finish();
                return;
            }
            if (!root.Narrator.Recorder.supported()) {
                this.status("Bu brauzerda ovoz yozib bo'lmaydi. Telefoningizdagi Chrome yoki Safari'da oching.");
                return;
            }
            if (this.recorded.has(this.page) && !root.confirm(this.app.tx("Bu sahifa yozilgan. Qaytadan yozasizmi?"))) return;
            this.player.stop();
            this.hl(-1);
            // busy while the microphone opens (a permission prompt may be up): no second recorder
            this.busy = true;
            this.renderButtons();
            const recorder = this.recorder = new root.Narrator.Recorder();
            try {
                await recorder.start((level, sec) => {
                    $('recRing').style.transform = `scale(${(1 + level * 0.7).toFixed(3)})`;
                    $('recStatus').textContent = `🔴 ${clock(sec)} — o'qing...`;
                    if (sec > MAX_SECONDS) this.finish();
                });
            } catch (e) {
                this.recorder = null;
                this.busy = false;
                this.status('Mikrofonga ruxsat bering va qaytadan bosing.');
                this.renderButtons();
                return;
            }
            this.busy = false;
            if (this.recorder !== recorder) {
                recorder.cancel(); // the studio was left while the microphone was opening
                return;
            }
            this.recording = true;
            this.statusText = 'recording';
            this.render();
        }

        async finish() {
            if (!this.recording) return;
            this.recording = false;
            this.busy = true;
            $('recRing').style.transform = '';
            this.status('Saqlanmoqda...');
            this.render();
            const page = this.page;
            try {
                const r = await this.recorder.stop();
                if (r.duration < 1) {
                    this.status('Juda qisqa chiqdi. Qaytadan yozing.');
                    return;
                }
                const segs = this.segments();
                await root.Voices.saveClip({
                    voice: this.voice.id,
                    book: this.key,
                    page,
                    blob: r.blob,
                    mime: r.mime,
                    duration: Math.round(r.duration * 100) / 100,
                    marks: root.Narrator.marks(r.energies, segs.map((s) => s.length)),
                    sig: root.Narrator.sig(segs),
                    created: Date.now(),
                });
                this.recorded.add(page);
                this.status(page < this.story.pages.length ? "✓ Saqlandi. Tinglab ko'ring yoki keyingi sahifaga o'ting." : "✓ Saqlandi. Kitob tugadi — endi uni yuboring!");
            } catch (e) {
                this.status("Yozib bo'lmadi. Qaytadan urinib ko'ring.");
            } finally {
                this.recorder = null;
                this.busy = false;
                this.render();
            }
        }

        // Plays back this page with its sentences lit up, as the child will hear it.
        async preview() {
            if (this.player.playing) {
                this.player.stop();
                this.hl(-1);
                this.renderButtons();
                return;
            }
            this.player.unlock();
            const clip = await root.Voices.clip(this.voice.id, this.key, this.page);
            if (!clip) return;
            this.player.play(clip, {
                onSeg: (i) => this.hl(i),
                onEnd: () => {
                    this.hl(-1);
                    this.renderButtons();
                },
            });
            this.renderButtons();
        }

        hl(i) {
            const list = $('studioText');
            const cur = list.querySelector('.is-reading');
            const want = i >= 0 ? list.querySelector(`[data-seg="${i}"]`) : null;
            if (cur === want) return;
            if (cur) cur.classList.remove('is-reading');
            if (want) want.classList.add('is-reading');
        }

        async remove() {
            if (!root.confirm(this.app.tx(`${this.page}-sahifadagi yozuv o'chirilsinmi?`))) return;
            this.player.stop();
            await root.Voices.deleteClip(this.voice.id, this.key, this.page);
            this.recorded.delete(this.page);
            this.status('');
            this.render();
        }

        async send() {
            if (!this.voice || !this.recorded.size) return;
            const file = await root.Voices.exportPack(this.voice.id, this.key);
            await share(file, `${this.voice.avatar} ${this.voice.name}: «${this.story.title}»`);
        }

        // ---------- voices ----------

        async openVoices() {
            this.editing = null;
            $('voiceTitle').textContent = 'Kimning ovozi?';
            $('voiceForm').classList.add('hidden');
            $('voicePick').classList.remove('hidden');
            $('voiceNote').textContent = '';
            const voices = (await root.Voices.list()).filter((v) => !v.builtin);
            this.voices = voices;
            $('voiceList').innerHTML = voices.map((v) => {
                const on = this.voice && v.id === this.voice.id;
                return `<div class="relative">
                    <button type="button" data-use="${esc(v.id)}"${on ? ' aria-current="true"' : ''} class="w-full min-h-[104px] p-3 rounded-2xl border-2 ${on ? 'border-rose-400 bg-rose-50' : 'border-orange-100 bg-white hover:bg-orange-50'} flex flex-col items-center justify-center gap-1 transition">
                        <span class="text-4xl leading-none" aria-hidden="true">${esc(v.avatar)}</span>
                        <span class="font-bold text-gray-800 truncate max-w-full">${esc(v.name)}</span>
                    </button>
                    <button type="button" data-edit="${esc(v.id)}" aria-label="${esc(v.name)}: tahrirlash" class="absolute top-1.5 right-1.5 w-9 h-9 rounded-xl bg-white/90 text-gray-500 hover:text-rose-600 shadow-sm transition">
                        <i class="fa-solid fa-pen text-xs"></i>
                    </button>
                </div>`;
            }).join('') + `<button type="button" data-add="1" class="min-h-[104px] p-3 rounded-2xl border-2 border-dashed border-rose-200 text-rose-700 hover:bg-rose-50 flex flex-col items-center justify-center gap-1 font-bold transition">
                    <span class="text-3xl leading-none" aria-hidden="true">＋</span><span>Yangi ovoz</span>
                </button>`;
            $('voiceModal').classList.remove('hidden');
        }

        closeVoices() {
            $('voiceModal').classList.add('hidden');
            this.editing = null;
        }

        onVoiceListClick(e) {
            const b = e.target.closest('button');
            if (!b) return;
            if (b.dataset.use) {
                const v = this.voices.find((x) => x.id === b.dataset.use);
                this.closeVoices();
                this.player.stop();
                this.status('');
                this.useVoice(v);
            } else if (b.dataset.edit) {
                this.editVoice(this.voices.find((x) => x.id === b.dataset.edit));
            } else if (b.dataset.add) {
                this.editVoice(null);
            }
        }

        editVoice(v) {
            this.editing = v ? v.id : 'new';
            const taken = new Set((this.voices || []).map((x) => x.avatar));
            this.pickedAvatar = v ? v.avatar : AVATARS.find((a) => !taken.has(a)) || AVATARS[0];
            $('voiceTitle').textContent = v ? 'Ovozni tahrirlash' : 'Yangi ovoz';
            $('voicePick').classList.add('hidden');
            $('voiceForm').classList.remove('hidden');
            $('voiceName').value = v ? v.name : '';
            $('voiceEditTools').classList.toggle('hidden', !v);
            this.renderAvatars();
            $('voiceName').focus();
        }

        renderAvatars() {
            $('voiceAvatars').innerHTML = AVATARS.map((a) => {
                const on = a === this.pickedAvatar;
                return `<button type="button" data-avatar="${a}" aria-pressed="${on}" class="min-h-[56px] text-3xl rounded-2xl border-2 ${on ? 'border-rose-400 bg-rose-50' : 'border-orange-100 hover:bg-orange-50'} transition">${a}</button>`;
            }).join('');
        }

        async saveVoice(e) {
            e.preventDefault();
            const name = $('voiceName').value.trim();
            if (!name) return;
            let v;
            if (this.editing === 'new') v = await root.Voices.createVoice(name, this.pickedAvatar);
            else v = await root.Voices.updateVoice(this.editing, { name, avatar: this.pickedAvatar });
            this.closeVoices();
            if (v) await this.useVoice(v);
        }

        async deleteVoice() {
            const v = (this.voices || []).find((x) => x.id === this.editing);
            if (!v || !root.confirm(this.app.tx(`${v.name} ovozi va uning barcha yozuvlari o'chirilsinmi?`))) return;
            await root.Voices.deleteVoice(v.id);
            if (this.voice && this.voice.id === v.id) {
                this.voice = null;
                this.recorded = new Set();
                this.render();
            }
            this.openVoices();
        }

        // Every book this voice has recorded, in one file.
        async sendAll() {
            const v = (this.voices || []).find((x) => x.id === this.editing);
            if (!v) return;
            await share(await root.Voices.exportPack(v.id), `${v.avatar} ${v.name}`);
        }

        async importFile(file) {
            $('voiceImport').value = '';
            if (!file) return;
            try {
                const { voice, count, unplayable } = await root.Voices.importPack(file);
                await this.openVoices();
                $('voiceNote').textContent = `✓ ${voice.avatar} ${voice.name}: ${count} ta sahifa qo'shildi.` +
                    (unplayable ? " Diqqat: bu telefon bu yozuvlarni o'qiy olmasligi mumkin." : '');
                if (this.voice && this.voice.id === voice.id) await this.useVoice(voice);
            } catch (e) {
                $('voiceNote').textContent = "Bu fayl ertak ovozi emas. Telegram'dagi .json faylni tanlang.";
            }
        }
    }

    root.Studio = Studio;
})(window);
