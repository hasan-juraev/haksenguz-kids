/*
 * AppController: library, story view, profiles, points, sounds and the final quiz.
 * The book itself (pages, turning, covers) lives in js/book.js; what is
 * remembered between visits (per child) lives in js/store.js.
 */
(function (root) {
    'use strict';

    const CATEGORIES = ['all', 'folk', 'classic', 'navoiy', 'modern'];
    const DEFAULT_QUIZ = {
        q: "Kitobdan olgan xulosangiz qanday?",
        a: ["Ezgulik, ilm, birdamlik va halollik har doim g'alaba qozonadi ✨", "Dangasalik va yomon niyatlar hamisha mukofotlanadi 💤", "Faqat yolg'izlik va janjallashish yaxshi natija beradi 🍃"],
        ok: 0
    };
    const ANSWER_POINTS = 10;
    const QUIZ_POINTS = 50;

    const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

    class AppController {
        constructor() {
            this.db = root.storiesDatabase || {};
            this.store = new root.Store();
            this.currentStoryKey = null;
            this.currentStoryObj = null;
            this.activeCategory = 'all';
            this.soundEnabled = this.store.settings.sound !== false;
            this.audioCtx = null;
            this.heroKey = null;
            this.editingProfile = null;
            this.pickedAvatar = null;

            this.book = new root.BookEngine(document.getElementById('book'), {
                onChange: (s) => {
                    this.updateControls(s);
                    this.saveProgress(s);
                },
                onTurnStart: (t) => this.playPageTurnSound(t.cover ? 'cover' : 'page'),
                onAnswer: (ok, praise) => this.onAnswer(ok, praise),
                onAction: (act) => this.onBookAction(act),
                onPoke: () => this.playChime(),
                decorate: (box) => root.Translit && root.Translit.apply(box),
            });

            document.addEventListener('keydown', (e) => this.onKey(e));
            document.getElementById('profileList').addEventListener('click', (e) => this.onProfileListClick(e));
            document.getElementById('avatarPicker').addEventListener('click', (e) => this.onAvatarClick(e));
            const profileModal = document.getElementById('profileModal');
            profileModal.addEventListener('click', (e) => {
                if (e.target === profileModal) this.closeProfiles();
            });

            if (root.Translit) root.Translit.setMode(this.store.settings.script);
            this.renderScriptBtn();
            this.renderSoundBtn();
            this.updateCategoryLabels();
            this.refreshProfile();
        }

        // Everything on screen that depends on who is reading.
        refreshProfile() {
            const p = this.store.profile();
            document.getElementById('profileAvatar').textContent = p.avatar;
            document.getElementById('profileName').textContent = p.name;
            document.getElementById('userPoints').textContent = `${p.points} ball`;
            this.renderHero();
            this.initLibrary();
        }

        // ---------- library ----------

        // The hero offers the book this child is in the middle of, if any.
        renderHero() {
            const p = this.store.profile();
            const rec = p.last && this.db[p.last] ? p.books[p.last] : null;
            this.heroKey = rec && rec.page >= 1 ? p.last : null;
            const story = this.db[this.heroKey || 'zumrad'];
            const hero = document.getElementById('heroArt');
            if (hero && story && root.Art) hero.innerHTML = root.Art.render(story.cover || story.pages[0].scene, { still: false, seed: 'hero:' + (this.heroKey || 'zumrad') });
            document.getElementById('heroBtnLabel').textContent = this.heroKey ? 'Davom ettirish' : 'Kitobni Ochish';
            const caption = document.getElementById('heroResume');
            caption.textContent = this.heroKey ? `📖 ${story.title} · ${rec.page} / ${story.pages.length}` : '';
            caption.classList.toggle('hidden', !this.heroKey);
        }

        openHeroBook() {
            if (this.heroKey) this.startStory(this.heroKey, true);
            else this.startStory('zumrad');
        }

        updateCategoryLabels() {
            const keys = Object.keys(this.db);
            CATEGORIES.forEach((c) => {
                const count = document.querySelector(`#cat-${c} [data-count]`);
                if (!count) return;
                const n = c === 'all' ? keys.length : keys.filter((k) => this.db[k].category === c).length;
                count.textContent = `(${n})`;
            });
        }

        initLibrary() {
            const grid = document.getElementById('libraryGrid');
            grid.innerHTML = '';
            const books = this.store.profile().books;
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
                    <div class="overflow-hidden space-y-1 min-w-0 flex-1">
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="text-[11px] font-bold text-brand-700 bg-orange-100 px-2 py-0.5 rounded-lg">${esc(item.tag.split('•')[0].trim())}</span>
                            ${item.isNew ? '<span class="text-[11px] font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-lg">Yangi</span>' : ''}
                        </div>
                        <h4 class="font-bold text-gray-800 text-base leading-snug">${esc(item.title)}</h4>
                        <p class="text-xs text-gray-500">📄 ${item.pages.length} sahifali rasmli kitob</p>
                        ${this.cardStatus(item, books[key])}
                    </div>`;
                grid.appendChild(card);
            });
            const heading = document.getElementById('libraryHeading');
            if (heading) heading.textContent = `${keys.length} ta interaktiv kitob`;
        }

        // Half-read books show how far the child got; finished ones their stars.
        cardStatus(story, rec) {
            if (!rec) return '';
            const total = story.pages.length;
            if (rec.page >= 1) {
                const pct = Math.round((rec.page / total) * 100);
                return `<div class="flex items-center gap-2 pt-0.5">
                    <div class="flex-1 h-2 bg-orange-100 rounded-full overflow-hidden"><div class="h-full bg-emerald-500 rounded-full" style="width:${pct}%"></div></div>
                    <span class="text-[11px] font-bold text-emerald-700 whitespace-nowrap">📖 ${rec.page} / ${total}</span>
                </div>`;
            }
            if (rec.finished) {
                const { stars } = root.BookEngine.score(story, rec.answers);
                return `<p class="text-xs font-bold text-amber-700"><span class="text-sm tracking-wider text-amber-500" aria-label="${stars} yulduz">${'★'.repeat(stars)}<span class="text-gray-300">${'★'.repeat(3 - stars)}</span></span> O'qildi</p>`;
            }
            return '';
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
            this.renderHero();
            this.initLibrary();
        }

        // resume: jump straight to the page this child stopped on.
        startStory(storyKey, resume) {
            const story = this.db[storyKey];
            if (!story) return;
            this.currentStoryKey = storyKey;
            this.currentStoryObj = story;
            this.show('storyView');
            const rec = this.store.book(storyKey);
            this.book.load(storyKey, story, rec);
            if (resume && rec.page >= 1) this.book.goTo(rec.page);
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
            if (!document.getElementById('infoModal').classList.contains('hidden')) {
                if (e.key === 'Escape' || e.key === 'Enter') {
                    e.preventDefault();
                    this.closeModal();
                }
                return;
            }
            if (!document.getElementById('profileModal').classList.contains('hidden')) {
                if (e.key === 'Escape') {
                    if (this.editingProfile) this.showProfileList();
                    else this.closeProfiles();
                }
                return;
            }
            if (document.getElementById('storyView').classList.contains('hidden')) return;
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

        // Remembers the page this child is on; reaching the end marks the book read.
        saveProgress(s) {
            const key = this.currentStoryKey;
            if (!key || s.busy) return;
            const rec = this.store.book(key);
            if (s.end) {
                rec.finished = true;
                rec.page = 0;
            } else if (s.view >= 1) {
                rec.page = s.view;
                this.store.profile().last = key;
            } else {
                return;
            }
            this.store.save();
        }

        onBookAction(act) {
            if (act === 'quiz') this.startMiniGame();
            else if (act === 'restart') this.book.goTo(this.book.spread ? 0 : 1);
            else if (act === 'resume') {
                const page = this.book.resumePage();
                if (page) {
                    this.book.goTo(page);
                    this.playPageTurnSound('page');
                }
            }
        }

        // ---------- points & feedback ----------

        addPoints(n) {
            const points = this.store.addPoints(n);
            document.getElementById('userPoints').textContent = `${points} ball`;
        }

        onAnswer(ok, praise) {
            if (ok) {
                this.addPoints(ANSWER_POINTS);
                this.toast(`⭐ ${praise} +${ANSWER_POINTS} ball`);
                this.playChime(true);
            } else {
                this.store.save();
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
            this.store.setSetting('sound', this.soundEnabled);
            this.renderSoundBtn();
        }

        renderSoundBtn() {
            const btn = document.getElementById('soundToggleBtn');
            btn.setAttribute('aria-pressed', String(this.soundEnabled));
            btn.innerHTML = this.soundEnabled
                ? `<i class="fa-solid fa-volume-high"></i> <span class="hidden md:inline">Varaqlash Ovozi: Yoqilgan</span>`
                : `<i class="fa-solid fa-volume-xmark"></i> <span class="hidden md:inline">Varaqlash Ovozi: O'chiq</span>`;
            btn.className = this.soundEnabled
                ? 'px-3 py-2 bg-amber-100 text-amber-800 rounded-xl font-bold text-xs transition flex items-center space-x-1.5'
                : 'px-3 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold text-xs transition flex items-center space-x-1.5';
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
                        // The quiz pays out once per book, however often it is retaken.
                        const rec = this.store.book(this.currentStoryKey);
                        const first = !rec.quiz;
                        if (first) {
                            rec.quiz = true;
                            this.addPoints(QUIZ_POINTS);
                        }
                        this.playChime(true);
                        this.showModal('Tabriklaymiz! 🎉', first
                            ? `Siz to'g'ri xulosa topdingiz va ${QUIZ_POINTS} ball qo'shildi!`
                            : "Siz to'g'ri xulosa topdingiz! Bu kitob uchun ballni avvalroq olgansiz.");
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

        // ---------- script (Lotin / Кирилл) ----------

        setScript(mode) {
            this.store.setSetting('script', mode);
            if (root.Translit) root.Translit.setMode(mode);
            this.renderScriptBtn();
            // Redraw the open book so its text is fitted to the page in the new script.
            if (this.book.story) this.book.goTo(this.book.view);
        }

        renderScriptBtn() {
            const mode = this.store.settings.script;
            document.querySelectorAll('#scriptToggle [data-script]').forEach((btn) => {
                const on = btn.dataset.script === mode;
                btn.setAttribute('aria-pressed', String(on));
                btn.className = `min-h-[40px] px-2 sm:px-3 rounded-lg text-xs font-bold transition ${on ? 'bg-brand-500 text-white shadow-sm' : 'text-brand-700 hover:bg-brand-200'}`;
            });
        }

        // Text for native dialogs, which the page-wide Cyrillic switch can't reach.
        tx(text) {
            return root.Translit && root.Translit.mode() === 'cyr' ? root.Translit.toCyrillic(text) : text;
        }

        // ---------- profiles ----------

        openProfiles() {
            this.showProfileList();
            document.getElementById('profileModal').classList.remove('hidden');
            const current = document.querySelector('#profileList [aria-current="true"]');
            if (current) current.focus();
        }

        closeProfiles() {
            this.editingProfile = null;
            document.getElementById('profileModal').classList.add('hidden');
            document.getElementById('profileBtn').focus();
        }

        showProfileList() {
            this.editingProfile = null;
            document.getElementById('profileTitle').textContent = "Kim o'qiyapti?";
            document.getElementById('profileForm').classList.add('hidden');
            const list = document.getElementById('profileList');
            list.classList.remove('hidden');
            const activeId = this.store.profile().id;
            list.innerHTML = this.store.profiles().map((p) => {
                const on = p.id === activeId;
                return `<div class="relative">
                    <button type="button" data-use="${esc(p.id)}"${on ? ' aria-current="true"' : ''} class="w-full min-h-[120px] p-3 rounded-2xl border-2 ${on ? 'border-brand-500 bg-orange-50' : 'border-orange-100 bg-white hover:bg-orange-50'} flex flex-col items-center justify-center gap-1 transition">
                        <span class="text-4xl leading-none" aria-hidden="true">${esc(p.avatar)}</span>
                        <span class="font-bold text-gray-800 truncate max-w-full">${esc(p.name)}</span>
                        <span class="text-xs font-bold text-amber-600">⭐ ${p.points} ball</span>
                    </button>
                    <button type="button" data-edit="${esc(p.id)}" aria-label="${esc(p.name)}: tahrirlash" class="absolute top-1.5 right-1.5 w-9 h-9 rounded-xl bg-white/90 text-gray-500 hover:text-brand-600 hover:bg-white shadow-sm transition">
                        <i class="fa-solid fa-pen text-xs"></i>
                    </button>
                </div>`;
            }).join('') + `<button type="button" data-add="1" class="min-h-[120px] p-3 rounded-2xl border-2 border-dashed border-orange-200 text-brand-700 hover:bg-orange-50 flex flex-col items-center justify-center gap-1 font-bold transition">
                    <span class="text-3xl leading-none" aria-hidden="true">＋</span>
                    <span>Bola qo'shish</span>
                </button>`;
        }

        onProfileListClick(e) {
            const btn = e.target.closest('button');
            if (!btn) return;
            if (btn.dataset.use) this.useProfile(btn.dataset.use);
            else if (btn.dataset.edit) this.editProfile(btn.dataset.edit);
            else if (btn.dataset.add) this.editProfile(null);
        }

        useProfile(id) {
            const changed = id !== this.store.profile().id;
            this.store.use(id);
            this.closeProfiles();
            this.refreshProfile();
            // Another child's book, answers and points: start them in the library.
            if (changed && document.getElementById('homeView').classList.contains('hidden')) this.goHome();
        }

        // id: the profile to edit, or null to add a new child.
        editProfile(id) {
            const p = id ? this.store.data.profiles[id] : null;
            const taken = new Set(this.store.profiles().map((x) => x.avatar));
            this.editingProfile = p ? p.id : 'new';
            this.pickedAvatar = p ? p.avatar : root.Store.AVATARS.find((a) => !taken.has(a)) || root.Store.AVATARS[0];
            document.getElementById('profileTitle').textContent = p ? 'Tahrirlash' : 'Yangi kitobxon';
            document.getElementById('profileList').classList.add('hidden');
            document.getElementById('profileForm').classList.remove('hidden');
            document.getElementById('profileDeleteBtn').classList.toggle('hidden', !p || this.store.profiles().length < 2);
            const input = document.getElementById('profileNameInput');
            input.value = p ? p.name : '';
            this.renderAvatarPicker();
            input.focus();
        }

        renderAvatarPicker() {
            document.getElementById('avatarPicker').innerHTML = root.Store.AVATARS.map((a) => {
                const on = a === this.pickedAvatar;
                return `<button type="button" data-avatar="${a}" aria-pressed="${on}" class="min-h-[56px] text-3xl rounded-2xl border-2 ${on ? 'border-brand-500 bg-orange-50' : 'border-orange-100 hover:bg-orange-50'} transition">${a}</button>`;
            }).join('');
        }

        onAvatarClick(e) {
            const btn = e.target.closest('[data-avatar]');
            if (!btn) return;
            this.pickedAvatar = btn.dataset.avatar;
            this.renderAvatarPicker();
        }

        saveProfile(e) {
            e.preventDefault();
            const name = document.getElementById('profileNameInput').value.trim();
            if (!name) return;
            if (this.editingProfile === 'new') {
                const p = this.store.addProfile(name, this.pickedAvatar);
                this.useProfile(p.id);
                this.goHome();
                return;
            }
            this.store.updateProfile(this.editingProfile, { name, avatar: this.pickedAvatar });
            this.refreshProfile();
            this.showProfileList();
        }

        deleteProfile() {
            const p = this.store.data.profiles[this.editingProfile];
            if (!p) return;
            if (!root.confirm(this.tx(`${p.name} o'chirilsinmi? Uning ballari va o'qigan kitoblari ham o'chib ketadi.`))) return;
            const wasActive = p.id === this.store.profile().id;
            this.store.removeProfile(p.id);
            this.refreshProfile();
            if (wasActive && document.getElementById('homeView').classList.contains('hidden')) this.goHome();
            this.showProfileList();
        }

        // ---------- modal ----------

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
