/*
 * Animals of Uzbek folk tales: fox, wolf and dog (one canine), donkey and
 * horse (one equine), ram, goat, rooster/hen, rabbit, bear, hedgehog, cat,
 * small birds (sparrow, swallow, hoopoe), stork, owl, fish, snake, bee and
 * the Simurg'. All face right; mirror with { f: 1 }.
 */
(function (Art) {
    'use strict';

    const { S, tube, ptube, blob, radial, n1, OL } = Art;
    const CHEEK = '#f4978e';

    function eye(c, x, y, mood, r = 2.4) {
        if (mood === 'sleep' || mood === 'joy') {
            return `<path d="M${x - 3} ${y} Q${x} ${y + (mood === 'joy' ? -3 : 3)} ${x + 3} ${y}" fill="none" ${S(1.7)}/>`;
        }
        const big = mood === 'scared' || mood === 'surprised';
        return `<g ${c.anim('sv-blink', 5)}>${big ? `<circle cx="${x}" cy="${y}" r="${r + 2}" fill="#fff" ${S(1.2)}/>` : ''}` +
            `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.2}" fill="#23150c"/><circle cx="${x + 0.8}" cy="${y - 0.9}" r="${r * 0.38}" fill="#fff"/></g>`;
    }

    // ---------- fox / wolf / dog ----------
    Art.define('canine', (c, o) => {
        const kind = o.kind || 'fox';
        const pal = {
            fox: ['#f28c28', '#fff3e0', '#4a2a14'],
            wolf: ['#8e97a6', '#e8ebf0', '#454b58'],
            dog: ['#d9a066', '#fff4e3', '#7a4a24'],
        }[kind];
        const [body, light, dark] = o.colors || pal;
        const pose = o.pose || 'sit';
        const m = o.mood || 'happy';
        let s = '';
        let headX;
        let headY;
        if (pose === 'sit') {
            if (kind === 'dog') {
                s += `<g ${c.anim('sv-wag', 0.8)}>${ptube('M-10 -10 C-22 -14 -26 -24 -22 -36', 6, body)}</g>`;
            } else {
                s += `<path d="M-8 -5 C-30 -3 -46 -20 -40 -40 C-36 -48 -27 -46 -27 -37 C-27 -25 -19 -16 -5 -15Z" fill="${body}" ${S()}/>`;
                s += `<path d="M-40 -40 C-36 -48 -27 -46 -27 -37 C-31 -36 -36 -37 -40 -40Z" fill="${kind === 'fox' ? light : dark}" ${S(1.6)}/>`;
            }
            s += `<ellipse cx="-4" cy="-11" rx="14" ry="11" fill="${body}" ${S()}/>`;
            s += `<path d="M-14 -2 C-18 -22 -10 -42 6 -46 C18 -46 22 -32 18 -16 C16 -8 14 -3 12 0 L-12 0Z" fill="${body}" ${S()}/>`;
            s += `<path d="M8 -44 C18 -38 20 -22 13 -8 C8 -18 5 -32 8 -44Z" fill="${light}"/>`;
            s += tube(8, -18, 8, -3, 6, body) + tube(14, -18, 15, -3, 6, body);
            s += `<ellipse cx="9" cy="-2" rx="5" ry="2.8" fill="${kind === 'fox' ? dark : body}" ${S(1.5)}/><ellipse cx="16" cy="-2" rx="5" ry="2.8" fill="${kind === 'fox' ? dark : body}" ${S(1.5)}/>`;
            headX = 14;
            headY = -54;
        } else {
            const run = pose === 'run';
            const legs = run
                ? [[-16, -26, -34, -12], [-9, -24, -20, -4], [12, -26, 30, -12], [19, -24, 36, -20]]
                : [[-16, -24, -17, -3], [-9, -24, -8, -3], [12, -24, 12, -3], [19, -24, 21, -3]];
            const tail = m === 'scared'
                ? `M-22 -30 C-30 -22 -30 -12 -24 -6`
                : `M-22 -34 C-38 -40 -46 -30 -50 -20`;
            if (kind === 'dog') s += ptube(`M-22 -34 C-30 -44 -34 -50 -30 -58`, 6, body);
            else s += ptube(tail, 10, body) + `<circle cx="${m === 'scared' ? -24 : -50}" cy="${m === 'scared' ? -6 : -20}" r="4.2" fill="${kind === 'fox' ? light : dark}"/>`;
            s += legs.slice(0, 2).map(([a, b, d, e]) => tube(a, b, d, e, 6.5, body)).join('');
            s += `<ellipse cx="0" cy="-32" rx="27" ry="13.5" fill="${body}" ${S()}/>`;
            s += `<path d="M-16 -22 Q2 -15 20 -23 Q2 -19 -16 -22Z" fill="${light}"/>`;
            s += legs.slice(2).map(([a, b, d, e]) => tube(a, b, d, e, 6.5, body)).join('');
            if (run) s += `<path d="M-44 -40 h-14 M-40 -30 h-18 M-44 -20 h-10" stroke="${OL}" stroke-width="2" stroke-linecap="round" opacity=".45"/>`;
            headX = 28;
            headY = -44;
        }
        s += `<g transform="translate(${headX} ${headY})">`;
        if (kind === 'dog') {
            s += `<path d="M-8 -6 C-17 -4 -17 10 -10 13 C-5 6 -4 -2 -8 -6Z" fill="${dark}" ${S(1.6)}/>`;
        } else {
            s += `<path d="M-9 -7 L-9 -26 L2 -12Z" fill="${body}" ${S(1.8)}/><path d="M-7 -11 L-7.5 -21 L-1 -13Z" fill="${dark}"/>`;
            s += `<path d="M2 -11 L7 -27 L12 -8Z" fill="${body}" ${S(1.8)}/><path d="M4.5 -12 L7 -21 L9.5 -10Z" fill="${dark}"/>`;
        }
        s += `<circle cx="0" cy="0" r="13" fill="${body}" ${S()}/>`;
        const snout = kind === 'wolf' ? 28 : 25;
        s += `<path d="M4 -3 C14 -3 ${snout - 3} 0 ${snout} 3 C${snout - 3} 9 12 10 4 8Z" fill="${body}" ${S(1.8)}/>`;
        s += `<path d="M2 4 C8 10 16 10 ${snout - 3} 7 C16 13 6 13 0 9Z" fill="${light}"/>`;
        s += `<ellipse cx="${snout}" cy="2.6" rx="3" ry="2.4" fill="#2b1b12"/>`;
        s += eye(c, 6, -3, m);
        s += `<ellipse cx="3" cy="5" rx="3.2" ry="2.2" fill="${CHEEK}" opacity=".45"/>`;
        if (m === 'angry') {
            s += `<path d="M2 -9 L11 -5" stroke="${OL}" stroke-width="2.2" stroke-linecap="round"/>`;
            s += `<path d="M12 8 L14 12 L16 8 L18 12 L20 8" fill="#fff" ${S(1)}/>`;
        } else if (m === 'scared' || m === 'surprised') {
            s += `<ellipse cx="17" cy="9" rx="2.6" ry="2.2" fill="#8b2f2f"/>`;
        } else {
            s += `<path d="M13 8 Q16 11 20 8" fill="none" ${S(1.5)}/>`;
        }
        if (kind === 'dog' && o.bark) s += `<path d="M14 9 Q20 16 24 8Z" fill="#9b3535" ${S(1.2)}/>`;
        s += `</g>`;
        if (kind === 'dog' && pose === 'sit') s += `<path d="M4 -42 Q14 -36 22 -42" fill="none" stroke="#e63946" stroke-width="3.2"/>`;
        return s;
    }, { actor: true });
    Art.define('fox', (c, o) => Art.parts.canine(c, Object.assign({ kind: 'fox' }, o)), { actor: true });
    Art.define('wolf', (c, o) => Art.parts.canine(c, Object.assign({ kind: 'wolf' }, o)), { actor: true });
    Art.define('dog', (c, o) => Art.parts.canine(c, Object.assign({ kind: 'dog' }, o)), { actor: true });

    // ---------- donkey / horse ----------
    Art.define('equine', (c, o) => {
        const donkey = o.kind !== 'horse';
        const body = o.color || (donkey ? '#9aa0a8' : '#b5703a');
        const light = o.light || (donkey ? '#ece8e2' : '#f0d2b0');
        const mane = o.mane || (donkey ? '#4a4f58' : '#3b2415');
        const m = o.mood || 'happy';
        let s = '';
        s += ptube('M-30 -46 C-38 -38 -38 -26 -36 -18', 3, body) + `<path d="M-37 -20 q-4 6 0 10 q4 -2 2 -10z" fill="${mane}" ${S(1.2)}/>`;
        const legs = o.walk
            ? [[-22, -36, -28, -3], [-14, -36, -10, -3], [16, -36, 12, -3], [24, -36, 30, -3]]
            : [[-22, -36, -23, -3], [-14, -36, -13, -3], [16, -36, 16, -3], [24, -36, 26, -3]];
        s += legs.map(([a, b, d, e]) => tube(a, b, d, e, 7, body) + `<rect x="${d - 5}" y="${e - 3}" width="10" height="5" rx="2" fill="#3b3b3b" ${S(1.2)}/>`).join('');
        s += `<ellipse cx="0" cy="-44" rx="33" ry="16" fill="${body}" ${S()}/>`;
        s += `<path d="M-22 -34 Q0 -26 24 -34 Q2 -30 -22 -34Z" fill="${light}"/>`;
        if (o.saddle) {
            s += `<path d="M-15 -58 Q0 -62 15 -58 L17 -40 Q0 -36 -17 -40Z" fill="${o.saddle}" ${S(1.6)}/>`;
            s += `<path d="M-13 -52 H13 M-14 -45 H14" stroke="#ffd166" stroke-width="1.6" stroke-dasharray="3 2"/>`;
            s += [-14, -7, 0, 7, 14].map((x) => `<path d="M${x} -39 v5" stroke="#ffd166" stroke-width="2"/>`).join('');
        }
        s += `<path d="M18 -52 C24 -64 28 -74 34 -80 L45 -72 C39 -64 35 -54 31 -40Z" fill="${body}" ${S()}/>`;
        if (donkey) s += `<path d="M20 -53 L23 -62 L26 -58 L29 -68 L31 -63 L34 -73 L37 -70" fill="none" stroke="${mane}" stroke-width="3.4" stroke-linejoin="round"/>`;
        else s += `<path d="M19 -52 C22 -66 30 -80 38 -84 C36 -74 30 -66 29 -56 C27 -50 24 -46 19 -52Z" fill="${mane}" ${S(1.5)}/>`;
        s += `<g transform="translate(46 -74) rotate(35)"><ellipse rx="15" ry="9.6" fill="${body}" ${S()}/><ellipse cx="9" cy="1.4" rx="8" ry="7.6" fill="${light}" ${S(1.6)}/><circle cx="13" cy="0" r="1.3" fill="${OL}"/></g>`;
        if (donkey) {
            s += `<ellipse cx="36" cy="-92" rx="3.8" ry="13" transform="rotate(-18 36 -92)" fill="${body}" ${S(1.8)}/><ellipse cx="36" cy="-92" rx="1.8" ry="9" transform="rotate(-18 36 -92)" fill="${mane}"/>`;
            s += `<ellipse cx="44" cy="-93" rx="3.8" ry="13" transform="rotate(12 44 -93)" fill="${body}" ${S(1.8)}/>`;
        } else {
            s += `<path d="M38 -84 L40 -95 L45 -85Z" fill="${body}" ${S(1.6)}/>`;
        }
        s += eye(c, 44, -78, m, 2.2);
        if (m === 'joy' || m === 'laugh' || o.bray) s += `<path d="M52 -62 Q57 -56 60 -64Z" fill="#9b3535" ${S(1.2)}/>`;
        if (m === 'sad') s += `<path d="M40 -83 l6 2" stroke="${OL}" stroke-width="1.6"/>`;
        if (o.rider) {
            s += Art.item(c, [o.rider, -2, -56, Object.assign({ seated: true, s: 0.92 }, o.riderOpts || {})]);
        }
        return s;
    }, { actor: true, breath: 4 });
    Art.define('donkey', (c, o) => Art.parts.equine(c, Object.assign({ kind: 'donkey' }, o)), { actor: true, breath: 4 });
    Art.define('horse', (c, o) => Art.parts.equine(c, Object.assign({ kind: 'horse' }, o)), { actor: true, breath: 4 });

    // ---------- ram / sheep ----------
    Art.define('ram', (c, o) => {
        const wool = o.color || '#f7f1e3';
        const face = o.face || '#4a3b35';
        let s = '';
        s += [[-18, -20, -20, -2], [-10, -20, -9, -2], [12, -20, 12, -2], [19, -20, 21, -2]].map(([a, b, d, e]) => tube(a, b, d, e, 4.4, face)).join('');
        const circles = [];
        for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2;
            circles.push([Math.cos(a) * 22, -32 + Math.sin(a) * 12, 8.5]);
        }
        circles.push([0, -32, 20]);
        s += blob(circles, wool, 2);
        s += `<path d="M-12 -38 q3 -4 6 0 M2 -40 q3 -4 6 0 M-4 -28 q3 -4 6 0" fill="none" stroke="#d8cdb4" stroke-width="1.6"/>`;
        s += `<g transform="translate(28 -40) rotate(18)"><ellipse rx="9" ry="12" fill="${face}" ${S()}/><ellipse cx="-9" cy="-4" rx="6" ry="3" fill="${face}" ${S(1.5)}/>`;
        s += eye(c, 2, -3, o.mood, 2);
        s += `<path d="M1 7 q2 2 4 0" fill="none" stroke="#f1e3d3" stroke-width="1.4"/></g>`;
        if (o.horns !== false) {
            s += ptube('M24 -48 C14 -56 18 -68 28 -64 C35 -60 31 -51 24 -53 C21 -54 22 -58 26 -58', 5, '#d9b27c');
        }
        return s;
    }, { actor: true });

    // ---------- goat ----------
    Art.define('goat', (c, o) => {
        const body = o.color || '#f2ede4';
        const dark = o.dark || '#8a7f73';
        let s = '';
        s += `<path d="M-24 -40 l-6 -8 l2 10z" fill="${body}" ${S(1.6)}/>`;
        s += [[-18, -30, -19, -2], [-11, -30, -10, -2], [12, -30, 12, -2], [19, -30, 21, -2]].map(([a, b, d, e]) => tube(a, b, d, e, 5, body)).join('');
        s += `<ellipse cx="0" cy="-36" rx="25" ry="12.5" fill="${body}" ${S()}/>`;
        s += `<path d="M14 -42 L24 -58 L34 -54 L26 -36Z" fill="${body}" ${S()}/>`;
        s += ptube('M26 -64 C22 -72 16 -76 10 -74', 3.6, dark);
        s += `<g transform="translate(33 -58) rotate(28)"><ellipse rx="11" ry="7" fill="${body}" ${S()}/><ellipse cx="-8" cy="-5" rx="6" ry="2.6" fill="${body}" ${S(1.4)}/></g>`;
        s += eye(c, 34, -61, o.mood, 2);
        s += `<path d="M39 -52 L37 -42 L42 -49Z" fill="${dark}" ${S(1.2)}/>`;
        if (o.rider) s += Art.item(c, [o.rider, -2, -46, Object.assign({ seated: true, legLen: 44, s: 0.95 }, o.riderOpts || {})]);
        return s;
    }, { actor: true });

    // ---------- rooster / hen ----------
    Art.define('rooster', (c, o) => {
        const hen = !!o.hen;
        const gold = !!o.gold;
        const body = gold ? '#fbbf24' : (o.color || (hen ? '#c98a4b' : '#e76f51'));
        let s = '';
        if (gold) s += `<circle cx="0" cy="-22" r="36" fill="${radial(c, 'henglow', '#fde68a', 0.9)}"/>`;
        if (hen) {
            s += `<path d="M-10 -22 C-22 -34 -24 -22 -20 -14 C-16 -18 -12 -18 -8 -14Z" fill="${gold ? '#f59e0b' : '#9c6b3f'}" ${S(1.6)}/>`;
        } else {
            s += `<path d="M-8 -24 C-20 -52 -36 -40 -30 -20 C-26 -30 -18 -30 -8 -16Z" fill="#2d6a4f" ${S(1.6)}/>`;
            s += `<path d="M-8 -22 C-26 -44 -40 -26 -32 -10 C-26 -20 -18 -20 -8 -12Z" fill="#1d4e89" ${S(1.6)}/>`;
            s += `<path d="M-8 -18 C-24 -30 -34 -16 -26 -4 C-22 -12 -16 -12 -8 -8Z" fill="#f4a261" ${S(1.6)}/>`;
        }
        s += tube(-3, -10, -4, -1, 2.4, '#f4a261') + tube(4, -10, 5, -1, 2.4, '#f4a261');
        s += `<path d="M-8 -1 h8 M1 -1 h8" stroke="#f4a261" stroke-width="2" stroke-linecap="round"/>`;
        s += `<ellipse cx="0" cy="-20" rx="14" ry="11.5" fill="${body}" ${S()}/>`;
        s += `<path d="M8 -26 C10 -34 12 -38 12 -40 L20 -42 C22 -34 18 -26 12 -18Z" fill="${body}" ${S(1.8)}/>`;
        s += `<circle cx="15" cy="-40" r="8" fill="${body}" ${S()}/>`;
        s += `<path d="M9 -46 q1.5 -7 4.5 -1.5 q2 -7 5 -1 q3.5 -5 4 1.5Z" fill="#e63946" ${S(1.4)}/>`;
        s += `<ellipse cx="21" cy="-33" rx="2.4" ry="4" fill="#e63946" ${S(1.1)}/>`;
        s += `<path d="M22 -42 L29 -39 L22 -37Z" fill="#fbbf24" ${S(1.2)}/>`;
        s += eye(c, 17, -42, o.mood, 1.9);
        s += `<path d="M-8 -22 C-4 -30 6 -28 8 -20 C4 -14 -4 -14 -8 -22Z" fill="${gold ? '#f59e0b' : (hen ? '#a8713a' : '#c1440e')}" ${S(1.5)}/>`;
        if (o.crow) s += `<path d="M28 -44 q6 -2 10 -6 M28 -39 q7 0 11 0 M28 -34 q6 2 10 5" stroke="${OL}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
        if (gold) s += `<g ${c.anim('sv-twinkle', 1.4)}><path d="M-18 -40 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2z" fill="#fff"/></g>`;
        return s;
    }, { actor: true, breath: 2.4 });
    Art.define('hen', (c, o) => Art.parts.rooster(c, Object.assign({ hen: true }, o)), { actor: true, breath: 2.4 });

    // ---------- rabbit ----------
    Art.define('rabbit', (c, o) => {
        const col = o.color || '#d6cbbd';
        let s = '';
        s += `<circle cx="-16" cy="-13" r="5.4" fill="#fff" ${S(1.6)}/>`;
        s += `<ellipse cx="-3" cy="-4" rx="12" ry="4.6" fill="${col}" ${S(1.8)}/>`;
        s += `<ellipse cx="0" cy="-17" rx="16" ry="15" fill="${col}" ${S()}/>`;
        s += `<ellipse cx="3" cy="-13" rx="8" ry="9" fill="#f5efe6"/>`;
        s += `<ellipse cx="10" cy="-4" rx="4.4" ry="3.4" fill="${col}" ${S(1.5)}/>`;
        s += `<g ${c.anim('sv-wiggle', 3.2)}><ellipse cx="5" cy="-56" rx="4.6" ry="14" transform="rotate(-12 5 -56)" fill="${col}" ${S(1.8)}/><ellipse cx="5" cy="-56" rx="2" ry="10" transform="rotate(-12 5 -56)" fill="#f7b2bd"/>` +
            `<ellipse cx="14" cy="-56" rx="4.6" ry="14" transform="rotate(10 14 -56)" fill="${col}" ${S(1.8)}/><ellipse cx="14" cy="-56" rx="2" ry="10" transform="rotate(10 14 -56)" fill="#f7b2bd"/></g>`;
        s += `<circle cx="10" cy="-36" r="11.5" fill="${col}" ${S()}/>`;
        s += eye(c, 13, -38, o.mood, 2.1);
        s += `<ellipse cx="20.5" cy="-34" rx="2.2" ry="1.6" fill="#f28482"/>`;
        s += `<ellipse cx="12" cy="-31" rx="2.8" ry="1.8" fill="${CHEEK}" opacity=".6"/>`;
        s += `<path d="M18 -31 q2 2 4 0" fill="none" ${S(1.2)}/>`;
        if (o.mood === 'cry') s += `<path d="M14 -34 q-2 4 0 6 q2 -2 0 -6z" fill="#7cc6ff" ${S(0.8)}/>`;
        return s;
    }, { actor: true, breath: 1.8 });

    // ---------- bear (front facing) ----------
    Art.define('bear', (c, o) => {
        const col = o.color || '#8b5a2b';
        const light = '#d8a871';
        let s = '';
        s += `<ellipse cx="0" cy="-32" rx="27" ry="29" fill="${col}" ${S()}/>`;
        s += `<ellipse cx="0" cy="-26" rx="16" ry="19" fill="${light}"/>`;
        s += `<ellipse cx="-15" cy="-6" rx="11" ry="7.5" fill="${col}" ${S(1.8)}/><ellipse cx="15" cy="-6" rx="11" ry="7.5" fill="${col}" ${S(1.8)}/>`;
        s += `<ellipse cx="-15" cy="-6" rx="5" ry="3.6" fill="${light}"/><ellipse cx="15" cy="-6" rx="5" ry="3.6" fill="${light}"/>`;
        if (o.hold === 'honey') {
            s += `<g transform="translate(0 -30)"><path d="M-11 -10 Q-15 10 0 12 Q15 10 11 -10Z" fill="#e9a23b" ${S(1.5)}/><rect x="-12" y="-14" width="24" height="6" rx="2" fill="#c47f1d" ${S(1.3)}/></g>`;
            s += ptube('M-22 -44 Q-24 -30 -12 -30', 11, col) + ptube('M22 -44 Q24 -30 12 -30', 11, col);
        } else if (o.wave) {
            s += ptube('M-22 -44 Q-26 -30 -24 -18', 11, col) + ptube('M22 -44 Q34 -56 34 -70', 11, col);
        } else {
            s += ptube('M-22 -44 Q-26 -30 -24 -18', 11, col) + ptube('M22 -44 Q26 -30 24 -18', 11, col);
        }
        s += `<g transform="translate(0 -66)">`;
        s += `<circle cx="-15" cy="-15" r="7.4" fill="${col}" ${S(1.8)}/><circle cx="15" cy="-15" r="7.4" fill="${col}" ${S(1.8)}/>`;
        s += `<circle cx="-15" cy="-15" r="3.4" fill="${light}"/><circle cx="15" cy="-15" r="3.4" fill="${light}"/>`;
        s += `<circle r="19" fill="${col}" ${S()}/>`;
        s += `<ellipse cx="0" cy="6" rx="9.5" ry="7.4" fill="${light}" ${S(1.4)}/>`;
        s += `<ellipse cx="0" cy="2.6" rx="3.8" ry="2.6" fill="#2b1b12"/>`;
        s += eye(c, -7, -4, o.mood, 2.2) + eye(c, 7, -4, o.mood, 2.2);
        s += `<path d="M-3 9 Q0 12 3 9" fill="none" ${S(1.4)}/>`;
        s += `<ellipse cx="-12" cy="5" rx="3.2" ry="2.2" fill="${CHEEK}" opacity=".55"/><ellipse cx="12" cy="5" rx="3.2" ry="2.2" fill="${CHEEK}" opacity=".55"/></g>`;
        return s;
    }, { actor: true, breath: 3.6 });

    // ---------- hedgehog ----------
    Art.define('hedgehog', (c, o) => {
        const pts = [];
        for (let i = 0; i <= 16; i++) {
            const a = Math.PI + (i / 16) * Math.PI * 0.92;
            const r = i % 2 ? 17 : 24;
            pts.push(`${n1(Math.cos(a) * r - 2)} ${n1(Math.sin(a) * r * 0.9 - 2)}`);
        }
        let s = `<path d="M${pts.join(' L')} L12 -2Z" fill="#7a5230" ${S(1.8)}/>`;
        s += `<path d="M6 -2 C8 -14 14 -18 20 -16 C24 -14 28 -10 31 -8 C28 -4 22 -2 14 -1Z" fill="#e8c49a" ${S(1.8)}/>`;
        s += `<circle cx="31" cy="-8" r="2.2" fill="#2b1b12"/>`;
        s += eye(c, 18, -11, o.mood, 1.8);
        s += `<ellipse cx="16" cy="-6" rx="2.6" ry="1.7" fill="${CHEEK}" opacity=".6"/>`;
        s += `<ellipse cx="4" cy="-1" rx="4" ry="2" fill="#6b4424"/><ellipse cx="16" cy="-1" rx="4" ry="2" fill="#6b4424"/>`;
        if (o.apple) s += `<g transform="translate(-6 -26)">${'<circle r="7" fill="#e63946" ' + S(1.5) + '/><path d="M0 -7 q2 -4 4 -4" stroke="' + OL + '" stroke-width="1.3" fill="none"/>'}</g>`;
        return s;
    }, { actor: true, breath: 2 });

    // ---------- cat ----------
    Art.define('cat', (c, o) => {
        const col = o.color || '#f4a259';
        const stripe = o.stripe || '#c96f2c';
        const m = o.mood || 'happy';
        let s = '';
        if (o.pose === 'pounce') {
            s += ptube('M-26 -20 C-40 -26 -44 -38 -36 -44', 6, col);
            s += tube(-18, -16, -24, -2, 6, col) + tube(16, -18, 26, -4, 6, col);
            s += `<ellipse cx="0" cy="-20" rx="24" ry="11" fill="${col}" ${S()}/>`;
            s += `<path d="M-10 -30 v8 M-2 -31 v8 M6 -30 v8" stroke="${stripe}" stroke-width="2.4"/>`;
            s += `<g transform="translate(24 -30)">`;
        } else {
            s += ptube('M-12 -4 C-30 -4 -32 -22 -22 -30', 6.5, col);
            s += `<path d="M-14 0 C-17 -20 -8 -38 4 -40 C14 -40 18 -26 15 -12 L14 0Z" fill="${col}" ${S()}/>`;
            s += `<path d="M-4 -30 q4 2 8 0 M-7 -22 q6 2 12 0" fill="none" stroke="${stripe}" stroke-width="2.2"/>`;
            s += `<path d="M4 -36 C12 -30 14 -18 10 -6 C6 -14 3 -26 4 -36Z" fill="#fff3e3"/>`;
            s += tube(5, -14, 5, -2, 5.4, col) + tube(11, -14, 12, -2, 5.4, col);
            s += `<g transform="translate(6 -48)">`;
        }
        s += `<path d="M-12 -5 L-11 -21 L-2 -11Z" fill="${col}" ${S(1.7)}/><path d="M2 -11 L11 -21 L12 -5Z" fill="${col}" ${S(1.7)}/>`;
        s += `<circle r="13" fill="${col}" ${S()}/>`;
        s += `<path d="M-4 -12 v4 M0 -13 v5 M4 -12 v4" stroke="${stripe}" stroke-width="1.8"/>`;
        s += eye(c, -5, -1, m, 2.1) + eye(c, 5, -1, m, 2.1);
        s += `<path d="M-1.6 4 L1.6 4 L0 6Z" fill="#f28482"/>`;
        s += `<path d="M0 6 Q-2 9 -4 7 M0 6 Q2 9 4 7" fill="none" ${S(1.2)}/>`;
        s += `<path d="M-6 5 L-16 3 M-6 7 L-16 8 M6 5 L16 3 M6 7 L16 8" stroke="${OL}" stroke-width=".9"/>`;
        if (m === 'angry') s += `<path d="M-9 -6 L-2 -3 M9 -6 L2 -3" stroke="${OL}" stroke-width="1.8"/>`;
        s += `</g>`;
        return s;
    }, { actor: true, breath: 2.8 });

    // ---------- small birds ----------
    Art.define('bird', (c, o) => {
        const kind = o.kind || 'sparrow';
        const pal = {
            sparrow: ['#a47148', '#f1dfc4', '#6b4424'],
            swallow: ['#233d8f', '#ffffff', '#152659'],
            hoopoe: ['#e9a15a', '#fbe3c4', '#2b2b2b'],
            bluebird: ['#3b82f6', '#dbeafe', '#1e3a8a'],
            dove: ['#f5f5f4', '#ffffff', '#a8a29e'],
            robin: ['#8d6e63', '#ff7043', '#5d4037'],
            gold: ['#fbbf24', '#fff7d6', '#d97706'],
        }[kind] || ['#a47148', '#f1dfc4', '#6b4424'];
        const [body, belly, dark] = o.colors || pal;
        let s = '';
        const fly = !!o.fly;
        if (fly) {
            s += `<g ${c.anim('sv-flap', 0.5)}><path d="M-4 -10 C-12 -26 -2 -34 8 -30 C6 -22 4 -14 2 -9Z" fill="${dark}" ${S(1.5)}/></g>`;
        }
        if (kind === 'swallow') s += `<path d="M-8 -8 L-26 -16 L-17 -7 L-27 1Z" fill="${dark}" ${S(1.5)}/>`;
        else s += `<path d="M-8 -9 L-19 -13 L-17 -5Z" fill="${dark}" ${S(1.5)}/>`;
        if (!fly) s += `<path d="M-2 -1 l-1 4 M3 -1 l1 4" stroke="#f4a261" stroke-width="1.8" stroke-linecap="round"/>`;
        s += `<ellipse cx="0" cy="-8" rx="10.5" ry="7.8" fill="${body}" ${S(1.8)}/>`;
        s += `<path d="M-4 -3 Q4 1 10 -6 Q4 -3 -4 -3Z" fill="${belly}"/>`;
        if (kind === 'hoopoe') {
            s += [-40, -20, 0, 20, 40].map((a) => `<g transform="translate(8 -18) rotate(${a})"><path d="M0 0 L-2 -12 L2 -12Z" fill="${body}" ${S(1.2)}/><path d="M-2 -12 L2 -12 L0 -15Z" fill="#111"/></g>`).join('');
        }
        s += `<circle cx="8" cy="-14" r="6" fill="${body}" ${S(1.8)}/>`;
        if (kind === 'swallow') s += `<path d="M9 -10 Q12 -8 14 -11 L13 -13 Z" fill="#d64545"/>`;
        s += `<path d="M13 -15 L${kind === 'hoopoe' ? 24 : 19} -13 L13 -11.5Z" fill="#f4a261" ${S(1.1)}/>`;
        s += eye(c, 9.5, -15, o.mood, 1.5);
        if (kind === 'hoopoe') s += `<path d="M-6 -10 L4 -10 M-6 -7 L4 -7" stroke="#111" stroke-width="1.6"/>`;
        if (fly) {
            s += `<g ${c.anim('sv-flap', 0.5, 0.25)}><path d="M-2 -10 C-8 -30 6 -38 14 -32 C10 -24 6 -16 3 -9Z" fill="${body}" ${S(1.6)}/></g>`;
        } else {
            s += `<path d="M-6 -11 C-2 -15 6 -13 5 -6 C1 -4 -4 -5 -6 -11Z" fill="${dark}" ${S(1.3)}/>`;
        }
        if (o.hold === 'seed') s += `<ellipse cx="21" cy="-12" rx="2.6" ry="1.8" fill="#f2c14e" ${S(1)}/><circle cx="21" cy="-12" r="6" fill="${radial(c, 'seedglow', '#fff3b0', 0.9)}"/>`;
        if (o.bandage) s += `<path d="M-6 -12 L0 -4 M-2 -14 L4 -6" stroke="#fff" stroke-width="3"/><path d="M-6 -12 L0 -4 M-2 -14 L4 -6" stroke="#e63946" stroke-width="1" stroke-dasharray="1 2"/>`;
        return s;
    }, { actor: true, breath: 1.2 });

    // ---------- stork (laylak) ----------
    Art.define('stork', (c, o) => {
        let s = '';
        if (o.fly) {
            s += `<g ${c.anim('sv-flap', 1.1)}><path d="M-6 -12 C-20 -44 10 -58 28 -46 C14 -40 6 -26 4 -12Z" fill="#fff" ${S(1.8)}/><path d="M4 -46 C14 -54 24 -52 28 -46 C20 -44 14 -40 10 -36Z" fill="#222"/></g>`;
            s += `<path d="M-18 -8 L-40 -2" stroke="#e63946" stroke-width="2.4" stroke-linecap="round"/><path d="M-18 -6 L-40 2" stroke="#e63946" stroke-width="2.4" stroke-linecap="round"/>`;
            s += `<ellipse cx="0" cy="-8" rx="22" ry="8" fill="#fff" ${S()}/>`;
            s += `<path d="M-20 -8 C-26 -6 -30 -10 -34 -14 C-26 -14 -22 -14 -18 -12Z" fill="#222" ${S(1.2)}/>`;
            s += ptube('M18 -10 L38 -14', 5, '#fff');
            s += `<circle cx="41" cy="-15" r="5" fill="#fff" ${S(1.6)}/><path d="M45 -16 L62 -12 L45 -13Z" fill="#e63946" ${S(1.1)}/>`;
            s += eye(c, 42, -16, o.mood, 1.4);
            if (o.carry) s += `<g transform="translate(58 -6)">${o.carry === 'seed' ? `<ellipse rx="3" ry="2" fill="#f2c14e" ${S(1)}/>` : `<rect x="-8" y="0" width="16" height="10" rx="2" fill="#c1121f" ${S(1.2)}/>`}</g>`;
            return s;
        }
        s += tube(-2, -42, -3, -1, 2.2, '#e63946') + tube(5, -42, 7, -1, 2.2, '#e63946');
        s += `<path d="M-7 0 h8 M3 0 h8" stroke="#e63946" stroke-width="2" stroke-linecap="round"/>`;
        s += `<ellipse cx="0" cy="-50" rx="17" ry="11" fill="#fff" ${S()}/>`;
        s += `<path d="M-15 -52 C-22 -46 -28 -48 -32 -54 C-24 -56 -18 -60 -8 -60 C-6 -54 -10 -52 -15 -52Z" fill="#222" ${S(1.4)}/>`;
        s += ptube('M10 -56 C18 -64 12 -72 16 -82', 5.6, '#fff');
        s += `<circle cx="18" cy="-85" r="6" fill="#fff" ${S(1.8)}/>`;
        s += `<path d="M22 -87 L${o.open ? 42 : 42} -82 L22 -83Z" fill="#e63946" ${S(1.1)}/>`;
        s += eye(c, 19, -86, o.mood, 1.5);
        if (o.bandage) s += `<path d="M-10 -58 L2 -46 M-4 -60 L8 -48" stroke="#fff" stroke-width="4"/><path d="M-10 -58 L2 -46 M-4 -60 L8 -48" stroke="#e63946" stroke-width="1.2" stroke-dasharray="2 2"/>`;
        return s;
    }, { actor: true, breath: 3 });

    // ---------- owl ----------
    Art.define('owl', (c, o) => {
        let s = `<ellipse cx="0" cy="-16" rx="13" ry="16" fill="#8d6e63" ${S()}/>`;
        s += `<ellipse cx="0" cy="-12" rx="8" ry="10" fill="#d7ccc8"/>`;
        s += `<path d="M-12 -30 L-10 -38 L-5 -31 M12 -30 L10 -38 L5 -31" fill="#8d6e63" ${S(1.5)}/>`;
        s += `<circle cx="-5" cy="-24" r="5.4" fill="#fff" ${S(1.4)}/><circle cx="5" cy="-24" r="5.4" fill="#fff" ${S(1.4)}/>`;
        s += `<g ${c.anim('sv-blink', 4)}><circle cx="-5" cy="-24" r="2.6" fill="#23150c"/><circle cx="5" cy="-24" r="2.6" fill="#23150c"/></g>`;
        s += `<path d="M-2 -20 L2 -20 L0 -16Z" fill="#f4a261"/>`;
        s += `<path d="M-5 0 l-2 3 M-3 0 l0 3 M3 0 l0 3 M5 0 l2 3" stroke="#f4a261" stroke-width="1.6"/>`;
        return s;
    }, { actor: true, breath: 3 });

    // ---------- fish ----------
    Art.define('fish', (c, o) => {
        const gold = o.gold !== false;
        const body = o.color || (gold ? '#f7b733' : '#5fa8d3');
        const fin = gold ? '#f59e0b' : '#1b4965';
        let s = '';
        if (gold) s += `<circle r="34" fill="${radial(c, 'fishglow', '#fde68a', 0.85)}"/>`;
        s += `<g ${c.anim('sv-wag', 0.9)}><path d="M-14 0 L-30 -12 L-26 0 L-30 12Z" fill="${fin}" ${S(1.6)}/></g>`;
        s += `<path d="M-2 -9 L6 -18 L10 -8Z" fill="${fin}" ${S(1.4)}/>`;
        s += `<ellipse cx="0" cy="0" rx="17" ry="10" fill="${body}" ${S()}/>`;
        s += `<path d="M-6 -7 Q-2 0 -6 7 M0 -8 Q4 0 0 8" fill="none" stroke="${fin}" stroke-width="1.3" opacity=".7"/>`;
        s += `<path d="M2 3 L-2 9 L6 6Z" fill="${fin}" ${S(1.1)}/>`;
        s += eye(c, 9, -2, o.mood, 2);
        s += `<path d="M14 3 Q16 5 17 3" fill="none" ${S(1.2)}/>`;
        if (gold) s += `<g ${c.anim('sv-twinkle', 1.3)}><path d="M-4 -16 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5z" fill="#fff"/></g>`;
        return s;
    }, { actor: true, breath: 1.6 });

    // ---------- snake (friendly-cartoon) ----------
    Art.define('snake', (c, o) => {
        const col = o.color || '#52b788';
        let s = `<g ${c.anim('sv-wiggle', 1.2)}>`;
        s += ptube('M-26 -2 C-10 6 4 -2 -2 -14 C-8 -24 8 -32 14 -32', 9, col);
        s += `<path d="M-20 0 L-16 -2 M-8 1 L-4 -1 M2 -8 L-2 -10 M-2 -20 L2 -22" stroke="#2d6a4f" stroke-width="2" stroke-linecap="round"/>`;
        s += `<ellipse cx="17" cy="-33" rx="8" ry="6.4" fill="${col}" ${S(2)}/>`;
        s += `<circle cx="15" cy="-37" r="3.4" fill="#fff" ${S(1.2)}/><circle cx="21" cy="-37" r="3.4" fill="#fff" ${S(1.2)}/>`;
        s += `<circle cx="16" cy="-37" r="1.6" fill="#111"/><circle cx="22" cy="-37" r="1.6" fill="#111"/>`;
        s += `<path d="M24 -31 L30 -29 M30 -29 l3 -2 M30 -29 l3 2" stroke="#e63946" stroke-width="1.4" stroke-linecap="round"/>`;
        s += `</g>`;
        return s;
    }, { actor: true });

    // ---------- bee / wasp ----------
    Art.define('bee', (c, o) => {
        return `<g ${c.anim('sv-buzz', 0.35)}>` +
            `<ellipse cx="-2" cy="-10" rx="5" ry="7" fill="rgba(255,255,255,.8)" ${S(1)} transform="rotate(-25 -2 -10)"/>` +
            `<ellipse cx="0" cy="0" rx="8" ry="5.6" fill="${o.color || '#fbbf24'}" ${S(1.6)}/>` +
            `<path d="M-3 -5 V5 M2 -5.4 V5.4" stroke="#222" stroke-width="2.4"/>` +
            `<circle cx="7" cy="-1" r="1.2" fill="#111"/><path d="M-8 0 l-4 1" stroke="${OL}" stroke-width="1.4"/></g>`;
    }, { actor: false });

    // ---------- Simurg' ----------
    Art.define('simurg', (c, o) => {
        let s = `<circle cx="0" cy="-40" r="110" fill="${radial(c, 'simglow', '#fff1b8', 0.8)}"/>`;
        s += `<g ${c.anim('sv-sway', 5)}>`;
        const plumes = [['#7209b7', -70, 20], ['#f72585', -84, 6], ['#4cc9f0', -90, -10], ['#fbbf24', -80, -24]];
        s += plumes.map(([col, x, y]) => `<path d="M-14 -24 C-40 -20 ${x} ${y - 20} ${x - 20} ${y + 16} C${x + 10} ${y + 4} -30 -8 -12 -14Z" fill="${col}" ${S(1.8)}/>` +
            `<circle cx="${x - 12}" cy="${y + 6}" r="4.4" fill="#fde68a" ${S(1.2)}/>`).join('');
        s += `</g>`;
        s += `<g ${c.anim('sv-flap-soft', 2.2)}><path d="M-6 -44 C-30 -110 40 -130 70 -96 C40 -92 20 -70 8 -40Z" fill="#f59e0b" ${S(2)}/>` +
            `<path d="M4 -60 C14 -90 40 -104 60 -96 M8 -52 C20 -76 38 -86 52 -82" fill="none" stroke="#b45309" stroke-width="2"/></g>`;
        s += `<path d="M-22 -26 C-24 -48 -4 -58 12 -52 C30 -46 30 -26 18 -16 C6 -8 -18 -10 -22 -26Z" fill="#fbbf24" ${S()}/>`;
        s += `<path d="M14 -50 C18 -66 28 -76 38 -76 C44 -70 42 -60 34 -54Z" fill="#fbbf24" ${S(2)}/>`;
        s += [-30, -10, 10].map((a) => `<path transform="translate(36 -76) rotate(${a})" d="M0 0 C-2 -10 2 -18 6 -22 C6 -14 4 -6 2 0Z" fill="#f72585" ${S(1.2)}/>`).join('');
        s += `<path d="M42 -70 L54 -66 L42 -63Z" fill="#fb8500" ${S(1.2)}/>`;
        s += eye(c, 38, -69, o.mood, 1.9);
        return s;
    }, { actor: true, breath: 4 });
})(window.Art);
