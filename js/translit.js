/*
 * Uzbek Latin -> Cyrillic, and a display layer that shows every piece of
 * Uzbek text on the page in the chosen script.
 *
 * Content is written once, in Latin. With Cyrillic on, text nodes (and a few
 * attributes) are converted as they appear; the Latin original is kept, so
 * switching back restores it exactly. Anything inside translate="no" is left
 * alone (the script toggle itself, the "Zzz" of a sleeping character), and so
 * is any word containing a digit ("3D").
 *
 * So app code should never read Uzbek text back from the page (it may be
 * showing Cyrillic): keep source strings in JS or data and write them out.
 *
 *   Translit.toCyrillic("Bir bor ekan, bir yo'q ekan") -> "Бир бор экан, бир йўқ экан"
 *   Translit.setMode('cyr' | 'lat')
 *   Translit.apply(el)  // convert a freshly built subtree right away (before measuring it)
 */
(function (root) {
    'use strict';

    // oʻ / gʻ letters and the tutuq belgisi are typed with any of these.
    const APOS = "'ʻʼ‘’`";
    const LETTERS = {
        a: 'а', b: 'б', c: 'с', d: 'д', e: 'е', f: 'ф', g: 'г', h: 'ҳ', i: 'и', j: 'ж', k: 'к', l: 'л', m: 'м',
        n: 'н', o: 'о', p: 'п', q: 'қ', r: 'р', s: 'с', t: 'т', u: 'у', v: 'в', w: 'в', x: 'х', y: 'й', z: 'з',
    };
    // Loanwords whose Cyrillic spelling the rules can't guess (whole words only).
    const EXCEPTIONS = {
        kompyuter: 'компьютер', sirk: 'цирк', konsert: 'концерт',
        yanvar: 'январь', fevral: 'февраль', aprel: 'апрель', iyun: 'июнь', iyul: 'июль',
        sentabr: 'сентябрь', oktabr: 'октябрь', noyabr: 'ноябрь', dekabr: 'декабрь',
    };

    const isApos = (ch) => !!ch && APOS.includes(ch);
    const isLetter = (ch) => /[A-Za-z]/.test(ch);
    const isVowel = (ch) => 'aeiou'.includes(ch);

    function convertWord(w) {
        if (/\d/.test(w)) return w;
        const exc = EXCEPTIONS[w.toLowerCase()];
        if (exc) return w[0] === w[0].toUpperCase() ? exc[0].toUpperCase() + exc.slice(1) : exc;

        const allCaps = /[A-Z].*[A-Z]/.test(w) && w === w.toUpperCase();
        let out = '';
        let prevLetter = false;
        let prevVowel = false;
        // Case follows the first Latin letter of the unit: "Sh" -> "Ш", "SHOH" -> "ШОҲ".
        const emit = (cyr, src, vowel) => {
            const upper = src !== src.toLowerCase();
            out += !upper ? cyr : allCaps ? cyr.toUpperCase() : cyr[0].toUpperCase() + cyr.slice(1);
            prevLetter = true;
            prevVowel = vowel;
        };

        for (let i = 0; i < w.length;) {
            const ch = w[i];
            const lo = ch.toLowerCase();
            const next = (w[i + 1] || '').toLowerCase();
            const start = !prevLetter;

            if (isApos(ch)) {
                // tutuq belgisi between letters: ma'no -> маъно, mo''jiza -> мўъжиза
                if (prevLetter && isLetter(w[i + 1] || '')) out += allCaps ? 'Ъ' : 'ъ';
                else out += ch;
                i += 1;
                continue;
            }
            if (!isLetter(ch)) {
                out += ch;
                prevLetter = prevVowel = false;
                i += 1;
                continue;
            }
            if (lo === 's' && isApos(w[i + 1]) && (w[i + 2] || '').toLowerCase() === 'h') {
                emit('сҳ', ch, false); // Is'hoq -> Исҳоқ
                i += 3;
            } else if (lo === 'o' && isApos(w[i + 1])) {
                emit('ў', ch, true);
                i += 2;
            } else if (lo === 'g' && isApos(w[i + 1])) {
                emit('ғ', ch, false);
                i += 2;
            } else if (lo === 's' && next === 'h') {
                emit('ш', ch, false);
                i += 2;
            } else if (lo === 'c' && next === 'h') {
                emit('ч', ch, false);
                i += 2;
            } else if (lo === 'y' && next === 'o' && isApos(w[i + 2])) {
                emit('й', ch, false); // yo'l -> йўл: the oʻ is its own letter
                i += 1;
            } else if (lo === 'y' && (next === 'o' || next === 'u' || next === 'a')) {
                emit({ o: 'ё', u: 'ю', a: 'я' }[next], ch, true);
                i += 2;
            } else if (lo === 'y' && next === 'e') {
                // yer -> ер, poyezd -> поезд; after a consonant only in loanwords: obyekt -> объект
                emit(start || prevVowel ? 'е' : 'ъе', ch, true);
                i += 2;
            } else if (lo === 'e') {
                emit(start || prevVowel ? 'э' : 'е', ch, true); // eshik -> эшик, poeziya -> поэзия
                i += 1;
            } else {
                emit(LETTERS[lo], ch, isVowel(lo));
                i += 1;
            }
        }
        return out;
    }

    function toCyrillic(text) {
        return String(text).replace(/[A-Za-z0-9'ʻʼ‘’`]+/g, convertWord);
    }

    // ---------- display layer ----------

    const SKIP = 'script, style, noscript, textarea, [translate="no"]';
    const ATTRS = ['title', 'aria-label', 'placeholder', 'alt'];
    const ATTR_SEL = ATTRS.map((a) => `[${a}]`).join(',');
    // What we put on screen and what it replaced, so a later switch back
    // (or a change made by the app in the meantime) is handled correctly.
    const texts = new WeakMap();
    const attrs = new WeakMap();
    let mode = 'lat';
    let observer = null;

    const skipped = (el) => !el || !!el.closest(SKIP);

    function convertText(node, cyr) {
        const cur = node.nodeValue;
        const rec = texts.get(node);
        if (!cyr) {
            if (rec && cur === rec.out) node.nodeValue = rec.src;
            texts.delete(node);
            return;
        }
        if ((rec && cur === rec.out) || !/[A-Za-z]/.test(cur) || skipped(node.parentElement)) return;
        const out = toCyrillic(cur);
        if (out === cur) return;
        texts.set(node, { src: cur, out });
        node.nodeValue = out;
    }

    function convertAttrs(el, cyr) {
        if (!cyr) {
            const recs = attrs.get(el);
            if (!recs) return;
            Object.keys(recs).forEach((a) => {
                if (el.getAttribute(a) === recs[a].out) el.setAttribute(a, recs[a].src);
            });
            attrs.delete(el);
            return;
        }
        if (skipped(el)) return;
        ATTRS.forEach((a) => {
            const cur = el.getAttribute(a);
            if (cur === null) return;
            const recs = attrs.get(el) || {};
            if (recs[a] && cur === recs[a].out) return;
            const out = toCyrillic(cur);
            if (out === cur) return;
            recs[a] = { src: cur, out };
            attrs.set(el, recs);
            el.setAttribute(a, out);
        });
    }

    function walk(node, cyr) {
        if (node.nodeType === 3) {
            convertText(node, cyr);
            return;
        }
        if (node.nodeType !== 1 && node.nodeType !== 11) return;
        const tw = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
        let t;
        while ((t = tw.nextNode())) convertText(t, cyr);
        if (node.nodeType === 1 && node.matches(ATTR_SEL)) convertAttrs(node, cyr);
        node.querySelectorAll(ATTR_SEL).forEach((el) => convertAttrs(el, cyr));
    }

    function watch() {
        if (observer || !root.MutationObserver) return;
        // Whatever the app draws later (pages, cards, toasts) is converted
        // before it is painted. Our own nodeValue writes are not observed.
        observer = new MutationObserver((records) => {
            if (mode !== 'cyr') return;
            records.forEach((r) => {
                if (r.type === 'childList') r.addedNodes.forEach((n) => walk(n, true));
                else convertAttrs(r.target, true);
            });
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ATTRS });
    }

    function setMode(next) {
        mode = next === 'cyr' ? 'cyr' : 'lat';
        document.documentElement.setAttribute('data-script', mode);
        if (mode === 'cyr') watch();
        else if (!observer) return; // never shown in Cyrillic: nothing to restore
        walk(document.body, mode === 'cyr');
    }

    function apply(node) {
        if (mode === 'cyr' && node) walk(node, true);
    }

    root.Translit = { toCyrillic, setMode, apply, mode: () => mode };
})(window);
