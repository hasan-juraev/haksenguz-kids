/*
 * Uzbek Latin -> Cyrillic, and a display layer that shows every piece of
 * Uzbek text on the page in the chosen script, with the app's menus and
 * buttons in the chosen language (Korean: js/i18n.js). Stories stay Uzbek:
 * anything inside [data-content] is never swapped for another language.
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
 *   Translit.setMode('cyr' | 'lat')    Translit.setLang('uz' | 'ko')
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
    // Story text: shown in the chosen script, but never swapped for another language.
    const CONTENT = '[data-content]';
    const ATTRS = ['title', 'aria-label', 'placeholder', 'alt'];
    const ATTR_SEL = ATTRS.map((a) => `[${a}]`).join(',');
    // What the app wrote and what we put on screen instead, so a later switch
    // (or a change made by the app in the meantime) is handled correctly.
    const texts = new WeakMap();
    const attrs = new WeakMap();
    let mode = 'lat';
    let lang = 'uz';
    let observer = null;
    let title = null; // the page title as written in index.html

    const skipped = (el) => !el || !!el.closest(SKIP);
    const active = () => mode === 'cyr' || lang !== 'uz';

    // How the app's text is shown: its menus in the chosen language (js/i18n.js),
    // then everything Uzbek in the chosen script.
    function display(text, el) {
        let out = text;
        if (lang !== 'uz' && root.I18n && !(el && el.closest(CONTENT))) out = root.I18n.translate(out, lang);
        if (mode === 'cyr') out = toCyrillic(out);
        return out;
    }

    function convertText(node, on) {
        const cur = node.nodeValue;
        const rec = texts.get(node);
        const src = rec && cur === rec.out ? rec.src : cur;
        if (!on || !/[A-Za-z]/.test(src) || skipped(node.parentElement)) {
            if (rec && cur === rec.out) node.nodeValue = rec.src;
            texts.delete(node);
            return;
        }
        const out = display(src, node.parentElement);
        if (out === src) {
            if (cur !== src) node.nodeValue = src;
            texts.delete(node);
            return;
        }
        texts.set(node, { src, out });
        if (cur !== out) node.nodeValue = out;
    }

    function convertAttrs(el, on) {
        const recs = attrs.get(el) || {};
        const off = !on || skipped(el);
        ATTRS.forEach((a) => {
            const cur = el.getAttribute(a);
            if (cur === null) return;
            const src = recs[a] && cur === recs[a].out ? recs[a].src : cur;
            const out = off ? src : display(src, el);
            if (out === src) delete recs[a];
            else recs[a] = { src, out };
            if (cur !== out) el.setAttribute(a, out);
        });
        if (Object.keys(recs).length) attrs.set(el, recs);
        else attrs.delete(el);
    }

    function walk(node, on) {
        if (node.nodeType === 3) {
            convertText(node, on);
            return;
        }
        if (node.nodeType !== 1 && node.nodeType !== 11) return;
        const tw = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
        let t;
        while ((t = tw.nextNode())) convertText(t, on);
        if (node.nodeType === 1 && node.matches(ATTR_SEL)) convertAttrs(node, on);
        node.querySelectorAll(ATTR_SEL).forEach((el) => convertAttrs(el, on));
    }

    function watch() {
        if (observer || !root.MutationObserver) return;
        // Whatever the app draws later (pages, cards, toasts) is converted
        // before it is painted. Our own nodeValue writes are not observed.
        observer = new MutationObserver((records) => {
            if (!active()) return;
            records.forEach((r) => {
                if (r.type === 'childList') r.addedNodes.forEach((n) => walk(n, true));
                else convertAttrs(r.target, true);
            });
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ATTRS });
    }

    function refresh() {
        document.documentElement.setAttribute('data-script', mode);
        document.documentElement.setAttribute('data-lang', lang);
        if (title === null) title = document.title;
        document.title = display(title, null);
        if (active()) watch();
        else if (!observer) return; // never changed anything: nothing to restore
        walk(document.body, active());
    }

    // 'lat' | 'cyr': the script Uzbek is shown in.
    function setMode(next) {
        mode = next === 'cyr' ? 'cyr' : 'lat';
        refresh();
    }

    // 'uz' | 'ko': the language of the app's menus and buttons (stories stay Uzbek).
    function setLang(next) {
        lang = next === 'ko' ? 'ko' : 'uz';
        refresh();
    }

    // Both at once, with one pass over the page.
    function set({ script, lang: next }) {
        mode = script === 'cyr' ? 'cyr' : 'lat';
        lang = next === 'ko' ? 'ko' : 'uz';
        refresh();
    }

    function apply(node) {
        if (active() && node) walk(node, true);
    }

    root.Translit = { toCyrillic, setMode, setLang, set, apply, mode: () => mode, lang: () => lang, display: (text) => display(text, null) };
})(window);
