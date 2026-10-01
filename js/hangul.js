/*
 * Korean-letter sound hints (ROADMAP Phase 3, item 9): Uzbek written in
 * Hangul the way it sounds, for children who read Korean letters first.
 *
 *   Hangul.read("Assalomu alaykum") -> "앗살로무 알라이쿰"
 *   Hangul.read("Toshkent")         -> "토시켄트"
 *
 * Uzbek spelling is regular, so a few rules do it:
 *  - each sound has its letter (q and k are ㅋ, x and h are ㅎ, v is ㅂ, o and
 *    o' are ㅗ); sh, ch and y before a vowel fold into it (sha 샤, ya 야);
 *  - between two vowels one consonant starts the next syllable, except l,
 *    which is doubled as Korean writes it (lola 롤라, alaykum 알라이쿰);
 *  - a doubled consonant closes the syllable before it (Assalomu 앗살로무);
 *  - n, m, l and ng can end a syllable; any other consonant without a vowel
 *    gets ㅡ (or ㅣ after sh, ch, j): anor 아노르, kitob 키토브, Toshkent 토시켄트.
 * Anything that isn't an Uzbek letter (spaces, punctuation, numbers) is kept.
 * It is a hint for sounding words out, not a spelling: Korean has no ㅗ for
 * each of o and o', and its ㄹ is both l and r.
 */
(function (root) {
    'use strict';

    // Initial consonants (index into ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ)
    const ONSET = { g: 0, G: 0, n: 2, d: 3, l: 5, r: 5, m: 6, b: 7, v: 7, s: 9, S: 9, '': 11, j: 12, z: 12, C: 14, k: 15, q: 15, t: 16, f: 17, p: 17, h: 18, x: 18 };
    // Vowels (index into ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ); `glide` after y or sh
    const VOWEL = { a: 0, e: 5, i: 20, o: 8, O: 8, u: 13 };
    const GLIDE = { a: 2, e: 7, i: 20, o: 12, O: 12, u: 17 };
    const EU = 18; // ㅡ
    const I = 20; // ㅣ
    // Final consonants that a syllable may end with (index into the 28 finals)
    const CODA = { k: 1, q: 1, g: 1, n: 4, l: 8, r: 8, m: 16, b: 17, p: 17, s: 19, t: 19, d: 19, z: 19, N: 21 };
    const SOFT_END = { n: 4, m: 16, l: 8, N: 21 }; // may end a syllable without being doubled

    const block = (l, v, t = 0) => String.fromCharCode(0xac00 + (l * 21 + v) * 28 + t);
    const isVowel = (c) => c in VOWEL;

    // Uzbek letters of one word as sounds: sh -> S, ch -> C, ng -> N, o' -> O, g' -> G.
    function sounds(word) {
        const w = word.toLowerCase().replace(/[ʻʼ‘’`]/g, "'");
        const out = [];
        for (let i = 0; i < w.length; i++) {
            const two = w.slice(i, i + 2);
            if (two === 'sh') out.push('S');
            else if (two === 'ch') out.push('C');
            else if (two === 'ng' && w[i + 2] !== "'") out.push('N'); // ng' is n + g'
            else if (two === "o'") out.push('O');
            else if (two === "g'") out.push('G');
            else {
                if (w[i] !== "'" && (isVowel(w[i]) || w[i] in ONSET || w[i] === 'y')) out.push(w[i]);
                continue;
            }
            i++;
        }
        return out;
    }

    // A consonant that has no vowel: its own syllable with ㅡ (ㅣ after sh, ch, j; y is 이).
    function alone(c) {
        if (c === 'y') return block(11, I);
        if (c === 'N') return block(11, EU, 21);
        return block(ONSET[c], c === 'S' || c === 'C' || c === 'j' ? I : EU);
    }

    function readWord(word) {
        const ph = sounds(word);
        if (!ph.length) return word;
        const syl = []; // { l, v, t }
        let i = 0;
        let pending = []; // consonants since the last vowel
        const closeWith = (code) => {
            const last = syl[syl.length - 1];
            if (last && !last.alone && !last.t) {
                last.t = code;
                return true;
            }
            return false;
        };
        const flush = (cluster, before) => {
            // cluster: consonants between the last vowel and the next one (none at the end of the word).
            // Returns the onset for the next vowel, and whether it glides (y, sh).
            let k = 0;
            let onset = '';
            let glide = false;
            const n = cluster.length;
            const atEnd = before === null;
            // the last consonant (and a y after it) start the next syllable
            let lead = n;
            if (!atEnd && n) {
                if (cluster[n - 1] === 'y') {
                    glide = true;
                    lead = n - 1;
                    if (lead > 0 && cluster[lead - 1] !== 'y') {
                        onset = cluster[lead - 1];
                        lead--;
                    }
                } else {
                    onset = cluster[n - 1];
                    lead = n - 1;
                }
            }
            for (k = 0; k < lead; k++) {
                const c = cluster[k];
                const next = k + 1 < lead ? cluster[k + 1] : onset || null;
                if (k === 0 && syl.length && next && c === next && CODA[c] !== undefined && closeWith(CODA[c])) continue; // doubled: ss -> ㅅ + ㅅ
                // n before g, g', k, q is said ng
                if (k === 0 && syl.length && SOFT_END[c] !== undefined && closeWith(c === 'n' && 'gGkq'.includes(next) ? 21 : SOFT_END[c])) continue;
                syl.push({ alone: alone(c) });
            }
            // l between vowels is written twice; ng before a vowel is ㄴ + ㄱ
            if (!atEnd && onset === 'l' && lead === 0 && syl.length && !syl[syl.length - 1].alone) closeWith(8);
            if (onset === 'N') {
                if (!(syl.length && !syl[syl.length - 1].alone && closeWith(4))) syl.push({ alone: block(2, EU) });
                onset = 'g';
            }
            if (onset === 'S' && !glide) glide = true;
            return { onset, glide };
        };
        for (i = 0; i < ph.length; i++) {
            const c = ph[i];
            if (isVowel(c)) {
                const { onset, glide } = flush(pending, c);
                pending = [];
                syl.push({ l: ONSET[onset], v: glide ? GLIDE[c] : VOWEL[c], t: 0 });
            } else {
                pending.push(c);
            }
        }
        if (pending.length) flush(pending, null);
        return syl.map((s) => s.alone || block(s.l, s.v, s.t)).join('');
    }

    // Each run of letters (with o', g' and the tutuq) is read as a word; everything else stays.
    function read(text) {
        return String(text).replace(/[A-Za-z]+(?:['ʻʼ‘’`][A-Za-z]+)*/g, (w) => readWord(w));
    }

    root.Hangul = { read, readWord, sounds };
})(window);
