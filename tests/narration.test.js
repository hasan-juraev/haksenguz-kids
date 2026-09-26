/*
 * Read-along checks: sentence splitting and finding sentence starts in a
 * recording. Run with: node tests/narration.test.js
 */
'use strict';

global.window = { matchMedia: () => ({ matches: false }) };
require('../js/book.js');
require('../js/narrator.js');
const { sentences, segments } = window.BookEngine;
const N = window.Narrator;

let failed = 0;
let total = 0;
const check = (cond, msg) => {
    total++;
    if (!cond) {
        failed++;
        console.log(`✗ ${msg}`);
    }
};
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ---------- sentences ----------

check(same(sentences('Bir. Ikki! Uch?'), ['Bir.', 'Ikki!', 'Uch?']), 'plain sentences');
check(same(sentences("Momo: «Barakalla, qizim! Endi uyingga qayt.» — debdi. Zumrad quvondi."),
    ["Momo: «Barakalla, qizim! Endi uyingga qayt.» — debdi.", 'Zumrad quvondi.']), 'quoted speech stays whole, dash carries on');
check(same(sentences("Ona buyuribdi: «Tashlab kel!» Chol yig'labdi."), ['Ona buyuribdi: «Tashlab kel!»', "Chol yig'labdi."]), 'a quote can end a sentence');
check(same(sentences('Kutaveribdi... kun botibdi.'), ['Kutaveribdi... kun botibdi.']), 'lowercase after dots carries on');
check(same(sentences('Salom'), ['Salom']), 'no final stop');
check(same(segments({ title: 'Boshlanish', text: 'Bir. Ikki.' }), ['Boshlanish', 'Bir.', 'Ikki.']), 'segments = title + sentences');

// ---------- finding sentence starts ----------

// Fake loudness track: [kind, seconds] with kind 's' speech, 'p' pause,
// 'n' room noise before the phone's noise filter settles, 'c' a tap on the screen.
function track(parts, { speech = -22, silence = -75, jitter = 3 } = {}) {
    const out = [];
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5) * 2;
    parts.forEach(([kind, sec]) => {
        const n = Math.round(sec / N.FRAME);
        const level = { s: speech, p: silence, n: -45, c: -10 }[kind];
        for (let i = 0; i < n; i++) out.push(level + rnd() * jitter);
    });
    return Float32Array.from(out);
}
const near = (got, want, tol = 0.25) => got.length === want.length && got.every((g, i) => Math.abs(g - want[i]) <= tol);

// 1. Title and three sentences with clear pauses between them, short breaths inside.
let t = track([['p', 0.6], ['s', 1.2], ['p', 0.7], ['s', 2.0], ['p', 0.15], ['s', 1.5], ['p', 0.6], ['s', 3.0], ['p', 0.5], ['s', 2.2], ['p', 0.8]]);
let m = N.marks(t, [18, 90, 80, 55]);
check(near(m, [0, 2.38, 6.63, 10.13], 0.05), `clear pauses: ${m}`);

// 2. A long comma pause far from where a break is expected is not taken for one.
t = track([['p', 0.5], ['s', 1.0], ['p', 0.6], ['s', 0.8], ['p', 0.9], ['s', 4.0], ['p', 0.5], ['s', 3.0], ['p', 0.5]]);
m = N.marks(t, [12, 100, 60]);
check(near(m, [0, 1.98, 8.18], 0.05), `comma pause ignored: ${m}`);

// 3. A reader who barely pauses: breaks fall where the text says, in order.
t = track([['p', 0.5], ['s', 10.0], ['p', 0.5]]);
m = N.marks(t, [10, 50, 40]);
check(m.length === 3 && m[0] < m[1] && m[1] < m[2] && Math.abs(m[1] - 1.5) < 0.3 && Math.abs(m[2] - 6.5) < 0.3, `no pauses: ${m}`);

// 4. Silence (or a dead microphone): evenly spread, still in order.
t = track([['p', 6.0]]);
m = N.marks(t, [10, 20, 30]);
check(near(m, [0, 1, 3]), `silence: ${m}`);

// 5. One piece: lit up from the start.
t = track([['p', 1.0], ['s', 3.0], ['p', 1.0]]);
check(near(N.marks(t, [40]), [0]), "single piece starts at 0");

// 6. Room noise at the start (filter not settled yet) and taps on the screen
//    at both ends: neither is taken for speech or for a pause between pieces.
t = track([['c', 0.04], ['n', 0.6], ['p', 0.6], ['s', 1.2], ['p', 0.45], ['s', 3.5], ['p', 0.7], ['s', 2.2], ['p', 0.7], ['s', 3.2], ['p', 0.8], ['c', 0.04], ['p', 0.2]]);
m = N.marks(t, [17, 79, 47, 68]);
check(near(m, [0, 2.77, 6.97, 9.87], 0.05), `noise at the start, taps at the ends: ${m}`);

// 7. segAt
check(N.segAt([0.4, 2.4, 7.3], 0) === 0 && N.segAt([0.4, 2.4, 7.3], 2.39) === 1 && N.segAt([0.4, 2.4, 7.3], 9) === 2, 'segAt');

// 8. sig changes with the text
check(N.sig(['a', 'b']) !== N.sig(['a', 'c']) && N.sig(['a', 'b']) === N.sig(['a', 'b']), 'sig');

console.log(`${total - failed}/${total} passed`);
process.exit(failed ? 1 : 0);
