/*
 * Yozuv poygasi, the typing race (like TypeRacer). The child types a short
 * text as fast as they can, and their avatar races three animals to the
 * flag: 🐢 Toshbaqa, 🐫 Tuya and 🐎 Tulpor. The animals keep to the child's
 * own pace (the median of their last races at that level), so the turtle is
 * usually beaten and the tulpor takes a good day.
 *
 * The texts come from the books, at three levels:
 *   words   3–4 short words: the Alifbo's and the child's dictionary
 *   short   a proverb (Ikki xalq — bir maqol) or a tongue twister's first line
 *   book    a sentence from the pages this child has read
 * Texts are typed in Uzbek Latin, whatever the script switch says: capitals
 * don't matter, and ' ʻ ʼ ‘ ’ all count for the tutuq and o' g'. Quotes are
 * left out and dashes become "-", so every text can be typed on a phone.
 *
 * A wrong letter turns red, and the race waits until it is fixed (as in
 * TypeRacer). Letters from a Korean or Cyrillic keyboard are not taken; the
 * light over the track asks for the ABC keyboard instead. The race pauses
 * while the phone is locked or the app is in the background. The first race
 * finished each day and each new record are worth points. profile.race keeps
 * the best speed and the last speeds per level.
 */
(function (root) {
    'use strict';

    const LEVELS = ['words', 'short', 'book'];
    const RECENT = 5; // the last speeds kept per level; the animals' pace is their median
    // so'z/daqiqa of a first race, by age: young children hunt for every key
    const START_BY_AGE = { 4: 1.5, 5: 2, 6: 2.5, 7: 3.5, 8: 4.5, 9: 6, 10: 7.5 };
    const START_NO_AGE = 4;
    // how fast each level types against the others (short words a little slower)
    const LEVEL_FACTOR = { words: 0.9, short: 1, book: 1 };
    // The animals, against the child's pace.
    const RIVALS = [
        { id: 'turtle', icon: '🐢', name: 'Toshbaqa', pace: 0.55 },
        { id: 'camel', icon: '🐫', name: 'Tuya', pace: 0.9 },
        { id: 'horse', icon: '🐎', name: 'Tulpor', pace: 1.25 },
    ];
    const MIN_PACE = 0.5; // even the slowest child can beat the turtle
    const FLUKE = 2.5; // a race this many times the child's usual speed (a grown-up typing?) sets no record
    const RACE_MINUTES = 1.5; // a book sentence takes about this long at the child's pace
    const DAY_POINTS = 10; // the first race finished each day
    const RECORD_POINTS = 10; // beating this level's best speed
    // Letters from a Korean (한글) or Cyrillic keyboard: the race asks for ABC instead.
    const FOREIGN = /[\u0400-\u04FF\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/;
    const FOREIGN_ALL = new RegExp(FOREIGN.source, 'g');
    // Book sentences that are dialogue once the quotes are gone: "Hoy! - dedi. Keyin...".
    const RUN_ON = /[.!?] - [A-Za-z']|[!?],|\.\.\./;

    const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

    function median(list) {
        const a = list.slice().sort((x, y) => x - y);
        const m = a.length >> 1;
        return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
    }

    // ---------- texts ----------

    // A text made easy to type: one kind of apostrophe, no quotes, plain dashes and spaces.
    function clean(text) {
        return String(text)
            .replace(/[ʻʼ‘’`]/g, "'")
            .replace(/[«»“”„"]/g, '')
            .replace(/[—–]/g, '-')
            .replace(/…/g, '...')
            .replace(/\s+([,.!?:;])/g, '$1')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Only letters, the tutuq and plain punctuation: what any phone keyboard has.
    const typable = (text) => /^[A-Za-z][A-Za-z' ,.!?:;-]*$/.test(text);

    // One typed character against the text's: case, apostrophe and dash styles don't matter.
    const fold = (ch) => String(ch).toLowerCase().replace(/[ʻʼ‘’`]/, "'").replace(/[—–]/, '-');
    const same = (a, b) => fold(a) === fold(b);

    // How much of `want` the typed text gets right from its start.
    function matched(want, typed) {
        let i = 0;
        while (i < typed.length && i < want.length && same(typed[i], want[i])) i++;
        return i;
    }

    // The text as the race goes, one word at a time: each word keeps its space.
    const words = (text) => text.match(/\S+\s*/g) || [];

    // Speed in words a minute (a word is 5 letters, as in every typing test).
    const wpm = (chars, ms) => (ms > 0 ? (chars / 5) / (ms / 60000) : 0);

    function shuffle(list, rand) {
        const a = list.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    const usable = (db, k, locked) => !['alifbo', 'kichik'].includes(db[k].category) && !(locked && locked(k));

    // Books a child has opened or finished.
    function openedBooks(db, profile, locked) {
        const books = (profile && profile.books) || {};
        return Object.keys(db).filter((k) => usable(db, k, locked) && books[k] && (books[k].page >= 1 || books[k].finished));
    }

    // The books on the child's age shelf (every book without an age).
    function shelfBooks(db, profile, locked) {
        const shelf = root.Levels && profile ? root.Levels.shelfFor(profile.age) : null;
        return Object.keys(db).filter((k) => usable(db, k, locked) && (!shelf || root.Levels.fits(db[k], shelf)));
    }

    const sentences = (text) => (root.BookEngine ? root.BookEngine.sentences(text) : String(text || '').split(/(?<=[.!?])\s+/));

    // Every text a level offers: [{ text, book }].
    function texts(db, profile, level, locked) {
        const out = [];
        const add = (raw, book) => {
            const text = clean(raw);
            if (typable(text)) out.push({ text, book });
        };
        if (level === 'words') {
            const D = root.Dictionary;
            const mine = D && profile ? D.entries(db, profile).map((e) => e.term) : [];
            const abc = db.alifbo ? db.alifbo.pages.filter((p) => p.word).map((p) => p.word[0]) : [];
            const pool = [...new Set([...abc, ...mine].map((w) => clean(w).toLowerCase()))].filter((w) => /^[a-z']{2,7}$/.test(w) && w[0] !== "'");
            const n = profile && profile.age && profile.age <= 6 ? 3 : 4;
            // a handful of word sets; texts() is called again for each race
            for (let i = 0; i < 6 && pool.length >= n; i++) out.push({ text: shuffle(pool, Math.random).slice(0, n).join(' '), book: null });
        } else if (level === 'short') {
            if (db.maqollar) db.maqollar.pages.forEach((p) => add(p.title, 'maqollar'));
            if (db.tez_aytish) db.tez_aytish.pages.forEach((p) => add(sentences(p.text)[0] || '', 'tez_aytish'));
        } else {
            // only the pages read so far, so a race never tells how a story ends
            const books = (profile && profile.books) || {};
            const read = (k) => (books[k] && !books[k].finished && books[k].page >= 1 ? db[k].pages.slice(0, books[k].page) : db[k].pages);
            const from = (keys) => keys.forEach((k) => read(k).forEach((p) => sentences(p.text).forEach((s) => {
                const text = clean(s);
                if (text.length >= 30 && text.length <= 110 && !RUN_ON.test(text)) add(text, k);
            })));
            const mine = openedBooks(db, profile, locked);
            from(mine);
            if (out.length < 4) from(shelfBooks(db, profile, locked).filter((k) => !mine.includes(k)));
        }
        return out;
    }

    // A text for the next race, not the one just typed if there is another. Book
    // sentences are kept to about RACE_MINUTES at the child's pace.
    function pickText(db, profile, level, { locked, not, rand = Math.random } = {}) {
        let list = texts(db, profile, level, locked);
        if (level === 'book') {
            const most = Math.max(40, Math.round(pace(profile, level) * 5 * RACE_MINUTES));
            const fit = list.filter((t) => t.text.length <= most);
            list = fit.length >= 4 ? fit : list.slice().sort((a, b) => a.text.length - b.text.length).slice(0, 4);
        }
        const fresh = list.filter((t) => t.text !== not);
        const from = fresh.length ? fresh : list;
        return from.length ? from[Math.floor(rand() * from.length)] : null;
    }

    // ---------- pace and records ----------

    const record = (profile) => {
        const r = (profile.race = profile.race || {});
        r.best = r.best || {};
        r.recent = r.recent || {};
        return r;
    };

    // The child's pace at a level: the median of their last races there, else
    // of their races at the other levels, else a start by age.
    function pace(profile, level) {
        const all = (profile && profile.race && profile.race.recent) || {};
        const mine = all[level] || [];
        if (mine.length) return Math.max(MIN_PACE, median(mine));
        const other = LEVELS.filter((l) => l !== level).flatMap((l) => (all[l] || []).map((s) => s / LEVEL_FACTOR[l]));
        if (other.length) return Math.max(MIN_PACE, median(other) * LEVEL_FACTOR[level]);
        const age = profile && profile.age;
        return (age ? START_BY_AGE[Math.min(10, Math.max(4, age))] : START_NO_AGE) * LEVEL_FACTOR[level];
    }

    // The three animals for a race at this pace, each with a speed.
    const rivals = (p) => RIVALS.map((r) => Object.assign({}, r, { wpm: Math.max(0.1, Math.round(p * r.pace * 10) / 10) }));

    // Saves a finished race; says what it earned. A record is a bigger number on
    // screen; a race far faster than usual (a grown-up typing) counts for the day
    // but sets no record.
    function finish(profile, level, speed, today) {
        const r = record(profile);
        const recent = r.recent[level] || [];
        const fluke = recent.length >= 3 && speed > FLUKE * median(recent);
        const before = r.best[level] || 0;
        const isRecord = !fluke && before > 0 && Math.round(speed) > Math.round(before);
        if (!fluke && speed > before) r.best[level] = speed;
        r.recent[level] = [...recent, speed].slice(-RECENT);
        r.races = (r.races || 0) + 1;
        const firstToday = r.day !== today;
        r.day = today;
        return { isRecord, fluke, firstToday, points: (firstToday ? DAY_POINTS : 0) + (isRecord ? RECORD_POINTS : 0) };
    }

    const PLACES = ["🥇 Birinchi bo'ldingiz!", "🥈 Ikkinchi bo'ldingiz!", "🥉 Uchinchi bo'ldingiz!", '🏁 Marraga yetdingiz!'];
    const clock = (ms) => {
        const s = Math.floor(Math.max(0, ms) / 1000);
        return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    };
    const shown = (speed) => Math.max(1, Math.round(speed)); // speeds on screen are whole and never 0

    // ---------- the game ----------

    const LEVEL_INFO = {
        words: { icon: '🔤', name: "So'zlar", sub: "3–4 ta qisqa so'z" },
        short: { icon: '💬', name: 'Maqollar', sub: 'Maqol yoki tez aytish' },
        book: { icon: '📖', name: 'Kitobdan', sub: "O'qigan kitobingizdan bir gap" },
    };
    const WARN = "⌨️ ABC ga o'ting (한/영)";

    class RaceGame {
        constructor(app) {
            this.app = app;
            this.level = null;
            this.last = null; // the text just raced
            this.run = null;
            this.frame = 0;
            this.countdown = 0;
            this.cleanup = []; // listeners to take off when the race stops
        }

        defaultLevel() {
            const age = this.app.store.profile().age;
            return !age ? 'short' : age <= 6 ? 'words' : age >= 9 ? 'book' : 'short';
        }

        // Choosing a level.
        open() {
            if (!root.Games) return;
            this.stop();
            this.app.reader.stop();
            const p = this.app.store.profile();
            const best = (p.race && p.race.best) || {};
            const mine = this.level || this.defaultLevel();
            const levels = LEVELS.map((l) => {
                const info = LEVEL_INFO[l];
                return `<button type="button" class="race-level${l === mine ? ' is-mine' : ''}" data-level="${l}">
                    <span class="race-level-icon" aria-hidden="true">${info.icon}</span><b>${info.name}</b><small>${info.sub}</small>
                    ${best[l] ? `<span class="race-best">🏆 ${shown(best[l])} so'z/daqiqa</span>` : ''}
                </button>`;
            }).join('');
            const card = root.Games.open(`
                <div class="race-setup">
                    <div class="play-head"><h3>🏁 Yozuv poygasi</h3><button type="button" class="play-x" data-close aria-label="Yopish">✕</button></div>
                    <p class="play-sub">Kim tezroq yozadi? Toshbaqa, tuya va tulpor bilan poyga qiling!</p>
                    <div class="race-rivals" aria-hidden="true">${RIVALS.map((r) => `<span><i>${r.icon}</i>${r.name}</span>`).join('')}</div>
                    <div class="race-levels">${levels}</div>
                </div>`, 'play-card--race');
            card.querySelector('.race-levels').addEventListener('click', (e) => {
                const b = e.target.closest('[data-level]');
                if (b) this.start(b.dataset.level);
            });
            const suggested = card.querySelector('.race-level.is-mine');
            if (suggested) suggested.focus();
        }

        // A race: the lanes, the text and the box to type in.
        start(level) {
            this.stop();
            this.level = level;
            const profile = this.app.store.profile();
            const opts = { locked: (k) => this.app.isLocked(k), not: this.last };
            const pick = pickText(this.app.db, profile, level, opts) || pickText(this.app.db, profile, 'short', opts);
            if (!pick) return;
            this.last = pick.text;
            const text = pick.text;
            const list = words(text);
            const racers = rivals(pace(profile, level));
            const lane = (cls, icon, name, extra) => `
                <div class="race-lane ${cls}">
                    <span class="race-name"><i aria-hidden="true">${icon}</i> <span${extra}>${name}</span></span>
                    <div class="race-road"><span class="race-car" aria-hidden="true">${icon}</span><span class="race-flag" aria-hidden="true">🏁</span></div>
                    <span class="race-wpm"></span>
                </div>`;
            const from = pick.book && this.app.db[pick.book] ? `📖 ${esc(this.app.db[pick.book].title)}` : '';
            const card = root.Games.open(`
                <div class="race-game">
                    <div class="play-head"><h3>🏁 Yozuv poygasi</h3><button type="button" class="play-x" data-close aria-label="Yopish">✕</button></div>
                    <div class="race-track">
                        ${lane('is-me', esc(profile.avatar), esc(profile.name), ' data-content')}
                        ${racers.map((r) => lane('is-rival', r.icon, r.name, '')).join('')}
                        <div class="race-light" aria-live="assertive">3</div>
                    </div>
                    <div class="race-stats"><span class="race-time">⏱ 0:00</span><span class="race-speed"></span></div>
                    <p class="race-text" translate="no" lang="uz"></p>
                    ${from ? `<p class="race-from" data-content>${from}</p>` : ''}
                    <p class="race-hint">⌨️ Klaviaturani lotin harflariga (ABC) o'tkazing. Bosh harf shart emas.</p>
                    <input class="race-input" type="text" lang="uz" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" enterkeyhint="next" aria-label="Shu yerga yozing" placeholder="Shu yerga yozing">
                    <div class="race-result hidden" aria-live="polite"></div>
                </div>`, 'play-card--race');

            const $ = (sel) => card.querySelector(sel);
            const game = $('.race-game');
            const input = $('.race-input');
            const box = $('.race-text');
            const light = $('.race-light');
            const lanes = card.querySelectorAll('.race-lane');
            const cars = [...lanes].map((l) => l.querySelector('.race-car'));
            const move = (i, p) => cars[i].style.setProperty('--p', Math.min(1, p).toFixed(4));
            const run = {
                started: false, done: false, t0: 0, last: 0, hiddenAt: 0,
                wi: 0, doneLen: 0, keys: 0, prevLen: 0, wrong: false,
                rivals: racers.map((r, i) => ({ r, lane: i + 1, pos: 0, at: 0, phase: i * 2.1, cpms: (r.wpm * 5) / 60000 })),
                ahead: 0, // animals at the flag before the child
                finishedAt: 0,
                shownTime: '', shownSpeed: '',
            };
            this.run = run;
            const on = (target, ev, fn) => {
                target.addEventListener(ev, fn);
                this.cleanup.push(() => target.removeEventListener(ev, fn));
            };

            // What the race reads from the box: no letters from a Korean or Cyrillic
            // keyboard, no space left over from the word before, and no space a
            // keyboard adds after the last word.
            const read = () => {
                let t = input.value.replace(FOREIGN_ALL, '').replace(/^\s+/, '');
                if (run.wi === list.length - 1) t = t.replace(/\s+$/, '');
                return t;
            };

            const draw = () => {
                const word = list[run.wi] || '';
                const typed = read();
                const good = matched(word, typed);
                const bad = Math.min(typed.length - good, word.length - good);
                const over = good === word.length && typed.length > good; // more typed than the word holds
                const next = bad > 0 || over ? '' : word.slice(good, good + 1);
                const restWord = word.slice(good + Math.max(bad, 0) + next.length);
                box.innerHTML = `<span class="rt-done">${esc(text.slice(0, run.doneLen))}</span>`
                    + `<span class="rt-word"><span class="rt-ok">${esc(word.slice(0, good))}</span>`
                    + (bad > 0 ? `<span class="rt-bad">${esc(word.slice(good, good + bad))}</span>` : '')
                    + (next ? `<span class="rt-cur">${esc(next)}</span>` : '')
                    + `${esc(restWord)}</span>`
                    + (over ? '<span class="rt-bad">⌫</span>' : '')
                    + `<span class="rt-rest">${esc(list.slice(run.wi + 1).join(''))}</span>`;
                move(0, (run.doneLen + good) / text.length);
            };

            // The light over the track asks for the ABC keyboard while letters come from another one.
            const warn = (yes) => {
                if (yes) {
                    light.textContent = WARN;
                    light.classList.remove('is-go', 'is-gone');
                    light.classList.add('is-warn');
                } else if (light.classList.contains('is-warn')) {
                    light.classList.remove('is-warn');
                    light.classList.add('is-gone');
                }
            };

            const finishMe = () => {
                run.done = true;
                run.finishedAt = performance.now();
                const ms = run.finishedAt - run.t0;
                const speed = Math.round(wpm(text.length, ms) * 10) / 10;
                const acc = Math.round((100 * text.length) / Math.max(run.keys, text.length));
                const place = run.ahead;
                warn(false);
                input.disabled = true; // the phone keyboard closes
                lanes[0].querySelector('.race-wpm').textContent = `${shown(speed)}`;
                lanes[0].classList.add('is-done');
                const earned = finish(this.app.store.profile(), level, speed, new Date().toDateString());
                this.app.store.save();
                if (earned.points) this.app.addPoints(earned.points);
                this.app.playChime(true);
                game.classList.add('is-won', `place-${Math.min(place, 3) + 1}`);
                const res = $('.race-result');
                res.classList.remove('hidden'); // shown first, so the live region reads what comes in
                res.innerHTML = `
                    <p class="race-place">${PLACES[Math.min(place, 3)]}</p>
                    ${earned.isRecord ? '<p class="race-record">🏆 Yangi rekord!</p>' : ''}
                    <div class="race-nums">
                        <span><b>⚡ ${shown(speed)}</b><small>so'z/daqiqa</small></span>
                        <span><b>🎯 ${acc}%</b><small>to'g'ri</small></span>
                        <span><b>⏱ ${clock(ms)}</b><small>vaqt</small></span>
                    </div>
                    ${earned.points ? `<p class="race-points">⭐ +${earned.points} ball</p>` : ''}
                    <div class="race-again">
                        <button type="button" data-again>🔄 Yana poyga</button>
                        <button type="button" data-levels>🏁 Boshqa daraja</button>
                    </div>`;
                const again = res.querySelector('[data-again]');
                again.addEventListener('click', () => this.start(level));
                res.querySelector('[data-levels]').addEventListener('click', () => this.open());
                const buttons = res.querySelector('.race-again');
                if (buttons.scrollIntoView) buttons.scrollIntoView({ block: 'nearest' });
                // a moment later, so an Enter typed with the last letter doesn't start a new race
                setTimeout(() => {
                    if (again.isConnected) again.focus({ preventScroll: true });
                }, 800);
            };

            const onInput = (e) => {
                if (!run.started || run.done) {
                    input.value = '';
                    return;
                }
                const composing = !!(e && e.isComposing);
                warn(FOREIGN.test(input.value));
                // Korean or Cyrillic letters and a leading space go, once the keyboard has let go of them
                if (!composing) {
                    const tidy = input.value.replace(FOREIGN_ALL, '').replace(/^\s+/, '');
                    if (tidy !== input.value) input.value = tidy;
                }
                let typed = read();
                if (typed.length > run.prevLen) run.keys += typed.length - run.prevLen;
                // Whole words done; a keyboard suggestion can bring more than one at once.
                let advanced = false;
                while (run.wi < list.length) {
                    const w = list[run.wi];
                    if (typed.length < w.length || matched(w, typed) < w.length) break;
                    run.doneLen += w.length;
                    run.wi++;
                    typed = typed.slice(w.length).replace(/^\s+/, '');
                    advanced = true;
                }
                if (advanced) input.value = typed;
                if (run.wi >= list.length) {
                    input.classList.remove('is-wrong');
                    draw();
                    finishMe();
                    return;
                }
                const word = list[run.wi];
                const good = matched(word, typed);
                const wrong = good < typed.length;
                if (wrong && !run.wrong) {
                    input.classList.remove('is-wrong');
                    void input.offsetWidth; // restart the shake
                }
                input.classList.toggle('is-wrong', wrong);
                run.wrong = wrong;
                // a letter fixed in the middle of a word: the next one goes at the end
                if (!wrong && !composing && input.selectionStart < input.value.length) input.setSelectionRange(input.value.length, input.value.length);
                run.prevLen = typed.length;
                draw();
            };
            on(input, 'input', onInput);
            on(input, 'compositionend', () => onInput({ isComposing: false }));
            // Enter (or "next" on a phone) ends a word as a space would.
            on(input, 'keydown', (e) => {
                if (e.key !== 'Enter' || e.isComposing) return;
                e.preventDefault();
                const word = list[run.wi];
                if (!run.started || run.done || !word) return;
                const typed = read();
                const bare = word.trimEnd();
                if (bare.length < word.length && typed.length === bare.length && matched(bare, typed) === bare.length) {
                    input.value = `${typed} `;
                    onInput();
                }
            });
            // The text is typed, not pasted.
            ['paste', 'drop'].forEach((ev) => on(input, ev, (e) => e.preventDefault()));
            // Taps on the text or the track keep the keyboard open; a tap outside the
            // card doesn't throw the race away (✕ and Escape still close it).
            const racing = () => this.run === run && !run.done;
            on(game, 'mousedown', (e) => {
                if (racing() && !e.target.closest('button, input')) e.preventDefault();
            });
            on(game, 'click', (e) => {
                if (racing() && !e.target.closest('button, input')) input.focus();
            });
            const modal = card.closest('.play-modal');
            if (modal) {
                on(modal, 'click', (e) => {
                    if (e.target !== modal || !racing()) return;
                    e.stopPropagation(); // before js/games.js closes the window
                    input.focus();
                });
            }
            // The race pauses while the phone is locked or another app is open.
            on(document, 'visibilitychange', () => {
                const now = performance.now();
                if (document.hidden) {
                    run.hiddenAt = now;
                } else if (run.hiddenAt) {
                    if (run.started && !run.done) run.t0 += now - Math.max(run.hiddenAt, run.t0);
                    run.hiddenAt = 0;
                    run.last = 0; // the animals go on from where they stopped
                }
            });
            // The window fits what the phone keyboard leaves free, so the track stays in sight.
            const vv = root.visualViewport;
            if (vv && modal) {
                const fit = () => {
                    modal.style.top = `${vv.offsetTop}px`;
                    modal.style.height = `${vv.height}px`;
                    modal.style.bottom = 'auto';
                };
                on(vv, 'resize', fit);
                on(vv, 'scroll', fit);
                this.cleanup.push(() => {
                    modal.style.top = '';
                    modal.style.height = '';
                    modal.style.bottom = '';
                });
                fit();
            }

            // The animals run with a little sway, so no race looks the same.
            const tick = (now) => {
                if (!input.isConnected) return this.stop(); // the window was closed
                const dt = Math.min(100, now - (run.last || now));
                run.last = now;
                run.rivals.forEach((x) => {
                    if (x.at) return;
                    x.pos += dt * x.cpms * (1 + 0.2 * Math.sin(now / 800 + x.phase));
                    move(x.lane, x.pos / text.length);
                    if (x.pos >= text.length) {
                        x.at = now;
                        if (!run.done) run.ahead++;
                        lanes[x.lane].querySelector('.race-wpm').textContent = `${shown(x.r.wpm)}`;
                        lanes[x.lane].classList.add('is-done');
                    }
                });
                if (!run.done) {
                    const ms = Math.max(0, now - run.t0);
                    const time = `⏱ ${clock(ms)}`;
                    if (time !== run.shownTime) $('.race-time').textContent = run.shownTime = time;
                    const typed = run.doneLen + matched(list[run.wi] || '', read());
                    const speed = ms > 2000 && typed ? `⚡ ${Math.round(wpm(typed, ms))} so'z/daqiqa` : '';
                    if (speed && speed !== run.shownSpeed) $('.race-speed').textContent = run.shownSpeed = speed;
                }
                // after the child's finish, the animals still running get a few seconds more
                const allIn = run.rivals.every((x) => x.at);
                if (run.done && (allIn || now - run.finishedAt > 6000)) return this.stop();
                this.frame = requestAnimationFrame(tick);
            };

            // 3, 2, 1, go! The box takes the keyboard now, while the tap still counts on phones.
            draw();
            input.focus();
            let count = 3;
            this.app.playChime();
            this.countdown = setInterval(() => {
                if (!input.isConnected) return this.stop();
                count--;
                if (count > 0) {
                    light.textContent = String(count);
                    this.app.playChime();
                    return;
                }
                clearInterval(this.countdown);
                this.countdown = 0;
                light.textContent = '🚦 Boshla!';
                light.classList.add('is-go');
                this.app.playChime(true);
                run.started = true;
                run.t0 = performance.now();
                input.value = '';
                input.focus();
                draw();
                this.frame = requestAnimationFrame(tick);
                setTimeout(() => {
                    if (!light.classList.contains('is-warn')) light.classList.add('is-gone');
                }, 1200);
            }, 800);
        }

        stop() {
            if (this.frame) cancelAnimationFrame(this.frame);
            if (this.countdown) clearInterval(this.countdown);
            this.frame = 0;
            this.countdown = 0;
            this.cleanup.splice(0).forEach((undo) => undo());
        }
    }

    RaceGame.LEVELS = LEVELS;
    RaceGame.RIVALS = RIVALS;
    root.RaceGame = RaceGame;
    root.Race = { LEVELS, RIVALS, clean, typable, same, matched, words, wpm, median, texts, pickText, pace, rivals, finish, DAY_POINTS, RECORD_POINTS, FOREIGN };
})(window);
