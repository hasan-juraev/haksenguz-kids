/*
 * Mening lug'atim, my dictionary (ROADMAP Phase 3, item 10). Every "Yangi
 * so'z" card a child has come across becomes a card in their own
 * dictionary, with the picture of the page it was on. A word is collected
 * when its page is opened (profile.words, by js/app.js); every word of a
 * book the child has finished counts too. The dictionary is in Uzbek
 * alphabet order, and its games are in js/games.js.
 */
(function (root) {
    'use strict';

    // The Uzbek Latin alphabet in order; o', g', sh, ch and ng are one letter each.
    const ALPHABET = ['a', 'b', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z', "o'", "g'", 'sh', 'ch', 'ng'];

    // A word as Uzbek letters: "o'rdak" -> o', r, d, a, k. The tutuq (she'r) is a tile of its own.
    function letters(word) {
        const w = String(word).replace(/[ʻʼ‘’`]/g, "'");
        const out = [];
        for (let i = 0; i < w.length; i++) {
            const two = w.slice(i, i + 2).toLowerCase();
            if (two === "o'" || two === "g'" || two === 'sh' || two === 'ch' || (two === 'ng' && w[i + 2] !== "'")) {
                out.push(w.slice(i, i + 2));
                i++;
            } else {
                out.push(w[i]);
            }
        }
        return out;
    }

    // Compares two words letter by letter in alphabet order (anything else sorts after).
    function compare(a, b) {
        const x = letters(a.toLowerCase());
        const y = letters(b.toLowerCase());
        for (let i = 0; i < Math.min(x.length, y.length); i++) {
            const p = ALPHABET.indexOf(x[i]);
            const q = ALPHABET.indexOf(y[i]);
            if (p !== q) return (p < 0 ? 99 : p) - (q < 0 ? 99 : q);
        }
        return x.length - y.length;
    }

    // The Korean meaning of a book's word, from its Korean helper glossary (js/stories-ko.js).
    function koMeaning(book, term) {
        const ko = (root.storiesKorean || {})[book];
        if (!ko || !ko.words || !root.BookEngine) return null;
        const first = String(term).split(/\s+/)[0];
        const hit = ko.words.find(([, , forms]) => root.BookEngine.glossForms(forms)(first));
        return hit ? hit[1] : null;
    }

    // The child's dictionary: one card per word (the first page it was on), in alphabet order.
    function entries(db, profile) {
        const seen = new Set(Object.keys((profile && profile.words) || {}));
        Object.entries((profile && profile.books) || {}).forEach(([book, rec]) => {
            if (rec && rec.finished && db[book]) db[book].pages.forEach((p, i) => p.word && seen.add(`${book}:${i + 1}`));
        });
        const out = [];
        const terms = new Set();
        Object.entries(db).forEach(([book, st]) => st.pages.forEach((p, i) => {
            const key = `${book}:${i + 1}`;
            if (!p.word || !seen.has(key)) return;
            const t = p.word[0].toLowerCase();
            if (terms.has(t)) return;
            terms.add(t);
            out.push({ key, book, view: i + 1, term: p.word[0], meaning: p.word[1], ko: koMeaning(book, p.word[0]), scene: p.scene });
        }));
        return out.sort((a, b) => compare(a.term, b.term));
    }

    // Words fit for "build the word": one word, 3–7 letters.
    const spellable = (e) => !/\s/.test(e.term) && letters(e.term).length >= 3 && letters(e.term).length <= 7;

    // n different items, shuffled (rand: 0..1).
    function pick(list, n, rand = Math.random) {
        const a = list.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a.slice(0, n);
    }

    root.Dictionary = { ALPHABET, letters, compare, koMeaning, entries, spellable, pick };
})(window);
