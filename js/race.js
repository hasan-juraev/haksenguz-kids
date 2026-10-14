/*
 * Yozuv poygasi, the typing race (like TypeRacer). The child types a short
 * text as fast as they can, and their avatar races three animals to the
 * flag: 🐢 Toshbaqa, 🐫 Tuya and 🐎 Tulpor. The animals keep to the child's
 * own pace (the last races at that level), so the turtle is usually beaten
 * and the tulpor takes a good day.
 *
 * The texts come from the books, at three levels:
 *   words   3–4 short words: the Alifbo's and the child's dictionary
 *   short   a proverb (Ikki xalq — bir maqol) or a tongue twister's first line
 *   book    a sentence from a book this child has opened
 * Texts are typed in Uzbek Latin, whatever the script switch says: capitals
 * don't matter, and ' ʻ ʼ ‘ ’ all count for the tutuq and o' g'. Quotes are
 * left out and dashes become "-", so every text can be typed on a phone.
 *
 * A wrong letter turns red, and the race waits until it is fixed (as in
 * TypeRacer). The first race finished each day and each new record are
 * worth points. profile.race keeps the best speed and the last speeds per level.
 */
(function (root) {
    'use strict';

    const LEVELS = ['words', 'short', 'book'];
    const RECENT = 5; // the last speeds kept per level; the animals' pace is their average
    const START_PACE = { words: 5, short: 7, book: 9 }; // so'z/daqiqa before a first race
    // The animals, against the child's pace.
    const RIVALS = [
        { id: 'turtle', icon: '🐢', name: 'Toshbaqa', pace: 0.55 },
        { id: 'camel', icon: '🐫', name: 'Tuya', pace: 0.9 },
        { id: 'horse', icon: '🐎', name: 'Tulpor', pace: 1.25 },
    ];
    const MIN_WPM = 2;
    const DAY_POINTS = 10; // the first race finished each day
    const RECORD_POINTS = 10; // beating this level's best speed

    const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

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

    // Books a child has opened (or finished), else the books on their shelf.
    function readBooks(db, profile, locked) {
        const usable = (k) => !['alifbo', 'kichik'].includes(db[k].category) && !(locked && locked(k));
        const books = (profile && profile.books) || {};
        const opened = Object.keys(db).filter((k) => usable(k) && books[k] && (books[k].page >= 1 || books[k].finished));
        if (opened.length) return opened;
        const shelf = root.Levels && profile ? root.Levels.shelfFor(profile.age) : null;
        return Object.keys(db).filter((k) => usable(k) && (!shelf || root.Levels.fits(db[k], shelf)));
    }

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
            readBooks(db, profile, locked).forEach((k) => db[k].pages.forEach((p) => sentences(p.text).forEach((s) => {
                const text = clean(s);
                if (text.length >= 30 && text.length <= 110) add(text, k);
            })));
        }
        return out;
    }

    const sentences = (text) => (root.BookEngine ? root.BookEngine.sentences(text) : String(text || '').split(/(?<=[.!?])\s+/));

    // A text for the next race, not the one just typed if there is another.
    function pickText(db, profile, level, { locked, not, rand = Math.random } = {}) {
        const list = texts(db, profile, level, locked);
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

    // The child's pace at a level: their last races, or a start by age.
    function pace(profile, level) {
        const recent = (profile && profile.race && profile.race.recent && profile.race.recent[level]) || [];
        if (recent.length) return Math.max(MIN_WPM, recent.reduce((a, b) => a + b, 0) / recent.length);
        const age = profile && profile.age;
        const byAge = !age ? 1 : age <= 6 ? 0.6 : age >= 9 ? 1.4 : 1;
        return START_PACE[level] * byAge;
    }

    // The three animals for a race at this pace, each with a speed.
    const rivals = (p) => RIVALS.map((r) => Object.assign({}, r, { wpm: Math.max(MIN_WPM, Math.round(p * r.pace * 10) / 10) }));

    // Saves a finished race; says what it earned.
    function finish(profile, level, speed, today) {
        const r = record(profile);
        const before = r.best[level] || 0;
        const isRecord = before > 0 && speed > before;
        if (speed > before) r.best[level] = speed;
        r.recent[level] = [...(r.recent[level] || []), speed].slice(-RECENT);
        r.races = (r.races || 0) + 1;
        const firstToday = r.day !== today;
        r.day = today;
        return { isRecord, firstToday, points: (firstToday ? DAY_POINTS : 0) + (isRecord ? RECORD_POINTS : 0) };
    }

    const PLACES = ["🥇 Birinchi bo'ldingiz!", "🥈 Ikkinchi bo'ldingiz!", "🥉 Uchinchi bo'ldingiz!", '🏁 Marraga yetdingiz!'];
    const clock = (ms) => {
        const s = Math.floor(ms / 1000);
        return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    };

    // ---------- the game ----------

    const LEVEL_INFO = {
        words: { icon: '🔤', name: "So'zlar", sub: "3–4 ta qisqa so'z" },
        short: { icon: '💬', name: 'Maqollar', sub: 'Maqol yoki tez aytish' },
        book: { icon: '📖', name: 'Kitobdan', sub: "O'qigan kitobingizdan bir gap" },
    };

    class RaceGame {
        constructor(app) {
            this.app = app;
            this.level = null;
            this.last = null; // the text just raced
            this.frame = 0;
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
                    ${best[l] ? `<span class="race-best">🏆 ${Math.round(best[l])} so'z/daqiqa</span>` : ''}
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
                    </div>
                    <div class="race-light" aria-live="assertive">3</div>
                    <p class="race-text" translate="no" lang="uz"></p>
                    ${from ? `<p class="race-from" data-content>${from}</p>` : ''}
                    <input class="race-input" type="text" lang="uz" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" enterkeyhint="next" aria-label="Shu yerga yozing" placeholder="Shu yerga yozing">
                    <p class="race-hint">⌨️ Klaviaturani lotin harflariga (ABC) o'tkazing. Bosh harf shart emas.</p>
                    <div class="race-stats"><span class="race-time">⏱ 0:00</span><span class="race-speed"></span></div>
                    <div class="race-result hidden" aria-live="polite"></div>
                </div>`, 'play-card--race');

            const $ = (sel) => card.querySelector(sel);
            const input = $('.race-input');
            const box = $('.race-text');
            const light = $('.race-light');
            const lanes = card.querySelectorAll('.race-lane');
            const cars = [...lanes].map((l) => l.querySelector('.race-car'));
            const move = (i, p) => cars[i].style.setProperty('--p', Math.min(1, p).toFixed(4));
            const run = {
                started: false, done: false, t0: 0, wi: 0, doneLen: 0, keys: 0, prevLen: 0, wrong: false,
                rivals: racers.map((r, i) => ({ r, lane: i + 1, pos: 0, at: 0, phase: i * 2.1, cpms: (r.wpm * 5) / 60000 })),
                ahead: 0, // animals at the flag before the child
                finishedAt: 0,
            };
            this.run = run;

            const draw = () => {
                const word = list[run.wi] || '';
                const typed = input.value;
                const good = matched(word, typed);
                const bad = Math.min(typed.length - good, word.length - good);
                const next = bad > 0 ? '' : word.slice(good, good + 1);
                const restWord = word.slice(good + Math.max(bad, 0) + next.length);
                box.innerHTML = `<span class="rt-done">${esc(text.slice(0, run.doneLen))}</span>`
                    + `<span class="rt-word"><span class="rt-ok">${esc(word.slice(0, good))}</span>`
                    + (bad > 0 ? `<span class="rt-bad">${esc(word.slice(good, good + bad))}</span>` : '')
                    + (next ? `<span class="rt-cur">${esc(next)}</span>` : '')
                    + `${esc(restWord)}</span>`
                    + `<span class="rt-rest">${esc(list.slice(run.wi + 1).join(''))}</span>`;
                move(0, (run.doneLen + good) / text.length);
            };

            const finishMe = () => {
                run.done = true;
                run.finishedAt = performance.now();
                const ms = run.finishedAt - run.t0;
                const speed = Math.round(wpm(text.length, ms) * 10) / 10;
                const acc = Math.round((100 * text.length) / Math.max(run.keys, text.length));
                const place = run.ahead;
                input.disabled = true;
                lanes[0].querySelector('.race-wpm').textContent = `${Math.max(1, Math.round(speed))}`;
                lanes[0].classList.add('is-done');
                const earned = finish(this.app.store.profile(), level, speed, new Date().toDateString());
                this.app.store.save();
                if (earned.points) this.app.addPoints(earned.points);
                this.app.playChime(true);
                const res = $('.race-result');
                res.innerHTML = `
                    <p class="race-place">${PLACES[Math.min(place, 3)]}</p>
                    ${earned.isRecord ? '<p class="race-record">🏆 Yangi rekord!</p>' : ''}
                    <div class="race-nums">
                        <span><b>⚡ ${Math.max(1, Math.round(speed))}</b><small>so'z/daqiqa</small></span>
                        <span><b>🎯 ${acc}%</b><small>to'g'ri</small></span>
                        <span><b>⏱ ${clock(ms)}</b><small>vaqt</small></span>
                    </div>
                    ${earned.points ? `<p class="race-points">⭐ +${earned.points} ball</p>` : ''}
                    <div class="race-again">
                        <button type="button" data-again>🔄 Yana poyga</button>
                        <button type="button" data-levels>🏁 Boshqa daraja</button>
                    </div>`;
                res.classList.remove('hidden');
                $('.race-hint').classList.add('hidden');
                card.querySelector('.race-game').classList.add('is-won', `place-${Math.min(place, 3) + 1}`);
                res.querySelector('[data-again]').addEventListener('click', () => this.start(level));
                res.querySelector('[data-levels]').addEventListener('click', () => this.open());
            };

            const onInput = () => {
                if (!run.started || run.done) {
                    input.value = '';
                    return;
                }
                let typed = input.value;
                if (/^\s+$/.test(typed)) {
                    input.value = typed = ''; // a space between words, typed twice
                }
                if (typed.length > run.prevLen) run.keys += typed.length - run.prevLen;
                const word = list[run.wi];
                const good = matched(word, typed);
                const wrong = good < typed.length;
                if (wrong && !run.wrong) {
                    input.classList.remove('is-wrong');
                    void input.offsetWidth;
                    input.classList.add('is-wrong');
                }
                run.wrong = wrong;
                if (!wrong && good === word.length) {
                    run.doneLen += word.length;
                    run.wi++;
                    input.value = '';
                    run.wrong = false;
                }
                run.prevLen = input.value.length;
                draw();
                if (run.wi >= list.length) finishMe();
            };
            input.addEventListener('input', onInput);
            // Enter (or "next" on a phone) ends a word as a space would.
            input.addEventListener('keydown', (e) => {
                if (e.key !== 'Enter') return;
                e.preventDefault();
                const word = list[run.wi];
                if (!run.started || run.done || !word || !/\s$/.test(word)) return;
                const bare = word.trimEnd();
                if (input.value.length === bare.length && matched(bare, input.value) === bare.length) {
                    input.value += ' ';
                    onInput();
                }
            });
            // The text is typed, not pasted.
            ['paste', 'drop'].forEach((ev) => input.addEventListener(ev, (e) => e.preventDefault()));

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
                        lanes[x.lane].querySelector('.race-wpm').textContent = `${Math.round(x.r.wpm)}`;
                        lanes[x.lane].classList.add('is-done');
                    }
                });
                if (!run.done) {
                    const ms = now - run.t0;
                    $('.race-time').textContent = `⏱ ${clock(ms)}`;
                    if (ms > 2000 && run.doneLen) $('.race-speed').textContent = `⚡ ${Math.round(wpm(run.doneLen, ms))} so'z/daqiqa`;
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
                setTimeout(() => light.classList.add('is-gone'), 1200);
            }, 800);
        }

        stop() {
            if (this.frame) cancelAnimationFrame(this.frame);
            if (this.countdown) clearInterval(this.countdown);
            this.frame = 0;
            this.countdown = 0;
        }
    }

    RaceGame.LEVELS = LEVELS;
    RaceGame.RIVALS = RIVALS;
    root.RaceGame = RaceGame;
    root.Race = { LEVELS, RIVALS, clean, typable, same, matched, words, wpm, texts, pickText, pace, rivals, finish, DAY_POINTS, RECORD_POINTS };
})(window);
