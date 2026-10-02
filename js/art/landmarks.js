/*
 * Landmarks and keepsakes of Uzbekistan's regions, drawn for the culture
 * passport's stickers (js/passport.js): Oqsaroy, the Zurmala tower, the
 * Tashkent TV tower and metro, Chimyon, a Zomin juniper, cotton, a Xorazm
 * melon, Samarqand bread, a Chust do'ppi, Marg'ilon atlas, a car from Asaka,
 * an old book and the rock pictures of Sarmishsoy. Like every part they draw at their
 * base (0,0); stories may use them too.
 */
(function (Art) {
    'use strict';

    const { S, tube, ptube, blob, fabric, n1, OL } = Art;

    Art.define('oqsaroy', (c) => {
        // What is left of Amir Temur's Oqsaroy in Shahrisabz: the two towers of its gate, still in blue tiles
        const tile = c.def('oqtile', (id) => `<pattern id="${id}" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#1d6fa5"/><path d="M5 0 L10 5 L5 10 L0 5Z" fill="#7fc8e8"/><circle cx="5" cy="5" r="1.4" fill="#fff"/></pattern>`);
        let s = `<path d="M-52 0 Q0 -8 52 0Z" fill="#c9a26b" ${S(1.6)}/>`;
        for (const k of [-1, 1]) {
            s += `<path d="M${k * 18} 0 L${k * 19} -104 L${k * 46} -100 L${k * 50} 0Z" fill="#dcb47e" ${S(2)}/>`;
            s += `<path d="M${k * 25} -10 L${k * 25.5} -92 L${k * 41} -90 L${k * 43} -10Z" fill="${tile}" ${S(1.4)}/>`;
            s += `<path d="M${k * 25} -60 H${k * 43}" stroke="#f4d58d" stroke-width="3"/>`;
            // the arch springs from each tower and breaks off before it meets the other
            s += `<path d="M${k * 19} -56 Q${k * 17} -76 ${k * 7} -88 L${k * 4} -82 L${k * 7} -79 L${k * 5} -74 Q${k * 12} -66 ${k * 13} -56Z" fill="#dcb47e" ${S(1.6)}/>`;
        }
        // a man at the gate shows how big it is
        s += Art.item(c, ['person', 0, 0, { s: 0.22, head: 'doppi', pattern: 'stripes', color: '#e63946', color2: '#ffd166', color3: '#264653', still: true }]);
        return s;
    });

    Art.define('zurmala', (c) => {
        // The Zurmala tower in Termiz: mud brick, nearly two thousand years old, worn away at the top
        let s = `<path d="M-46 0 Q-34 -12 -26 -12 L26 -12 Q34 -12 46 0Z" fill="#c9a26b" ${S(2)}/>`;
        s += `<path d="M-24 -12 L-21 -86 L-13 -92 L-5 -87 L3 -96 L11 -89 L17 -93 L21 -86 L24 -12Z" fill="#c38d55" ${S(2)}/>`;
        for (let y = -21; y > -86; y -= 9) s += `<path d="M${n1(-23 + (-y - 12) * 0.03)} ${y} H${n1(23 - (-y - 12) * 0.03)}" stroke="#a87444" stroke-width="1.3"/>`;
        s += `<path d="M-11 -62 l7 -2 l2 7 l-7 2Z M7 -38 l6 -1 l1 6 l-6 1Z M-14 -30 l4 0 l0 4 l-4 0Z" fill="#8f6038"/>`;
        s += `<path d="M-15 -90 q-5 -8 1 -11 M13 -91 q5 -8 -1 -10 M0 -95 q0 -7 3 -9" fill="none" stroke="#6a994e" stroke-width="2.2" stroke-linecap="round"/>`;
        return s;
    });

    Art.define('teleminora', (c) => {
        // The Tashkent TV tower: legs that lean in, a slim shaft, the round viewing deck and a tall mast
        let s = ptube('M-34 0 C-22 -14 -12 -28 -5 -46', 4.6, '#a3adba') + ptube('M34 0 C22 -14 12 -28 5 -46', 4.6, '#a3adba');
        s += `<path d="M-5.5 0 L-4 -116 L4 -116 L5.5 0Z" fill="#cdd5df" ${S(1.8)}/>`;
        s += ptube('M-14 2 C-8 -12 -4 -26 -2 -40', 4.6, '#b9c2cd');
        s += `<path d="M-14 -70 Q0 -60 14 -70 L12 -80 Q0 -86 -12 -80Z" fill="#5aa9e6" ${S(1.8)}/>`;
        s += `<path d="M-12 -74 Q0 -68 12 -74" fill="none" stroke="#fff" stroke-width="1.8" stroke-dasharray="2.4 2"/>`;
        s += `<ellipse cx="0" cy="-98" rx="7" ry="3.4" fill="#5aa9e6" ${S(1.4)}/>`;
        s += `<path d="M-2.6 -116 L-1.2 -152 L1.2 -152 L2.6 -116Z" fill="#fff" ${S(1.2)}/>`;
        s += [-124, -136, -147].map((y) => `<rect x="-2.2" y="${y}" width="4.4" height="5" fill="#e63946"/>`).join('');
        return s;
    });

    Art.define('metro', () => {
        // A Tashkent metro train under the blue "M"
        let s = `<path d="M-46 0 L-46 -60 Q-46 -74 -32 -74 L32 -74 Q46 -74 46 -60 L46 0Z" fill="#3a86c8" ${S(2.2)}/>`;
        s += `<path d="M-36 -62 Q-36 -66 -32 -66 L32 -66 Q36 -66 36 -62 L36 -36 L-36 -36Z" fill="#d6ecfb" ${S(1.8)}/>`;
        s += `<path d="M-28 -62 L-16 -40 M-18 -63 L-5 -40" stroke="#fff" stroke-width="2.4" opacity=".8"/>`;
        s += `<rect x="-46" y="-30" width="92" height="7" fill="#f4d35e"/>`;
        s += `<circle cx="-30" cy="-13" r="5.4" fill="#fff8c9" ${S(1.6)}/><circle cx="30" cy="-13" r="5.4" fill="#fff8c9" ${S(1.6)}/>`;
        s += `<rect x="-10" y="-18" width="20" height="8" rx="2" fill="#1d3557"/><path d="M-6 -14 h12" stroke="#fff" stroke-width="1.4" stroke-dasharray="2 1.4"/>`;
        s += `<path d="M-54 3 H54" stroke="${OL}" stroke-width="4.4" stroke-linecap="round"/><path d="M-54 3 H54" stroke="#9aa5b1" stroke-width="1.6"/>`;
        s += `<g transform="translate(0 -90)"><circle r="12.5" fill="#1d4ed8" ${S(1.8)}/><path d="M-6.4 5 V-5 L0 2 L6.4 -5 V5" fill="none" stroke="#fff" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"/></g>`;
        return s;
    });

    Art.define('chimyon', () => {
        // The Chimyon mountains in winter, and skis left in the snow
        let s = `<path d="M-58 0 L-14 -86 L6 -56 L26 -76 L58 0Z" fill="#7d93b8" ${S(2)}/>`;
        s += `<path d="M-14 -86 L-26 -62 L-20 -66 L-14 -60 L-7 -67 L-1 -66Z" fill="#fff" ${S(1.6)}/>`;
        s += `<path d="M26 -76 L14 -64 L19 -66 L24 -61 L28 -66 L31 -64Z" fill="#fff" ${S(1.6)}/>`;
        s += `<path d="M-30 -30 L-18 -42 M10 -30 L22 -44" stroke="#6a80a5" stroke-width="2" stroke-linecap="round"/>`;
        s += `<path d="M-58 0 Q-20 -20 20 -12 Q44 -8 58 0Z" fill="#fff" ${S(1.8)}/>`;
        s += `<g transform="translate(26 -4)">` + tube(-5, 0, -11, -44, 3.6, '#e63946') + tube(5, 0, 9, -44, 3.6, '#e63946') +
            `<path d="M-12 -44 q-2 -6 3 -7 M9 -44 q2 -6 -3 -7" fill="none" ${S(1.6)}/>` +
            tube(-16, 2, -20, -38, 1.2, '#264653') + tube(15, 2, 20, -38, 1.2, '#264653') + `</g>`;
        return s;
    });

    Art.define('archa', (c) => {
        // An old juniper of the Zomin mountains: a thick twisted trunk and a dark blue-green crown
        let s = `<path d="M-12 0 C-6 -14 -16 -28 -6 -42 C-2 -48 4 -46 6 -40 C10 -28 2 -16 12 0Z" fill="#8a5a3b" ${S(2)}/>`;
        s += `<path d="M-5 -6 C-3 -16 -9 -24 -4 -34 M4 -4 C2 -14 6 -22 2 -32" fill="none" stroke="#6b4428" stroke-width="1.6"/>`;
        s += blob([[-22, -54, 15], [2, -60, 19], [24, -50, 14], [-10, -80, 15], [12, -84, 13], [-2, -100, 11], [26, -70, 9]], '#2f6f62', 2.2);
        s += [[-26, -58], [-4, -68], [20, -54], [-14, -86], [10, -90], [-4, -104]].map(([x, y]) => `<path d="M${x} ${y} q4 -5 9 -1" fill="none" stroke="#6fb59c" stroke-width="2.4" stroke-linecap="round"/>`).join('');
        return s;
    });

    Art.define('paxta', () => {
        // A cotton branch: white bolls bursting out of dry brown husks
        let s = ptube('M0 0 C-2 -30 4 -50 0 -74', 3.4, '#7a5230');
        s += ptube('M1 -40 C12 -46 20 -54 24 -62', 2.6, '#7a5230') + ptube('M0 -50 C-12 -54 -20 -60 -24 -70', 2.6, '#7a5230');
        const leaf = (x, y, r) => `<path transform="translate(${x} ${y}) rotate(${r})" d="M0 0 C-6 -4 -12 -2 -14 -8 C-10 -10 -8 -14 -10 -20 C-4 -18 0 -22 2 -26 C4 -20 10 -20 14 -18 C10 -12 14 -8 12 -4 C6 -4 4 -2 0 0Z" fill="#4f9d52" ${S(1.6)}/>`;
        s += leaf(-2, -20, -50) + leaf(3, -28, 55);
        const boll = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-13 2 L-17 -6 L-7 -4 L0 -12 L7 -4 L17 -6 L13 2 Q0 10 -13 2Z" fill="#8a5a2b" ${S(1.6)}/>` +
            blob([[-7, -10, 7], [7, -10, 7], [0, -17, 8], [0, -7, 7]], '#fff', 1.8) + `</g>`;
        return s + boll(0, -78, 1.15) + boll(27, -64, 0.95) + boll(-27, -72, 0.95);
    });

    Art.define('qovun', (c) => {
        // A Xorazm melon: long and golden, with a fine net on its skin
        const net = c.def('qovunnet', (id) => `<pattern id="${id}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="8" height="8" fill="#f2c14e"/><path d="M0 4 H8 M4 0 V8" stroke="#c99338" stroke-width="1.1"/></pattern>`);
        let s = `<ellipse cx="0" cy="-27" rx="48" ry="26" fill="${net}" ${S(2.2)}/>`;
        s += `<path d="M-30 -43 Q-4 -54 24 -46" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="5" stroke-linecap="round"/>`;
        s += `<path d="M46 -34 q7 -4 9 -12" fill="none" ${S(2.6)}/>`;
        s += `<path d="M53 -46 q11 -9 18 2 q-9 7 -18 -2z" fill="#52b788" ${S(1.6)}/>`;
        s += `<path d="M55 -46 q-4 -10 4 -12 q6 0 4 6" fill="none" stroke="#52b788" stroke-width="1.8"/>`;
        return s;
    });

    Art.define('non', (c) => {
        // Samarqand noni: a thick golden rim around a middle pressed with the chekich's pattern
        let s = `<path d="M-48 -20 Q-48 0 0 2 Q48 0 48 -20" fill="#a3602a" ${S(2)}/>`;
        s += `<ellipse cx="0" cy="-21" rx="48" ry="20" fill="#d98a3a" ${S(2)}/>`;
        s += `<ellipse cx="0" cy="-20" rx="31" ry="12" fill="#f1c27d" ${S(1.4)}/>`;
        for (const [r, n] of [[25, 18], [16, 12], [7, 6]]) {
            for (let i = 0; i < n; i++) {
                const a = (i / n) * Math.PI * 2;
                s += `<circle cx="${n1(Math.cos(a) * r)}" cy="${n1(-20 + Math.sin(a) * r * 0.4)}" r="1.3" fill="#a0522d"/>`;
            }
        }
        for (let i = 0; i < 18; i++) {
            const a = c.rand(0, Math.PI * 2);
            const r = c.rand(36, 44);
            s += `<ellipse cx="${n1(Math.cos(a) * r)}" cy="${n1(-21 + Math.sin(a) * r * 0.42)}" rx="1.7" ry="1" fill="${i % 3 ? '#fff4d6' : '#2b1d14'}"/>`;
        }
        s += `<path d="M-38 -32 Q-10 -42 22 -39" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3" stroke-linecap="round"/>`;
        return s;
    });

    Art.define('doppi', (c, o) => {
        // A Chust do'ppi: black and four-sided, with white pepper-pod (qalampir) patterns
        const col = o.color || '#1f1d2b';
        let s = `<path d="M-42 -6 L-36 -48 Q0 -62 36 -48 L42 -6 Q0 3 -42 -6Z" fill="${col}" ${S(2.2)}/>`;
        s += `<path d="M-15 -2 L-13 -56 M15 -2 L13 -56" stroke="#4a4660" stroke-width="1.6"/>`;
        const pepper = (x, y, k) => `<path transform="translate(${x} ${y}) scale(${k})" d="M0 13 C-8 6 -8 -6 0 -13 C3 -9 4 -3 2 3 C1 6 1 10 0 13Z" fill="#fff"/><path transform="translate(${x} ${y}) scale(${k})" d="M-6 -12 Q0 -20 6 -12" fill="none" stroke="#fff" stroke-width="1.6"/>`;
        s += pepper(-28, -27, 0.9) + pepper(0, -30, 1.1) + pepper(28, -27, 0.9);
        s += `<path d="M-41 -12 Q0 -3 41 -12" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="3 2.4"/>`;
        return s;
    });

    Art.define('atlas', (c) => {
        // Marg'ilon atlas: three folded lengths of silk ikat
        const cloth = [
            { color: '#d62868', color2: '#ffd23f', color3: '#3a86ff' },
            { color: '#3a0ca3', color2: '#4cc9f0', color3: '#f72585' },
            { color: '#2a9d8f', color2: '#e9c46a', color3: '#e76f51' },
        ];
        let s = '';
        cloth.forEach((o, i) => {
            const y = -i * 20;
            const x = (i % 2 ? 4 : -4);
            const fill = fabric(c, Object.assign({ pattern: 'ikat' }, o));
            s += `<path d="M${x - 46} ${y} L${x - 46} ${y - 16} Q${x - 46} ${y - 22} ${x - 40} ${y - 22} L${x + 40} ${y - 22} Q${x + 48} ${y - 22} ${x + 48} ${y - 13} Q${x + 48} ${y - 2} ${x + 40} ${y} Z" fill="${fill}" ${S(2)}/>`;
            s += `<path d="M${x + 40} ${y - 21} Q${x + 46} ${y - 12} ${x + 40} ${y - 1}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>`;
        });
        return s;
    });

    Art.define('mashina', (c, o) => {
        // A little car, the kind made in Asaka
        const col = o.color || '#3a86ff';
        let s = `<path d="M-52 -12 L-52 -26 Q-50 -32 -40 -33 L-26 -34 L-14 -50 Q-10 -54 -2 -54 L22 -54 Q30 -54 34 -48 L44 -34 Q54 -32 54 -24 L54 -12Z" fill="${col}" ${S(2.2)}/>`;
        s += `<path d="M-20 -36 L-11 -48 Q-9 -50 -5 -50 L5 -50 L5 -36Z" fill="#d6ecfb" ${S(1.6)}/><path d="M10 -36 L10 -50 L21 -50 Q26 -50 29 -46 L37 -36Z" fill="#d6ecfb" ${S(1.6)}/>`;
        s += `<path d="M7 -34 V-14" stroke="${OL}" stroke-width="1.4"/><path d="M12 -28 h6" stroke="${OL}" stroke-width="2" stroke-linecap="round"/>`;
        s += `<path d="M48 -28 h6" stroke="#ffd166" stroke-width="4" stroke-linecap="round"/><path d="M-52 -22 h4" stroke="#e63946" stroke-width="4" stroke-linecap="round"/>`;
        for (const x of [-32, 32]) s += `<circle cx="${x}" cy="-12" r="12" fill="#2b2d42" ${S(2)}/><circle cx="${x}" cy="-12" r="5" fill="#d9dee5" ${S(1.2)}/>`;
        return s;
    });

    Art.define('kitob', (c, o) => {
        // An old hand-written book with a leather cover and gold patterns (the Boburnoma)
        const col = o.color || '#7b2d26';
        let s = `<path d="M-34 -6 L-30 -86 L36 -80 L32 0Z" fill="#f3e3c3" ${S(2)}/>`;
        s += `<path d="M-34 -6 L32 0 L32 -4 L-34 -10Z" fill="#e2cba0"/>`;
        s += `<path d="M-40 -10 L-36 -92 L30 -86 L26 -4Z" fill="${col}" ${S(2.2)}/>`;
        s += `<path d="M-30 -18 L-27 -82 L22 -78 L19 -14Z" fill="none" stroke="#e9c46a" stroke-width="2"/>`;
        s += `<g transform="translate(-4 -48) rotate(3)"><path d="M0 -16 L12 0 L0 16 L-12 0Z" fill="#e9c46a" ${S(1.4)}/><circle r="4" fill="${col}"/></g>`;
        s += [[-26, -78], [16, -74], [-24, -20], [14, -16]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#e9c46a"/>`).join('');
        return s;
    });

    Art.define('sarmishsoy', () => {
        // A rock of the Sarmishsoy gorge with pictures pecked into its dark crust long ago
        let s = `<path d="M-58 0 C-62 -30 -46 -66 -6 -70 C30 -74 58 -50 60 -20 L62 0Z" fill="#6b4a36" ${S(2.2)}/>`;
        s += `<path d="M-40 -52 C-28 -62 -8 -66 10 -64" fill="none" stroke="#8a6248" stroke-width="5" stroke-linecap="round" opacity=".7"/>`;
        const L = 'fill="none" stroke="#f3dcb4" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
        // a mountain goat with big curved horns
        s += `<path transform="translate(-22 -18)" d="M-12 -10 H10 M-10 -10 L-12 0 M-5 -10 L-5 0 M5 -10 L5 0 M10 -10 L12 0 M10 -10 L16 -18 L21 -15 M16 -18 C12 -32 0 -34 -5 -26 M-12 -10 L-16 -15" ${L}/>`;
        // a deer
        s += `<path transform="translate(22 -38)" d="M-9 -6 H7 M-8 -6 L-9 2 M-3 -6 L-3 2 M3 -6 L3 2 M7 -6 L8 2 M7 -6 L11 -12 L14 -11 M11 -12 L9 -20 M10 -16 L14 -20 M9 -20 L6 -24 M9 -20 L12 -25" ${L}/>`;
        // a hunter with his bow
        s += `<path transform="translate(26 -8)" d="M0 -18 V-8 M0 -8 L-4 0 M0 -8 L4 0 M0 -15 L-7 -12 M0 -15 L6 -16 M7 -24 Q14 -16 7 -8 M2 -16 L16 -16" ${L}/><circle cx="26" cy="-30" r="2.6" fill="#f3dcb4"/>`;
        return s;
    });
})(window.Art);
