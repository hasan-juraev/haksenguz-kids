/*
 * AppController: library, story view, profiles, points, sounds and the final quiz.
 * The book itself (pages, turning, covers) lives in js/book.js; what is
 * remembered between visits (per child) lives in js/store.js.
 */
(function (root) {
    'use strict';

    const CATEGORIES = ['all', 'alifbo', 'folk', 'classic', 'navoiy', 'modern', 'twins', 'korea', 'holiday', 'kichik', 'mine'];
    const DEFAULT_QUIZ = {
        q: "Kitobdan olgan xulosangiz qanday?",
        a: ["Ezgulik, ilm, birdamlik va halollik har doim g'alaba qozonadi ✨", "Dangasalik va yomon niyatlar hamisha mukofotlanadi 💤", "Faqat yolg'izlik va janjallashish yaxshi natija beradi 🍃"],
        ok: 0
    };
    const ANSWER_POINTS = 10;
    const QUIZ_POINTS = 50;
    const ORDER_POINTS = 30;
    const COMPARE_POINTS = 30;
    const DICT_POINTS = 10; // a dictionary game won, once a day per game
    const DICT_MIN = 4; // words needed before the games open
    const TRACE_POINTS = 5; // each Alifbo letter traced, the first time
    const PICWORD_POINTS = 2; // each new word found in a picture (js/picwords.js)

    const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

    class AppController {
        constructor() {
            this.db = root.storiesDatabase || {};
            this.store = new root.Store();
            this.currentStoryKey = null;
            this.currentStoryObj = null;
            this.activeCategory = 'all';
            this.activeShelf = 'all'; // age shelf (js/levels.js); the child's own, if their age is set
            this.soundEnabled = this.store.settings.sound !== false;
            this.audioCtx = null;
            this.heroKey = null;
            this.editingProfile = null;
            this.pickedAvatar = null;
            this.pickedAge = null;
            this.voices = []; // who has read the open book aloud

            this.book = new root.BookEngine(document.getElementById('book'), {
                onChange: (s) => {
                    this.closeGloss();
                    this.closeWord();
                    this.updateControls(s);
                    this.saveProgress(s);
                    this.reader.onChange(s);
                    if (this.bedtime) this.bedtime.renderChip();
                },
                // at bedtime, past tonight's last page: good night (js/bedtime.js)
                onLimit: () => this.bedtime && this.bedtime.goodnight(),
                onTurnStart: (t) => this.playPageTurnSound(t.cover ? 'cover' : 'page'),
                onAnswer: (ok, praise) => this.onAnswer(ok, praise),
                onAction: (act, el) => this.onBookAction(act, el),
                onPoke: () => this.playChime(),
                onWord: (w) => this.showPicWord(w), // a thing touched in a picture says its name
                decorate: (box) => root.Translit && root.Translit.apply(box),
                // 가 (Korean-letter readings) stays as the child left it
                reading: !!this.store.settings.reading,
                onReading: (on) => {
                    this.store.settings.reading = on;
                    this.store.save();
                },
            });
            this.reader = new root.Narrator.ReadAlong(this.book, {
                onState: (st) => this.renderListen(st),
                toast: (msg) => this.toast(msg),
            });
            this.studio = new root.Studio(this);
            this.bedtime = root.Bedtime ? new root.Bedtime(this) : null;
            this.maker = root.StoryMaker ? new root.StoryMaker(this) : null; // Ertak yozamiz

            document.addEventListener('keydown', (e) => this.onKey(e));
            document.getElementById('profileList').addEventListener('click', (e) => this.onProfileListClick(e));
            document.getElementById('avatarPicker').addEventListener('click', (e) => this.onAvatarClick(e));
            document.getElementById('agePicker').addEventListener('click', (e) => this.onAgeClick(e));
            document.getElementById('dictView').addEventListener('click', (e) => this.onDictClick(e));
            document.getElementById('passView').addEventListener('click', (e) => this.onPassClick(e));
            document.querySelector('#playModal .play-card').addEventListener('click', (e) => this.onRegionClick(e));
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#glossCard, .gloss')) this.closeGloss();
                if (!e.target.closest('#wordCard, [data-action="poke"]')) this.closeWord();
            });
            const profileModal = document.getElementById('profileModal');
            profileModal.addEventListener('click', (e) => {
                if (e.target === profileModal) this.closeProfiles();
            });

            if (root.Translit) root.Translit.set({ script: this.store.settings.script, lang: this.store.settings.lang });
            this.renderScriptBtn();
            this.renderSoundBtn();
            this.refreshProfile(); // also the age shelf, category counts and library
            this.setupOffline();
            this.setupInstall();
            // A shared link (…/#zumrad) opens that book.
            this.openFromLink();
            root.addEventListener('hashchange', () => this.openFromLink());
        }

        // Everything on screen that depends on who is reading.
        refreshProfile() {
            const p = this.store.profile();
            if (this.maker) this.maker.sync(); // this child's own books join the library
            document.getElementById('profileAvatar').textContent = p.avatar;
            document.getElementById('profileName').textContent = p.name;
            document.getElementById('userPoints').textContent = `${p.points} ball`;
            // A child's age picks their shelf; without one, every book shows.
            this.activeShelf = (root.Levels && root.Levels.shelfFor(p.age)) || 'all';
            this.renderAgeFilter();
            this.updateCategoryLabels();
            this.renderHero();
            this.initLibrary();
            this.updateDictCount();
            this.updatePassCount();
        }

        // ---------- library ----------

        // The hero offers the book this child is in the middle of, if any.
        renderHero() {
            const p = this.store.profile();
            const rec = p.last && this.db[p.last] ? p.books[p.last] : null;
            this.heroKey = rec && rec.page >= 1 ? p.last : null;
            this.heroBook = this.heroKey || this.suggestedBook();
            const story = this.db[this.heroBook];
            const hero = document.getElementById('heroArt');
            if (hero && story && root.Art) hero.innerHTML = root.Art.render(story.cover || story.pages[0].scene, { still: false, seed: 'hero:' + this.heroBook });
            document.getElementById('heroBtnLabel').textContent = this.heroKey ? 'Davom ettirish' : 'Kitobni Ochish';
            // in the evening, "Uxlash vaqti" glows
            const hour = new Date().getHours();
            const bed = document.getElementById('bedBtn');
            if (bed) bed.classList.toggle('is-evening', hour >= 19 || hour < 5);
            const caption = document.getElementById('heroResume');
            caption.textContent = this.heroKey ? `📖 ${story.title} · ${rec.page} / ${story.pages.length}` : '';
            caption.classList.toggle('hidden', !this.heroKey);
            // The banner's book is a holiday's story and the holiday is near.
            const near = root.Holidays && root.Holidays.soon(story);
            const line = document.getElementById('heroHoliday');
            if (line) {
                line.innerHTML = near ? `<span>${esc(root.Holidays.when(near.days))}</span> <span class="whitespace-nowrap">${esc(near.name)}</span>` : '';
                line.classList.toggle('hidden', !near);
            }
        }

        openHeroBook() {
            if (this.heroKey) this.startStory(this.heroKey, true);
            else this.startStory(this.heroBook || this.suggestedBook());
        }

        // A Korean twin tale opens once this child has finished its Uzbek tale.
        isLocked(key) {
            const twin = this.db[key] && this.db[key].twin;
            const rec = twin ? this.store.profile().books[twin] : null;
            return !!twin && !(rec && rec.finished);
        }

        showLocked(key) {
            this.showModal('🔒 Hali yopiq', `Avval «${this.db[this.db[key].twin].title}» ertagini oxirigacha o'qing. Shunda uning Koreyadagi egizagi ochiladi!`);
        }

        // With nothing in progress: the story of a holiday that is near, else
        // the first book on the child's shelf they haven't finished.
        suggestedBook() {
            const p = this.store.profile();
            const shelf = root.Levels ? root.Levels.shelfFor(p.age) : null;
            const keys = Object.keys(this.db).filter((k) => !this.isLocked(k) && !this.db[k].mine);
            const fits = (k) => !shelf || root.Levels.fits(this.db[k], shelf);
            const unread = (k) => !(p.books[k] && p.books[k].finished);
            const H = root.Holidays;
            const near = H ? keys.filter((k) => fits(k) && unread(k) && H.soon(this.db[k])) : [];
            if (near.length) return near.sort((a, b) => H.soon(this.db[a]).days - H.soon(this.db[b]).days)[0];
            return keys.find((k) => fits(k) && unread(k)) || keys.find(fits) || keys[0];
        }

        // Books in a category ('all' for every one) on the chosen age shelf.
        // The child's own books (Ertak yozamiz) stand only on their own shelf.
        shelfKeys(cat) {
            if (cat === 'mine') return Object.keys(this.db).filter((k) => this.db[k].mine && !this.db[k].guest);
            return Object.keys(this.db).filter((k) => !this.db[k].mine && (cat === 'all' || this.db[k].category === cat) && (!root.Levels || root.Levels.fits(this.db[k], this.activeShelf)));
        }

        updateCategoryLabels() {
            CATEGORIES.forEach((c) => {
                const count = document.querySelector(`#cat-${c} [data-count]`);
                if (count) count.textContent = `(${this.shelfKeys(c).length})`;
            });
        }

        filterAge(shelf) {
            this.activeShelf = shelf;
            this.renderAgeFilter();
            this.updateCategoryLabels();
            this.initLibrary();
        }

        // The age shelves; the active child's own shelf carries their face.
        renderAgeFilter() {
            const p = this.store.profile();
            const mine = root.Levels ? root.Levels.shelfFor(p.age) : null;
            document.querySelectorAll('#ageFilter [data-shelf]').forEach((btn) => {
                const on = btn.dataset.shelf === this.activeShelf;
                btn.setAttribute('aria-pressed', String(on));
                btn.className = `min-h-[36px] px-3 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-1 ${on ? 'bg-amber-400 text-amber-950 shadow-sm' : 'bg-white text-gray-600 border border-orange-100 hover:bg-amber-50'}`;
                const face = btn.querySelector('[data-mine]');
                if (face) face.textContent = btn.dataset.shelf === mine ? p.avatar : '';
            });
        }

        initLibrary() {
            const grid = document.getElementById('libraryGrid');
            grid.innerHTML = '';
            const books = this.store.profile().books;
            const keys = this.shelfKeys(this.activeCategory);
            if (this.activeCategory === 'mine' && this.maker) {
                // their heroes, a card to start a book, and the books they made
                document.getElementById('libraryEmpty').classList.add('hidden');
                document.getElementById('libraryHeading').textContent = '✍️ Mening ertaklarim';
                this.maker.renderShelf(grid);
                return;
            }
            document.getElementById('libraryEmpty').classList.toggle('hidden', keys.length > 0);
            keys.forEach((key) => {
                const item = this.db[key];
                const card = document.createElement('button');
                card.type = 'button';
                card.className = 'bg-white p-3 rounded-2xl shadow-sm hover:shadow-lg transition border border-orange-100 cursor-pointer flex space-x-4 items-center group text-left w-full';
                const locked = this.isLocked(key);
                card.onclick = () => (locked ? this.showLocked(key) : this.startStory(key));
                const scene = item.cover || item.pages[0].scene;
                const art = root.Art ? root.Art.render(scene, { still: true, seed: key + ':thumb' }) : '';
                card.innerHTML = `
                    <div class="thumb-art relative w-24 h-24 rounded-2xl flex-shrink-0 shadow-md group-hover:scale-105 transition" style="box-shadow:0 0 0 3px ${item.hue || '#f59e0b'}">${art}${locked ? '<span class="absolute inset-0 flex items-center justify-center bg-white/55 text-3xl" aria-hidden="true">🔒</span>' : ''}</div>
                    <div class="overflow-hidden space-y-1 min-w-0 flex-1">
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="text-[11px] font-bold text-brand-700 bg-orange-100 px-2 py-0.5 rounded-lg">${esc(item.tag.split('•')[0].trim())}</span>
                            ${item.age && root.Levels ? `<span class="text-[11px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-lg">${root.Levels.label(item)}</span>` : ''}
                            ${this.holidayChip(item)}
                            ${item.isNew ? '<span class="text-[11px] font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-lg">Yangi</span>' : ''}
                        </div>
                        <h4 class="font-bold text-gray-800 text-base leading-snug" data-content>${esc(item.title)}</h4>
                        ${this.koTitle(key)}
                        ${locked
                            ? `<p class="text-xs font-bold text-sky-800">🔒 «${esc(this.db[item.twin].title)}»ni o'qib tugating</p>`
                            : `<p class="text-xs text-gray-500">📄 ${item.pages.length} sahifali rasmli kitob</p>`}
                        ${this.cardStatus(item, books[key])}
                    </div>`;
                grid.appendChild(card);
            });
            const heading = document.getElementById('libraryHeading');
            if (heading) heading.textContent = `${keys.length} ta interaktiv kitob`;
        }

        // A holiday book's next date, "🎉 9-oktabr", with the holiday's name on hover.
        holidayChip(story) {
            const u = root.Holidays && root.Holidays.upcoming(story);
            return u ? `<span class="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-lg" title="${esc(u.name)}">🎉 ${root.Holidays.dateLabel(u.date)}</span>` : '';
        }

        // With the menus in Korean, a book's Korean title (if it has Korean) under its own.
        koTitle(key) {
            const ko = (root.storiesKorean || {})[key];
            return this.store.settings.lang === 'ko' && ko ? `<p class="text-sm font-bold text-gray-500 leading-snug" lang="ko">${esc(ko.title)}</p>` : '';
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
            ['homeView', 'storyView', 'gameView', 'studioView', 'dictView', 'passView', 'makerView'].forEach((id) => document.getElementById(id).classList.toggle('hidden', id !== view));
            root.scrollTo({ top: 0 });
        }

        // "✍️ Ertak yozish": the child's own shelf, in view.
        openMaker() {
            this.filterCategory('mine');
            const bar = document.getElementById('cat-mine');
            if (bar && bar.parentElement.scrollIntoView) bar.parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        goHome() {
            if (this.maker) this.maker.leave();
            if (this.bedtime) this.bedtime.stop();
            this.book.stopTurn();
            this.reader.stop();
            this.studio.close();
            this.closeGloss();
            this.clearLink();
            this.show('homeView');
            this.renderHero();
            this.updateCategoryLabels(); // a book made or kept since
            this.initLibrary();
            this.updateDictCount();
            this.updatePassCount();
        }

        // Leaving the book: the address no longer names it (so a reload doesn't reopen it).
        clearLink() {
            if (root.location.hash) root.history.replaceState(null, '', root.location.pathname + root.location.search);
        }

        // resume: jump straight to the page this child stopped on.
        startStory(storyKey, resume) {
            const story = this.db[storyKey];
            if (!story) return;
            if (this.bedtime && this.bedtime.on && this.bedtime.key !== storyKey) this.bedtime.stop();
            this.currentStoryKey = storyKey;
            this.currentStoryObj = story;
            // The address names the open book, so it can be shared as is
            // (a book from a link keeps that link: it is the book).
            const tag = `#${story.link || storyKey}`;
            if (root.location.hash !== tag) root.history.replaceState(null, '', tag);
            this.show('storyView');
            const rec = this.store.book(storyKey);
            this.reader.use(storyKey, null);
            this.voices = [];
            this.renderListen();
            this.renderOffline();
            this.book.load(storyKey, story, rec);
            if (resume && rec.page >= 1) this.book.goTo(rec.page);
            this.loadVoices(true);
        }

        // ---------- listening (read-along) ----------

        // Finds who has read this book aloud; announce: tell the child about a family voice.
        async loadVoices(announce) {
            const key = this.currentStoryKey;
            const voices = await root.Voices.forBook(key).catch(() => []);
            if (key !== this.currentStoryKey) return; // another book was opened meanwhile
            this.voices = voices;
            const pick = voices.find((v) => v.id === this.store.settings.voice) || voices[0] || null;
            this.reader.use(key, pick ? pick.id : null);
            this.renderListen();
            this.renderOffline();
            if (announce && pick && !pick.builtin) this.toast(`${pick.avatar} ${pick.name} bu ertakni o'qib bergan — 🎧 bosing!`);
        }

        // The ⬇️ next to "Tinglash", for books with built-in narration: saves its
        // recordings on the phone so they play without internet (family
        // recordings already live there). ✅ once saved; tapping it then removes them.
        async renderOffline() {
            const key = this.currentStoryKey;
            const btn = document.getElementById('offlineBtn');
            const total = key ? root.Voices.builtinCount(key) : 0;
            if (!total) {
                btn.classList.add('hidden');
                btn.classList.remove('flex');
                return;
            }
            if (this.savingBook === key) return; // the download shows its own progress
            const saved = await root.Voices.savedCount(key).catch(() => 0);
            if (key !== this.currentStoryKey) return;
            const done = saved >= total;
            btn.dataset.state = done ? 'saved' : 'none';
            btn.innerHTML = done ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-download"></i>';
            const label = done ? "Internetsiz ham tinglasa bo'ladi" : 'Internetsiz tinglash uchun saqlash';
            btn.setAttribute('aria-label', label);
            btn.title = label;
            btn.classList.remove('hidden');
            btn.classList.add('flex');
        }

        async toggleOfflineVoice() {
            const key = this.currentStoryKey;
            const btn = document.getElementById('offlineBtn');
            if (!key || this.savingBook) return;
            if (btn.dataset.state === 'saved') {
                if (!root.confirm(this.tx("Bu kitobning saqlangan ovozlari o'chirilsinmi? Internet bo'lsa, baribir tinglasa bo'ladi."))) return;
                await root.Voices.unsaveBook(key);
                this.renderOffline();
                return;
            }
            this.savingBook = key;
            btn.disabled = true;
            try {
                await root.Voices.saveBook(key, (done, total) => { btn.textContent = `${done}/${total}`; });
                this.toast("✓ Endi bu kitobni internetsiz ham tinglasa bo'ladi");
            } catch (e) {
                this.toast("📶 Saqlab bo'lmadi. Internetni tekshirib, qaytadan urinib ko'ring.");
            } finally {
                this.savingBook = null;
                btn.disabled = false;
                this.renderOffline();
            }
        }

        currentVoice() {
            return this.voices.find((v) => v.id === this.reader.voice) || null;
        }

        renderListen(st = { on: this.reader.on }) {
            const has = this.voices.length > 0;
            const btn = document.getElementById('listenBtn');
            btn.className = `${has ? 'flex' : 'hidden'} min-h-[48px] px-4 items-center gap-2 rounded-2xl font-bold text-sm text-white shadow-md transition ${st.on ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}`;
            btn.setAttribute('aria-pressed', String(!!st.on));
            btn.innerHTML = st.on
                ? `<i class="fa-solid fa-pause"></i> <span class="hidden sm:inline">To'xtatish</span>`
                : `<i class="fa-solid fa-headphones"></i> <span class="hidden sm:inline">Tinglash</span>`;
            btn.setAttribute('aria-label', st.on ? "O'qishni to'xtatish" : 'Ertakni tinglash');
            const v = this.currentVoice();
            const chip = document.getElementById('voiceChip');
            chip.classList.toggle('hidden', this.voices.length < 2);
            chip.textContent = v ? v.avatar : '';
            chip.setAttribute('aria-label', v ? `${v.name} o'qib beradi. Boshqa ovozni tanlash` : '');
            this.book.el.classList.toggle('has-voice', has);
        }

        toggleListen() {
            this.reader.toggle();
        }

        // Next voice that has read this book (the face next to "Tinglash").
        nextVoice() {
            if (this.voices.length < 2) return;
            const i = this.voices.findIndex((v) => v.id === this.reader.voice);
            const v = this.voices[(i + 1) % this.voices.length];
            const wasOn = this.reader.on;
            this.store.setSetting('voice', v.id);
            this.reader.use(this.currentStoryKey, v.id);
            this.renderListen();
            this.toast(`${v.avatar} ${v.name} o'qib beradi`);
            if (wasOn) this.reader.start();
        }

        // ---------- recording studio ----------

        openStudio() {
            if (!this.currentStoryKey) return;
            this.reader.stop();
            this.studio.gate(() => this.studio.open(this.currentStoryKey, this.book.view));
        }

        closeStudio() {
            this.studio.close();
            this.show('storyView');
            this.loadVoices(false);
        }

        backToBook() {
            this.show('storyView');
        }

        // ---------- navigation ----------

        nextPage() {
            if (this.book.isBusy()) return;
            const s = this.book.state();
            if (s.end && this.currentStoryObj && this.currentStoryObj.mine) {
                // a book a child made has no quiz: back to their shelf
                this.goHome();
                this.filterCategory('mine');
                return;
            }
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
            const open = (id) => !document.getElementById(id).classList.contains('hidden');
            if (open('playModal')) return; // js/games.js closes it on Escape
            if (open('infoModal')) {
                if (e.key === 'Escape' || e.key === 'Enter') {
                    e.preventDefault();
                    this.closeModal();
                }
                return;
            }
            if (open('gateModal')) {
                if (e.key === 'Escape') this.studio.closeGate();
                return;
            }
            if (open('voiceModal')) {
                if (e.key === 'Escape') {
                    if (this.studio.editing) this.studio.openVoices();
                    else this.studio.closeVoices();
                }
                return;
            }
            if (open('glossCard') && e.key === 'Escape') {
                this.closeGloss();
                return;
            }
            if (open('profileModal')) {
                if (e.key === 'Escape') {
                    if (this.editingProfile) this.showProfileList();
                    else this.closeProfiles();
                }
                return;
            }
            if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
            if (open('studioView')) {
                // Space starts and stops recording (a focused button handles its own).
                if (e.key === ' ' && e.target.tagName !== 'BUTTON') {
                    e.preventDefault();
                    this.studio.toggleRecord();
                }
                return;
            }
            if (!open('storyView')) return;
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
            else if (s.end && this.currentStoryObj && this.currentStoryObj.mine) next.innerHTML = `<span>✍️ Mening ertaklarim</span>`;
            else if (s.end) next.innerHTML = `<span>Bilimdon Testi</span> <i class="fa-solid fa-award"></i>`;
            else next.innerHTML = `<span>Keyingi</span> <i class="fa-solid fa-chevron-right"></i>`;
        }

        // Remembers the page this child is on; reaching the end marks the book read.
        saveProgress(s) {
            const key = this.currentStoryKey;
            if (!key || s.busy) return;
            const rec = this.store.book(key);
            if (s.end) {
                const twin = !rec.finished && Object.keys(this.db).find((k) => this.db[k].twin === key);
                if (twin) this.toast(`🔓 Yangi ertak ochildi: «${this.db[twin].title}»!`);
                // the first time: the book's place gets its stamp in the passport (js/passport.js)
                const P = root.Passport;
                const place = !rec.finished && P && P.regionOf(this.db[key]);
                const fresh = place && !(place.id in P.stamps(this.db, this.store.profile()));
                if (!rec.finished) rec.finishedAt = Date.now();
                rec.finished = true;
                rec.page = 0;
                if (fresh) {
                    const msg = `🗺️ Yangi muhr: ${place.name}!`;
                    if (twin) setTimeout(() => this.toast(msg), 2000);
                    else this.toast(msg);
                }
            } else if (s.view >= 1) {
                rec.page = s.view;
                this.store.profile().last = key;
                // its "Yangi so'z" joins this child's dictionary (Mening lug'atim)
                const p = this.db[key].pages[s.view - 1];
                if (p && p.word) {
                    const profile = this.store.profile();
                    profile.words = profile.words || {};
                    profile.words[`${key}:${s.view}`] = 1;
                }
            } else {
                return;
            }
            this.store.save();
        }

        onBookAction(act, el) {
            if (act === 'say') this.reader.say(+el.dataset.seg); // tap a sentence to hear it
            else if (act === 'gloss') this.showGloss(+el.dataset.gloss); // tap a word for its Korean
            else if (act === 'share' && this.currentStoryObj.mine && !this.currentStoryObj.guest) this.maker.share(this.currentStoryObj.made);
            else if (act === 'share') this.share(this.currentStoryKey);
            else if (act === 'edit') this.maker.edit(this.currentStoryObj.made);
            else if (act === 'keep') this.maker.keepGuest(false);
            else if (act === 'relay') this.maker.keepGuest(true); // Ertak estafetasi: write the next page
            else if (act === 'quiz') this.startMiniGame();
            else if (act === 'restart') this.book.goTo(this.book.spread ? 0 : 1);
            else if (act === 'resume') {
                const page = this.book.resumePage();
                if (page) {
                    this.book.goTo(page);
                    this.playPageTurnSound('page');
                }
            } else if (act === 'color') this.openColoring(+el.dataset.view);
            else if (act === 'order') this.openOrderGame();
            else if (act === 'twin') this.startStory(el.dataset.key);
            else if (act === 'compare') this.openCompare();
            else if (act === 'trace') this.openTracing(el.dataset.letter);
            else if (act === 'passport') this.openPassport(el.dataset.region);
        }

        // Alifbo: trace the page's letter, capital then small (+5 points the first time).
        openTracing(letter) {
            if (!letter || !root.Games || !root.Games.trace) return;
            const key = this.currentStoryKey;
            const cyr = root.Translit && root.Translit.mode() === 'cyr';
            const shown = (t) => (cyr ? root.Translit.toCyrillic(t) : t);
            const [big, small] = letter.split(' ');
            this.reader.stop();
            root.Games.trace({
                letters: [shown(big), shown(small || big.toLowerCase())],
                onStroke: () => this.playChime(),
                onDone: () => {
                    this.playChime(true);
                    const rec = this.store.book(key);
                    rec.traced = rec.traced || {};
                    if (rec.traced[big]) {
                        this.toast('✍️ Barakalla!');
                        return;
                    }
                    rec.traced[big] = true;
                    this.addPoints(TRACE_POINTS);
                    this.toast(`✍️ Barakalla! +${TRACE_POINTS} ball`);
                },
            });
        }

        // ---------- play corner (js/games.js) ----------

        // The picture of a story page (or of the ending) as a colouring page.
        openColoring(view) {
            const st = this.currentStoryObj;
            if (!st || !root.Games) return;
            const v = Math.min(Math.max(view, 1), st.pages.length);
            const page = st.pages[v - 1];
            this.reader.stop();
            root.Games.color({
                scene: this.book.sceneOf(v), // a guessed riddle's uncovered picture
                title: view > st.pages.length ? st.title : page.title,
                seed: `${this.currentStoryKey}:${view}`,
                onPaint: () => this.playChime(),
            });
        }

        // Four pictures from the story to put in order; pays out once per book.
        openOrderGame() {
            const key = this.currentStoryKey;
            if (!key || !root.Games) return;
            this.reader.stop();
            root.Games.order({
                story: this.currentStoryObj,
                seed: key,
                onRight: () => this.playChime(true),
                onWrong: () => this.toast("🤔 Yana o'ylab ko'ring!"),
                onWin: () => {
                    this.playChime(true);
                    const rec = this.store.book(key);
                    if (rec.order) {
                        this.toast('🧩 Barakalla!');
                        return;
                    }
                    rec.order = true;
                    this.addPoints(ORDER_POINTS);
                    this.toast(`🧩 Barakalla! +${ORDER_POINTS} ball`);
                },
            });
        }

        // Twin tales: is it in the Uzbek tale, the Korean one, or both? Pays out once per book.
        openCompare() {
            const key = this.currentStoryKey;
            const st = this.currentStoryObj;
            if (!st || !st.compare || !this.db[st.twin] || !root.Games) return;
            this.reader.stop();
            root.Games.compare({
                left: this.db[st.twin],
                right: st,
                icons: st.compare.icons || ['📕', '📗'],
                cards: st.compare.cards,
                seed: key,
                onRight: () => this.playChime(true),
                onWrong: () => this.toast("🤔 Yana o'ylab ko'ring!"),
                onWin: () => {
                    this.playChime(true);
                    const rec = this.store.book(key);
                    if (rec.compare) {
                        this.toast('🔍 Barakalla!');
                        return;
                    }
                    rec.compare = true;
                    this.addPoints(COMPARE_POINTS);
                    this.toast(`🔍 Barakalla! +${COMPARE_POINTS} ball`);
                },
            });
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
            this.reader.onAnswer(ok); // read-along waits for the right answer, then goes on
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
                const soft = this.bedtime && this.bedtime.on ? 0.35 : 1; // a whisper of paper at bedtime
                g.gain.setValueAtTime(0.0001, t);
                g.gain.exponentialRampToValueAtTime((kind === 'cover' ? 0.45 : 0.3) * soft, t + 0.06);
                g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
                src.connect(bp).connect(g).connect(ac.destination);
                src.start();
            } catch (e) {
                /* audio is optional */
            }
        }

        playChime(happy) {
            const ac = this.bedtime && this.bedtime.on ? null : this.ctx(); // quiet at bedtime
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
            this.reader.stop();
            this.closeGloss();
            this.show('gameView');
            // Answers in a random order; `order` keeps their places in the book (and in its Korean).
            const order = quiz.a.map((_, i) => i).sort(() => Math.random() - 0.5);
            this.quiz = { quiz, order, ko: false };
            this.renderQuiz();
        }

        // The book's Korean quiz ([question, ...answers]), if it has one.
        koQuiz() {
            const ko = (root.storiesKorean || {})[this.currentStoryKey];
            return ko && this.currentStoryObj && this.currentStoryObj.quiz ? ko.quiz || null : null;
        }

        toggleQuizKorean() {
            this.quiz.ko = !this.quiz.ko;
            this.renderQuiz();
        }

        renderQuiz() {
            const { quiz, order, ko } = this.quiz;
            const k = this.koQuiz();
            const koBtn = document.getElementById('gameKo');
            koBtn.classList.toggle('hidden', !k);
            koBtn.classList.toggle('is-on', !!(k && ko));
            koBtn.setAttribute('aria-pressed', String(!!(k && ko)));
            const line = (text) => (k && ko ? `<span class="ko-line" lang="ko">${esc(text)}</span>` : '');
            document.getElementById('gameQuestion').innerHTML = `<span data-content>${esc(quiz.q)}</span>${line(k && k[0])}`;
            const container = document.getElementById('gameOptionsContainer');
            container.innerHTML = '';
            order.forEach((i) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'w-full min-h-[48px] p-4 rounded-2xl bg-white hover:bg-emerald-50 border-2 border-orange-100 hover:border-emerald-400 text-gray-800 font-bold transition text-left flex items-center justify-between shadow-sm';
                btn.innerHTML = `<span data-content>${esc(quiz.a[i])}${line(k && k[i + 1])}</span> <i class="fa-solid fa-circle-question text-gray-400"></i>`;
                btn.onclick = () => this.answerQuiz(i === quiz.ok);
                container.appendChild(btn);
            });
        }

        answerQuiz(correct) {
            if (!correct) {
                this.showModal("Boshqatdan urinib ko'ring! 💪", "Bu xulosa asar g'oyasiga mos kelmaydi.");
                return;
            }
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
        }

        // ---------- Mening lug'atim (js/dictionary.js, games in js/games.js) ----------

        dictEntries() {
            return root.Dictionary ? root.Dictionary.entries(this.db, this.store.profile()) : [];
        }

        updateDictCount() {
            const el = document.getElementById('dictCount');
            if (el) el.textContent = `(${this.dictEntries().length})`;
        }

        openDictionary() {
            this.reader.stop();
            this.clearLink();
            this.show('dictView');
            this.renderDictionary();
        }

        // Picture cards in Uzbek alphabet order. Pictures are drawn as cards scroll into view.
        renderDictionary() {
            const list = this.dictEntries();
            this.dictList = list;
            document.getElementById('dictTotal').textContent = `${list.length} ta so'z`;
            document.getElementById('dictEmpty').classList.toggle('hidden', list.length > 0);
            const short = list.length < DICT_MIN;
            const hint = document.getElementById('dictHint');
            hint.classList.toggle('hidden', !short);
            hint.textContent = short ? `🎮 O'yinlar uchun kamida ${DICT_MIN} ta so'z kerak. Yana ${DICT_MIN - list.length} ta so'z yig'ing!` : '';
            document.querySelectorAll('#dictGames [data-game]').forEach((b) => {
                const need = b.dataset.game === 'match' ? list.filter((e) => e.ko).length : b.dataset.game === 'spell' ? list.filter(root.Dictionary.spellable).length : list.length;
                b.disabled = need < (b.dataset.game === 'listen' ? DICT_MIN : 3);
            });
            const grid = document.getElementById('dictGrid');
            grid.innerHTML = list.map((e, i) => `
                <article class="dict-card">
                    <div class="dict-art" data-i="${i}"></div>
                    <div class="dict-body">
                        <h4 class="dict-term" data-content>${esc(e.term)}</h4>
                        ${e.w ? '<p class="dict-mean">🖼️ Rasmdan topilgan so\'z</p>' : `<p class="dict-mean" data-content>${esc(e.meaning)}</p>`}
                        ${e.ko ? `<p class="dict-ko" lang="ko">🇰🇷 ${esc(e.ko)}</p>` : ''}
                        <div class="dict-tools">
                            <button type="button" class="dict-say" data-say="${i}" aria-label="Eshitish">🔊</button>
                            ${e.book ? `<button type="button" class="dict-open" data-open="${i}">📖 Kitobda</button>` : ''}
                        </div>
                    </div>
                </article>`).join('');
            const draw = (box) => {
                const e = list[+box.dataset.i];
                if (!e || !root.Art || box.firstChild) return;
                box.innerHTML = root.Dictionary.picture(e);
                if (e.w && root.PicWords) root.PicWords.fit(box);
            };
            if (this.dictObserver) this.dictObserver.disconnect();
            if (root.IntersectionObserver) {
                this.dictObserver = new root.IntersectionObserver((seen) => seen.forEach((x) => {
                    if (!x.isIntersecting) return;
                    draw(x.target);
                    this.dictObserver.unobserve(x.target);
                }), { rootMargin: '200px' });
                grid.querySelectorAll('.dict-art').forEach((box) => this.dictObserver.observe(box));
            } else {
                grid.querySelectorAll('.dict-art').forEach(draw);
            }
        }

        onDictClick(e) {
            const say = e.target.closest('[data-say]');
            const open = e.target.closest('[data-open]');
            const game = e.target.closest('[data-game]');
            if (say) {
                if (!this.sayWord(this.dictList[+say.dataset.say].term)) this.toast("Bu qurilmada ovoz topilmadi");
            } else if (open) {
                const w = this.dictList[+open.dataset.open];
                this.startStory(w.book);
                this.book.goTo(w.view);
            } else if (game && !game.disabled) {
                this.dictGame(game.dataset.game);
            }
        }

        // The phone's voice for an Uzbek word: an Uzbek voice if there is one, else
        // the Korean voice reading its 가 reading (every phone in Korea has one).
        wordVoice() {
            const synth = root.speechSynthesis;
            const voices = synth ? synth.getVoices() : [];
            const uz = voices.find((v) => /^uz/i.test(v.lang));
            const ko = voices.find((v) => /^ko/i.test(v.lang));
            return uz ? { voice: uz, lang: 'uz-UZ', read: (t) => t } : ko && root.Hangul ? { voice: ko, lang: 'ko-KR', read: (t) => root.Hangul.read(t) } : null;
        }

        sayWord(term) {
            const v = this.wordVoice();
            if (!v) return false;
            const synth = root.speechSynthesis;
            synth.cancel();
            const u = new root.SpeechSynthesisUtterance(v.read(term));
            u.lang = v.lang;
            u.voice = v.voice;
            u.rate = 0.8;
            synth.speak(u);
            return true;
        }

        // A game with the child's words; the first win of each game each day is worth points.
        dictGame(kind) {
            const list = this.dictList || this.dictEntries();
            if (!root.Games || !root.Games[kind]) return;
            const say = this.wordVoice() ? (t) => this.sayWord(t) : null;
            root.Games[kind]({
                entries: list,
                say,
                onRight: () => this.playChime(),
                onWrong: () => {},
                onWin: () => {
                    this.playChime(true);
                    const p = this.store.profile();
                    const today = new Date().toDateString();
                    p.dictWins = p.dictWins || {};
                    if (p.dictWins[kind] === today) return;
                    p.dictWins[kind] = today;
                    this.addPoints(DICT_POINTS);
                    this.toast(`📖 Barakalla! +${DICT_POINTS} ball`);
                },
            });
        }

        // ---------- Madaniyat pasporti (js/passport.js, map in js/uzmap.js) ----------

        updatePassCount() {
            const el = document.getElementById('passCount');
            const P = root.Passport;
            if (el && P) el.textContent = `(${Object.keys(P.stamps(this.db, this.store.profile())).length}/${P.REGIONS.length})`;
        }

        // region: open that place's card too (from the end of a book)
        openPassport(region) {
            if (!root.Passport) return;
            this.book.stopTurn();
            this.reader.stop();
            this.closeGloss();
            this.clearLink();
            this.passRegion = region || null;
            this.show('passView');
            this.renderPassport();
            if (region) this.showRegion(region);
        }

        // The map, a stamp (or an empty place) for each place, and the sticker album.
        renderPassport() {
            const P = root.Passport;
            const p = this.store.profile();
            const stamps = P.stamps(this.db, p);
            const mine = p.stickers || {};
            const ko = this.store.settings.lang === 'ko';
            document.getElementById('passStamped').textContent = `${Object.keys(stamps).length} / ${P.REGIONS.length} muhr`;
            document.getElementById('passPrice').textContent = `Har bir stiker — ${P.PRICE} ball. Viloyat stikerlari uning muhri bosilgach ochiladi.`;
            this.renderPassMap();
            document.getElementById('passStamps').innerHTML = P.REGIONS.map((r) => {
                const on = r.id in stamps;
                const have = r.stickers.filter((x) => mine[x.id]).length;
                return `<button type="button" class="pass-slot${on ? ' is-stamped' : ''}" data-region="${r.id}">
                    ${on ? P.stampSVG(r, { date: stamps[r.id] }) : P.emptySVG(r)}
                    <span class="pass-slot-name" data-content>${esc(r.name)}</span>
                    <span class="pass-slot-ko" lang="ko">${esc(r.ko)}</span>
                    <span class="pass-slot-meta" data-meta>📚 ${P.books(this.db, r.id).length} · 🎁 ${have}/${r.stickers.length}</span>
                </button>`;
            }).join('');
            document.getElementById('passAlbum').innerHTML = P.STICKERS.map((x) => `
                <button type="button" class="pass-sticker" data-region="${x.region}" data-sticker="${x.id}">
                    ${P.stickerSVG(x)}<b data-content>${esc(x.name)}</b>${ko ? `<small lang="ko">${esc(x.ko)}</small>` : `<small data-content>${esc(P.region(x.region).name)}</small>`}
                </button>`).join('');
            this.updatePassStickers();
        }

        // The map alone (it changes when a place is opened), with that place outlined.
        renderPassMap() {
            const P = root.Passport;
            const lang = this.store.settings.lang === 'ko' ? 'ko' : 'uz';
            document.getElementById('passMap').innerHTML = P.mapSVG({ stamped: P.stamps(this.db, this.store.profile()), selected: this.passRegion, lang });
        }

        // Sticker counts and the album, updated in place (a place's card may be open over them).
        updatePassStickers() {
            const P = root.Passport;
            const mine = this.store.profile().stickers || {};
            document.getElementById('passOwned').textContent = `${P.STICKERS.filter((x) => mine[x.id]).length} / ${P.STICKERS.length} stiker`;
            document.querySelectorAll('#passAlbum [data-sticker]').forEach((b) => b.classList.toggle('is-mine', !!mine[b.dataset.sticker]));
            P.REGIONS.forEach((r) => {
                const meta = document.querySelector(`#passStamps [data-region="${r.id}"] [data-meta]`);
                if (meta) meta.textContent = `📚 ${P.books(this.db, r.id).length} · 🎁 ${r.stickers.filter((x) => mine[x.id]).length}/${r.stickers.length}`;
            });
        }

        onPassClick(e) {
            const el = e.target.closest('[data-region]');
            if (el && root.Passport.region(el.dataset.region)) this.showRegion(el.dataset.region);
        }

        // A place's card: its stamp, a fact, the books that go there and its stickers.
        showRegion(id, fresh) {
            const P = root.Passport;
            const r = P && P.region(id);
            if (!r || !root.Games) return;
            this.passRegion = id;
            const p = this.store.profile();
            const stamps = P.stamps(this.db, p);
            const ko = this.store.settings.lang === 'ko';
            const on = id in stamps;
            const where = r.capital ? ['📍 Poytaxti:', r.city, r.koCity] : r.city ? ['📍 Markazi:', r.city, r.koCity] : ["📍 O'zbekistonning poytaxti", '', ''];
            const books = P.books(this.db, id).map((k) => {
                const st = this.db[k];
                const rec = p.books[k];
                const [status, cls] = this.isLocked(k) ? [`🔒 «${this.db[st.twin].title}»ni o'qib tugating`, '']
                    : rec && rec.finished ? ["✓ O'qildi", 'is-done']
                        : rec && rec.page ? [`📖 ${rec.page} / ${st.pages.length}`, 'is-reading'] : ["Hali o'qilmagan", ''];
                const art = root.Art ? root.Art.render(st.cover || st.pages[0].scene, { still: true, seed: k + ':thumb' }) : '';
                return `<button type="button" class="region-book" data-book="${esc(k)}"><span class="thumb-art">${art}</span><span><b data-content>${esc(st.title)}</b><small class="${cls}">${status}</small></span></button>`;
            }).join('');
            const stickers = r.stickers.map((x) => {
                const state = P.stickerState(this.db, p, x.id);
                const need = P.PRICE - p.points;
                const action = state === 'have'
                    ? `<span class="region-mine">✓ Sizniki</span>`
                    : `<button type="button" class="btn-buy" data-buy="${x.id}"${state === 'ok' ? '' : ' disabled'}><span>🎁 Olish</span> <span>⭐ ${P.PRICE} ball</span></button>` +
                      (state === 'points' ? `<small>Yana ${need} ball kerak</small>` : '');
                return `<div class="region-sticker${state === 'have' ? ' is-mine' : ''}${fresh === x.id ? ' is-new' : ''}">${P.stickerSVG(x)}<b data-content>${esc(x.name)}</b><small lang="ko">${esc(x.ko)}</small>${action}</div>`;
            }).join('');
            const html = `<div class="region-card">
                <div class="play-head"><h3><span data-content>${esc(r.name)}</span> <small class="pass-slot-ko" lang="ko">${esc(r.ko)}</small></h3><button type="button" class="play-x" data-close aria-label="Yopish">✕</button></div>
                <div class="region-top">${on ? P.stampSVG(r, { date: stamps[id] }) : P.emptySVG(r)}
                    <div><p class="region-city"><span>${where[0]}</span> ${where[1] ? `<b data-content>${esc(where[1])}</b>${ko ? ` <span lang="ko">(${esc(where[2])})</span>` : ''}` : ''}</p>
                    <p class="region-fact" data-content>${esc(r.fact)}</p>${ko ? `<p class="region-fact-ko" lang="ko">${esc(r.koFact)}</p>` : ''}</div>
                </div>
                <h4 class="region-h">📚 Bu yerga olib boradigan kitoblar</h4>
                <div class="region-books">${books}</div>
                <h4 class="region-h">🎁 Stikerlar</h4>
                <div class="region-stickers">${stickers}</div>
                ${on ? '' : `<p class="region-note">🔒 Stikerlar muhr bosilgach ochiladi: bu yerga olib boradigan kitobni oxirigacha o'qing!</p>`}
            </div>`;
            // Already open (a sticker was just bought): redraw it in place, keeping where focus returns to.
            const modal = document.getElementById('playModal');
            const card = modal.querySelector('.play-card');
            if (!modal.classList.contains('hidden') && card.querySelector('.region-card')) {
                card.innerHTML = html;
                const btn = card.querySelector('.region-sticker.is-new');
                if (btn) btn.scrollIntoView({ block: 'nearest' });
                const close = card.querySelector('[data-close]');
                if (close) close.focus();
            } else {
                root.Games.open(html, 'play-card--region');
            }
            // the map shows which place is open
            if (!document.getElementById('passView').classList.contains('hidden')) this.renderPassMap();
        }

        // Clicks inside a place's card (it lives in the play corner's modal, js/games.js).
        onRegionClick(e) {
            if (!e.target.closest('.region-card')) return;
            const buy = e.target.closest('[data-buy]');
            const book = e.target.closest('[data-book]');
            if (buy && !buy.disabled) this.buySticker(buy.dataset.buy);
            else if (book) {
                root.Games.close();
                const key = book.dataset.book;
                if (this.isLocked(key)) this.showLocked(key);
                else this.startStory(key, true);
            }
        }

        buySticker(id) {
            const P = root.Passport;
            const x = P.sticker(id);
            const p = this.store.profile();
            const state = P.stickerState(this.db, p, id);
            if (state === 'stamp') {
                this.toast("🔒 Avval bu yerga sayohat qiling: kitobini oxirigacha o'qing!");
                return;
            }
            if (state === 'points') {
                this.toast(`⭐ Ball yetmaydi: yana ${P.PRICE - p.points} ball kerak`);
                return;
            }
            if (state !== 'ok' || !this.store.spendPoints(P.PRICE)) return;
            p.stickers = p.stickers || {};
            p.stickers[id] = Date.now();
            this.store.save();
            document.getElementById('userPoints').textContent = `${p.points} ball`;
            this.playChime(true);
            this.toast(`🎁 Yangi stiker: ${x.name}!`);
            this.showRegion(x.region, id);
            if (!document.getElementById('passView').classList.contains('hidden')) this.updatePassStickers();
        }

        // ---------- Rasmdagi so'zlar: tap a thing in a picture (js/picwords.js) ----------

        // Its word, its Korean and, with 가 on, how it sounds. The first time, the
        // word joins this child's dictionary (+2 points).
        showPicWord(word) {
            this.picWord = word;
            const profile = this.store.profile();
            profile.picWords = profile.picWords || {};
            const fresh = !profile.picWords[word.term];
            if (fresh) {
                profile.picWords[word.term] = { w: word.w, book: this.currentStoryKey, view: Math.max(1, this.book.view) };
                this.addPoints(PICWORD_POINTS);
            }
            const art = document.getElementById('wordArt');
            art.innerHTML = root.PicWords.sticker(word.w);
            document.getElementById('wordTerm').textContent = word.term;
            const read = document.getElementById('wordRead');
            read.textContent = this.book.reading && root.Hangul ? root.Hangul.read(word.term) : '';
            read.classList.toggle('hidden', !read.textContent);
            document.getElementById('wordKo').textContent = `🇰🇷 ${word.ko}`;
            const note = document.getElementById('wordNew');
            note.textContent = fresh ? `✨ Lug'atimga qo'shildi! +${PICWORD_POINTS} ball` : '';
            note.classList.toggle('hidden', !fresh);
            document.getElementById('wordSay').classList.toggle('hidden', !root.speechSynthesis);
            document.getElementById('wordCard').classList.remove('hidden');
            root.PicWords.fit(art);
        }

        closeWord() {
            const card = document.getElementById('wordCard');
            if (!card || card.classList.contains('hidden')) return;
            card.classList.add('hidden');
        }

        sayPicWord() {
            if (this.picWord && !this.sayWord(this.picWord.term)) this.toast('Bu qurilmada ovoz topilmadi');
        }

        // ---------- Korean helper: tap a word ----------

        showGloss(i) {
            const ko = (root.storiesKorean || {})[this.currentStoryKey];
            const word = ko && ko.words && ko.words[i];
            if (!word) return;
            this.glossWord = word;
            document.getElementById('glossTerm').textContent = word[0];
            document.getElementById('glossKo').textContent = word[1];
            document.getElementById('glossSay').classList.toggle('hidden', !root.speechSynthesis);
            document.getElementById('glossCard').classList.remove('hidden');
        }

        closeGloss() {
            const card = document.getElementById('glossCard');
            if (card.classList.contains('hidden')) return;
            card.classList.add('hidden');
            if (root.speechSynthesis) root.speechSynthesis.cancel();
        }

        // Says the meaning with the phone's Korean voice (every phone in Korea has one).
        sayGloss() {
            const synth = root.speechSynthesis;
            if (!synth || !this.glossWord) return;
            const voice = synth.getVoices().find((v) => /^ko/i.test(v.lang));
            if (!voice && synth.getVoices().length) {
                this.toast("Bu qurilmada koreyscha ovoz topilmadi");
                return;
            }
            synth.cancel();
            const u = new root.SpeechSynthesisUtterance(this.glossWord[1]);
            u.lang = 'ko-KR';
            if (voice) u.voice = voice;
            u.rate = 0.9;
            synth.speak(u);
        }

        // ---------- script and menu language (Lot / Кир / 한) ----------

        // 'lat' | 'cyr': Uzbek in Latin or Cyrillic; 'ko': menus in Korean (stories stay Uzbek, in Latin).
        setScript(choice) {
            const script = choice === 'cyr' ? 'cyr' : 'lat';
            const lang = choice === 'ko' ? 'ko' : 'uz';
            this.store.setSetting('script', script);
            this.store.setSetting('lang', lang);
            if (root.Translit) root.Translit.set({ script, lang });
            this.renderScriptBtn();
            this.initLibrary();
            // The passport's map and cards have Korean names with the Korean menus.
            if (!document.getElementById('passView').classList.contains('hidden')) {
                this.renderPassport();
                if (this.passRegion && !document.getElementById('playModal').classList.contains('hidden')) this.showRegion(this.passRegion);
            }
            // Redraw the open book so its text is fitted to the page in the new script.
            if (this.book.story) this.book.goTo(this.book.view);
        }

        renderScriptBtn() {
            const { script, lang } = this.store.settings;
            const current = lang === 'ko' ? 'ko' : script;
            document.querySelectorAll('#scriptToggle [data-script]').forEach((btn) => {
                const on = btn.dataset.script === current;
                btn.setAttribute('aria-pressed', String(on));
                btn.className = `min-h-[40px] px-2 sm:px-3 rounded-lg text-xs font-bold transition ${on ? 'bg-brand-500 text-white shadow-sm' : 'text-brand-700 hover:bg-brand-200'}`;
            });
        }

        // Text for native dialogs, which the page-wide display layer can't reach.
        tx(text) {
            return root.Translit ? root.Translit.display(text) : text;
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
                        <span class="font-bold text-gray-800 truncate max-w-full" data-content>${esc(p.name)}</span>
                        <span class="text-xs font-bold text-amber-600">⭐ ${p.points} ball</span>
                        ${p.age && root.Levels ? `<span class="text-xs font-bold text-sky-700">${root.Levels.ageLabel(p.age)}</span>` : ''}
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
            this.pickedAge = p ? p.age || null : null;
            this.renderAvatarPicker();
            this.renderAgePicker();
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

        // Ages 4 to 11+ (optional: tapping the chosen one again clears it).
        renderAgePicker() {
            if (!root.Levels) return;
            document.getElementById('agePicker').innerHTML = root.Levels.AGES.map((a) => {
                const on = a === this.pickedAge;
                return `<button type="button" data-age="${a}" aria-pressed="${on}" class="min-h-[48px] text-lg font-bold rounded-2xl border-2 ${on ? 'border-brand-500 bg-orange-50 text-brand-700' : 'border-orange-100 text-gray-700 hover:bg-orange-50'} transition">${a >= 11 ? '11+' : a}</button>`;
            }).join('');
        }

        onAgeClick(e) {
            const btn = e.target.closest('[data-age]');
            if (!btn) return;
            const age = +btn.dataset.age;
            this.pickedAge = age === this.pickedAge ? null : age;
            this.renderAgePicker();
        }

        saveProfile(e) {
            e.preventDefault();
            const name = document.getElementById('profileNameInput').value.trim();
            if (!name) return;
            if (this.editingProfile === 'new') {
                const p = this.store.addProfile(name, this.pickedAvatar, this.pickedAge);
                this.useProfile(p.id);
                this.goHome();
                return;
            }
            this.store.updateProfile(this.editingProfile, { name, avatar: this.pickedAvatar, age: this.pickedAge });
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

        // ---------- offline, install, share ----------

        // sw.js keeps the app's files for use without internet (http/https only).
        setupOffline() {
            if (!('serviceWorker' in root.navigator) || !/^https?:$/.test(root.location.protocol)) return;
            const start = () => root.navigator.serviceWorker.register('sw.js')
                .then(() => root.navigator.serviceWorker.ready)
                .then((reg) => {
                    if (reg.active) reg.active.postMessage({ type: 'keep', urls: this.pageFiles() });
                })
                .catch(() => { /* offline support is optional */ });
            if (document.readyState === 'complete') start();
            else root.addEventListener('load', start, { once: true });
        }

        // Every file of the app this page uses, including fonts it hasn't
        // needed yet (the Cyrillic ones); recordings are left out.
        pageFiles() {
            const urls = new Set([root.location.href.split('#')[0]]);
            root.performance.getEntriesByType('resource').forEach((e) => urls.add(e.name));
            [...document.styleSheets].forEach((sheet) => {
                let rules = [];
                try {
                    rules = [...sheet.cssRules];
                } catch (e) {
                    return;
                }
                rules.filter((r) => r.type === CSSRule.FONT_FACE_RULE).forEach((r) => {
                    const m = /url\(["']?([^"')]+)/.exec(r.style.getPropertyValue('src'));
                    if (m) urls.add(new URL(m[1], sheet.href || root.location.href).href);
                });
            });
            return [...urls].filter((u) => {
                const url = new URL(u, root.location.href);
                return url.origin === root.location.origin && !/\/audio\/.+\.(m4a|webm|ogg|mp3|wav|aac)$/.test(url.pathname);
            });
        }

        // "Telefonga o'rnatish": Android/Chrome offers its own install prompt;
        // on iPhone and iPad it is done from Safari's share menu, so we explain.
        setupInstall() {
            const installed = root.matchMedia('(display-mode: standalone)').matches || root.navigator.standalone === true;
            if (installed) return;
            root.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                this.installPrompt = e;
                this.showInstall(true);
            });
            root.addEventListener('appinstalled', () => {
                this.installPrompt = null;
                this.showInstall(false);
            });
            const apple = /iphone|ipad|ipod/i.test(root.navigator.userAgent) || (root.navigator.platform === 'MacIntel' && root.navigator.maxTouchPoints > 1);
            if (apple) this.showInstall(true);
        }

        showInstall(on) {
            const btn = document.getElementById('installBtn');
            btn.classList.toggle('hidden', !on);
            btn.classList.toggle('flex', on);
        }

        installApp() {
            if (this.installPrompt) {
                const prompt = this.installPrompt;
                this.installPrompt = null;
                this.showInstall(false);
                prompt.prompt();
                return;
            }
            this.showModal("📲 Telefonga o'rnatish",
                "Safari'da pastdagi «Ulashish» (공유) tugmasini bosing, so'ng «Bosh ekranga qo'shish» (홈 화면에 추가) ni tanlang. Ertaklar belgisi telefoningiz ekranida paydo bo'ladi.");
        }

        // Shares the app, or one book, through the phone's share sheet
        // (Telegram, KakaoTalk...); elsewhere the link is copied.
        async share(key) {
            const story = key ? this.db[key] : null;
            const url = root.location.href.split('#')[0] + (story ? `#${key}` : '');
            const text = this.tx(story
                ? `«${story.title}» — o'zbek ertagi: rasmli, varaqlanadigan kitob`
                : "Ertaklar Olami — o'zbek xalq ertaklari bolalar uchun");
            if (root.navigator.share) {
                try {
                    await root.navigator.share({ title: story ? story.title : 'Ertaklar Olami', text, url });
                    return;
                } catch (e) {
                    if (e.name === 'AbortError') return;
                }
            }
            try {
                await root.navigator.clipboard.writeText(`${text}\n${url}`);
                this.toast("🔗 Havola nusxalandi — Telegram yoki KakaoTalk'ga joylang");
            } catch (e) {
                this.showModal('🔗 Havola', url);
            }
        }

        openFromLink() {
            // a book a child made, sent in a link (js/maker.js): the whole book is in it
            const shared = root.Maker && this.maker && root.Maker.fromHash(root.location.hash);
            if (shared) {
                const open = this.db[root.StoryMaker.GUEST];
                if (!(open && open.link === root.Maker.LINK + shared && this.currentStoryKey === root.StoryMaker.GUEST)) this.maker.openShared(shared);
                return;
            }
            let key = '';
            try {
                key = decodeURIComponent(root.location.hash.slice(1));
            } catch (e) {
                return;
            }
            if (this.db[key] && key !== this.currentStoryKey) this.startStory(key);
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
