/*
 * People of the fairy tales: one parametric figure dressed in Uzbek clothing
 * (atlas dress, chapan with belbog', do'ppi, salla, ro'mol, telpak) plus
 * the dev, the fairy and the little star. Named presets ("zumrad", "momo",
 * "afandi", ...) live in Art.cast so story scenes stay short.
 */
(function (Art) {
    'use strict';

    const { S, tube, ptube, fabric, radial, n1, OL } = Art;
    const SKIN = '#f6cda5';
    const CHEEK = '#f4978e';

    // Hand targets per pose, in units of the arm segment length, measured from
    // the shoulder: [outward, downward]. Two-bone IK finds the elbow.
    const POSES = {
        down: { r: [0.35, 1.9], l: [0.35, 1.9] },
        wave: { r: [0.95, -1.65], l: [0.35, 1.9] },
        up: { r: [0.7, -1.8], l: [0.7, -1.8] },
        cheer: { r: [1.1, -1.5], l: [1.1, -1.5] },
        hold: { r: [-1.0, 1.35], l: [-1.0, 1.35] },
        lift: { r: [-0.45, -1.85], l: [-0.45, -1.85] },
        point: { r: [1.95, 0.2], l: [0.35, 1.9] },
        hips: { r: [-0.25, 1.45], l: [-0.25, 1.45] },
        heart: { r: [-1.05, 0.55], l: [0.35, 1.9] },
        pray: { r: [-1.05, 0.6], l: [-1.05, 0.6] },
        push: { r: [1.9, 0.55], l: [-1.9, 0.7] },
        reach: { r: [1.5, 0.8], l: [1.5, 0.8] },
        shrug: { r: [1.2, -0.3], l: [1.2, -0.3] },
        think: { r: [-0.95, -0.25], l: [-0.6, 1.3] },
        ear: { r: [-0.12, -1.0], l: [0.35, 1.9] },
        sweep: { r: [-0.5, 1.95], l: [-0.95, 1.6] },
        flute: { r: [0.3, 0.3], l: [-1.75, -0.1] },
        give: { r: [1.3, 1.1], l: [-0.6, 1.5] },
        scared: { r: [1.0, -1.1], l: [1.0, -1.1] },
    };

    // Things a figure can hold. `two`: held between both hands, else in the
    // right hand. Coordinates are around the grip point.
    const HELD = {
        broom: { svg: () => `<g transform="rotate(28)"><path d="M-3 -4 L3 -4 L11 30 Q0 34 -11 30Z" fill="#e2b85c" ${S(1.6)}/><path d="M-5 10 L-7 29 M0 10 L0 31 M5 10 L7 29" stroke="#b8862f" stroke-width="1.2"/><rect x="-4" y="-7" width="8" height="8" rx="2" fill="#c0392b" ${S(1.3)}/></g>` },
        lamp: { light: true, svg: (c) => `<path d="M0 2 L0 8" stroke="${OL}" stroke-width="1.6"/><path d="M-10 9 Q0 22 10 9Z" fill="#d6a940" ${S(1.6)}/><path d="M9 10 Q15 9 17 5" fill="none" ${S(1.6)}/><g ${c.anim('sv-flicker', 0.9)}><path d="M17 5 Q13 -3 17 -9 Q21 -3 17 5Z" fill="#ffb703" stroke="#e76f51" stroke-width="1"/></g>` },
        book: { two: true, svg: () => `<path d="M-15 -8 L0 -4 L15 -8 L15 9 L0 13 L-15 9Z" fill="#fff8e7" ${S(1.5)}/><path d="M0 -4 L0 13" stroke="${OL}" stroke-width="1.3"/><path d="M-12 -2 L-3 0 M-12 2 L-3 4 M-12 6 L-3 8 M3 0 L12 -2 M3 4 L12 2 M3 8 L12 6" stroke="#b9a98a" stroke-width="1"/><path d="M-16 9 L0 14 L16 9 L16 12 L0 17 L-16 12Z" fill="#c0392b" ${S(1.3)}/>` },
        flute: { at: 'flute', svg: () => `<rect x="-2.6" y="-2" width="5.2" height="44" rx="2.6" fill="#dcb46c" ${S(1.5)}/><circle cx="0" cy="14" r="1.2" fill="${OL}"/><circle cx="0" cy="21" r="1.2" fill="${OL}"/><circle cx="0" cy="28" r="1.2" fill="${OL}"/><path d="M-2.6 6h5.2M-2.6 36h5.2" stroke="#b5452f" stroke-width="2"/>` },
        chest: { two: true, svg: () => `<rect x="-15" y="-10" width="30" height="20" rx="3" fill="#b5452f" ${S(1.5)}/><path d="M-15 -3 H15" stroke="#e9c46a" stroke-width="2.4"/><rect x="-3" y="-4" width="6" height="7" rx="1.5" fill="#e9c46a" ${S(1)}/>` },
        bowl: { two: true, svg: () => `<path d="M-13 -5 Q0 14 13 -5Z" fill="#2f6fbf" ${S(1.5)}/><path d="M-9 0 Q0 6 9 0" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="2 2"/><ellipse cx="0" cy="-5" rx="13" ry="3" fill="#f4e3c1" ${S(1.3)}/>` },
        seeds: { two: true, svg: () => `<ellipse cx="0" cy="0" rx="9" ry="4" fill="#f3d27a" ${S(1.2)}/><circle cx="-4" cy="-2" r="1.2" fill="#b98a2f"/><circle cx="1" cy="-3" r="1.2" fill="#b98a2f"/><circle cx="4" cy="-1" r="1.2" fill="#b98a2f"/>` },
        sticks: { two: true, svg: () => `<g transform="rotate(-8)">${[-6, -3, 0, 3, 6].map((x) => tube(x, -26, x * 0.5, 22, 2.6, '#9c6b3f')).join('')}<rect x="-8" y="-4" width="16" height="5" rx="2" fill="#d62828" ${S(1.2)}/></g>` },
        stick: { svg: () => tube(0, -20, 2, 20, 2.8, '#9c6b3f') },
        bird: { two: true, k: 1.35, svg: () => `<ellipse cx="0" cy="-2" rx="10" ry="7" fill="#9c6b3f" ${S(1.5)}/><circle cx="8" cy="-8" r="5" fill="#9c6b3f" ${S(1.5)}/><path d="M12 -9 L17 -7 L12 -5Z" fill="#f4a261" ${S(1)}/><circle cx="9" cy="-9" r="1.2" fill="${OL}"/><path d="M-4 -3 Q2 -8 6 -2" fill="none" stroke="#6b4424" stroke-width="1.6"/><path d="M-6 0 h8" stroke="#fff" stroke-width="3"/>` },
        swallow: { two: true, k: 1.6, svg: () => `<ellipse cx="0" cy="-2" rx="10" ry="6.5" fill="#233d8f" ${S(1.5)}/><path d="M-8 -2 L-20 -8 L-14 -2 L-20 3Z" fill="#152659" ${S(1.2)}/><circle cx="8" cy="-7" r="5" fill="#233d8f" ${S(1.5)}/><path d="M9 -4 Q11 -3 12 -5" stroke="#d64545" stroke-width="2"/><path d="M12 -8 L17 -7 L12 -5.5Z" fill="#f4a261" ${S(1)}/><circle cx="9" cy="-8" r="1.1" fill="#fff"/><path d="M-4 0 Q2 3 8 0" fill="none" stroke="#fff" stroke-width="2"/><path d="M-3 -6 L4 1 M1 -7 L7 -1" stroke="#fff" stroke-width="2.6"/><path d="M-3 -6 L4 1" stroke="#e63946" stroke-width="1" stroke-dasharray="1 1.6"/>` },
        stork: { two: true, k: 1.35, svg: () => `<ellipse cx="0" cy="-2" rx="15" ry="8" fill="#fff" ${S(1.5)}/><path d="M-15 -2 Q-24 -2 -26 -8 Q-18 -10 -10 -8Z" fill="#222" ${S(1.2)}/><path d="M10 -6 Q16 -16 14 -24" fill="none" stroke="${OL}" stroke-width="6" stroke-linecap="round"/><path d="M10 -6 Q16 -16 14 -24" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/><circle cx="14" cy="-26" r="4" fill="#fff" ${S(1.4)}/><path d="M17 -27 L30 -23 L17 -24Z" fill="#e63946" ${S(1)}/><circle cx="15" cy="-27" r="1" fill="${OL}"/><path d="M-6 -6 h10 M-1 -10 v8" stroke="#e63946" stroke-width="2"/>` },
        net: { svg: () => `<path d="M0 0 L-6 26 Q8 34 20 26 Z" fill="none" ${S(1.6)}/><path d="M-4 10 L16 10 M-5 18 L18 18 M3 2 L0 30 M10 4 L10 30" stroke="${OL}" stroke-width="1"/>` },
        eggs: { two: true, svg: () => `<path d="M-15 -4 L15 -4 L11 10 L-11 10Z" fill="#c8923f" ${S(1.5)}/><path d="M-13 1 H13 M-12 6 H12" stroke="#9a6a2b" stroke-width="1"/><ellipse cx="-7" cy="-6" rx="4" ry="5" fill="#fff" ${S(1.2)}/><ellipse cx="0" cy="-8" rx="4" ry="5" fill="#fff" ${S(1.2)}/><ellipse cx="7" cy="-6" rx="4" ry="5" fill="#fff" ${S(1.2)}/>` },
        fish: { two: true, k: 1.5, svg: () => `<ellipse cx="0" cy="0" rx="14" ry="8" fill="#f7b733" ${S(1.5)}/><path d="M-12 0 L-24 -9 L-21 0 L-24 9Z" fill="#f59e0b" ${S(1.4)}/><circle cx="7" cy="-2" r="1.6" fill="${OL}"/><path d="M-2 -5 Q2 0 -2 5" fill="none" stroke="#c77d0a" stroke-width="1.2"/>` },
        bread: { two: true, svg: () => `<ellipse cx="0" cy="0" rx="13" ry="10" fill="#e3a857" ${S(1.5)}/><ellipse cx="0" cy="0" rx="7" ry="5" fill="#f3c98b"/><circle cx="-2" cy="-1" r=".9" fill="#9a5b21"/><circle cx="2" cy="1" r=".9" fill="#9a5b21"/><circle cx="1" cy="-2" r=".9" fill="#9a5b21"/>` },
        apple: { svg: () => `<circle cx="0" cy="0" r="6" fill="#e63946" ${S(1.4)}/><path d="M0 -6 q1 -4 3 -5" stroke="${OL}" stroke-width="1.2" fill="none"/><path d="M1 -7 q5 -3 7 1 q-4 2 -7 -1z" fill="#52b788"/>` },
        goldapple: { svg: (c) => `<circle r="13" fill="${radial(c, 'gold', '#fde68a', 0.9)}"/><circle cx="0" cy="0" r="6.5" fill="#fbbf24" ${S(1.4)}/><path d="M0 -6 q1 -4 3 -5" stroke="${OL}" stroke-width="1.2" fill="none"/><path d="M1 -7 q5 -3 7 1 q-4 2 -7 -1z" fill="#52b788"/><circle cx="-2" cy="-2" r="1.6" fill="#fff" opacity=".8"/>` },
        flower: { svg: () => `<path d="M0 0 L0 -18" stroke="#2d6a4f" stroke-width="2"/>${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-23" rx="3" ry="5" transform="rotate(${a} 0 -20)" fill="#ff8fab" ${S(1)}/>`).join('')}<circle cx="0" cy="-20" r="2.6" fill="#ffd166"/>` },
        snowdrop: { svg: () => `<path d="M0 0 Q1 -12 -3 -18" fill="none" stroke="#2d6a4f" stroke-width="2"/><path d="M-3 -18 Q-9 -14 -7 -8 Q-4 -10 -3 -18 Q-1 -10 1 -8 Q3 -14 -3 -18Z" fill="#fff" ${S(1)}/>` },
        scroll: { two: true, svg: () => `<rect x="-14" y="-12" width="28" height="24" fill="#fbf1d5" ${S(1.4)}/><rect x="-16" y="-15" width="32" height="5" rx="2.5" fill="#d4a373" ${S(1.2)}/><rect x="-16" y="10" width="32" height="5" rx="2.5" fill="#d4a373" ${S(1.2)}/><path d="M-9 -4 H9 M-9 1 H9 M-9 6 H4" stroke="#8d7b5a" stroke-width="1.2"/>` },
        bow: { svg: () => `<path d="M-2 -30 Q18 0 -2 30" fill="none" stroke="#8b5a2b" stroke-width="3.4" stroke-linecap="round"/><path d="M-2 -30 L-2 30" stroke="#f5f5f5" stroke-width="1"/><path d="M-4 0 L26 0" stroke="#6b4424" stroke-width="2"/><path d="M26 0 l-6 -3 l0 6z" fill="#9aa5b1"/>` },
        pickaxe: { svg: () => `<g transform="rotate(-35)">${tube(0, 16, 0, -28, 3.2, '#9c6b3f')}<path d="M-18 -26 Q0 -36 18 -26 Q0 -31 -18 -26Z" fill="#9aa5b1" ${S(1.5)}/></g>` },
        ketmon: { svg: () => `<g transform="rotate(-25)">${tube(0, 18, 0, -30, 3.2, '#9c6b3f')}<path d="M-2 -32 L14 -34 L16 -22 L0 -24Z" fill="#9aa5b1" ${S(1.5)}/></g>` },
        shovel: { svg: () => `<g transform="rotate(20)">${tube(0, -22, 0, 18, 3, '#9c6b3f')}<path d="M-7 18 L7 18 L6 32 Q0 38 -6 32Z" fill="#9aa5b1" ${S(1.5)}/></g>` },
        sapling: { two: true, svg: () => `<path d="M-9 2 L9 2 L6 12 L-6 12Z" fill="#b5652f" ${S(1.4)}/><path d="M0 2 L0 -18" stroke="#2d6a4f" stroke-width="2.4"/><path d="M0 -8 Q-10 -12 -12 -20 Q-3 -18 0 -8Z M0 -14 Q9 -18 12 -26 Q2 -24 0 -14Z" fill="#52b788" ${S(1.2)}/>` },
        moneybag: { svg: () => `<path d="M-10 -2 Q-16 18 0 20 Q16 18 10 -2 Q6 -6 4 -8 L-4 -8 Q-6 -6 -10 -2Z" fill="#d9a441" ${S(1.5)}/><path d="M-5 -8 Q0 -4 5 -8" fill="none" ${S(1.3)}/><text x="0" y="12" text-anchor="middle" font-size="11" font-weight="700" fill="#7a4f12">$</text>` },
        club: { svg: () => `<g transform="rotate(-20)">${tube(0, 14, 0, -8, 4, '#9c6b3f')}<rect x="-9" y="-30" width="18" height="24" rx="6" fill="#a8743f" ${S(1.6)}/><path d="M-9 -24 H9 M-9 -12 H9" stroke="#7a4f2a" stroke-width="2"/></g>` },
        wand: { svg: (c) => `${tube(0, 8, 0, -16, 2, '#fff')}<g ${c.anim('sv-twinkle', 1.6)}><path d="M0 -26 L2.5 -19 L9 -19 L4 -15 L6 -8 L0 -12 L-6 -8 L-4 -15 L-9 -19 L-2.5 -19Z" fill="#fde047" ${S(1.2)}/></g>` },
        honey: { two: true, svg: () => `<path d="M-11 -10 Q-15 10 0 12 Q15 10 11 -10Z" fill="#e9a23b" ${S(1.5)}/><rect x="-12" y="-14" width="24" height="6" rx="2" fill="#c47f1d" ${S(1.3)}/><path d="M-6 -8 q0 6 3 6" fill="none" stroke="#fff3c4" stroke-width="2"/>` },
        jug: { two: true, svg: () => `<path d="M-6 -16 L6 -16 L5 -12 Q14 -6 12 6 Q10 14 0 14 Q-10 14 -12 6 Q-14 -6 -5 -12Z" fill="#c8733f" ${S(1.5)}/><path d="M11 -8 Q20 -8 16 4" fill="none" ${S(1.8)}/><path d="M-11 0 H11" stroke="#f4d58d" stroke-width="2"/>` },
        dasturxon: { two: true, svg: () => `<rect x="-14" y="-7" width="28" height="14" rx="2" fill="#c1121f" ${S(1.5)}/><rect x="-11" y="-4" width="22" height="8" fill="none" stroke="#ffd166" stroke-width="1.4" stroke-dasharray="2 2"/>` },
        hen: { two: true, k: 1.3, svg: () => `<ellipse cx="0" cy="-2" rx="12" ry="9" fill="#fbbf24" ${S(1.5)}/><circle cx="9" cy="-11" r="6" fill="#fbbf24" ${S(1.5)}/><path d="M6 -17 q2 -4 4 0 q2 -4 4 0Z" fill="#e63946" ${S(1)}/><path d="M14 -11 l5 1 l-5 2z" fill="#f97316"/><circle cx="10" cy="-12" r="1.2" fill="${OL}"/><path d="M-12 -4 q-6 -6 -4 -12 q4 4 6 8z" fill="#f59e0b" ${S(1.2)}/>` },
        kite: { svg: () => `<path d="M0 0 L-2 -60" stroke="#6b7280" stroke-width="1"/>` },
        telescope: { svg: () => `<g transform="rotate(-35)"><rect x="-4" y="-34" width="10" height="36" rx="3" fill="#3d5a80" ${S(1.5)}/><rect x="-5" y="-38" width="12" height="6" rx="2" fill="#e0b84e" ${S(1.2)}/></g>` },
    };

    // Two-bone IK: elbow on the outer/lower side of the shoulder→hand line.
    function arm(side, sx, sy, tx, ty, L) {
        let dx = tx - sx;
        let dy = ty - sy;
        let d = Math.hypot(dx, dy) || 0.001;
        if (d > 2 * L * 0.995) {
            const k = (2 * L * 0.995) / d;
            dx *= k;
            dy *= k;
            d = 2 * L * 0.995;
        }
        const hx = sx + dx;
        const hy = sy + dy;
        const mx = (sx + hx) / 2;
        const my = (sy + hy) / 2;
        const h = Math.sqrt(Math.max(0, L * L - (d / 2) * (d / 2)));
        const nx = -dy / d;
        const ny = dx / d;
        const e1 = [mx + nx * h, my + ny * h];
        const e2 = [mx - nx * h, my - ny * h];
        const score = (e) => side * e[0] + e[1] * 0.35;
        const [ex, ey] = score(e1) >= score(e2) ? e1 : e2;
        return { ex, ey, hx, hy };
    }

    Art.face = function (c, o, bearded) {
        const m = o.mood || 'happy';
        const lx = (o.look || 0) * 1.8;
        const old = o.age === 'old';
        let s = '';
        const closed = m === 'sleep' || m === 'joy' || m === 'bow';
        if (closed) {
            const d = m === 'sleep' || m === 'bow'
                ? (x) => `M${x - 3} 1 Q${x} 3.6 ${x + 3} 1`
                : (x) => `M${x - 3} 2.4 Q${x} -1.6 ${x + 3} 2.4`;
            s += `<path d="${d(-6.2)} ${d(6.2)}" fill="none" ${S(1.8)}/>`;
        } else {
            const big = m === 'surprised' || m === 'scared';
            const ry = big ? 3.6 : 3;
            const eye = (x) => `<ellipse cx="${n1(x + lx)}" cy="1" rx="${big ? 2.8 : 2.3}" ry="${ry}" fill="#2b1a10"/>` +
                `<circle cx="${n1(x + lx + 0.9)}" cy="-0.3" r="0.95" fill="#fff"/>`;
            s += `<g ${c.anim('sv-blink', 4.6)}>${eye(-6.2)}${eye(6.2)}</g>`;
        }
        const brow = {
            sad: 'M-9.5 -5 L-4 -7.4 M9.5 -5 L4 -7.4',
            cry: 'M-9.5 -5 L-4 -7.4 M9.5 -5 L4 -7.4',
            angry: 'M-9.5 -8 L-3.5 -5 M9.5 -8 L3.5 -5',
            surprised: 'M-9 -7.5 Q-6.2 -10 -3.5 -7.5 M9 -7.5 Q6.2 -10 3.5 -7.5',
            scared: 'M-9 -6 Q-6.5 -9.5 -3.5 -8 M9 -6 Q6.5 -9.5 3.5 -8',
            think: 'M-9 -6.5 L-3.5 -7 M9 -8.5 Q6 -9.5 3.5 -7.5',
        }[m];
        if (brow) s += `<path d="${brow}" fill="none" stroke="${o.old ? '#9b948a' : OL}" stroke-width="1.8" stroke-linecap="round"/>`;
        if (old) s += `<path d="M-12.5 -1 l-2.4 -1.4 M-12.5 1.5 l-2.6 0.2 M12.5 -1 l2.4 -1.4 M12.5 1.5 l2.6 0.2" stroke="${OL}" stroke-width="1" opacity=".6"/>`;
        s += `<ellipse cx="-10.6" cy="6.6" rx="3.4" ry="2.3" fill="${CHEEK}" opacity=".6"/><ellipse cx="10.6" cy="6.6" rx="3.4" ry="2.3" fill="${CHEEK}" opacity=".6"/>`;
        s += `<path d="M${n1(-1.2 + lx * 0.5)} 4.2 Q${n1(lx * 0.5)} 5.8 ${n1(1.2 + lx * 0.5)} 4.2" fill="none" stroke="${OL}" stroke-width="1.3" stroke-linecap="round"/>`;
        const my = bearded ? 11.5 : 9;
        const mouth = {
            happy: `<path d="M-4 ${my - 0.5} Q0 ${my + 3.5} 4 ${my - 0.5}" fill="none" ${S(1.7)}/>`,
            joy: `<path d="M-5 ${my - 1} Q0 ${my + 6.5} 5 ${my - 1}Z" fill="#9b3535" ${S(1.5)}/>`,
            laugh: `<path d="M-5 ${my - 1} Q0 ${my + 6.5} 5 ${my - 1}Z" fill="#9b3535" ${S(1.5)}/>`,
            sad: `<path d="M-4 ${my + 2.2} Q0 ${my - 1.4} 4 ${my + 2.2}" fill="none" ${S(1.7)}/>`,
            cry: `<path d="M-4 ${my + 2.2} Q0 ${my - 1.4} 4 ${my + 2.2}" fill="none" ${S(1.7)}/>`,
            surprised: `<ellipse cx="0" cy="${my + 1}" rx="2.4" ry="3.1" fill="#9b3535" ${S(1.4)}/>`,
            scared: `<path d="M-4 ${my + 2} Q-2 ${my - 1} 0 ${my + 2} Q2 ${my - 1} 4 ${my + 2}" fill="none" ${S(1.6)}/>`,
            angry: `<path d="M-4.5 ${my + 1.6} Q0 ${my - 0.8} 4.5 ${my + 1.6}" fill="none" ${S(1.8)}/>`,
            sleep: `<ellipse cx="1" cy="${my + 0.8}" rx="1.6" ry="1.9" fill="#9b3535"/>`,
            think: `<path d="M-2 ${my + 1} L4 ${my}" fill="none" ${S(1.6)}/>`,
            bow: `<path d="M-3 ${my} Q0 ${my + 2.4} 3 ${my}" fill="none" ${S(1.6)}/>`,
            sly: `<path d="M-4 ${my} Q1 ${my + 3.2} 5 ${my - 2}" fill="none" ${S(1.7)}/>`,
        }[m] || `<path d="M-4 ${my - 0.5} Q0 ${my + 3.5} 4 ${my - 0.5}" fill="none" ${S(1.7)}/>`;
        s += mouth;
        if (m === 'cry') {
            s += `<g ${c.anim('sv-drip', 1.8)}><path d="M-7 5 q-2.4 4 0 6 q2.4 -2 0 -6z" fill="#7cc6ff" ${S(0.8)}/></g>`;
            s += `<g ${c.anim('sv-drip', 1.8, 0.9)}><path d="M7 5 q-2.4 4 0 6 q2.4 -2 0 -6z" fill="#7cc6ff" ${S(0.8)}/></g>`;
        }
        if (m === 'scared') s += `<path d="M13 -8 q-2.4 4 0 6 q2.4 -2 0 -6z" fill="#bfe3ff" ${S(0.8)}/>`;
        return s;
    };

    // Head drawn around its centre. `o.head` picks hair / headwear.
    Art.head = function (c, o) {
        const skin = o.skin || SKIN;
        const hair = o.hair || (o.age === 'old' ? '#ebe7df' : '#3a2418');
        const h = o.head || 'none';
        let s = '';
        if (h !== 'rumol' && h !== 'crescentScarf') {
            s += `<circle cx="-16.2" cy="2" r="4.2" fill="${skin}" ${S(1.8)}/><circle cx="16.2" cy="2" r="4.2" fill="${skin}" ${S(1.8)}/>`;
        }
        s += `<circle cx="0" cy="0" r="17" fill="${skin}" ${S(2.2)}/>`;
        const bearded = !!o.beard;
        if (h === 'braids' || h === 'girlcap' || h === 'crescent' || h === 'wreath') {
            s += `<path d="M-17.6 2 C-19 -15 -9 -21 0 -21 C9 -21 19 -15 17.6 2 C15 -7 8 -11 1.2 -11 L0 -8.5 L-1.2 -11 C-8 -11 -15 -7 -17.6 2Z" fill="${hair}" ${S(1.6)}/>`;
        } else if (h === 'boy' || h === 'doppi' || h === 'modern') {
            if (o.age !== 'old') {
                s += `<path d="M-17 -1 C-18 -15 -8 -21 0 -21 C8 -21 18 -15 17 -1 C13 -8 8 -9 4 -8 C3 -11 -3 -11 -4 -8 C-8 -9 -13 -8 -17 -1Z" fill="${hair}" ${S(1.6)}/>`;
            } else {
                s += `<path d="M-17 -2 C-17 -6 -15 -8 -13 -8 M17 -2 C17 -6 15 -8 13 -8" fill="none" stroke="${hair}" stroke-width="3" stroke-linecap="round"/>`;
            }
        }
        s += Art.face(c, o, bearded);
        if (bearded) {
            const bc = o.beardColor || (o.age === 'old' ? '#f4f1ea' : '#2f2118');
            const long = o.beard === 'long';
            s += `<path d="${long
                ? 'M-15.5 2 C-16.5 18 -8 31 0 34 C8 31 16.5 18 15.5 2 C11 9 6 11 0 11 C-6 11 -11 9 -15.5 2Z'
                : 'M-15.5 2 C-15.5 12 -7 20 0 21 C7 20 15.5 12 15.5 2 C11 8 6 10 0 10 C-6 10 -11 8 -15.5 2Z'}" fill="${bc}" ${S(1.7)}/>`;
            s += `<path d="M-8 8.6 C-4.5 5.6 -1 6.8 0 8 C1 6.8 4.5 5.6 8 8.6 C4.5 10.4 1 9.8 0 9.2 C-1 9.8 -4.5 10.4 -8 8.6Z" fill="${bc}" ${S(1.2)}/>`;
            const m = o.mood || 'happy';
            if (m === 'joy' || m === 'laugh') s += `<path d="M-4 11 Q0 17 4 11Z" fill="#9b3535" ${S(1.2)}/>`;
            else if (m === 'sad' || m === 'cry') s += `<path d="M-3 14 Q0 11.4 3 14" fill="none" ${S(1.5)}/>`;
            else if (m === 'surprised' || m === 'scared') s += `<ellipse cx="0" cy="13" rx="2.2" ry="2.8" fill="#9b3535" ${S(1.2)}/>`;
            else s += `<path d="M-3 12 Q0 14.6 3 12" fill="none" ${S(1.5)}/>`;
        }
        const hat = o.hat;
        if (h === 'doppi') {
            s += `<path d="M-15.6 -8 L-14 -20.6 Q0 -26 14 -20.6 L15.6 -8 Q0 -11.6 -15.6 -8Z" fill="${hat || '#1f1d2b'}" ${S(1.8)}/>`;
            s += [-8.5, 0, 8.5].map((x) => `<path transform="translate(${x} -15.6)" d="M0 3.6 C-3 1.6 -2.8 -2.4 0 -4 C1.6 -2.6 1.8 0 0 3.6Z" fill="#fff"/>`).join('');
            s += `<path d="M-15 -10 Q0 -13.2 15 -10" fill="none" stroke="#fff" stroke-width="1" stroke-dasharray="2 1.6"/>`;
        } else if (h === 'girlcap') {
            s += `<path d="M-10.6 -13.4 L-9.6 -22.6 Q0 -26.6 9.6 -22.6 L10.6 -13.4 Q0 -15.8 -10.6 -13.4Z" fill="${hat || '#d62839'}" ${S(1.6)}/>`;
            s += `<circle cx="-5" cy="-19" r="1.3" fill="#ffd166"/><circle cx="0" cy="-20.5" r="1.3" fill="#ffd166"/><circle cx="5" cy="-19" r="1.3" fill="#ffd166"/>`;
        } else if (h === 'salla' || h === 'crown') {
            const k = o.bigHat ? 1.32 : 1;
            const W = h === 'crown' ? (hat || '#f3e9d2') : (hat || '#fbfaf4');
            s += `<g transform="translate(0 -8) scale(${k})"><ellipse cx="0" cy="-6" rx="21" ry="11" fill="${W}" ${S(1.8)}/>` +
                `<ellipse cx="0" cy="-14.5" rx="17" ry="9.5" fill="${W}" ${S(1.8)}/>` +
                `<path d="M-19 -3 Q-2 3 19 -8 M-16 -12 Q2 -6 16 -17 M-10 -21 Q3 -17 9 -22.5" fill="none" stroke="#cfc6b0" stroke-width="1.6"/>`;
            if (h === 'crown') {
                s += `<path d="M2 -20 C6 -34 14 -40 12 -48 C18 -40 14 -28 6 -18Z" fill="#8ecae6" ${S(1.3)}/>` +
                    `<circle cx="1.5" cy="-14" r="4.4" fill="#e63946" stroke="#f4c542" stroke-width="2.2"/>`;
            } else {
                s += `<circle cx="0" cy="-23" r="3" fill="${W}" ${S(1.3)}/>`;
            }
            s += `</g>`;
        } else if (h === 'telpak') {
            s += `<path d="M-18.5 -5 C-21 -24 -12 -35 0 -35 C12 -35 21 -24 18.5 -5 Q0 -10 -18.5 -5Z" fill="${hat || '#2e2622'}" ${S(1.8)}/>`;
            s += `<path d="M-13 -12 q2 -3 4 0 q2 -3 4 0 M-2 -12 q2 -3 4 0 q2 -3 4 0 M-10 -22 q2 -3 4 0 q2 -3 4 0 M2 -24 q2 -3 4 0 q2 -3 4 0" fill="none" stroke="#5a4a40" stroke-width="1.4"/>`;
        } else if (h === 'rumol' || h === 'crescentScarf') {
            s += `<path d="M-18.4 -3 C-17.4 -17 -9 -22.6 0 -22.6 C9 -22.6 17.4 -17 18.4 -3 C13.6 -12 7 -14.4 0 -14.4 C-7 -14.4 -13.6 -12 -18.4 -3Z" fill="${o.scarfFill || hat || '#f4efe4'}" ${S(1.6)}/>`;
        } else if (h === 'cap') {
            s += `<path d="M-16 -8 C-16 -20 -8 -24 0 -24 C8 -24 16 -20 16 -8Z" fill="${hat || '#e63946'}" ${S(1.6)}/><path d="M6 -9 L26 -7 Q24 -3 6 -4Z" fill="${hat || '#e63946'}" ${S(1.5)}/>`;
        }
        if (h === 'crescent' || h === 'crescentScarf') {
            s += `<g transform="translate(0 -28)"><circle r="12" fill="${radial(c, 'moonglow', '#fff7c2', 0.9)}"/><path d="M-11 -6 A11 11 0 0 0 11 -6 A16 16 0 0 1 -11 -6Z" fill="#fde68a" ${S(1.4)}/></g>`;
        }
        if (h === 'wreath') {
            s += [-12, -6, 0, 6, 12].map((x, i) => `<circle cx="${x}" cy="${-15 - (i % 2) * 2}" r="3" fill="${['#ff8fab', '#ffd166', '#90e0ef'][i % 3]}" ${S(1)}/>`).join('');
        }
        return s;
    };

    function person(c, o) {
        const child = o.age === 'child';
        const old = o.age === 'old';
        const fem = o.sex === 'f';
        const skin = o.skin || SKIN;
        const hair = o.hair || (old ? '#ebe7df' : '#3a2418');
        const top = child ? -56 : -80;
        const hem = child ? -9 : -11;
        const sw = child ? 12 : 16;
        const hw = (child ? 19 : 25) + (o.belly ? 8 : 0);
        const hr = 17;
        const hy = top - hr + 3;
        const L = child ? 13.5 : 18;
        const aw = child ? 6.4 : 7.4;
        const outfit = o.outfit || (fem ? 'dress' : 'robe');
        const fill = fabric(c, o);
        const col = o.color || '#3aa36b';
        const shirtBottom = top + (child ? 30 : 40);
        // Seated figures (riders, so'ri, carpet) get a short lap-length robe and
        // are drawn with the seat, not the feet, at the origin.
        const seated = !!(o.seated || o.noLegs);
        const bodyBottom = seated ? top + (child ? 34 : 46) : (outfit === 'shirt' ? shirtBottom : hem);
        let back = '';
        let legs = '';
        let body = '';
        let arms = '';
        let hands = '';
        let held = '';

        // back layer: braids falling behind the shoulders, headscarf drape
        if (o.head === 'braids' || o.head === 'girlcap' || o.head === 'crescent' || o.head === 'wreath') {
            for (let i = 0; i < 4; i++) {
                for (const side of [-1, 1]) {
                    const x0 = side * (10 + i * 1.6);
                    const x1 = side * (sw + 3 + i * 2.6);
                    const y1 = hy + (child ? 44 : 56) - i * 3;
                    back += `<path d="M${x0} ${hy + 4} Q${x0 + side * 6} ${(hy + y1) / 2} ${x1} ${y1}" fill="none" stroke="${OL}" stroke-width="4.2" stroke-linecap="round"/>` +
                        `<path d="M${x0} ${hy + 4} Q${x0 + side * 6} ${(hy + y1) / 2} ${x1} ${y1}" fill="none" stroke="${hair}" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="3 1.2"/>`;
                }
            }
        }
        if (o.head === 'rumol' || o.head === 'crescentScarf') {
            const sf = o.scarfFill || o.hat || '#f4efe4';
            back += `<path transform="translate(0 ${hy})" d="M-21.5 2 C-24.5 -19 -12 -26 0 -26 C12 -26 24.5 -19 21.5 2 C22.5 14 26 22 29 ${hr + 16} L-29 ${hr + 16} C-26 22 -22.5 14 -21.5 2Z" fill="${sf}" ${S(2)}/>`;
        }
        if (o.wings) {
            const wf = o.wings === true ? 'rgba(186,230,253,.75)' : o.wings;
            back += `<g ${c.anim('sv-flap-soft', 1.4)}><path d="M-4 ${top + 4} C-40 ${top - 30} -58 ${top + 6} -30 ${top + 30} C-46 ${top + 38} -30 ${top + 56} -4 ${top + 20}Z" fill="${wf}" ${S(1.6)}/>` +
                `<path d="M4 ${top + 4} C40 ${top - 30} 58 ${top + 6} 30 ${top + 30} C46 ${top + 38} 30 ${top + 56} 4 ${top + 20}Z" fill="${wf}" ${S(1.6)}/></g>`;
        }
        if (o.glow) {
            back = `<circle cx="0" cy="${top}" r="${child ? 70 : 90}" fill="${radial(c, 'aura', o.glow === true ? '#fff4b8' : o.glow, 0.75)}"/>` + back;
        }

        // legs & feet
        const legCol = o.pants || (fem ? (o.color2 || '#f4c542') : '#3d3b52');
        const shoe = o.shoes || (fem ? '#b5302a' : '#2d2a26');
        if (o.noLegs) {
            // sitting cross-legged on a carpet or so'ri: legs hidden by the robe
        } else if (seated) {
            const ly = bodyBottom - 4;
            const toY = bodyBottom + (o.legLen || (child ? 20 : 26));
            legs += tube(-8, ly, -12, toY, child ? 6 : 7, legCol) + tube(8, ly, 12, toY, child ? 6 : 7, legCol);
            legs += `<ellipse cx="-14" cy="${toY + 1}" rx="${child ? 6 : 7}" ry="3.4" fill="${shoe}" ${S(1.6)}/><ellipse cx="14" cy="${toY + 1}" rx="${child ? 6 : 7}" ry="3.4" fill="${shoe}" ${S(1.6)}/>`;
        } else {
            const lt = bodyBottom - 3;
            const spread = o.walk ? 5 : 0;
            legs += tube(-6, lt, -7 - spread, -4, child ? 6 : 7, legCol) + tube(6, lt, 7 + spread, -4, child ? 6 : 7, legCol);
            legs += `<ellipse cx="${-9 - spread}" cy="-2.5" rx="${child ? 6.5 : 7.5}" ry="3.6" fill="${shoe}" ${S(1.7)}/>` +
                `<ellipse cx="${9 + spread}" cy="-2.5" rx="${child ? 6.5 : 7.5}" ry="3.6" fill="${shoe}" ${S(1.7)}/>`;
        }

        // body
        const t = top;
        const b = bodyBottom;
        const a = sw;
        const w = outfit === 'shirt' ? a + 9 : hw;
        const side = o.belly
            ? `Q${-w - 10} ${(t + b) / 2 + 6} ${-w} ${b}`
            : `L${-w} ${b}`;
        const side2 = o.belly
            ? `Q${w + 10} ${(t + b) / 2 + 6} ${a + 7} ${t + 11}`
            : `L${a + 7} ${t + 11}`;
        body += `<path d="M${-a} ${t} Q${-a - 6} ${t + 1} ${-a - 7} ${t + 11} ${side} Q0 ${b + 4} ${w} ${b} ${side2} Q${a + 6} ${t + 1} ${a} ${t} Q0 ${t - 3} ${-a} ${t}Z" fill="${fill}" ${S(2.2)}/>`;
        const widthAt = (y) => a + 7 + (w - a - 7) * Math.max(0, (y - (t + 11)) / (b - (t + 11)));
        if (outfit === 'robe') {
            body += `<path d="M-6 ${t - 1} L0 ${t + 14} L6 ${t - 1}Z" fill="${o.shirt || '#fbf7ee'}" ${S(1.3)}/>`;
            body += `<path d="M0 ${t + 14} L0 ${b + 1}" stroke="${OL}" stroke-width="1.3" opacity=".55"/>`;
            body += `<path d="M-7.5 ${t - 1} L0 ${t + 16} L7.5 ${t - 1}" fill="none" stroke="${o.trim || '#f4c542'}" stroke-width="2.4"/>`;
            const by = t + (child ? 22 : 31);
            const bw = widthAt(by);
            const bw2 = widthAt(by + 6);
            body += `<path d="M${-bw} ${by} Q0 ${by + 3} ${bw} ${by} L${bw2} ${by + 6} Q0 ${by + 9} ${-bw2} ${by + 6}Z" fill="${o.belt || '#c0392b'}" ${S(1.4)}/>`;
            body += `<path d="M-2 ${by + 6} l-4 11 l6 -2z M2 ${by + 6} l4 10 l-6 0z" fill="${o.belt || '#c0392b'}" ${S(1.2)}/>`;
        } else if (outfit === 'dress') {
            if (o.vest) {
                const vy = t + (child ? 20 : 28);
                const vw = widthAt(vy);
                body += `<path d="M${-a} ${t} Q${-a - 6} ${t + 1} ${-a - 7} ${t + 11} L${-vw} ${vy} L-4 ${vy} L-2 ${t + 4} L2 ${t + 4} L4 ${vy} L${vw} ${vy} L${a + 7} ${t + 11} Q${a + 6} ${t + 1} ${a} ${t}Z" fill="${o.vest}" ${S(1.6)}/>`;
                body += `<path d="M-4 ${vy - 2} H-2 M2 ${vy - 2} H4" stroke="#ffd166" stroke-width="2"/>`;
            }
            body += `<path d="M-6.5 ${t - 1} Q0 ${t + 6} 6.5 ${t - 1}" fill="none" stroke="${o.trim || '#ffd166'}" stroke-width="2.6"/>`;
        } else if (outfit === 'shirt') {
            body += `<path d="M-6 ${t - 1} L0 ${t + 6} L6 ${t - 1}" fill="#fff" ${S(1.3)}/>`;
            body += `<circle cx="0" cy="${t + 13}" r="1.2" fill="${OL}"/><circle cx="0" cy="${t + 21}" r="1.2" fill="${OL}"/>`;
        } else if (outfit === 'royal') {
            body += `<path d="M-7 ${t - 1} L0 ${t + 16} L7 ${t - 1}" fill="#fff4d6" ${S(1.3)}/>`;
            body += `<path d="M-8 ${t} L-3 ${b} M8 ${t} L3 ${b}" stroke="#f4c542" stroke-width="3.2"/>`;
            const by = t + 31;
            const bw = widthAt(by);
            body += `<path d="M${-bw} ${by} Q0 ${by + 3} ${bw} ${by} L${bw} ${by + 6} Q0 ${by + 9} ${-bw} ${by + 6}Z" fill="#f4c542" ${S(1.4)}/><circle cx="0" cy="${by + 4}" r="3.4" fill="#2a9d8f" ${S(1.2)}/>`;
        }
        if (o.patches) {
            body += `<rect x="${-w + 8}" y="${b - 22}" width="9" height="8" fill="#c9a36b" stroke="${OL}" stroke-width=".8" stroke-dasharray="1.5 1.5" transform="rotate(-8 ${-w + 12} ${b - 18})"/>`;
            body += `<rect x="${a - 2}" y="${t + 18}" width="8" height="7" fill="#8fb996" stroke="${OL}" stroke-width=".8" stroke-dasharray="1.5 1.5"/>`;
        }

        // arms
        const pose = typeof o.pose === 'object' ? o.pose : (POSES[o.pose] || POSES.down);
        const sleeve = o.sleeve || col;
        const H = {};
        for (const sd of [-1, 1]) {
            const [ox, oy] = sd > 0 ? pose.r : pose.l;
            const sx = sd * (sw + 3);
            const sy = top + 5;
            const tx = sx + sd * ox * L;
            const ty = sy + oy * L;
            const r = arm(sd, sx, sy, tx, ty, L);
            const d = `M${n1(sx)} ${n1(sy)} L${n1(r.ex)} ${n1(r.ey)} L${n1(r.hx)} ${n1(r.hy)}`;
            arms += ptube(d, aw, sleeve);
            H[sd] = [r.hx, r.hy];
        }
        hands = [-1, 1].map((sd) => `<circle cx="${n1(H[sd][0])}" cy="${n1(H[sd][1])}" r="${child ? 3.9 : 4.3}" fill="${skin}" ${S(1.7)}/>`).join('');

        if (o.cane) {
            const [hx, hy2] = H[-1];
            held += tube(hx, hy2 - 4, hx - 3, -1, 2.4, '#8b5a2b');
            held += `<path d="M${n1(hx)} ${n1(hy2 - 4)} q0 -9 8 -8" fill="none" stroke="${OL}" stroke-width="6.4" stroke-linecap="round"/><path d="M${n1(hx)} ${n1(hy2 - 4)} q0 -9 8 -8" fill="none" stroke="#8b5a2b" stroke-width="2.4" stroke-linecap="round"/>`;
        }
        let overHead = '';
        if (o.hold) {
            const item = HELD[o.hold];
            if (item) {
                let px;
                let py;
                let rot = 0;
                if (item.at === 'flute') {
                    px = 0;
                    py = hy + 10;
                    rot = -58;
                } else if (item.two) {
                    px = (H[-1][0] + H[1][0]) / 2;
                    py = (H[-1][1] + H[1][1]) / 2;
                } else {
                    [px, py] = H[1];
                }
                const k = (child ? 0.85 : 1) * (item.k || 1);
                const g = `<g transform="translate(${n1(px)} ${n1(py)}) rotate(${rot}) scale(${k})">${item.svg(c)}</g>`;
                // A flute is played at the lips, in front of the face.
                if (item.at === 'flute') overHead += g;
                else held += g;
            }
        }

        const headS = `<g transform="translate(0 ${hy})${o.tilt ? ` rotate(${o.tilt})` : ''}">${Art.head(c, Object.assign({}, o, { hair, skin }))}</g>`;
        let extra = '';
        if (o.mood === 'sleep') extra += Art.parts.zzz(c, { x: 16, y: hy - 18 });
        const all = back + legs + body + arms + held + hands + headS + overHead + extra;
        return seated ? `<g transform="translate(0 ${-bodyBottom})">${all}</g>` : all;
    }

    Art.define('person', person, { actor: true });

    // ---------- dev (div) ----------
    Art.define('dev', (c, o) => {
        const col = o.color || '#8e6bd1';
        const dark = o.dark || '#5b3ea6';
        const belly = o.bellyColor || '#c4b5fd';
        const m = o.mood || 'happy';
        let s = '';
        if (o.wings) {
            s += `<g ${c.anim('sv-flap-soft', 1.6)}><path d="M-30 -120 C-90 -170 -120 -110 -104 -70 C-96 -90 -80 -96 -70 -84 C-70 -100 -52 -104 -40 -92Z" fill="${o.wingColor || '#fde68a'}" ${S(2.2)}/>` +
                `<path d="M30 -120 C90 -170 120 -110 104 -70 C96 -90 80 -96 70 -84 C70 -100 52 -104 40 -92Z" fill="${o.wingColor || '#fde68a'}" ${S(2.2)}/></g>`;
        }
        s += tube(-18, -44, -20, -8, 18, col) + tube(18, -44, 20, -8, 18, col);
        s += `<ellipse cx="-22" cy="-4" rx="15" ry="7" fill="${dark}" ${S(2)}/><ellipse cx="22" cy="-4" rx="15" ry="7" fill="${dark}" ${S(2)}/>`;
        s += `<path d="M-38 -40 C-46 -82 -30 -122 0 -124 C30 -122 46 -82 38 -40 C26 -28 -26 -28 -38 -40Z" fill="${col}" ${S(2.6)}/>`;
        s += `<ellipse cx="0" cy="-66" rx="22" ry="26" fill="${belly}" opacity=".85"/>`;
        s += `<path d="M-38 -46 C-20 -36 20 -36 38 -46 L40 -30 C20 -20 -20 -20 -40 -30Z" fill="#f4a261" ${S(2)}/>`;
        s += [-26, -12, 4, 18, 30].map((x, i) => `<ellipse cx="${x}" cy="${-37 + (i % 2) * 4}" rx="3.4" ry="2.4" fill="#8a4b1a"/>`).join('');
        const club = o.club;
        const pose = o.pose || 'down';
        const armL = pose === 'up' || pose === 'scared' ? [-66, -150] : [-52, -60];
        const armR = pose === 'up' || pose === 'scared' ? [66, -150] : (club ? [56, -86] : [52, -60]);
        s += ptube(`M-34 -104 Q-50 -96 ${armL[0]} ${armL[1]}`, 15, col) + ptube(`M34 -104 Q50 -96 ${armR[0]} ${armR[1]}`, 15, col);
        if (club) {
            s += `<g transform="translate(${armR[0]} ${armR[1]}) rotate(18)">${tube(0, 12, 0, -24, 6, '#8b5a2b')}<ellipse cx="0" cy="-40" rx="14" ry="20" fill="#6b4a2b" ${S(2)}/>` +
                [[-8, -52], [8, -50], [-12, -36], [12, -34], [0, -58]].map(([x, y]) => `<path d="M${x} ${y} l${x > 0 ? 6 : -6} -3 l-2 6z" fill="#cbd5e1" ${S(1)}/>`).join('') + `</g>`;
        }
        s += `<circle cx="${armL[0]}" cy="${armL[1]}" r="10" fill="${col}" ${S(2.2)}/><circle cx="${armR[0]}" cy="${armR[1]}" r="10" fill="${col}" ${S(2.2)}/>`;
        // head
        s += `<g transform="translate(0 -146)">`;
        s += `<path d="M-20 -18 C-30 -34 -34 -48 -26 -58 C-24 -44 -16 -34 -8 -28Z" fill="#f3e8c9" ${S(2)}/><path d="M20 -18 C30 -34 34 -48 26 -58 C24 -44 16 -34 8 -28Z" fill="#f3e8c9" ${S(2)}/>`;
        s += `<path d="M-30 -2 L-42 -12 L-32 8Z M30 -2 L42 -12 L32 8Z" fill="${col}" ${S(2)}/>`;
        s += `<circle cx="0" cy="0" r="32" fill="${col}" ${S(2.6)}/>`;
        s += `<path d="M-10 -30 q4 -12 10 -4 q4 -12 10 0" fill="${dark}" ${S(1.8)}/>`;
        const eyeY = -6;
        if (m === 'sleep') {
            s += `<path d="M-18 ${eyeY} q6 6 12 0 M6 ${eyeY} q6 6 12 0" fill="none" ${S(2.4)}/>`;
        } else {
            const er = m === 'scared' || m === 'surprised' ? 8.5 : 7.5;
            s += `<g ${c.anim('sv-blink', 5.2)}><circle cx="-12" cy="${eyeY}" r="${er}" fill="#fff" ${S(2)}/><circle cx="12" cy="${eyeY}" r="${er}" fill="#fff" ${S(2)}/>` +
                `<circle cx="${-12 + (o.look || 0) * 2}" cy="${eyeY + 1}" r="3.6" fill="#1f1235"/><circle cx="${12 + (o.look || 0) * 2}" cy="${eyeY + 1}" r="3.6" fill="#1f1235"/></g>`;
        }
        const brows = m === 'angry'
            ? `M-22 -20 L-5 -13 M22 -20 L5 -13`
            : (m === 'scared' ? `M-22 -14 L-6 -20 M22 -14 L6 -20` : `M-21 -18 Q-12 -24 -4 -18 M21 -18 Q12 -24 4 -18`);
        s += `<path d="${brows}" fill="none" stroke="${dark}" stroke-width="4.4" stroke-linecap="round"/>`;
        s += `<ellipse cx="-20" cy="8" rx="5" ry="3.4" fill="${CHEEK}" opacity=".45"/><ellipse cx="20" cy="8" rx="5" ry="3.4" fill="${CHEEK}" opacity=".45"/>`;
        s += `<ellipse cx="0" cy="4" rx="5" ry="3.6" fill="${dark}"/>`;
        if (m === 'angry') {
            s += `<path d="M-16 16 Q0 8 16 16 Q0 26 -16 16Z" fill="#5a1f2b" ${S(2)}/><path d="M-11 15 l3 -8 l3 8Z M5 15 l3 -8 l3 8Z" fill="#fff" ${S(1.2)}/>`;
        } else if (m === 'scared' || m === 'surprised') {
            s += `<ellipse cx="0" cy="18" rx="8" ry="9" fill="#5a1f2b" ${S(2)}/>`;
        } else if (m === 'sleep') {
            s += `<path d="M-8 16 Q0 20 8 16" fill="none" ${S(2)}/>`;
        } else {
            s += `<path d="M-16 12 Q0 28 16 12Z" fill="#5a1f2b" ${S(2)}/><path d="M-6 13 l2 6 l2 -6Z" fill="#fff" ${S(1)}/>`;
        }
        s += `</g>`;
        if (m === 'sleep') s += Art.parts.zzz(c, { x: 28, y: -186, s: 1.6 });
        return s;
    }, { actor: true, breath: 4.2 });

    // ---------- little star with a face ----------
    // The little star glows by itself, so it is drawn in the light layer
    // (above the night-time wash).
    Art.define('starkid', (c, o) => {
        const pts = [];
        for (let i = 0; i < 10; i++) {
            const r = i % 2 ? 11 : 26;
            const a = -Math.PI / 2 + (i * Math.PI) / 5;
            pts.push(`${n1(Math.cos(a) * r)} ${n1(Math.sin(a) * r - 26)}`);
        }
        const face = Art.face(c, { mood: o.mood || 'happy' });
        Art.light(c, `<circle cx="0" cy="-26" r="54" fill="${radial(c, 'starglow', '#fff3b0', 0.85)}"/>` +
            `<g ${c.anim('sv-bob', 2.6)}><path d="M${pts.join(' L')}Z" fill="#fcd34d" ${S(2.2)} stroke-linejoin="round"/>` +
            `<path d="M-8 -40 L-4 -44" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>` +
            `<g transform="translate(0 -24) scale(.72)">${face}</g></g>`);
        return '';
    }, { actor: true, breath: 2.6 });

    // ---------- presets ----------
    Object.assign(Art.cast, {
        // Zumrad va Qimmat
        zumrad: { sex: 'f', age: 'child', pattern: 'ikat', color: '#1f9d6b', color2: '#ffd166', color3: '#ef476f', head: 'girlcap', hat: '#d62839', vest: '#6a2c70', pants: '#ffd166' },
        qimmat: { sex: 'f', age: 'child', pattern: 'ikat', color: '#ff8fab', color2: '#ffe5a5', color3: '#b388eb', head: 'girlcap', hat: '#7b2cbf', hair: '#5c3317', pants: '#b388eb' },
        chol: { age: 'old', head: 'doppi', beard: 'long', pattern: 'stripes', color: '#35618f', color2: '#8ecae6', color3: '#264653', belt: '#e9c46a', cane: true },
        ogayona: { sex: 'f', head: 'rumol', hat: '#7b2cbf', scarfFill: '#9d4edd', pattern: 'dots', color: '#5a189a', color2: '#e0aaff', mood: 'angry', pants: '#3c096c' },
        momo: { sex: 'f', age: 'old', head: 'rumol', hat: '#fbfaf5', pattern: 'dots', color: '#6d597a', color2: '#e5989b', pants: '#355070', mood: 'happy' },
        // Oltin tarvuz
        dehqon: { head: 'doppi', beard: 'short', pattern: 'patch', color: '#6a994e', color2: '#bc6c25', belt: '#bc4749', patches: true },
        boy: { head: 'salla', beard: 'short', belly: true, pattern: 'stripes', color: '#7b2cbf', color2: '#f4c542', color3: '#c77dff', belt: '#f4c542', mood: 'sly', hold: 'moneybag' },
        // Ur to'qmoq
        bobo: { age: 'old', head: 'salla', beard: 'long', pattern: 'stripes', color: '#8d6e63', color2: '#d7ccc8', color3: '#5d4037', belt: '#2a9d8f' },
        kampir: { sex: 'f', age: 'old', head: 'rumol', hat: '#fff8f0', pattern: 'ikat', color: '#9a031e', color2: '#fb8b24', color3: '#5f0f40', pants: '#0f4c5c' },
        saroybon: { head: 'doppi', beard: 'short', belly: true, pattern: 'stripes', color: '#b5838d', color2: '#ffcdb2', color3: '#6d6875', belt: '#e5989b', mood: 'sly' },
        // Uch og'a-ini botirlar
        polvon: { head: 'doppi', pattern: 'stripes', color: '#c1121f', color2: '#fdf0d5', color3: '#780000', belt: '#003049', belly: false, s: 1.08 },
        mergan: { head: 'telpak', pattern: 'stripes', color: '#2a9d8f', color2: '#e9c46a', color3: '#264653', belt: '#e76f51', hold: 'bow' },
        kenja: { age: 'child', head: 'doppi', pattern: 'stripes', color: '#3a86ff', color2: '#ffbe0b', color3: '#8338ec', belt: '#ff006e' },
        ota: { age: 'old', head: 'salla', beard: 'long', pattern: 'stripes', color: '#6c584c', color2: '#dde5b6', color3: '#a98467', belt: '#adc178', cane: true },
        // Afandi
        afandi: { head: 'salla', bigHat: true, beard: 'short', pattern: 'stripes', color: '#e76f51', color2: '#f4a261', color3: '#2a9d8f', belt: '#264653', mood: 'sly' },
        afandibola: { age: 'child', head: 'doppi', pattern: 'stripes', color: '#3a86ff', color2: '#ffbe0b', color3: '#fb5607', belt: '#8338ec' },
        qoshni: { head: 'doppi', beard: 'short', beardColor: '#5b4636', pattern: 'stripes', color: '#588157', color2: '#dad7cd', color3: '#344e41', belt: '#a3b18a' },
        mehmon: { head: 'doppi', pattern: 'stripes', color: '#457b9d', color2: '#a8dadc', color3: '#1d3557', belt: '#e63946' },
        // Dono qiz
        podshoh: { head: 'crown', beard: 'short', beardColor: '#3b2a1f', outfit: 'royal', color: '#6a0dad', belly: true },
        vazir: { head: 'salla', hat: '#2a9d8f', beard: 'long', beardColor: '#5b4636', pattern: 'stripes', color: '#264653', color2: '#2a9d8f', color3: '#e9c46a', belt: '#e9c46a' },
        oydin: { sex: 'f', age: 'child', pattern: 'ikat', color: '#3a86ff', color2: '#ffd166', color3: '#ff006e', head: 'girlcap', hat: '#ffbe0b', vest: '#023e8a', pants: '#ff006e' },
        // Susambil & others
        chopon: { age: 'child', head: 'telpak', pattern: 'stripes', color: '#8d6e63', color2: '#e9c46a', color3: '#5d4037', belt: '#d62828' },
        nodira: { sex: 'f', age: 'child', pattern: 'ikat', color: '#06d6a0', color2: '#ffd166', color3: '#118ab2', head: 'girlcap', hat: '#ef476f', pants: '#118ab2' },
        buvi: { sex: 'f', age: 'old', head: 'rumol', hat: '#fffaf0', pattern: 'ikat', color: '#264653', color2: '#e9c46a', color3: '#e76f51', pants: '#6d597a' },
        baliqchi: { age: 'old', head: 'doppi', beard: 'long', pattern: 'patch', color: '#4d908e', color2: '#f9c74f', belt: '#f94144', patches: true },
        hoshimjon: { age: 'child', head: 'boy', outfit: 'shirt', color: '#ffbe0b', pants: '#3a86ff', shoes: '#e63946' },
        farhod: { head: 'crown', hat: '#e0fbfc', pattern: 'stripes', color: '#1d3557', color2: '#457b9d', color3: '#e63946', belt: '#f4c542' },
        otabek: { head: 'doppi', pattern: 'stripes', color: '#264653', color2: '#2a9d8f', color3: '#e9c46a', belt: '#e76f51' },
        dost: { head: 'doppi', pattern: 'stripes', color: '#9c6644', color2: '#ede0d4', color3: '#7f5539', belt: '#b08968' },
        shoh: { head: 'crown', beard: 'short', beardColor: '#6b4f3a', outfit: 'royal', color: '#9d0208' },
        oydinota: { age: 'old', head: 'doppi', beard: 'long', pattern: 'patch', color: '#7f5539', color2: '#ddb892', belt: '#606c38', patches: true },
        dehqon2: { head: 'doppi', beard: 'short', pattern: 'stripes', color: '#606c38', color2: '#dda15e', color3: '#283618', belt: '#bc6c25', hold: 'ketmon' },
        oyqiz: { sex: 'f', age: 'child', color: '#cfe8ff', pattern: 'dots', color2: '#ffffff', head: 'crescent', hair: '#6d6875', glow: '#dbeafe', pants: '#bde0fe' },
        pari: { sex: 'f', age: 'child', color: '#a0e7e5', pattern: 'dots', color2: '#ffffff', head: 'wreath', hair: '#8ecae6', wings: true, glow: '#caf0f8', pants: '#b4f8c8', hold: 'wand', pose: 'wave' },
        kid1: { age: 'child', head: 'doppi', pattern: 'stripes', color: '#ef476f', color2: '#ffd166', color3: '#073b4c', belt: '#118ab2' },
        kid2: { sex: 'f', age: 'child', pattern: 'ikat', color: '#8338ec', color2: '#ffbe0b', color3: '#ff006e', head: 'braids', pants: '#ffbe0b' },
        kid3: { age: 'child', head: 'boy', outfit: 'shirt', color: '#06d6a0', pants: '#073b4c', shoes: '#ef476f' },
        kid4: { sex: 'f', age: 'child', pattern: 'ikat', color: '#fb5607', color2: '#ffd166', color3: '#3a86ff', head: 'girlcap', hat: '#3a86ff', pants: '#3a86ff' },
        ona: { sex: 'f', head: 'rumol', hat: '#f28482', scarfFill: '#f5cac3', pattern: 'ikat', color: '#84a59d', color2: '#f7ede2', color3: '#f28482', pants: '#f6bd60' },
    });
})(window.Art);
