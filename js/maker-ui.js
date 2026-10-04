/*
 * Ertak yozamiz: the story maker's screens (its pieces and rules are in
 * js/maker.js).
 *  - The shelf "✍️ Mening ertaklarim" in the library: the child's heroes
 *    and books, and a card to start a new book.
 *  - The editor, one page at a time: the picture with who stands where
 *    (the chooser), the place and the time of day, and the words. Sentence
 *    starters and the characters' names help children still learning to
 *    write.
 *  - The hero maker: who the hero is, their clothes, colours, hair and what
 *    they hold, with a live picture.
 * Everything is saved as it changes. A grown-up can send a book in a link
 * (after the grown-ups' sum); a book opened from a link can be kept.
 */
(function (root) {
    'use strict';

    const M = root.Maker;
    const GUEST = 'ertak_mehmon'; // the key of a book opened from a link, until it is kept
    const SAVE_AFTER = 400; // ms of quiet typing before saving
    const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
    const $ = (id) => document.getElementById(id);
    const byId = (list, id) => list.find((x) => x.id === id);
    const WHO_ICON = { boy: '👦', girl: '👧', man: '👨', woman: '👩', grandpa: '👴', grandma: '👵' };
    const ASK = ['Chapda kim turadi?', "O'rtada kim turadi?", "O'ngda kim turadi?", 'Osmonda nima uchadi?'];

    class StoryMaker {
        constructor(app) {
            this.app = app;
            this.book = null; // the book being edited (kept on the profile)
            this.view = 0; // its page being edited, from 0
            this.slot = null; // the chooser's slot
            this.tab = 'heroes'; // the chooser's tab
            this.hero = null; // the hero in the hero maker: { id, name, look }
            this.heroFor = null; // the slot the new hero goes to, if the chooser asked for one
            this.guest = null; // a book opened from a link: { book, heroes }
            this.thumbs = new Map(); // place pictures for the place chooser
            this.saveTimer = 0;
            const view = $('makerView');
            view.addEventListener('click', (e) => this.onClick(e));
            view.addEventListener('input', (e) => this.onInput(e));
            const card = document.querySelector('#playModal .play-card');
            card.addEventListener('click', (e) => this.onModalClick(e));
            card.addEventListener('input', (e) => this.onModalInput(e));
        }

        heroes() {
            return this.app.store.heroes();
        }

        books() {
            return this.app.store.myBooks();
        }

        page() {
            return this.book.pages[this.view];
        }

        // ---------- the shelf ----------

        // The child's books on this device, newest first, as stories (in app.db).
        sync() {
            const { db } = this.app;
            // another child now (the profile was switched): the editor's book is
            // saved, and the editor closes, since that book isn't theirs
            if (this.book && this.books()[this.book.id] !== this.book) {
                this.flush();
                this.book = null;
                if (!$('makerView').classList.contains('hidden')) this.app.show('homeView');
            }
            Object.keys(db).forEach((k) => {
                if (db[k].mine && k !== GUEST) delete db[k];
            });
            const heroes = this.heroes();
            Object.values(this.books()).forEach((b) => {
                db[M.key(b.id)] = M.toStory(b, heroes);
            });
        }

        // Their heroes, a "new book" card and their books, in the library grid.
        renderShelf(grid) {
            const heroes = this.heroes();
            const strip = document.createElement('div');
            strip.className = 'mk-shelf-heroes';
            strip.innerHTML = `<div class="mk-shelf-head"><b>🦸 Qahramonlarim</b><small>${heroes.length ? '' : "O'zingizga o'xshagan qahramon yasang!"}</small></div>
                <div class="mk-shelf-row">${heroes.map((h) => `<button type="button" class="mk-shelf-hero" data-hero="${esc(h.id)}"><span class="mk-shelf-art">${this.sticker({ k: `h:${h.id}`, mood: 'happy' })}</span><span data-content>${esc(h.name)}</span></button>`).join('')}
                ${heroes.length < M.MAX_HEROES ? '<button type="button" class="mk-shelf-hero mk-shelf-hero--new" data-hero="new"><span class="mk-shelf-art" aria-hidden="true">＋</span><span>Yangi qahramon</span></button>' : ''}</div>`;
            strip.addEventListener('click', (e) => {
                const b = e.target.closest('[data-hero]');
                if (b) this.openHero(b.dataset.hero === 'new' ? null : b.dataset.hero, null);
            });
            grid.appendChild(strip);

            const add = document.createElement('button');
            add.type = 'button';
            add.className = 'mk-new-book';
            add.innerHTML = `<span class="mk-new-plus" aria-hidden="true">✍️</span><span><b>Yangi ertak yozish</b><small>Qahramonlar, joylar va o'z so'zlaringiz bilan</small></span>`;
            add.onclick = () => this.create();
            grid.appendChild(add);

            const books = Object.values(this.books()).sort((a, b) => b.updated - a.updated);
            const recs = this.app.store.profile().books;
            books.forEach((b) => {
                const key = M.key(b.id);
                const st = this.app.db[key] || M.toStory(b, heroes);
                const card = document.createElement('div');
                card.className = 'mk-book-card';
                const art = root.Art ? root.Art.render(st.pages[0].scene, { still: true, seed: key + ':thumb' }) : '';
                card.innerHTML = `<button type="button" class="mk-book-open" data-read>
                        <span class="thumb-art mk-book-thumb">${art}</span>
                        <span class="mk-book-info"><b data-content>${esc(st.title)}</b><small>📄 ${b.pages.length} sahifa</small>${this.app.cardStatus(st, recs[key])}</span>
                    </button>
                    <button type="button" class="mk-book-edit" data-edit aria-label="Tahrirlash" title="Tahrirlash">✏️</button>`;
                card.querySelector('[data-read]').onclick = () => this.read(b.id);
                card.querySelector('[data-edit]').onclick = () => this.edit(b.id);
                grid.appendChild(card);
            });
        }

        // ---------- the editor ----------

        create() {
            if (Object.keys(this.books()).length >= M.MAX_BOOKS) {
                this.app.showModal('📚 Javon to\'ldi', `Ko'pi bilan ${M.MAX_BOOKS} ta ertak saqlanadi. Yangisini yozish uchun eskisidan birini o'chiring.`);
                return;
            }
            const book = M.newBook(this.app.store.profile().name, this.heroes());
            this.books()[book.id] = book;
            this.app.store.save();
            this.edit(book.id);
        }

        edit(id) {
            const book = this.books()[id];
            if (!book) return;
            this.app.reader.stop();
            this.app.clearLink();
            this.book = book;
            this.view = 0;
            this.app.activeCategory = 'mine'; // back from here: the child's own shelf
            this.app.show('makerView');
            this.render();
        }

        // Back to the shelf, with the book saved.
        close() {
            this.leave();
            this.app.goHome();
            this.app.filterCategory('mine');
        }

        // Whatever the child goes to next, the book is saved first.
        leave() {
            this.flush();
            this.book = null;
        }

        read(id) {
            this.flush();
            const book = this.books()[id];
            if (!book) return;
            this.app.db[M.key(id)] = M.toStory(book, this.heroes());
            this.app.startStory(M.key(id));
        }

        removeBook() {
            const b = this.book;
            if (!b || !root.confirm(this.app.tx(`«${b.title || 'Mening ertagim'}» ertagi o'chirilsinmi?`))) return;
            clearTimeout(this.saveTimer);
            delete this.books()[b.id];
            delete this.app.db[M.key(b.id)];
            delete this.app.store.profile().books[M.key(b.id)];
            if (this.app.store.profile().last === M.key(b.id)) this.app.store.profile().last = null;
            this.app.store.save();
            this.book = null;
            this.app.goHome();
            this.app.filterCategory('mine');
            this.app.toast("🗑️ Ertak o'chirildi");
        }

        // Saves now; the book in the library is redrawn from it.
        save() {
            clearTimeout(this.saveTimer);
            this.saveTimer = 0;
            if (!this.book) return;
            this.book.updated = Date.now();
            this.app.db[M.key(this.book.id)] = M.toStory(this.book, this.heroes());
            this.app.store.save();
            const tag = $('makerSaved');
            if (tag) tag.textContent = '✓ Saqlandi';
        }

        // Typing: saves a moment after the child stops.
        saveSoon() {
            clearTimeout(this.saveTimer);
            const tag = $('makerSaved');
            if (tag) tag.textContent = '…';
            this.saveTimer = setTimeout(() => this.save(), SAVE_AFTER);
        }

        flush() {
            if (this.saveTimer) this.save();
        }

        render() {
            const b = this.book;
            $('makerTitle').value = b.title;
            $('makerAuthor').value = b.author;
            $('makerMoral').value = b.moral;
            $('makerSaved').textContent = '✓ Saqlandi';
            this.renderPages();
            this.renderPage();
        }

        // The strip of pages, and the buttons to add, move and remove them.
        renderPages() {
            const b = this.book;
            const heroes = this.heroes();
            $('makerPages').innerHTML = b.pages.map((p, i) => `<button type="button" class="mk-page${i === this.view ? ' is-on' : ''}" data-mk="page" data-i="${i}" aria-pressed="${i === this.view}" aria-label="${i + 1}-sahifa">
                    <span class="thumb-art mk-page-art">${root.Art ? root.Art.render(M.sceneOf(p, heroes), { still: true, seed: `${b.id}:${i}` }) : ''}</span><b>${i + 1}</b></button>`).join('') +
                (b.pages.length < M.MAX_PAGES ? `<button type="button" class="mk-page mk-page--add" data-mk="add-page"><span aria-hidden="true">＋</span><b>Sahifa</b></button>` : '');
            $('makerPageNo').textContent = `${this.view + 1}-sahifa`;
            $('makerLeft').disabled = this.view === 0;
            $('makerRight').disabled = this.view === b.pages.length - 1;
            $('makerDelPage').disabled = b.pages.length === 1;
            $('makerFull').classList.toggle('hidden', b.pages.length < M.MAX_PAGES);
        }

        // The page being edited: its picture, characters, place, time and words.
        renderPage() {
            const p = this.page();
            this.renderStage();
            $('makerPageTitle').value = p.title;
            $('makerPageTitle').placeholder = M.place(p.place).at;
            $('makerPageBy').value = p.by || '';
            $('makerPageBy').placeholder = this.book.author || this.app.store.profile().name;
            $('makerText').value = p.text;
            this.renderCount();
            this.renderNames();
        }

        renderStage() {
            const p = this.page();
            const heroes = this.heroes();
            $('makerArt').innerHTML = root.Art ? root.Art.render(M.sceneOf(p, heroes), { seed: `${this.book.id}:${this.view}`, label: M.pageTitle(p) }) : '';
            $('makerSlots').innerHTML = M.SLOTS.map((at, i) => {
                const s = p.cast[i];
                const name = s ? M.nameOf(s.k, heroes) : '';
                return `<button type="button" class="mk-slot${s ? '' : ' is-empty'}" data-mk="slot" data-i="${i}">
                    <span class="mk-slot-art">${s ? this.sticker(s) : '<span aria-hidden="true">＋</span>'}</span>
                    <small>${esc(at.label)}</small><b${s && M.hero(s.k, heroes) ? ' data-content' : ''}>${esc(name) || '&nbsp;'}</b></button>`;
            }).join('');
            const pl = M.place(p.place);
            $('makerPlace').innerHTML = `<span aria-hidden="true">📍</span> <span>Joy:</span> <b>${esc(pl.label)}</b> <span aria-hidden="true">▾</span>`;
            const times = M.timesFor(pl);
            const cur = times.includes(M.time(p.time)) ? p.time : times[0].id;
            $('makerTimes').innerHTML = times.length > 1 ? times.map((t) => `<button type="button" class="mk-time" data-mk="time" data-t="${t.id}" aria-pressed="${t.id === cur}"><span aria-hidden="true">${t.icon}</span> <span>${esc(t.label)}</span></button>`).join('') : '';
            // the page's picture in the strip, too
            const thumb = document.querySelector(`#makerPages [data-i="${this.view}"] .mk-page-art`);
            if (thumb && root.Art) thumb.innerHTML = root.Art.render(M.sceneOf(p, heroes), { still: true, seed: `${this.book.id}:${this.view}` });
        }

        renderCount() {
            $('makerCount').textContent = `${$('makerText').value.length} / ${M.LIMITS.text}`;
        }

        // Buttons that put a sentence starter or a character's name into the text.
        renderNames() {
            const names = M.names(this.page(), this.heroes());
            $('makerStarters').innerHTML = M.STARTERS.map((s) => `<button type="button" class="mk-word" data-mk="insert" data-s="${esc(s)}" data-content>${esc(s)}</button>`).join('');
            $('makerNames').innerHTML = names.map((n) => `<button type="button" class="mk-word mk-word--name" data-mk="insert" data-s="${esc(n)}" data-content>${esc(n)}</button>`).join('');
            $('makerNamesRow').classList.toggle('hidden', !names.length);
        }

        goPage(i) {
            if (i < 0 || i >= this.book.pages.length || i === this.view) return;
            this.flush();
            this.view = i;
            this.renderPages();
            this.renderPage();
        }

        addPage() {
            const b = this.book;
            if (b.pages.length >= M.MAX_PAGES) return;
            b.pages.splice(this.view + 1, 0, M.newPage(this.page()));
            this.view++;
            this.save();
            this.renderPages();
            this.renderPage();
            $('makerText').focus();
        }

        removePage() {
            const b = this.book;
            if (b.pages.length === 1) return;
            const p = this.page();
            if ((p.text || p.title) && !root.confirm(this.app.tx(`${this.view + 1}-sahifa o'chirilsinmi?`))) return;
            b.pages.splice(this.view, 1);
            this.view = Math.min(this.view, b.pages.length - 1);
            this.save();
            this.renderPages();
            this.renderPage();
        }

        movePage(d) {
            const b = this.book;
            const to = this.view + d;
            if (to < 0 || to >= b.pages.length) return;
            [b.pages[this.view], b.pages[to]] = [b.pages[to], b.pages[this.view]];
            this.view = to;
            this.save();
            this.renderPages();
            this.renderPage();
        }

        // A sentence starter or a name, put in where the cursor is.
        insert(str) {
            const ta = $('makerText');
            const v = ta.value;
            const a = ta.selectionStart == null ? v.length : ta.selectionStart;
            const z = ta.selectionEnd == null ? v.length : ta.selectionEnd;
            const before = v.slice(0, a);
            const after = v.slice(z);
            const add = (before && !/\s$/.test(before) ? ' ' : '') + str + (after && /^\s/.test(after) ? '' : ' ');
            ta.focus();
            // a full page: nothing is cut off the end to make room
            if (before.length + add.length + after.length > M.LIMITS.text) return;
            ta.value = before + add + after;
            const pos = before.length + add.length;
            ta.setSelectionRange(pos, pos);
            this.onText();
        }

        onText() {
            this.page().text = M.cleanText($('makerText').value, M.LIMITS.text);
            this.renderCount();
            this.saveSoon();
        }

        onClick(e) {
            const b = e.target.closest('[data-mk]');
            if (!b || !this.book) return;
            const act = b.dataset.mk;
            if (act === 'back') this.close();
            else if (act === 'read') this.read(this.book.id);
            else if (act === 'page') this.goPage(+b.dataset.i);
            else if (act === 'add-page') this.addPage();
            else if (act === 'del-page') this.removePage();
            else if (act === 'move') this.movePage(+b.dataset.d);
            else if (act === 'slot') this.openChooser(+b.dataset.i);
            else if (act === 'place') this.openPlaces();
            else if (act === 'time') this.setTime(b.dataset.t);
            else if (act === 'insert') this.insert(b.dataset.s);
            else if (act === 'del-book') this.removeBook();
            else if (act === 'share') this.share(this.book.id);
        }

        onInput(e) {
            const el = e.target;
            if (!this.book) return;
            const b = this.book;
            const L = M.LIMITS;
            if (el.id === 'makerTitle') b.title = M.clean(el.value, L.title);
            else if (el.id === 'makerAuthor') b.author = M.clean(el.value, L.author);
            else if (el.id === 'makerMoral') b.moral = M.clean(el.value, L.moral);
            else if (el.id === 'makerPageTitle') {
                this.page().title = M.clean(el.value, L.pageTitle);
                $('makerArt').querySelector('svg').setAttribute('aria-label', M.pageTitle(this.page()));
            } else if (el.id === 'makerPageBy') {
                this.page().by = M.clean(el.value, L.by);
            } else if (el.id === 'makerText') {
                this.onText();
                return;
            } else return;
            this.saveSoon();
        }

        setTime(t) {
            this.page().time = t;
            this.save();
            this.renderStage();
        }

        // ---------- pictures ----------

        // A character as a sticker (the chooser, the slots, the shelf).
        sticker(slot, label) {
            const piece = M.pieceOf(slot, this.heroes());
            if (!piece || !root.Art) return '';
            const [part, o] = piece;
            return root.Art.sticker([[part, 0, 0, Object.assign({}, o, { f: !!slot.f })]], { box: M.boxOf(slot.k, this.heroes()), seed: `mk:${slot.k}`, label });
        }

        // ---------- the chooser: who stands here? ----------

        openChooser(i) {
            this.slot = i;
            const cur = this.page().cast[i];
            if (M.SLOTS[i].sky) this.tab = 'sky';
            else if (cur && M.ITEM[cur.k]) this.tab = M.ITEM[cur.k].group;
            else if (cur || this.heroes().length || this.tab === 'sky') this.tab = 'heroes';
            this.app.reader.stop();
            root.Games.open(this.chooserHTML(), 'play-card--maker');
        }

        chooserHTML() {
            const i = this.slot;
            const at = M.SLOTS[i];
            const cur = this.page().cast[i];
            const heroes = this.heroes();
            const tabs = at.sky ? [] : [{ id: 'heroes', icon: '⭐', label: 'Qahramonlarim' }].concat(M.GROUPS.filter((g) => !g.sky));
            const pick = (k, name, content) => `<button type="button" class="mk-pick" data-mc="pick" data-k="${esc(k)}" aria-pressed="${!!cur && cur.k === k}">
                    <span class="mk-pick-art">${this.sticker({ k, mood: 'happy', f: false })}</span><span class="mk-pick-name"${content ? ' data-content' : ''}>${esc(name)}</span></button>`;
            let grid;
            if (this.tab === 'heroes') {
                grid = heroes.map((h) => `<div class="mk-pick-wrap">${pick(`h:${h.id}`, h.name, true)}<button type="button" class="mk-pick-edit" data-mc="edit-hero" data-id="${esc(h.id)}" aria-label="Tahrirlash" title="Tahrirlash">✏️</button></div>`).join('') +
                    (heroes.length < M.MAX_HEROES ? `<button type="button" class="mk-pick mk-pick--new" data-mc="new-hero"><span class="mk-pick-art" aria-hidden="true">＋</span><span class="mk-pick-name">Yangi qahramon</span></button>` : '');
            } else {
                grid = M.ITEMS.filter((it) => it.group === this.tab).map((it) => pick(it.id, it.label, false)).join('');
            }
            const feels = cur && (M.hero(cur.k, heroes) || (M.ITEM[cur.k] && M.ITEM[cur.k].feel));
            const tools = cur ? `<div class="mk-tools">
                    ${feels ? `<div class="mk-moods" role="group" aria-label="Kayfiyati qanday?"><span class="mk-tools-label">Kayfiyati:</span>${M.MOODS.map((m) => `<button type="button" class="mk-mood" data-mc="mood" data-m="${m.id}" aria-pressed="${cur.mood === m.id}" aria-label="${esc(m.label)}" title="${esc(m.label)}">${m.icon}</button>`).join('')}</div>` : ''}
                    <div class="mk-tools-row">
                        <button type="button" class="mk-tool" data-mc="flip" aria-pressed="${!!cur.f}">↔️ Teskari burish</button>
                        <button type="button" class="mk-tool" data-mc="clear">🗑️ Olib tashlash</button>
                        <button type="button" class="mk-tool mk-tool--done" data-mc="done">✓ Tayyor</button>
                    </div></div>` : '';
            return `<div class="maker-card mk-chooser">
                <div class="play-head"><h3>${esc(ASK[i])}</h3><button type="button" class="play-x" data-close aria-label="Yopish">✕</button></div>
                ${tabs.length ? `<div class="mk-tabs" role="tablist">${tabs.map((t) => `<button type="button" class="mk-tab" role="tab" data-mc="tab" data-tab="${t.id}" aria-selected="${t.id === this.tab}"><span aria-hidden="true">${t.icon}</span> <span>${esc(t.label)}</span></button>`).join('')}</div>` : ''}
                ${this.tab === 'heroes' && !heroes.length ? `<p class="play-sub">O'zingizga o'xshagan qahramon yasang: ismi, kiyimi, sochi — hammasini o'zingiz tanlaysiz!</p>` : ''}
                <div class="mk-picks">${grid}</div>
                ${tools}
            </div>`;
        }

        // Redraws the open modal in place, keeping its scroll and the button in focus.
        redraw(html, focusSel) {
            const card = document.querySelector('#playModal .play-card');
            const top = card.scrollTop;
            card.innerHTML = html;
            card.scrollTop = top;
            const f = focusSel && card.querySelector(focusSel);
            if (f) f.focus();
        }

        setSlot(slot) {
            this.page().cast[this.slot] = slot;
            this.save();
            this.renderStage();
            this.renderNames();
        }

        pick(k) {
            const i = this.slot;
            const cur = this.page().cast[i];
            const it = M.ITEM[k];
            if (cur && cur.k === k) return;
            // facing inwards from the right; the mood carries on from the one before
            this.setSlot({ k, mood: cur ? cur.mood : 'happy', f: !!(it && it.turn && i === 2) });
            this.redraw(this.chooserHTML(), `[data-mc="pick"][data-k="${k}"]`);
        }

        onModalClick(e) {
            const card = e.target.closest('.maker-card');
            const b = e.target.closest('[data-mc]');
            if (!card || !b) return;
            const act = b.dataset.mc;
            const slot = this.book && this.slot != null ? this.page().cast[this.slot] : null;
            if (act === 'tab') {
                this.tab = b.dataset.tab;
                this.redraw(this.chooserHTML(), `[data-tab="${this.tab}"]`);
            } else if (act === 'pick') this.pick(b.dataset.k);
            else if (act === 'mood' && slot) {
                this.setSlot(Object.assign({}, slot, { mood: b.dataset.m }));
                this.redraw(this.chooserHTML(), `[data-m="${b.dataset.m}"]`);
            } else if (act === 'flip' && slot) {
                this.setSlot(Object.assign({}, slot, { f: !slot.f }));
                this.redraw(this.chooserHTML(), '[data-mc="flip"]');
            } else if (act === 'clear') {
                this.setSlot(null);
                root.Games.close();
            } else if (act === 'done') root.Games.close();
            else if (act === 'new-hero') this.openHero(null, this.slot);
            else if (act === 'edit-hero') this.openHero(b.dataset.id, this.slot);
            else if (act === 'set-place') this.setPlace(b.dataset.p);
            else if (act === 'hl') this.setLook(b.dataset.k, b.dataset.v);
            else if (act === 'save-hero') this.saveHero();
            else if (act === 'del-hero') this.removeHero();
            else if (act === 'cancel-hero') this.leaveHero();
        }

        onModalInput(e) {
            if (e.target.id === 'mkHeroName' && this.hero) this.hero.name = e.target.value;
        }

        // ---------- places ----------

        openPlaces() {
            this.app.reader.stop();
            root.Games.open(this.placesHTML(), 'play-card--maker');
        }

        placesHTML() {
            const p = this.page();
            const cards = M.PLACES.map((pl) => {
                const t = M.timesFor(pl).includes(M.time(p.time)) ? p.time : M.timesFor(pl)[0].id;
                const id = `${pl.id}:${t}`;
                if (!this.thumbs.has(id) && root.Art) this.thumbs.set(id, root.Art.render(M.sceneOf({ place: pl.id, time: t, cast: [null, null, null, null] }, []), { still: true, seed: `place:${pl.id}` }));
                return `<button type="button" class="mk-place-pick" data-mc="set-place" data-p="${pl.id}" aria-pressed="${pl.id === p.place}"><span class="thumb-art">${this.thumbs.get(id) || ''}</span><span>${esc(pl.label)}</span></button>`;
            }).join('');
            return `<div class="maker-card mk-places">
                <div class="play-head"><h3>📍 Bu voqea qayerda bo'ldi?</h3><button type="button" class="play-x" data-close aria-label="Yopish">✕</button></div>
                <div class="mk-place-grid">${cards}</div>
            </div>`;
        }

        setPlace(id) {
            const p = this.page();
            p.place = id;
            // indoors there is no snow or sunset: back to day
            if (!M.timesFor(M.place(id)).includes(M.time(p.time))) p.time = M.timesFor(M.place(id))[0].id;
            this.save();
            root.Games.close();
            this.renderStage();
            $('makerPageTitle').placeholder = M.place(id).at;
        }

        // ---------- the hero maker ----------

        // id: a hero to change (null: a new one); slot: where a new hero goes when done.
        openHero(id, slot) {
            const h = id ? this.heroes().find((x) => x.id === id) : null;
            if (!h && this.heroes().length >= M.MAX_HEROES) return;
            this.hero = h ? { id: h.id, name: h.name, look: Object.assign({}, h.look) } : { id: null, name: '', look: M.cleanLook({}) };
            this.heroFor = slot;
            this.app.reader.stop();
            root.Games.open(this.heroHTML(), 'play-card--maker');
        }

        heroHTML() {
            const { look: l, id, name } = this.hero;
            const who = byId(M.WHO, l.who);
            const chips = (k, list, cur, icons) => list.map((x) => `<button type="button" class="mk-chip" data-mc="hl" data-k="${k}" data-v="${x.id}" aria-pressed="${x.id === cur}">${icons && icons[x.id] ? `<span aria-hidden="true">${icons[x.id]}</span> ` : ''}${esc(x.label)}</button>`).join('');
            const swatch = (k, cols, cur, label) => cols.map((c, i) => `<button type="button" class="mk-swatch" data-mc="hl" data-k="${k}" data-v="${i}" style="background:${c}" aria-pressed="${i === cur}" aria-label="${label} ${i + 1}" title="${label} ${i + 1}"></button>`).join('');
            const row = (label, inner) => `<div class="mk-row"><span class="mk-row-label">${label}</span><div class="mk-row-items">${inner}</div></div>`;
            return `<div class="maker-card mk-hero">
                <div class="play-head"><h3>🦸 ${id ? 'Qahramonni tahrirlash' : 'Yangi qahramon'}</h3><button type="button" class="play-x" data-close aria-label="Yopish">✕</button></div>
                <div class="mk-hero-grid">
                    <div class="mk-hero-preview">${this.heroSticker()}</div>
                    <div class="mk-hero-fields">
                        <label class="mk-row-label" for="mkHeroName">Ismi</label>
                        <input id="mkHeroName" class="mk-input" type="text" maxlength="${M.LIMITS.name}" autocomplete="off" value="${esc(name)}" placeholder="Masalan, Aziz">
                        <p id="mkHeroHint" class="mk-hint hidden" aria-live="polite">✏️ Qahramoningizga ism qo'ying!</p>
                        ${row('Kim?', chips('who', M.WHO, l.who, WHO_ICON))}
                        ${row('Bosh kiyim va soch', chips('head', who.heads.map((h) => ({ id: h, label: M.HEADS[h].label })), l.head))}
                        ${who.beard ? row('Soqol', `<button type="button" class="mk-chip" data-mc="hl" data-k="beard" data-v="${l.beard ? 0 : 1}" aria-pressed="${l.beard}">🧔 Soqolli</button>`) : ''}
                        ${row('Kiyim', chips('wear', M.WEARS, l.wear))}
                        ${row('Naqsh', chips('pattern', M.PATTERNS, l.pattern))}
                        ${row('Rang', M.COLORS.map((c) => `<button type="button" class="mk-swatch" data-mc="hl" data-k="color" data-v="${c.id}" style="background:${c.c[0]}" aria-pressed="${c.id === l.color}" aria-label="${esc(c.label)}" title="${esc(c.label)}"></button>`).join(''))}
                        ${row('Teri rangi', swatch('skin', M.SKINS, l.skin, 'Teri rangi'))}
                        ${row('Soch rangi', swatch('hair', M.HAIRS, l.hair, 'Soch rangi'))}
                        ${row("Qo'lida", chips('hold', M.HOLDS, l.hold))}
                    </div>
                </div>
                <div class="mk-hero-actions">
                    <button type="button" class="mk-tool mk-tool--done" data-mc="save-hero">💾 Saqlash</button>
                    ${id ? `<button type="button" class="mk-tool" data-mc="del-hero">🗑️ O'chirish</button>` : ''}
                    <button type="button" class="mk-tool" data-mc="cancel-hero">Bekor qilish</button>
                </div>
            </div>`;
        }

        heroSticker() {
            if (!root.Art) return '';
            const o = M.heroOpts(this.hero.look, this.hero.look.hold === 'none' ? 'wave' : 'happy');
            const box = o.age === 'child' ? [-50, -124, 100, 128] : [-62, -152, 124, 158];
            return root.Art.sticker([['person', 0, 0, o]], { box, seed: 'mk:hero', label: this.hero.name || undefined });
        }

        setLook(k, v) {
            const l = this.hero.look;
            if (k === 'skin' || k === 'hair') l[k] = +v;
            else if (k === 'beard') l.beard = v === '1';
            else l[k] = v;
            // a new kind of hero: their first head, and white hair if they are old
            if (k === 'who') {
                l.head = null;
                const old = byId(M.WHO, v).o.age === 'old';
                if (old) l.hair = 4;
                else if (l.hair === 4) l.hair = 0;
            }
            this.hero.look = M.cleanLook(l);
            const name = $('mkHeroName');
            if (name) this.hero.name = name.value;
            this.redraw(this.heroHTML(), k === 'beard' ? '[data-k="beard"]' : `[data-k="${k}"][data-v="${v}"]`);
        }

        saveHero() {
            const h = this.hero;
            const name = M.clean($('mkHeroName') ? $('mkHeroName').value : h.name, M.LIMITS.name);
            if (!name) {
                $('mkHeroHint').classList.remove('hidden');
                $('mkHeroName').classList.add('is-missing');
                $('mkHeroName').focus();
                return;
            }
            const heroes = this.heroes();
            let id = h.id;
            if (id) {
                const kept = heroes.find((x) => x.id === id);
                if (!kept) return;
                kept.name = name;
                kept.look = M.cleanLook(h.look);
            } else {
                if (heroes.length >= M.MAX_HEROES) return;
                const made = M.newHero(name, h.look);
                heroes.push(made);
                id = made.id;
            }
            this.app.store.save();
            this.sync(); // every book with this hero in it
            const slot = this.heroFor;
            this.hero = null;
            this.heroFor = null;
            this.app.playChime(true);
            if (slot != null && this.book) {
                // back in the chooser: a new hero goes straight into the slot
                if (!h.id) this.page().cast[slot] = { k: `h:${id}`, mood: 'wave', f: false };
                this.save();
                this.renderStage();
                this.renderNames();
                this.slot = slot;
                this.tab = 'heroes';
                this.redraw(this.chooserHTML(), `[data-k="h:${id}"]`);
            } else {
                root.Games.close();
                if (this.book) this.renderStage();
                else this.app.initLibrary();
            }
        }

        // A hero is removed from every book they were in.
        removeHero() {
            const h = this.hero;
            if (!h || !h.id || !root.confirm(this.app.tx(`${h.name} o'chirilsinmi? U ertaklaringizdan ham olib tashlanadi.`))) return;
            const store = this.app.store;
            const heroes = this.heroes();
            heroes.splice(heroes.findIndex((x) => x.id === h.id), 1);
            Object.values(this.books()).forEach((b) => b.pages.forEach((p) => {
                p.cast = p.cast.map((s) => (s && s.k === `h:${h.id}` ? null : s));
            }));
            store.save();
            this.sync();
            this.leaveHero();
        }

        // Back where the hero maker was opened from.
        leaveHero() {
            const slot = this.heroFor;
            this.hero = null;
            this.heroFor = null;
            if (slot != null && this.book) {
                this.renderStage();
                this.renderNames();
                this.slot = slot;
                this.tab = 'heroes';
                this.redraw(this.chooserHTML(), '[data-tab="heroes"]');
            } else {
                root.Games.close();
                if (this.book) this.renderStage();
                else this.app.initLibrary();
            }
        }

        // ---------- links ----------

        // A grown-up sends the book: the whole book is in the link.
        share(id) {
            const book = this.books()[id];
            if (!book) return;
            this.flush();
            this.app.studio.gate(() => this.sendLink(book), "Ertakni ulashish uchun hisoblang:");
        }

        async sendLink(book) {
            const url = `${root.location.href.split('#')[0]}#${M.LINK}${M.encode(book, this.heroes())}`;
            const title = book.title || 'Mening ertagim';
            const text = this.app.tx(`«${title}» — o'zimiz yozgan ertak. O'qing va davomini yozib, qaytarib yuboring!`);
            if (root.navigator.share) {
                try {
                    await root.navigator.share({ title, text, url });
                    return;
                } catch (e) {
                    if (e.name === 'AbortError') return;
                }
            }
            try {
                await root.navigator.clipboard.writeText(`${text}\n${url}`);
                this.app.toast("🔗 Havola nusxalandi — Telegram yoki KakaoTalk'ga joylang");
            } catch (e) {
                this.app.showModal('🔗 Havola', url);
            }
        }

        // A book from a link ("#ertak=…"): read it as a gift; it can be kept,
        // or continued (Ertak estafetasi). When it is one of this child's own
        // books coming back with new pages, keeping it updates their copy.
        openShared(data) {
            const got = M.decode(data);
            if (!got) {
                this.app.showModal('🔗 Ertak topilmadi', "Bu havolada ertak yo'q yoki u to'liq ko'chirilmagan. Havolani yuborgan kishidan qaytadan so'rang.");
                return false;
            }
            this.guest = got;
            const st = M.toStory(got.book, got.heroes, { guest: true });
            st.link = `${M.LINK}${data}`; // the address keeps the book while it is read
            st.update = !!this.relayBook(got.book.relay); // it is theirs: keeping it updates it
            st.more = got.book.pages.length < M.MAX_PAGES; // room for a next page
            this.app.db[GUEST] = st;
            delete this.app.store.profile().books[GUEST]; // each gift is read from its start
            this.app.startStory(GUEST);
            return true;
        }

        // This child's copy of a book that travels (the same relay id), if they have one.
        relayBook(relay) {
            return Object.values(this.books()).find((b) => (b.relay || b.id) === relay) || null;
        }

        // The gift book joins the child's shelf, or updates their own copy of it;
        // its heroes are matched to theirs. write: then add the next page.
        keepGuest(write) {
            const g = this.guest;
            if (!g) return;
            const mine = this.relayBook(g.book.relay);
            if (!mine && Object.keys(this.books()).length >= M.MAX_BOOKS) {
                this.app.showModal('📚 Javon to\'ldi', `Ko'pi bilan ${M.MAX_BOOKS} ta ertak saqlanadi. Yangisini yozish uchun eskisidan birini o'chiring.`);
                return;
            }
            if (mine && !write && !root.confirm(this.app.tx(`«${mine.title || 'Mening ertagim'}» ertagi yangi sahifalar bilan yangilansinmi?`))) return;
            const { book, heroes } = M.adopt(g, this.heroes());
            heroes.forEach((h) => this.heroes().push(h));
            let kept = mine;
            if (mine) {
                Object.assign(mine, { title: book.title, author: book.author, moral: book.moral, pages: book.pages, updated: Date.now() });
            } else {
                kept = Object.assign(book, { created: Date.now(), updated: Date.now() });
                this.books()[kept.id] = kept;
            }
            this.app.store.save();
            this.guest = null;
            delete this.app.db[GUEST];
            this.sync();
            if (write) {
                // the next page, at the end, for whoever is writing it now
                this.edit(kept.id);
                this.goPage(kept.pages.length - 1);
                this.addPage();
                $('makerPageBy').focus();
                return;
            }
            this.app.toast(mine ? '🔄 Ertak yangilandi!' : "📥 Ertak javoningizga qo'shildi!");
            this.app.goHome();
            this.app.filterCategory('mine');
        }
    }

    StoryMaker.GUEST = GUEST;
    root.StoryMaker = StoryMaker;
})(window);
