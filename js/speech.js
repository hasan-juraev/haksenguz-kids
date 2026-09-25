/*
 * Speech helpers for Uzbek text.
 *
 * - segment()/markup(): split a page into sentences and words. The book wraps
 *   them in <span class="s" data-s> / <span class="w" data-w> so the narrator
 *   can highlight exactly what it is reading. Quoted speech «...» becomes its
 *   own segment, so dialogue can be read in a character voice.
 * - toCyrillic(): Uzbek Latin → Uzbek Cyrillic.
 * - respell(): when a device has no Uzbek voice, a related-language voice
 *   (Kazakh, Azerbaijani, Kyrgyz, Turkish, Russian) reads Uzbek much better
 *   if the words are respelled in that language's orthography.
 * - voiceInfo(): ranks a SpeechSynthesisVoice for reading Uzbek.
 *
 * Plain browser script (window.Speech); also loaded by
 * tools/generate-narration.mjs in Node.
 */
(function (root) {
    'use strict';

    const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

    // o‘ g‘ and the tutuq belgisi come in several apostrophe shapes.
    const norm = (s) => String(s).replace(/[ʻʼ‘’`´]/g, "'");

    const SENTENCE_END = /[.!?…]["»”)]*[,]?$/;
    const hasSound = (t) => /[\p{L}\p{N}]/u.test(t);

    // → [{ q: isDialogue, toks: [...] }]
    function segment(text) {
        const tokens = norm(text).split(/\s+/).filter(Boolean);
        const segs = [];
        let cur = null;
        let inQuote = false;
        const push = () => {
            if (cur && cur.toks.length) segs.push(cur);
            cur = null;
        };
        for (const tok of tokens) {
            if (tok.includes('«') && !inQuote) {
                push();
                inQuote = true;
            }
            if (!cur) cur = { q: inQuote, toks: [] };
            cur.toks.push(tok);
            if (inQuote && tok.includes('»')) {
                inQuote = false;
                push();
            } else if (SENTENCE_END.test(tok) || tok === '•') {
                push();
            }
        }
        push();
        return segs;
    }

    function stem(t) {
        return norm(t).toLowerCase().replace(/[^a-z']/g, '').replace(/^'+|'+$/g, '');
    }

    // ctx = { s, w } running counters so numbering continues across elements.
    function markup(text, ctx, opts = {}) {
        const vocab = opts.vocab ? stem(opts.vocab) : '';
        return segment(text).map((sg) => {
            const s = ctx.s++;
            const words = sg.toks.map((t) => {
                const w = ctx.w++;
                const v = vocab.length >= 3 && stem(t).startsWith(vocab);
                return `<span class="w${v ? ' w--vocab' : ''}" data-w="${w}">${esc(t)}</span>`;
            }).join(' ');
            return `<span class="s" data-s="${s}"${sg.q ? ' data-q="1"' : ''}>${words}</span>`;
        }).join(' ');
    }

    // ---------- Latin → Cyrillic ----------

    const CYR = {
        a: 'а', b: 'б', c: 'с', d: 'д', f: 'ф', g: 'г', h: 'ҳ', i: 'и', j: 'ж', k: 'к', l: 'л', m: 'м', n: 'н',
        o: 'о', p: 'п', q: 'қ', r: 'р', s: 'с', t: 'т', u: 'у', v: 'в', w: 'в', x: 'х', y: 'й', z: 'з',
    };
    const isLatin = (c) => /[a-z]/i.test(c || '');

    function toCyrillic(input) {
        const s = norm(input);
        let out = '';
        for (let i = 0; i < s.length; i++) {
            const ch = s[i];
            const lo = ch.toLowerCase();
            const upper = ch !== lo;
            const cap = (c) => (upper ? c.toUpperCase() : c);
            const next = (s[i + 1] || '').toLowerCase();
            const next2 = s[i + 2] || '';
            const prev = i > 0 ? s[i - 1].toLowerCase() : '';
            if ((lo === 'o' || lo === 'g') && next === "'") {
                out += cap(lo === 'o' ? 'ў' : 'ғ');
                i++;
            } else if (lo === 's' && next === 'h') {
                out += cap('ш');
                i++;
            } else if (lo === 'c' && next === 'h') {
                out += cap('ч');
                i++;
            } else if (lo === 'y' && next === 'o' && next2 !== "'") {
                out += cap('ё');
                i++;
            } else if (lo === 'y' && (next === 'u' || next === 'a' || next === 'e')) {
                out += cap({ u: 'ю', a: 'я', e: 'е' }[next]);
                i++;
            } else if (lo === 'e') {
                out += cap(!isLatin(prev) || /[aeiou]/.test(prev) ? 'э' : 'е');
            } else if (ch === "'") {
                out += isLatin(prev) && isLatin(s[i + 1]) ? 'ъ' : ch;
            } else if (CYR[lo]) {
                out += cap(CYR[lo]);
            } else {
                out += ch;
            }
        }
        return out;
    }

    // ---------- respelling for related-language voices ----------

    function swap(str, pairs) {
        return pairs.reduce((acc, [a, b]) => acc.split(a).join(b), str);
    }

    function respell(token, lang) {
        if (!lang || lang === 'uz') return norm(token);
        if (lang === 'ru' || lang === 'kk' || lang === 'ky') {
            let c = toCyrillic(token);
            if (lang === 'kk') c = swap(c, [['ў', 'о'], ['Ў', 'О'], ['ҳ', 'һ'], ['Ҳ', 'Һ']]);
            else c = swap(c, [['ў', lang === 'ky' ? 'о' : 'у'], ['Ў', lang === 'ky' ? 'О' : 'У'], ['қ', 'к'], ['Қ', 'К'], ['ғ', 'г'], ['Ғ', 'Г'], ['ҳ', 'х'], ['Ҳ', 'Х']]);
            return c.replace(/ъ/g, '');
        }
        // Latin Turkic spellings: Turkish (tr) and Azerbaijani (az).
        let t = swap(norm(token), [
            ["O'", 'O'], ["o'", 'o'], ["G'", lang === 'az' ? 'Ğ' : 'G'], ["g'", lang === 'az' ? 'ğ' : 'g'],
            ['SH', 'Ş'], ['Sh', 'Ş'], ['sh', 'ş'], ['CH', 'Ç'], ['Ch', 'Ç'], ['ch', 'ç'], ['J', 'C'], ['j', 'c'],
        ]);
        if (lang === 'tr') t = swap(t, [['X', 'H'], ['x', 'h'], ['Q', 'K'], ['q', 'k'], ['W', 'V'], ['w', 'v']]);
        return t.replace(/([\p{L}])'([\p{L}])/gu, '$1$2');
    }

    // ---------- voices ----------

    const LANGS = { uz: 100, kk: 46, az: 44, ky: 43, tr: 40, ru: 20 };
    const LANG_NAMES = { uz: "o'zbekcha", kk: 'qozoqcha', az: 'ozarbayjoncha', ky: "qirg'izcha", tr: 'turkcha', ru: 'ruscha' };

    function voiceInfo(v) {
        const code = String(v.lang || '').toLowerCase().replace('_', '-').slice(0, 2);
        if (!(code in LANGS)) return null;
        const natural = /natural|neural|online|premium|enhanced|wavenet/i.test(v.name || '');
        const short = String(v.name || '').replace(/^Microsoft\s+/i, '').replace(/\s*\(.*$/, '').replace(/\s+Online.*$/i, '').replace(/\s*-\s*.*$/, '').trim();
        return {
            voice: v,
            id: v.voiceURI || v.name,
            lang: code,
            langName: LANG_NAMES[code],
            natural,
            short: short || v.name,
            score: LANGS[code] + (natural ? 15 : 0) + (/madina/i.test(v.name || '') ? 2 : 0),
        };
    }

    // Rough reading time, used as a pacing fallback and a watchdog.
    function estimateMs(text, rate = 1) {
        return (String(text).length / 14) * 1000 / Math.max(0.3, rate) + 400;
    }

    root.Speech = { esc, norm, segment, markup, stem, toCyrillic, respell, voiceInfo, estimateMs, hasSound, SENTENCE_END };
})(typeof window !== 'undefined' ? window : globalThis);
