/*
 * AppController: library, story view, points, sounds and the final quiz.
 * The book itself (pages, turning, covers) lives in js/book.js.
 */
(function (root) {
    'use strict';

    const CATEGORIES = ['all', 'folk', 'classic', 'navoiy', 'modern'];
    const DEFAULT_QUIZ = {
        q: "Kitobdan olgan xulosangiz qanday?",
        a: ["Ezgulik, ilm, birdamlik va halollik har doim g'alaba qozonadi ✨", "Dangasalik va yomon niyatlar hamisha mukofotlanadi 💤", "Faqat yolg'izlik va janjallashish yaxshi natija beradi 🍃"],
        ok: 0
    };

    const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

    class AppController {
        constructor() {
            this.db = root.storiesDatabase || {};
            this.currentStoryKey = null;
            this.currentStoryObj = null;
            this.points = 150;
            this.isCyrillic = false;
            this.activeCategory = 'all';
            this.soundEnabled = true;
            this.audioCtx = null;

            this.book = new root.BookEngine(document.getElementById('book'), {
                onChange: (s) => this.updateControls(s),
                onTurnStart: (t) => this.playPageTurnSound(t.cover ? 'cover' : 'page'),
                onAnswer: (ok, praise) => this.onAnswer(ok, praise),
                onAction: (act) => this.onBookAction(act),
                onPoke: () => this.playChime(),
            });

            document.addEventListener('keydown', (e) => this.onKey(e));
            this.renderHero();
            this.updateCategoryLabels();
            this.initLibrary();
        }

        // ---------- library ----------

        renderHero() {
            const hero = document.getElementById('heroArt');
            const z = this.db.zumrad;
            if (hero && z && root.Art) hero.innerHTML = root.Art.render(z.cover || z.pages[0].scene, { still: false, seed: 'hero' });
        }

        updateCategoryLabels() {
            const keys = Object.keys(this.db);
            CATEGORIES.forEach((c) => {
                const btn = document.getElementById(`cat-${c}`);
                if (!btn) return;
                const n = c === 'all' ? keys.length : keys.filter((k) => this.db[k].category === c).length;
                const label = btn.textContent.replace(/\s*\(\d+\)$/, '').trim();
                btn.textContent = `${label} (${n})`;
            });
        }

        initLibrary() {
            const grid = document.getElementById('libraryGrid');
            grid.innerHTML = '';
            const keys = Object.keys(this.db).filter((k) => this.activeCategory === 'all' || this.db[k].category === this.activeCategory);
            keys.forEach((key) => {
                const item = this.db[key];
                const card = document.createElement('button');
                card.type = 'button';
                card.className = 'bg-white p-3 rounded-2xl shadow-sm hover:shadow-lg transition border border-orange-100 cursor-pointer flex space-x-4 items-center group text-left w-full';
                card.onclick = () => this.startStory(key);
                const scene = item.cover || item.pages[0].scene;
                const art = root.Art ? root.Art.render(scene, { still: true, seed: key + ':thumb' }) : '';
                card.innerHTML = `
                    <div class="thumb-art w-24 h-24 rounded-2xl flex-shrink-0 shadow-md group-hover:scale-105 transition" style="box-shadow:0 0 0 3px ${item.hue || '#f59e0b'}">${art}</div>
                    <div class="overflow-hidden space-y-1">
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="text-[11px] font-bold text-brand-700 bg-orange-100 px-2 py-0.5 rounded-lg">${esc(item.tag.split('•')[0].trim())}</span>
                            ${item.isNew ? '<span class="text-[11px] font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-lg">Yangi</span>' : ''}
                        </div>
                        <h4 class="font-bold text-gray-800 text-base leading-snug">${esc(item.title)}</h4>
                        <p class="text-xs text-gray-500">📄 ${item.pages.length} sahifali rasmli kitob</p>
                    </div>`;
                grid.appendChild(card);
            });
            const heading = document.getElementById('libraryHeading');
            if (heading) heading.textContent = `${keys.length} ta interaktiv kitob`;
        }

        filterCategory(cat) {
            this.activeCategory = cat;
            CATEGORIES.forEach((c) => {
                const btn = document.getElementById(`cat-${c}`);
                if (!btn) return;
                btn.className = c === cat
                    ? 'px-4 py-2 bg-brand-500 text-white text-sm font-bold rounded-xl shadow-sm whitespace-nowrap transition'
                    : 'px-4 py-2 bg-white text-gray-600 hover:bg-brand-50 text-sm font-bold rounded-xl border border-orange-100 whitespace-nowrap transition';
            });
            this.initLibrary();
        }

        show(view) {
            ['homeView', 'storyView', 'gameView'].forEach((id) => document.getElementById(id).classList.toggle('hidden', id !== view));
            root.scrollTo({ top: 0 });
        }

        goHome() {
            this.book.stopTurn();
            this.show('homeView');
        }

        startStory(storyKey) {
            if (!this.db[storyKey]) return;
            this.currentStoryKey = storyKey;
            this.currentStoryObj = this.db[storyKey];
            this.show('storyView');
            this.book.load(storyKey, this.currentStoryObj);
        }

        backToBook() {
            this.show('storyView');
        }

        // ---------- navigation ----------

        nextPage() {
            if (this.book.isBusy()) return;
            const s = this.book.state();
            if (s.end) {
                this.startMiniGame();
                return;
            }
            this.book.next();
        }

        prevPage() {
            this.book.prev();
        }

        onKey(e) {
            if (document.getElementById('storyView').classList.contains('hidden')) return;
            if (!document.getElementById('infoModal').classList.contains('hidden')) {
                if (e.key === 'Escape' || e.key === 'Enter') this.closeModal();
                return;
            }
            if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
            if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                e.preventDefault();
                this.nextPage();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                e.preventDefault();
                this.prevPage();
            }
        }

        updateControls(s) {
            const total = s.pages;
            let label;
            if (s.closed) label = 'Muqova';
            else if (s.view <= 0) label = 'Sarlavha';
            else if (s.end) label = 'Tamom';
            else label = `Sahifa ${s.view} / ${total}`;
            const pct = s.end ? 100 : Math.max(0, Math.min(100, (Math.max(0, s.view) / total) * 100));
            document.getElementById('storyProgressBar').style.width = `${pct}%`;
            document.getElementById('storyProgressText').textContent = s.view >= 1 && !s.end ? `${s.view} / ${total} sahifa` : label;
            document.getElementById('bookPageIndicator').textContent = label;
            document.getElementById('prevPageBtn').disabled = !s.canPrev;
            const next = document.getElementById('nextPageBtn');
            if (s.closed) next.innerHTML = `<span>Kitobni ochish</span> <i class="fa-solid fa-book-open"></i>`;
            else if (s.end) next.innerHTML = `<span>Bilimdon Testi</span> <i class="fa-solid fa-award"></i>`;
            else next.innerHTML = `<span>Keyingi</span> <i class="fa-solid fa-chevron-right"></i>`;
        }

        onBookAction(act) {
            if (act === 'quiz') this.startMiniGame();
            else if (act === 'restart') this.book.goTo(this.book.spread ? 0 : 1);
        }

        // ---------- points & feedback ----------

        addPoints(n) {
            this.points += n;
            document.getElementById('userPoints').innerText = `${this.points} ball`;
        }

        onAnswer(ok, praise) {
            if (ok) {
                this.addPoints(10);
                this.toast(`⭐ ${praise} +10 ball`);
                this.playChime(true);
            } else {
                this.toast("🤔 Yana bir o'ylab ko'ring!");
            }
        }

        toast(msg) {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.style.opacity = '1';
            clearTimeout(this.toastTimer);
            this.toastTimer = setTimeout(() => { t.style.opacity = '0'; }, 1800);
        }

        // ---------- sound ----------

        ctx() {
            if (!this.soundEnabled) return null;
            try {
                if (!this.audioCtx) this.audioCtx = new (root.AudioContext || root.webkitAudioContext)();
                if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
                return this.audioCtx;
            } catch (e) {
                return null;
            }
        }

        // Procedural paper sound: filtered noise whose band sweeps down like a
        // sheet swishing past; the cover gets a lower, heavier thump.
        playPageTurnSound(kind = 'page') {
            const ac = this.ctx();
            if (!ac) return;
            try {
                const dur = kind === 'cover' ? 0.5 : 0.38;
                const len = Math.floor(ac.sampleRate * dur);
                const buf = ac.createBuffer(1, len, ac.sampleRate);
                const data = buf.getChannelData(0);
                for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
                const src = ac.createBufferSource();
                src.buffer = buf;
                const bp = ac.createBiquadFilter();
                bp.type = 'bandpass';
                const t = ac.currentTime;
                bp.frequency.setValueAtTime(kind === 'cover' ? 900 : 2600, t);
                bp.frequency.exponentialRampToValueAtTime(kind === 'cover' ? 180 : 700, t + dur);
                bp.Q.value = 1.4;
                const g = ac.createGain();
                g.gain.setValueAtTime(0.0001, t);
                g.gain.exponentialRampToValueAtTime(kind === 'cover' ? 0.45 : 0.3, t + 0.06);
                g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
                src.connect(bp).connect(g).connect(ac.destination);
                src.start();
            } catch (e) {
                /* audio is optional */
            }
        }

        playChime(happy) {
            const ac = this.ctx();
            if (!ac) return;
            try {
                const notes = happy ? [660, 880, 1320] : [880, 1175];
                notes.forEach((f, i) => {
                    const o = ac.createOscillator();
                    const g = ac.createGain();
                    const t = ac.currentTime + i * 0.09;
                    o.type = 'triangle';
                    o.frequency.value = f;
                    g.gain.setValueAtTime(0.0001, t);
                    g.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
                    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
                    o.connect(g).connect(ac.destination);
                    o.start(t);
                    o.stop(t + 0.32);
                });
            } catch (e) {
                /* audio is optional */
            }
        }

        toggleSoundEffects() {
            this.soundEnabled = !this.soundEnabled;
            const btn = document.getElementById('soundToggleBtn');
            btn.setAttribute('aria-pressed', String(this.soundEnabled));
            btn.innerHTML = this.soundEnabled
                ? `<i class="fa-solid fa-volume-high"></i> <span class="hidden md:inline">Varaqlash Ovozi: Yoqilgan</span>`
                : `<i class="fa-solid fa-volume-xmark"></i> <span class="hidden md:inline">Varaqlash Ovozi: O'chiq</span>`;
            btn.className = this.soundEnabled
                ? 'px-3 py-2 bg-amber-100 text-amber-800 rounded-xl font-bold text-xs transition flex items-center space-x-1.5'
                : 'px-3 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold text-xs transition flex items-center space-x-1.5';
        }

        triggerAiVoice() {
            this.showModal("🤖 AI Natural Voice", "Sun'iy intellekt orqali mazkur sahifa bolajonlar uchun tabiiy ohangda o'qib berilmoqda...");
        }

        // ---------- final quiz ----------

        startMiniGame() {
            const quiz = (this.currentStoryObj && this.currentStoryObj.quiz) || DEFAULT_QUIZ;
            this.show('gameView');
            document.getElementById('gameQuestion').textContent = quiz.q;
            const container = document.getElementById('gameOptionsContainer');
            container.innerHTML = '';
            const options = quiz.a.map((text, i) => ({ text, correct: i === quiz.ok }));
            options.sort(() => Math.random() - 0.5);
            options.forEach((opt) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'w-full min-h-[48px] p-4 rounded-2xl bg-white hover:bg-emerald-50 border-2 border-orange-100 hover:border-emerald-400 text-gray-800 font-bold transition text-left flex items-center justify-between shadow-sm';
                btn.innerHTML = `<span>${esc(opt.text)}</span> <i class="fa-solid fa-circle-question text-gray-400"></i>`;
                btn.onclick = () => {
                    if (opt.correct) {
                        this.addPoints(50);
                        this.playChime(true);
                        this.showModal('Tabriklaymiz! 🎉', "Siz to'g'ri xulosa topdingiz va 50 ball qo'shildi!");
                        setTimeout(() => {
                            this.closeModal();
                            this.goHome();
                        }, 2200);
                    } else {
                        this.showModal("Boshqatdan urinib ko'ring! 💪", "Bu xulosa asar g'oyasiga mos kelmaydi.");
                    }
                };
                container.appendChild(btn);
            });
        }

        toggleScript() {
            this.isCyrillic = !this.isCyrillic;
            const btn = document.getElementById('scriptToggleBtn');
            btn.innerText = this.isCyrillic ? "🇷🇺 Кирилл / Lotin" : "🇺🇿 Lotin / Кирилл";
            this.showModal("Grafik Almashtirildi", this.isCyrillic ? "Matnlar Kirill yozuviga moslashtirildi." : "Matnlar Lotin yozuviga moslashtirildi.");
        }

        showModal(title, desc) {
            document.getElementById('modalTitle').innerText = title;
            document.getElementById('modalDesc').innerText = desc;
            document.getElementById('infoModal').classList.remove('hidden');
        }

        closeModal() {
            document.getElementById('infoModal').classList.add('hidden');
        }
    }

    root.AppController = AppController;
    root.app = new AppController();
})(window);
