/*
 * Kunlik 5 so'z, five words a day (ROADMAP Phase 4, item 18). A few minutes
 * a day with the child's own dictionary (js/dictionary.js). A word the child
 * knows comes back after 1, 2, 4, 8, 16 and then every 32 days, so it
 * returns just before it would be forgotten; a word missed comes back the
 * next day. The schedule is kept in profile.review: the word (lower case)
 * -> { box, due }, with box 1–6 and due a day as 'YYYY-MM-DD'. The game is
 * Games.review (js/games.js); js/app.js keeps the schedule.
 */
(function (root) {
    'use strict';

    const PER_DAY = 5;
    // Days until a word comes back, by its box. A word known goes up a box,
    // a word missed goes back to the first.
    const DAYS = [0, 1, 2, 4, 8, 16, 32];
    const TOP = DAYS.length - 1;

    const pad = (n) => String(n).padStart(2, '0');
    // A day as 'YYYY-MM-DD', in the phone's own time zone.
    const day = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    // n days after a day.
    function addDays(on, n) {
        const [y, m, d] = on.split('-').map(Number);
        return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
    }
    // Whole days from one day to another.
    function between(from, to) {
        const t = (s) => Date.UTC(...s.split('-').map((x, i) => Number(x) - (i === 1 ? 1 : 0)));
        return Math.round((t(to) - t(from)) / 864e5);
    }

    const key = (e) => String(e.term).toLowerCase();

    function shuffle(list, rand = Math.random) {
        const a = list.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // The words to ask on a day, up to n: those due, the longest waiting
    // first, then words never asked.
    function due(entries, state, on, n = PER_DAY, rand = Math.random) {
        const s = state || {};
        const waiting = entries.filter((e) => s[key(e)] && s[key(e)].due <= on)
            .sort((a, b) => s[key(a)].due.localeCompare(s[key(b)].due) || s[key(a)].box - s[key(b)].box);
        const fresh = shuffle(entries.filter((e) => !s[key(e)]), rand);
        return waiting.concat(fresh).slice(0, Math.max(0, n));
    }

    // A word's schedule after an answer on a day.
    function answer(rec, right, on) {
        const box = right ? Math.min(TOP, ((rec && rec.box) || 0) + 1) : 1;
        return { box, due: addDays(on, DAYS[box]) };
    }

    // When words come back after a day: { on, n } for the first day with any, or null.
    function next(entries, state, on) {
        const s = state || {};
        const days = entries.map((e) => s[key(e)] && s[key(e)].due).filter((d) => d && d > on).sort();
        if (!days.length) return null;
        return { on: days[0], n: days.filter((d) => d === days[0]).length };
    }

    // How the words are growing: 🌱 new or missed lately (box 0–1), 🌿 growing (2–3), 🌳 known (4–6).
    function garden(entries, state) {
        const s = state || {};
        const out = { seed: 0, sprout: 0, tree: 0 };
        entries.forEach((e) => {
            const b = (s[key(e)] && s[key(e)].box) || 0;
            if (b >= 4) out.tree++;
            else if (b >= 2) out.sprout++;
            else out.seed++;
        });
        return out;
    }

    // What a word means, with the word itself left out ("laylaklar" in
    // laylak's meaning would give it away).
    function clue(e) {
        const t = String(e.term).toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return String(e.meaning || '').replace(new RegExp(`(^|[^a-z'ʻ’])${t}[a-z'ʻ’]*`, 'gi'), '$1…');
    }

    // The words to choose from for a card: the right one and n - 1 others, mixed.
    function choices(entry, entries, n = 3, rand = Math.random) {
        const others = shuffle(entries.filter((e) => key(e) !== key(entry)), rand).slice(0, n - 1);
        return shuffle([entry].concat(others), rand);
    }

    root.Review = { PER_DAY, DAYS, TOP, day, addDays, between, key, due, answer, next, garden, clue, choices };
})(window);
