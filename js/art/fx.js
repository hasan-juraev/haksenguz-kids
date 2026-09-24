/*
 * Effects: sparkles, hearts, music notes, Zzz, speech & thought bubbles,
 * sound bursts, glows and light rays, plus scene-wide weather (snow, falling
 * leaves, petals, fireflies, confetti).
 */
(function (Art) {
    'use strict';

    const { S, radial, n1, esc, OL, W, H } = Art;

    function star4(r, fill) {
        return `<path d="M0 ${-r} L${r * 0.28} ${-r * 0.28} L${r} 0 L${r * 0.28} ${r * 0.28} L0 ${r} L${-r * 0.28} ${r * 0.28} L${-r} 0 L${-r * 0.28} ${-r * 0.28}Z" fill="${fill}"/>`;
    }

    // Sparkles scattered in a box centred on (x, y) — defaults to the origin.
    Art.define('sparkles', (c, o) => {
        const w = o.w || 80;
        const h = o.h || 60;
        const n = o.n || 6;
        const col = o.color || '#fff6b0';
        let s = '';
        for (let i = 0; i < n; i++) {
            const x = (o.x || 0) + c.rand(-w / 2, w / 2);
            const y = (o.y || 0) + c.rand(-h / 2, h / 2);
            s += `<g transform="translate(${n1(x)} ${n1(y)})"><g ${c.anim('sv-twinkle', c.rand(1.2, 2.4))}>${star4(c.rand(4, 8), col)}</g></g>`;
        }
        if (o.lit !== false && c.xf !== undefined) {
            Art.light(c, s);
            return '';
        }
        return s;
    });

    function rising(c, n, dur, make) {
        let s = '';
        for (let i = 0; i < n; i++) {
            s += `<g transform="translate(${n1((i - (n - 1) / 2) * 10)} 0)"><g ${c.anim('sv-rise', dur, (i * dur) / n)}>${make(i)}</g></g>`;
        }
        return s;
    }

    Art.define('hearts', (c, o) => rising(c, o.n || 3, 3, (i) =>
        `<path transform="scale(${0.9 + (i % 2) * 0.4})" d="M0 4 C-8 -2 -8 -10 -3 -10 C-1 -10 0 -8 0 -7 C0 -8 1 -10 3 -10 C8 -10 8 -2 0 4Z" fill="${o.color || '#ef476f'}" ${S(1.2)}/>`));

    Art.define('notes', (c, o) => rising(c, o.n || 3, 3.4, (i) => i % 2
        ? `<path d="M0 0 v-14 l10 -3 v14" fill="none" ${S(1.8)}/><ellipse cx="-2" cy="0" rx="3.4" ry="2.6" fill="${OL}"/><ellipse cx="8" cy="-3" rx="3.4" ry="2.6" fill="${OL}"/>`
        : `<path d="M0 0 v-14 q6 2 8 6" fill="none" ${S(1.8)}/><ellipse cx="-2" cy="0" rx="3.6" ry="2.8" fill="${o.color || '#7b2cbf'}" ${S(1)}/>`));

    Art.define('zzz', (c, o) => {
        const inner = rising(c, 3, 3.6, (i) => `<text x="${i * 3}" y="0" font-family="Fredoka, Nunito, sans-serif" font-weight="700" font-size="${10 + i * 3}" fill="#6c63ff" stroke="#fff" stroke-width="2" paint-order="stroke">Z</text>`);
        if (o.x !== undefined) return `<g transform="translate(${o.x} ${o.y}) scale(${o.s || 1})">${inner}</g>`;
        return inner;
    });

    // Speech bubble; the tail points at `to` (relative offset), default down-left.
    Art.define('bubble', (c, o) => {
        const text = esc(o.text || '');
        const fs = o.size || 13;
        const w = Math.max(40, text.length * fs * 0.58 + 20);
        const h = fs + 16;
        const [tx, ty] = o.to || [-w * 0.3, h / 2 + 16];
        const bx = Math.max(-w / 2 + 10, Math.min(w / 2 - 10, tx * 0.4));
        return `<g ${c.anim('sv-bob', 2.4)}>` +
            `<path d="M${n1(bx - 7)} ${h / 2 - 1} L${n1(tx)} ${n1(ty)} L${n1(bx + 7)} ${h / 2 - 1}Z" fill="#fff" ${S(2)}/>` +
            `<rect x="${n1(-w / 2)}" y="${-h / 2}" width="${n1(w)}" height="${h}" rx="${h / 2}" fill="#fff" ${S(2)}/>` +
            `<path d="M${n1(bx - 6)} ${h / 2 - 1.2} L${n1(bx + 6)} ${h / 2 - 1.2}" stroke="#fff" stroke-width="3"/>` +
            `<text x="0" y="${n1(fs * 0.36)}" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-weight="700" font-size="${fs}" fill="${o.color || '#4b2e1a'}">${text}</text></g>`;
    });

    Art.define('think', (c, o) => {
        const text = esc(o.text || '?');
        const fs = o.size || 18;
        const w = Math.max(44, text.length * fs * 0.6 + 26);
        const [tx, ty] = o.to || [-w * 0.35, 40];
        let s = `<g ${c.anim('sv-bob', 3)}>`;
        s += Art.blob([[-w * 0.28, 0, 16], [0, -6, 20], [w * 0.28, 0, 16], [0, 8, 16]], '#fff', 2);
        s += `<circle cx="${n1(tx * 0.55)}" cy="${n1(ty * 0.55)}" r="5" fill="#fff" ${S(1.8)}/><circle cx="${n1(tx * 0.85)}" cy="${n1(ty * 0.85)}" r="3" fill="#fff" ${S(1.6)}/>`;
        s += `<text x="0" y="${n1(fs * 0.36)}" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-weight="700" font-size="${fs}" fill="${o.color || '#7b2cbf'}">${text}</text>`;
        if (o.icon) s += `<g transform="translate(0 2)">${o.icon}</g>`;
        return s + `</g>`;
    });

    // Comic "boom" for loud noises and bonks.
    Art.define('burst', (c, o) => {
        const pts = [];
        const R = o.r || 26;
        for (let i = 0; i < 16; i++) {
            const r = i % 2 ? R * 0.62 : R;
            const a = (i / 16) * Math.PI * 2;
            pts.push(`${n1(Math.cos(a) * r * 1.3)} ${n1(Math.sin(a) * r)}`);
        }
        const text = esc(o.text || '');
        return `<g ${c.anim('sv-pulse', 0.9)}><path d="M${pts.join(' L')}Z" fill="${o.color || '#ffd166'}" ${S(2)}/>` +
            `<text x="0" y="5" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-weight="700" font-size="${o.size || 13}" fill="#c1121f">${text}</text></g>`;
    });

    Art.define('mark', (c, o) => `<g ${c.anim('sv-bob', 1.4)}><text x="0" y="0" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-weight="700" font-size="${o.size || 30}" fill="${o.color || '#ef476f'}" stroke="#fff" stroke-width="3" paint-order="stroke">${esc(o.ch || '!')}</text></g>`);

    Art.define('sound', (c, o) => `<g ${c.anim('sv-pulse', 1.2)}>` +
        [8, 16, 24].map((r) => `<path d="M0 ${-r} A${r} ${r} 0 0 1 0 ${r}" fill="none" stroke="${o.color || '#4b2e1a'}" stroke-width="2.4" stroke-linecap="round" opacity="${1 - r / 36}"/>`).join('') + `</g>`);

    Art.define('motion', (c, o) => `<path d="M0 -10 h-${o.len || 22} M4 0 h-${(o.len || 22) + 8} M0 10 h-${(o.len || 22) - 4}" stroke="${OL}" stroke-width="2.2" stroke-linecap="round" opacity=".45"/>`);

    Art.define('glow', (c, o) => {
        Art.light(c, `<circle r="${o.r || 60}" fill="${radial(c, 'glow' + (o.color || 'y'), o.color || '#fff3b0', o.a || 0.85)}"/>`);
        return '';
    });

    // Drawn in place (behind whatever comes later in the scene), so a hero
    // standing in the light is not washed out by it.
    Art.define('rays', (c, o) => {
        const r = o.r || 90;
        return `<g ${c.anim('sv-spin', 24)}>${Array.from({ length: 12 }, (_, i) => `<path d="M-6 0 L0 ${-r} L6 0Z" transform="rotate(${i * 30})" fill="${o.color || '#fff3b0'}" opacity=".5"/>`).join('')}</g>` +
            `<circle r="${r * 0.55}" fill="${radial(c, 'raysglow', o.color || '#fff3b0', 0.8)}"/>`;
    });

    Art.define('dust', (c) => [[-10, -4, 7], [0, -8, 9], [10, -3, 6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#e9d8a6" opacity=".7"/>`).join(''));

    Art.define('smoke', (c, o) => rising(c, o.n || 3, 4, (i) => `<circle r="${6 + i * 2}" fill="${o.color || '#e5e7eb'}" opacity=".75"/>`));

    Art.define('drops', (c) => [[-10, 0], [0, -6], [10, 0]].map(([x, y], i) => `<g transform="translate(${x} ${y})"><g ${c.anim('sv-drip', 1.4, i * 0.4)}><path d="M0 0 q-3 5 0 7 q3 -2 0 -7z" fill="#7cc6ff" ${S(0.8)}/></g></g>`).join(''));

    Art.define('star', (c, o) => `<g ${c.anim('sv-twinkle', 2)}>${star4(o.r || 10, o.color || '#fde047')}</g>`);

    Art.define('crack', () => `<path d="M-30 0 l10 -4 l6 6 l10 -5 l8 5 l12 -3" fill="none" stroke="#8a6a3a" stroke-width="2"/><path d="M-16 8 l8 -3 l6 4" fill="none" stroke="#8a6a3a" stroke-width="1.6"/>`);

    // ---------- scene-wide effects ----------

    function falling(c, n, dur, make) {
        let s = '';
        for (let i = 0; i < n; i++) {
            const x = c.rand(0, W);
            const d = c.rand(dur * 0.7, dur * 1.3);
            // Still renders have no motion, so scatter the particles instead.
            const y = c.still ? c.rand(c.top, H - 20) : 0;
            s += `<g transform="translate(${n1(x)} ${n1(y)})"><g ${c.anim('sv-fall', d)}><g ${c.anim('sv-sway-x', c.rand(2, 4))}>${make(i)}</g></g></g>`;
        }
        return s;
    }

    Art.effects = function (c, sc) {
        const fx = sc.fx || [];
        let s = '';
        for (const f of fx) {
            if (f === 'snow') s += falling(c, 34, 9, () => `<circle r="${n1(c.rand(1.4, 3.2))}" fill="#fff" opacity=".95"/>`);
            if (f === 'leaves') s += falling(c, 12, 10, () => `<path d="M0 0 q6 -6 12 0 q-6 6 -12 0z" fill="${c.pick(['#e0892b', '#f2b33d', '#c25b1f'])}" ${S(0.8)}/>`);
            if (f === 'petals') s += falling(c, 16, 11, () => `<ellipse rx="3" ry="2" fill="${c.pick(['#ffc8dd', '#ffffff', '#ffafcc'])}"/>`);
            if (f === 'confetti') s += falling(c, 30, 6, () => `<rect x="-2" y="-4" width="4" height="8" rx="1" fill="${c.pick(['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#8338ec'])}" transform="rotate(${n1(c.rand(0, 180))})"/>`);
            if (f === 'rain') s += falling(c, 40, 1.4, () => `<path d="M0 0 l-2 10" stroke="#bfe3ff" stroke-width="1.6" stroke-linecap="round"/>`);
            if (f === 'fireflies') {
                let ff = '';
                for (let i = 0; i < 12; i++) {
                    ff += `<g transform="translate(${n1(c.rand(10, W - 10))} ${n1(c.rand(110, 290))})"><g ${c.anim('sv-firefly', c.rand(4, 7))}><circle r="7" fill="${radial(c, 'ff', '#fff59d', 0.9)}"/><circle r="1.8" fill="#fffde7"/></g></g>`;
                }
                s += ff;
            }
            if (f === 'sparkle') {
                for (let i = 0; i < 10; i++) s += `<g transform="translate(${n1(c.rand(10, W - 10))} ${n1(c.rand(10, H - 60))})"><g ${c.anim('sv-twinkle', c.rand(1.4, 2.8))}>${star4(c.rand(3, 6), '#fff6b0')}</g></g>`;
            }
        }
        return s;
    };
})(window.Art);
