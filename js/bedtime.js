/*
 * Uxlash vaqti (bedtime, ROADMAP item 14): a calm way to end the day with a
 * book. A grown-up picks one of the calm books (story.bedtime) and how many
 * pages to read tonight. Then:
 *  - the screen turns dark and warm, the questions rest, the page sound is
 *    soft and the chimes are quiet;
 *  - if someone has read the book aloud, their voice reads on by itself;
 *  - after tonight's last page, "Xayrli tun" (good night) fills the screen
 *    and slowly fades to dark. Tomorrow the book opens on the next page.
 */
(function (root) {
    'use strict';

    const PAGES = [3, 5, 0]; // pages a night; 0: to the end of the book
    const FADE_AFTER = 15000; // the good-night screen then fades to dark
    // The good-night picture: a sleeping village under the moon.
    const NIGHT = { bg: 'village', time: 'night', moonAt: [300, 64], items: [['hut', 140, 268, { lit: true }], ['cat', 262, 290, { mood: 'sleep' }], ['zzz', 276, 236, {}]] };

    const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

    class Bedtime {
        constructor(app) {
            this.app = app;
            this.on = false;
            this.key = null;
            this.from = 1; // the page tonight began on
            this.fadeTimer = 0;
            this.fadeAfter = FADE_AFTER;
            this.night = document.getElementById('goodnight');
            document.querySelector('#playModal .play-card').addEventListener('click', (e) => this.onPickerClick(e));
            this.night.addEventListener('click', (e) => this.onNightClick(e));
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !this.night.classList.contains('hidden')) this.leave();
            });
        }

        // Calm books: the one under way first, then new ones, then those read before.
        books() {
            const { db } = this.app;
            const books = this.app.store.profile().books;
            const rank = (k) => (books[k] && books[k].page >= 1 ? 0 : books[k] && books[k].finished ? 2 : 1);
            return Object.keys(db).filter((k) => db[k].bedtime && !this.app.isLocked(k)).sort((a, b) => rank(a) - rank(b));
        }

        pages() {
            const n = this.app.store.settings.bedtimePages;
            return PAGES.includes(n) ? n : 5;
        }

        // ---------- choosing ----------

        // How many pages tonight, then a tap on a book begins.
        open() {
            if (!root.Games) return;
            this.app.reader.stop();
            root.Games.open(this.pickerHTML(), 'play-card--bedtime');
        }

        pickerHTML() {
            const n = this.pages();
            const books = this.app.store.profile().books;
            const chips = PAGES.map((v) => `<button type="button" class="bed-chip" data-pages="${v}" aria-pressed="${v === n}">${v ? `${v} sahifa` : 'Butun kitob'}</button>`).join('');
            const cards = this.books().map((k) => {
                const st = this.app.db[k];
                const rec = books[k];
                const status = rec && rec.page >= 1 ? `▶ ${rec.page}-sahifadan` : rec && rec.finished ? "✓ O'qildi" : 'Yangi';
                const art = root.Art ? root.Art.render(st.cover || st.pages[0].scene, { still: true, seed: k + ':thumb' }) : '';
                return `<button type="button" class="bed-book" data-bed="${esc(k)}"><span class="thumb-art">${art}</span><span><b data-content>${esc(st.title)}</b><small>${status}</small></span></button>`;
            }).join('');
            return `<div class="bedtime-card">
                <div class="play-head"><h3>🌙 Uxlash vaqti</h3><button type="button" class="play-x" data-close aria-label="Yopish">✕</button></div>
                <p class="play-sub">Bugun kechqurun qaysi ertakni o'qiymiz?</p>
                <div class="bed-pages" role="group" aria-label="Nechta sahifa?"><span>Nechta sahifa?</span>${chips}</div>
                <div class="bed-books">${cards}</div>
            </div>`;
        }

        onPickerClick(e) {
            if (!e.target.closest('.bedtime-card')) return;
            const chip = e.target.closest('[data-pages]');
            const book = e.target.closest('[data-bed]');
            if (chip) {
                this.app.store.setSetting('bedtimePages', +chip.dataset.pages);
                e.currentTarget.querySelectorAll('[data-pages]').forEach((b) => b.setAttribute('aria-pressed', String(b === chip)));
            } else if (book) {
                root.Games.close();
                this.start(book.dataset.bed);
            }
        }

        // ---------- reading ----------

        // Opens the book where it was left (or at its first page) for tonight's pages.
        async start(key) {
            const app = this.app;
            const st = app.db[key];
            if (!st) return;
            app.reader.player.unlock(); // still inside the tap: lets the voice play on phones
            this.on = true;
            this.key = key;
            document.documentElement.dataset.bedtime = 'on';
            app.startStory(key);
            const rec = app.store.book(key);
            this.from = rec.page >= 1 && rec.page <= st.pages.length ? rec.page : 1;
            const n = this.pages();
            app.book.calm = true;
            app.book.limit = n ? Math.min(this.from + n - 1, st.pages.length) : st.pages.length;
            app.book.goTo(this.from);
            this.renderChip();
            // someone has read this book aloud: their voice reads on by itself
            await app.loadVoices(false);
            if (this.on && this.key === key && app.voices.length) app.reader.start();
        }

        // Tonight is over, or the grown-up left: everything as it was.
        stop() {
            clearTimeout(this.fadeTimer);
            if (!this.on) return;
            this.on = false;
            this.key = null;
            delete document.documentElement.dataset.bedtime;
            this.app.book.calm = false;
            this.app.book.limit = null;
            this.renderChip();
        }

        // "🌙 2 / 5": tonight's pages, in the bar above the book.
        renderChip() {
            const chip = document.getElementById('bedtimeChip');
            if (!chip) return;
            const { book } = this.app;
            chip.classList.toggle('hidden', !this.on);
            if (this.on && book.limit) chip.textContent = `🌙 ${Math.max(1, Math.min(book.view, book.limit) - this.from + 1)} / ${book.limit - this.from + 1}`;
        }

        // ---------- good night ----------

        // The book tried to go past tonight's last page.
        goodnight() {
            if (!this.on) return;
            const app = this.app;
            const st = app.db[this.key];
            const profile = app.store.profile();
            const last = app.book.limit;
            app.reader.stop();
            let next;
            let stamp = '';
            if (last >= st.pages.length) {
                // the whole book is read: it counts as finished, and may stamp the passport
                const P = root.Passport;
                const place = P && P.regionOf(st);
                const fresh = place && !app.store.book(this.key).finished && !(place.id in P.stamps(app.db, profile));
                app.saveProgress({ view: st.pages.length + 1, end: true, busy: false });
                next = "Ertak tugadi! Ertaga yangisini o'qiymiz.";
                if (fresh) stamp = `${P.stampSVG(place, { date: Date.now() })}<p>🗺️ Yangi muhr: ${esc(place.name)}!</p>`;
            } else {
                // tomorrow begins on the next page
                const rec = app.store.book(this.key);
                rec.page = last + 1;
                profile.last = this.key;
                app.store.save();
                next = `Ertaga shu yerdan davom etamiz: «${st.title}», ${last + 1}-sahifa.`;
            }
            const n = this.night;
            n.querySelector('.goodnight-art').innerHTML = root.Art ? root.Art.render(NIGHT, { seed: 'goodnight' }) : '';
            n.querySelector('.goodnight-title').textContent = `Xayrli tun, ${profile.name}! 🌙`;
            n.querySelector('.goodnight-next').textContent = next;
            n.querySelector('.goodnight-stamp').innerHTML = stamp;
            n.classList.remove('hidden', 'is-faded');
            n.querySelector('[data-goodnight]').focus();
            this.lullaby();
            this.fadeLater();
        }

        fadeLater() {
            clearTimeout(this.fadeTimer);
            this.fadeTimer = setTimeout(() => this.night.classList.add('is-faded'), this.fadeAfter);
        }

        onNightClick(e) {
            if (e.target.closest('[data-goodnight]')) {
                this.leave();
                return;
            }
            // a tap wakes the screen for a while
            this.night.classList.remove('is-faded');
            this.fadeLater();
        }

        leave() {
            this.night.classList.add('hidden');
            this.stop();
            this.app.goHome();
        }

        // Four soft, slow notes, going down.
        lullaby() {
            const ac = this.app.ctx();
            if (!ac) return;
            try {
                [659.25, 523.25, 440, 392].forEach((f, i) => {
                    const o = ac.createOscillator();
                    const g = ac.createGain();
                    const t = ac.currentTime + i * 0.6;
                    o.type = 'sine';
                    o.frequency.value = f;
                    g.gain.setValueAtTime(0.0001, t);
                    g.gain.exponentialRampToValueAtTime(0.06, t + 0.1);
                    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
                    o.connect(g).connect(ac.destination);
                    o.start(t);
                    o.stop(t + 1.15);
                });
            } catch (e) {
                /* audio is optional */
            }
        }
    }

    root.Bedtime = Bedtime;
})(window);
