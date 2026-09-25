/*
 * Places and props: skies, landscapes and interiors (Art.background), plus
 * trees, Uzbek houses, the kulba, palace portal and minaret, so'ri, tandir,
 * qozon, sandiq, tarvuz, dasturxon, arava, flying gilam and friends.
 */
(function (Art) {
    'use strict';

    const { S, tube, ptube, blob, radial, linear, fabric, n1, OL, W, H } = Art;

    const SKY = {
        day: ['#6ec3f0', '#b5e3fa', '#e9f7ff'],
        morning: ['#8fcbf2', '#ffd9ae', '#fff1d6'],
        sunset: ['#5f5bb0', '#f2876a', '#ffd08a'],
        dusk: ['#3a4a8f', '#8a64b3', '#f0a39a'],
        night: ['#2a3a8a', '#3d4fa8', '#5a67b8'],
        storm: ['#5b6477', '#8792a6', '#aab3c2'],
        winter: ['#a9c3dc', '#d3e1ee', '#eef4f9'],
    };

    const GROUND = {
        summer: ['#95cf6a', '#6fae4c', '#5b9a3c'],
        spring: ['#a8dc78', '#80c35a', '#65a845'],
        autumn: ['#dcbc62', '#c49a45', '#a67c32'],
        winter: ['#f5f9fd', '#dfe9f3', '#cbd9e8'],
        dry: ['#dcc38e', '#c7a76e', '#ad8d57'],
    };

    const LEAVES = {
        summer: ['#3f9d4c', '#57b65c', '#2f7d3a'],
        spring: ['#6cc04a', '#8fd46a', '#4e9a34'],
        autumn: ['#e0892b', '#f2b33d', '#c25b1f'],
        winter: ['#9fb4a3', '#b8c9bb', '#7d9482'],
        dry: ['#a3a654', '#bdb76b', '#7f7f3f'],
    };

    // ---------- sky ----------

    function cloud(c, x, y, s, op = 0.95) {
        const inner = blob([[-22, 0, 14], [0, -8, 18], [22, -2, 14], [38, 4, 10], [-36, 5, 9]], '#fff', 0) +
            `<path d="M-44 10 Q0 18 46 10" stroke="#d6e6f5" stroke-width="5" stroke-linecap="round" fill="none" opacity=".8"/>`;
        return `<g transform="translate(${n1(x)} ${n1(y)}) scale(${s})" opacity="${op}"><g ${c.anim('sv-drift', c.rand(16, 26))}>${inner}</g></g>`;
    }

    function sun(c, x, y, r, col = '#ffd84d') {
        const rays = Array.from({ length: 12 }, (_, i) => `<path d="M0 ${-r - 6} L4 ${-r - 18} L-4 ${-r - 18}Z" transform="rotate(${i * 30})" fill="${col}" opacity=".75"/>`).join('');
        return `<g transform="translate(${x} ${y})"><circle r="${r * 3}" fill="${radial(c, 'sunglow', '#fff3b0', 0.8)}"/>` +
            `<g ${c.anim('sv-spin', 40)}>${rays}</g><circle r="${r}" fill="${col}" stroke="#f4a261" stroke-width="2"/></g>`;
    }

    function moon(c, x, y, r = 19) {
        const mask = c.def('moonmask', (id) => `<mask id="${id}"><rect x="-40" y="-40" width="80" height="80" fill="#fff"/><circle cx="9" cy="-7" r="${r * 0.92}" fill="#000"/></mask>`);
        return `<g transform="translate(${x} ${y})"><circle r="${r * 3.2}" fill="${radial(c, 'moonglow', '#fff7c2', 0.6)}"/>` +
            `<circle r="${r}" fill="#fef3c7" mask="${mask}"/></g>`;
    }

    function stars(c, n, maxY, minY = 6) {
        let s = '';
        for (let i = 0; i < n; i++) {
            const x = c.rand(6, W - 6);
            const y = c.rand(minY, maxY);
            const r = c.rand(0.8, 2.2);
            const star = r > 1.7
                ? `<path d="M0 ${-r * 2.4} L${r * 0.6} ${-r * 0.6} L${r * 2.4} 0 L${r * 0.6} ${r * 0.6} L0 ${r * 2.4} L${-r * 0.6} ${r * 0.6} L${-r * 2.4} 0 L${-r * 0.6} ${-r * 0.6}Z" fill="#fff8d6"/>`
                : `<circle r="${n1(r)}" fill="#fff"/>`;
            s += `<g transform="translate(${n1(x)} ${n1(y)})"><g ${c.anim('sv-twinkle', c.rand(1.6, 3.6))}>${star}</g></g>`;
        }
        return s;
    }

    function sky(c, sc) {
        const time = sc.time || 'day';
        const cols = SKY[time] || SKY.day;
        let s = `<rect y="${c.top}" width="${W}" height="${H - c.top}" fill="${linear(c, 'sky' + time + c.top, [[0, cols[0]], [0.55, cols[1]], [1, cols[2]]])}"/>`;
        const night = time === 'night' || time === 'dusk';
        if (night) {
            c.lights.push(stars(c, time === 'night' ? 34 : 14, 150));
            if (c.top) c.lights.push(stars(c, 10, 0, c.top + 6));
            if (sc.moon !== false) {
                const [mx, my] = sc.moonAt || [332, 56];
                c.lights.push(moon(c, mx, my));
            }
        } else if (sc.sun !== false && time !== 'storm') {
            const at = sc.sunAt || (time === 'morning' ? [70, 92] : time === 'sunset' ? [300, 176] : [330, 58]);
            s += sun(c, at[0], at[1], time === 'sunset' ? 30 : 22, time === 'sunset' ? '#ffb347' : '#ffd84d');
        }
        if (sc.rainbow) s += Art.parts.rainbow(c, {});
        if (sc.clouds !== false && !night) {
            const n = sc.clouds || 3;
            for (let i = 0; i < n; i++) s += cloud(c, 40 + ((i * 131) % 330) + c.rand(-20, 20), 36 + c.rand(0, 60), c.rand(0.6, 1.0), 0.92);
            if (c.top) s += cloud(c, 90 + c.rand(0, 220), c.top + 26 + c.rand(0, 16), c.rand(0.5, 0.8), 0.85);
        }
        return s;
    }

    // ---------- distant landscape ----------

    function mountains(c, baseY, colFar, colNear, snow = true) {
        let s = '';
        for (const [col, off, amp] of [[colFar, 0, 1], [colNear, 36, 0.8]]) {
            const pts = [[-10, baseY + 10]];
            let x = -10;
            let up = true;
            while (x < W + 40) {
                x += c.rand(40, 70);
                const y = up ? baseY - c.rand(50, 100) * amp + off : baseY - c.rand(0, 20) + off;
                pts.push([x, y]);
                up = !up;
            }
            const d = `M${pts.map(([a, b]) => `${n1(a)} ${n1(b)}`).join(' L')} L${W + 20} ${H} L-20 ${H}Z`;
            s += `<path d="${d}" fill="${col}"/>`;
            if (snow) {
                for (let i = 1; i < pts.length - 1; i++) {
                    const [px, py] = pts[i];
                    if (py > baseY - 60 + off) continue;
                    const [lx, ly] = pts[i - 1];
                    const [rx, ry] = pts[i + 1];
                    const t = 0.24;
                    const a = [px + (lx - px) * t, py + (ly - py) * t];
                    const b = [px + (rx - px) * t, py + (ry - py) * t];
                    s += `<path d="M${n1(px)} ${n1(py)} L${n1(a[0])} ${n1(a[1])} L${n1(px - 4)} ${n1(py + (a[1] - py) * 0.7)} L${n1(px + 3)} ${n1(py + (b[1] - py) * 0.9)} L${n1(b[0])} ${n1(b[1])}Z" fill="#fbfdff" opacity=".95"/>`;
                }
            }
        }
        return s;
    }

    function hills(c, baseY, col, amp = 18) {
        let d = `M-10 ${baseY}`;
        let x = -10;
        while (x < W + 10) {
            const nx = x + c.rand(70, 120);
            d += ` Q${n1((x + nx) / 2)} ${n1(baseY - c.rand(amp * 0.4, amp * 1.4))} ${n1(nx)} ${n1(baseY + c.rand(-4, 4))}`;
            x = nx;
        }
        return `<path d="${d} L${W + 10} ${H} L-10 ${H}Z" fill="${col}"/>`;
    }

    function treeline(c, baseY, col, size = 16) {
        const circles = [];
        for (let x = -10; x < W + 20; x += size * 0.9) {
            const r = c.rand(size * 0.8, size * 1.35);
            circles.push(`<circle cx="${n1(x)}" cy="${n1(baseY - r * 0.6)}" r="${n1(r)}" fill="${col}"/>`);
            if (c.r() < 0.3) circles.push(`<path d="M${n1(x - 8)} ${baseY} L${n1(x)} ${n1(baseY - size * 3.2)} L${n1(x + 8)} ${baseY}Z" fill="${col}"/>`);
        }
        return circles.join('') + `<rect x="-10" y="${baseY - 2}" width="${W + 20}" height="${H - baseY + 2}" fill="${col}"/>`;
    }

    function poplars(c, baseY, col, n = 9) {
        let s = '';
        for (let i = 0; i < n; i++) {
            const x = 20 + i * (W / n) + c.rand(-12, 12);
            const h = c.rand(38, 58);
            s += `<ellipse cx="${n1(x)}" cy="${n1(baseY - h / 2)}" rx="${n1(h * 0.14)}" ry="${n1(h / 2)}" fill="${col}"/>`;
        }
        return s;
    }

    function skyline(c, baseY, col) {
        let s = '';
        let x = -10;
        while (x < W) {
            const kind = c.pick(['dome', 'dome', 'minaret', 'portal', 'block']);
            if (kind === 'dome') {
                const w = c.rand(34, 54);
                const h = c.rand(26, 40);
                s += `<rect x="${n1(x)}" y="${n1(baseY - h)}" width="${n1(w)}" height="${n1(h)}" fill="${col}"/>`;
                s += `<path d="M${n1(x + 4)} ${n1(baseY - h)} C${n1(x + 4)} ${n1(baseY - h - w * 0.75)} ${n1(x + w - 4)} ${n1(baseY - h - w * 0.75)} ${n1(x + w - 4)} ${n1(baseY - h)}Z" fill="${col}"/>`;
                s += `<rect x="${n1(x + w / 2 - 1)}" y="${n1(baseY - h - w * 0.62 - 8)}" width="2" height="9" fill="${col}"/>`;
                x += w + c.rand(2, 10);
            } else if (kind === 'minaret') {
                const h = c.rand(70, 100);
                s += `<path d="M${n1(x)} ${baseY} L${n1(x + 3)} ${n1(baseY - h)} L${n1(x + 11)} ${n1(baseY - h)} L${n1(x + 14)} ${baseY}Z" fill="${col}"/>`;
                s += `<rect x="${n1(x + 1)}" y="${n1(baseY - h - 10)}" width="12" height="10" fill="${col}"/><path d="M${n1(x)} ${n1(baseY - h - 10)} Q${n1(x + 7)} ${n1(baseY - h - 22)} ${n1(x + 14)} ${n1(baseY - h - 10)}Z" fill="${col}"/>`;
                x += 14 + c.rand(8, 16);
            } else if (kind === 'portal') {
                const w = c.rand(40, 56);
                const h = c.rand(44, 60);
                s += `<rect x="${n1(x)}" y="${n1(baseY - h)}" width="${n1(w)}" height="${n1(h)}" fill="${col}"/>`;
                x += w + c.rand(4, 10);
            } else {
                const w = c.rand(30, 46);
                const h = c.rand(16, 26);
                s += `<rect x="${n1(x)}" y="${n1(baseY - h)}" width="${n1(w)}" height="${n1(h)}" fill="${col}"/>`;
                x += w;
            }
        }
        return s;
    }

    function ground(c, top, season, variant) {
        const g = GROUND[season] || GROUND.summer;
        const d = `M-10 ${top} Q${W * 0.3} ${top - 8} ${W * 0.55} ${top + 2} T${W + 10} ${top - 2} L${W + 10} ${H} L-10 ${H}Z`;
        let s = `<path d="${d}" fill="${linear(c, 'gr' + season + variant, [[0, g[0]], [0.6, g[1]], [1, g[2]]])}"/>`;
        if (season !== 'winter') {
            for (let i = 0; i < 18; i++) {
                const x = c.rand(0, W);
                const y = c.rand(top + 12, H - 4);
                s += `<path d="M${n1(x - 4)} ${n1(y)} l2 -6 l2 5 l2 -7 l2 8" fill="none" stroke="${g[2]}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`;
            }
        } else {
            for (let i = 0; i < 10; i++) {
                s += `<ellipse cx="${n1(c.rand(0, W))}" cy="${n1(c.rand(top + 10, H))}" rx="${n1(c.rand(10, 26))}" ry="3" fill="#c9d8e8" opacity=".6"/>`;
            }
        }
        if (season === 'spring' || variant === 'flowers') {
            for (let i = 0; i < 16; i++) {
                const col = c.pick(['#ff8fab', '#ffd166', '#ffffff', '#c77dff', '#ef476f']);
                s += `<circle cx="${n1(c.rand(0, W))}" cy="${n1(c.rand(top + 8, H - 4))}" r="${n1(c.rand(1.6, 2.8))}" fill="${col}"/>`;
            }
        }
        return s;
    }

    function road(col = '#e9d3a4') {
        return `<path d="M150 ${H} C182 292 236 272 206 240 L214 236 C252 262 226 300 262 ${H}Z" fill="${col}" opacity=".9"/>`;
    }

    // ---------- interiors ----------

    function room(c, sc) {
        const night = sc.time === 'night' || sc.time === 'dusk';
        const t = c.top;
        let s = `<rect y="${t}" width="${W}" height="${H - t}" fill="${linear(c, 'wall' + t, [[0, '#f1d6aa'], [1, '#e6c28c']])}"/>`;
        s += `<rect y="${t}" width="${W}" height="18" fill="#7a4e2a"/>` + Array.from({ length: 14 }, (_, i) => `<rect x="${i * 30}" y="${t + 18}" width="10" height="7" fill="#5c381c"/>`).join('');
        if (t) s += `<path d="M150 ${t + 40} h100" stroke="#d9b27c" stroke-width="3"/><circle cx="200" cy="${t + 34}" r="10" fill="none" stroke="#d9b27c" stroke-width="3"/>`;
        // taxmon: niche with stacked ko'rpa blankets
        s += `<path d="M26 206 L26 96 Q26 64 64 58 Q102 64 102 96 L102 206Z" fill="#d9b27c" ${S(2)}/>`;
        const quilts = ['#e63946', '#f4a261', '#2a9d8f', '#e9c46a', '#8338ec', '#ef476f', '#118ab2'];
        quilts.forEach((col, i) => {
            s += `<rect x="32" y="${196 - i * 12}" width="64" height="12" rx="4" fill="${col}" ${S(1.4)}/>`;
            s += `<path d="M38 ${202 - i * 12} H90" stroke="#fff" stroke-width="1" stroke-dasharray="3 3" opacity=".6"/>`;
        });
        // small wall niches with dishes
        s += `<path d="M132 120 L132 88 Q132 74 146 72 Q160 74 160 88 L160 120Z" fill="#d9b27c" ${S(1.6)}/>`;
        s += `<path d="M137 118 Q146 104 155 118Z" fill="#1d4ed8" ${S(1.2)}/>`;
        // window
        const wx = sc.windowX || 300;
        s += `<rect x="${wx - 40}" y="60" width="80" height="84" rx="4" fill="${night ? '#1c2659' : '#bde4f7'}" ${S(2.4)}/>`;
        if (night) {
            s += [[-24, 72], [-6, 82], [18, 70], [28, 90], [-30, 124], [14, 118]].map(([dx, y]) => `<circle cx="${wx + dx}" cy="${y}" r="1.3" fill="#fff"/>`).join('');
            s += `<path d="M${wx + 20} 118 A9 9 0 1 0 ${wx + 30} 128 A7 7 0 1 1 ${wx + 20} 118Z" fill="#fef3c7"/>`;
        }
        s += `<path d="M${wx} 60 V144 M${wx - 40} 102 H${wx + 40}" stroke="#7a4e2a" stroke-width="5"/>`;
        s += `<path d="M${wx - 40} 60 L${wx + 40} 144 M${wx + 40} 60 L${wx - 40} 144" stroke="#7a4e2a" stroke-width="1.6" opacity=".5"/>`;
        s += `<rect x="${wx - 46}" y="142" width="92" height="8" rx="2" fill="#9c6b3f" ${S(1.6)}/>`;
        // floor + carpet
        s += `<path d="M0 214 L${W} 214 L${W} ${H} L0 ${H}Z" fill="#a0673a"/>`;
        s += `<path d="M20 222 L380 222 L${W + 20} ${H} L-20 ${H}Z" fill="#b5172f" ${S(2)}/>`;
        s += `<path d="M38 230 L362 230 L392 ${H - 6} L8 ${H - 6}Z" fill="none" stroke="#ffd166" stroke-width="3" stroke-dasharray="8 5"/>`;
        s += `<path d="M150 262 L200 244 L250 262 L200 284Z" fill="#1d3557" stroke="#ffd166" stroke-width="2"/>`;
        return s;
    }

    function palaceIn(c) {
        const tile = c.def('tileIn', (id) => `<pattern id="${id}" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#1e5aa8"/><path d="M10 1 L19 10 L10 19 L1 10Z" fill="#3fa7d6"/><circle cx="10" cy="10" r="3" fill="#fff"/><circle cx="0" cy="0" r="2" fill="#f4c542"/><circle cx="20" cy="20" r="2" fill="#f4c542"/></pattern>`);
        const t = c.top;
        let s = `<rect y="${t}" width="${W}" height="${H - t}" fill="#f0dcb4"/>`;
        s += `<rect y="${t}" width="${W}" height="${190 - t}" fill="${tile}"/>`;
        for (const x of [60, 200, 340]) {
            s += `<path d="M${x - 44} 206 L${x - 44} 96 Q${x - 44} 44 ${x} 30 Q${x + 44} 44 ${x + 44} 96 L${x + 44} 206Z" fill="#f3e3c3" ${S(2.4)}/>`;
            s += `<path d="M${x - 32} 206 L${x - 32} 100 Q${x - 32} 60 ${x} 48 Q${x + 32} 60 ${x + 32} 100 L${x + 32} 206Z" fill="#d6b37a"/>`;
            s += `<path d="M${x - 32} 100 Q${x - 16} 88 ${x} 100 Q${x + 16} 88 ${x + 32} 100" fill="none" stroke="#b08a52" stroke-width="2"/>`;
        }
        for (const x of [130, 270]) {
            s += `<rect x="${x - 7}" y="${40 + t}" width="14" height="${170 - t}" fill="#8b5a2b" ${S(2)}/><path d="M${x - 12} ${40 + t} L${x + 12} ${40 + t} L${x + 7} ${52 + t} L${x - 7} ${52 + t}Z" fill="#a0673a" ${S(1.6)}/>`;
        }
        s += `<rect y="206" width="${W}" height="${H - 206}" fill="#c8964f"/>`;
        s += `<path d="M40 222 L360 222 L400 ${H} L0 ${H}Z" fill="#8f1d2c" ${S(2)}/>`;
        s += `<path d="M58 232 L342 232 L378 ${H - 8} L22 ${H - 8}Z" fill="none" stroke="#f4c542" stroke-width="3" stroke-dasharray="10 5"/>`;
        return s;
    }

    function cave(c) {
        let s = `<rect y="${c.top}" width="${W}" height="${H - c.top}" fill="#3d3437"/>`;
        s += `<rect y="${c.top}" width="${W}" height="${-c.top}" fill="#2a2326"/>`;
        s += `<path d="M0 0 L${W} 0 L${W} 120 Q340 160 300 90 Q260 30 200 40 Q120 40 90 110 Q60 170 0 130Z" fill="#2a2326"/>`;
        s += [40, 90, 150, 250, 310, 360].map((x, i) => `<path d="M${x - 10} 0 L${x} ${30 + (i % 3) * 14} L${x + 10} 0Z" fill="#4a3f43"/>`).join('');
        s += `<path d="M0 230 Q200 206 ${W} 234 L${W} ${H} L0 ${H}Z" fill="#5a4c50"/>`;
        return s;
    }

    function inn(c, sc) {
        let s = `<rect y="${c.top}" width="${W}" height="${H - c.top}" fill="#d9a86c"/>`;
        for (let y = c.top; y < 220; y += 14) {
            s += `<path d="M0 ${y} H${W}" stroke="#c18f55" stroke-width="1.4"/>`;
            for (let x = Math.abs(Math.round(y / 14)) % 2 ? 0 : 20; x < W; x += 40) s += `<path d="M${x} ${y} V${y + 14}" stroke="#c18f55" stroke-width="1.4"/>`;
        }
        for (const x of [90, 310]) {
            s += `<path d="M${x - 60} 214 L${x - 60} 110 Q${x - 60} 50 ${x} 40 Q${x + 60} 50 ${x + 60} 110 L${x + 60} 214Z" fill="#6b4a2f" ${S(2.4)}/>`;
        }
        s += `<rect y="210" width="${W}" height="${H - 210}" fill="#8a5a34"/>`;
        s += `<rect x="40" y="240" width="170" height="30" rx="6" fill="#2a9d8f" ${S(1.8)}/>`;
        return s;
    }

    Art.background = function (c, sc) {
        const kind = sc.bg || 'meadow';
        const season = sc.season || 'summer';
        const time = sc.time || 'day';
        if (kind === 'room' || kind === 'hutin') return room(c, sc);
        if (kind === 'palace') return palaceIn(c, sc);
        if (kind === 'cave') return cave(c, sc);
        if (kind === 'inn') return inn(c, sc);

        let s = sky(c, sc);
        const night = time === 'night' || time === 'dusk';
        const hz = sc.horizon || 232;
        const far = night ? '#5b6aa8' : time === 'sunset' ? '#b88fb7' : '#a9c4de';
        const near = night ? '#4a5896' : time === 'sunset' ? '#9c7fa8' : '#86a8cc';
        const snowy = season !== 'summer' || kind === 'mountains';

        if (kind === 'space') {
            c.lights.push(stars(c, 60, H));
            if (c.top) c.lights.push(stars(c, 12, 0, c.top + 6));
            s += `<g transform="translate(90 90)"><circle r="30" fill="#ffb4a2" ${S(2)}/><ellipse rx="50" ry="9" fill="none" stroke="#e5989b" stroke-width="4" transform="rotate(-18)"/></g>`;
            s += `<circle cx="330" cy="240" r="16" fill="#90e0ef" ${S(2)}/>`;
            return s;
        }
        if (kind === 'sky') {
            s += blob([[0, 300, 60], [90, 290, 50], [170, 305, 60], [260, 292, 56], [340, 300, 62], [410, 290, 50]], '#fff', 0);
            s += blob([[40, 250, 26], [120, 262, 20], [300, 250, 24], [380, 262, 18]], '#f5faff', 0);
            return s;
        }
        if (kind === 'mountains' || kind === 'peak') {
            s += mountains(c, hz + 10, far, near, true);
            s += hills(c, hz + 20, GROUND[season][2], 14);
            if (kind === 'peak') {
                s += `<path d="M-10 ${H} L-10 250 Q120 196 200 206 Q290 214 410 262 L410 ${H}Z" fill="${GROUND[season][1]}"/>`;
                return s;
            }
            s += ground(c, hz + 26, season, kind);
            return s;
        }
        if (kind === 'desert') {
            s += hills(c, hz, '#f3d49a', 22) + hills(c, hz + 26, '#eec37d', 16);
            s += `<rect y="${hz + 40}" width="${W}" height="${H}" fill="#e8b96c"/>`;
            return s;
        }
        if (kind === 'city' || kind === 'bazaar') {
            s += mountains(c, hz - 24, far, near, snowy);
            s += skyline(c, hz + 4, night ? '#6a6fb0' : '#c6b6dd');
            s += `<rect y="${hz}" width="${W}" height="${H - hz}" fill="${night ? '#b7a484' : '#e7cf9f'}"/>`;
            for (let y = hz + 10; y < H; y += 14) {
                s += `<path d="M0 ${y} H${W}" stroke="#d2b47a" stroke-width="1.2"/>`;
            }
            return s;
        }
        if (kind === 'forest' || kind === 'hut') {
            const lv = LEAVES[season] || LEAVES.summer;
            s += mountains(c, hz - 30, far, near, snowy);
            s += treeline(c, hz - 6, night ? '#2f4f5c' : shade(lv[2], -30), 18);
            s += treeline(c, hz + 12, night ? '#2a4250' : shade(lv[2], -10), 22);
            s += ground(c, hz + 16, season === 'summer' ? 'summer' : season, 'forest');
            if (kind === 'forest') s += road('#d8c08e');
            return s;
        }
        s += mountains(c, hz - 18, far, near, snowy);
        if (kind === 'steppe') {
            s += hills(c, hz + 4, '#cdb86a', 10);
            s += ground(c, hz + 14, season === 'summer' ? 'dry' : season, 'steppe');
            return s;
        }
        const g = GROUND[season] || GROUND.summer;
        s += hills(c, hz + 2, shade(g[1], -12), 16);
        if (kind === 'village' || kind === 'yard' || kind === 'garden' || kind === 'field' || kind === 'poliz') {
            s += poplars(c, hz + 6, night ? '#2f5a4a' : shade((LEAVES[season] || LEAVES.summer)[2], -8), 10);
        }
        if (kind === 'village') {
            s += `<g opacity=".85">${Art.item(c, ['house', 70, hz + 10, { s: 0.42, night }])}${Art.item(c, ['house', 330, hz + 8, { s: 0.36, night, door: '#b5452f' }])}</g>`;
        }
        s += ground(c, hz + 8, season, kind);
        if (kind === 'village') s += road();
        if (kind === 'yard') {
            // hovli: packed-earth courtyard enclosed by a mud-brick devor with a carved gate
            const wt = hz - 70;
            s += `<path d="M-10 ${hz + 4} L-10 ${wt + 6} Q${W / 2} ${wt - 4} ${W + 10} ${wt + 6} L${W + 10} ${hz + 4}Z" fill="${night ? '#a88a64' : '#d4a86a'}" ${S(2)}/>`;
            s += `<path d="M-10 ${wt + 6} Q${W / 2} ${wt - 4} ${W + 10} ${wt + 6} L${W + 10} ${wt + 14} Q${W / 2} ${wt + 4} -10 ${wt + 14}Z" fill="${night ? '#957652' : '#bf9253'}"/>`;
            for (let i = 0; i < 22; i++) s += `<path d="M${n1(c.rand(0, W))} ${n1(c.rand(wt + 18, hz - 4))} l7 1" stroke="${night ? '#8f7250' : '#b98c52'}" stroke-width="1.6"/>`;
            const gx = sc.gateX !== undefined ? sc.gateX : 300;
            if (gx !== false) {
                s += `<path d="M${gx - 26} ${hz + 4} L${gx - 26} ${wt + 22} Q${gx} ${wt + 6} ${gx + 26} ${wt + 22} L${gx + 26} ${hz + 4}Z" fill="#7a4e2a" ${S(2)}/>`;
                s += `<path d="M${gx} ${wt + 12} V${hz + 4}" stroke="${OL}" stroke-width="1.6"/>`;
                s += `<path d="M${gx - 20} ${wt + 30} h14 v20 h-14z M${gx + 6} ${wt + 30} h14 v20 h-14z" fill="none" stroke="#5c381c" stroke-width="1.6"/>`;
                s += `<circle cx="${gx - 5}" cy="${hz - 22}" r="2.2" fill="#e9c46a"/><circle cx="${gx + 5}" cy="${hz - 22}" r="2.2" fill="#e9c46a"/>`;
            }
            if (sc.vine !== false) {
                s += `<path d="M20 ${wt + 8} q30 -16 60 0 q30 -16 60 0" fill="none" stroke="#6b4424" stroke-width="3"/>`;
                s += Art.blob([[30, wt + 4, 10], [52, wt, 12], [76, wt + 6, 10], [100, wt, 12], [124, wt + 6, 10]], season === 'winter' ? '#9fb4a3' : '#4f9a45', 1.6);
                if (season === 'summer' || season === 'autumn') s += [[44, wt + 14], [92, wt + 14]].map(([x, y]) => `<g transform="translate(${x} ${y})">${[[-3, 0], [3, 0], [0, 5], [-5, 5], [5, 5], [-2, 10], [2, 10]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="2.8" fill="#7b2cbf" stroke="${OL}" stroke-width=".6"/>`).join('')}</g>`).join('');
            }
            s += `<rect x="-10" y="${hz + 4}" width="${W + 20}" height="${H - hz}" fill="${season === 'winter' ? '#eef3f8' : night ? '#c9ad84' : '#ecd4a4'}"/>`;
            s += `<rect x="-10" y="${hz + 4}" width="${W + 20}" height="8" fill="#000" opacity=".08"/>`;
            for (let i = 0; i < 10; i++) s += `<ellipse cx="${n1(c.rand(0, W))}" cy="${n1(c.rand(hz + 16, H))}" rx="${n1(c.rand(6, 16))}" ry="2" fill="#d9bb86"/>`;
        }
        if (kind === 'river') {
            s += `<path d="M-10 262 C80 248 160 276 240 262 C300 252 360 266 410 256 L410 290 C340 300 280 284 220 296 C140 308 60 286 -10 298Z" fill="#5fb3e4" ${S(2)}/>`;
            s += `<g ${c.anim('sv-shimmer', 3)}><path d="M30 274 h24 M120 280 h30 M230 276 h22 M320 272 h28 M80 290 h18 M270 288 h20" stroke="#e0f4ff" stroke-width="2.4" stroke-linecap="round"/></g>`;
            if (sc.dry) s = s.replace(/#5fb3e4/g, '#9ec3d8');
        }
        if (kind === 'lake') {
            s += `<ellipse cx="200" cy="270" rx="120" ry="26" fill="${sc.murky ? '#8d9b6a' : '#5fb3e4'}" ${S(2)}/>`;
            s += `<g ${c.anim('sv-shimmer', 3)}><path d="M140 266 h24 M200 276 h30 M250 264 h20" stroke="#e0f4ff" stroke-width="2.4" stroke-linecap="round" opacity="${sc.murky ? 0.3 : 1}"/></g>`;
        }
        if (kind === 'field') {
            for (let i = -8; i <= 8; i++) s += `<path d="M${200 + i * 8} ${hz + 10} L${200 + i * 48} ${H}" stroke="${shade(g[2], -18)}" stroke-width="2.4" opacity=".55"/>`;
        }
        if (kind === 'poliz') {
            for (let r = 0; r < 4; r++) {
                const y = hz + 22 + r * 22;
                s += `<path d="M-10 ${y} Q60 ${y - 8} 120 ${y} T240 ${y} T360 ${y} T480 ${y}" fill="none" stroke="#3f8f3c" stroke-width="3"/>`;
                for (let x = 10 + (r % 2) * 30; x < W; x += 60) s += `<path d="M${x} ${y} q6 -10 14 -4 q-6 6 -14 4z" fill="#57b65c" ${S(1)}/>`;
            }
        }
        return s;
    };

    // Time-of-day wash drawn over the whole scene (lights go on top of it).
    Art.tint = function (c, sc) {
        const t = sc.time;
        const inner = ['room', 'hutin', 'palace', 'cave', 'inn'].includes(sc.bg);
        const y = c.top;
        if (t === 'night') return `<rect y="${y}" width="${W}" height="${H - y}" fill="${inner ? '#2c3570' : '#27336e'}" opacity="${inner ? 0.34 : 0.38}" style="mix-blend-mode:multiply"/>`;
        if (t === 'dusk') return `<rect y="${y}" width="${W}" height="${H - y}" fill="#6d5ba8" opacity=".28" style="mix-blend-mode:multiply"/>`;
        if (t === 'sunset') return `<rect y="${y}" width="${W}" height="${H - y}" fill="#ff9e6d" opacity=".16" style="mix-blend-mode:multiply"/>`;
        return '';
    };

    function shade(hex, amt) {
        const v = parseInt(hex.slice(1), 16);
        const f = (x) => Math.max(0, Math.min(255, x + amt));
        const r = f(v >> 16);
        const g = f((v >> 8) & 255);
        const b = f(v & 255);
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    Art.shade = shade;

    // Adds a light (glow, window, flame) that must stay bright at night. The
    // item wrapper sets c.xf to the current item transform.
    function light(c, markup) {
        c.lights.push(`<g transform="${c.xf || ''}">${markup}</g>`);
    }
    Art.light = light;

    function flames(c, k = 1) {
        return `<g transform="scale(${k})"><g ${c.anim('sv-flicker', 0.7)}>` +
            `<path d="M-14 0 C-18 -14 -8 -20 -8 -32 C0 -24 2 -30 2 -40 C10 -30 16 -22 14 0Z" fill="#f94144" ${S(1.6)}/>` +
            `<path d="M-8 0 C-10 -10 -2 -14 -2 -24 C4 -16 10 -14 8 0Z" fill="#f9844a"/>` +
            `<path d="M-4 0 C-4 -6 0 -10 0 -16 C4 -10 6 -6 4 0Z" fill="#f9c74f"/></g></g>`;
    }
    Art.flames = flames;

    // ---------- vegetation ----------

    Art.define('tree', (c, o) => {
        const kind = o.kind || 'round';
        const season = o.season || (kind === 'blossom' ? 'spring' : kind === 'autumn' ? 'autumn' : 'summer');
        const lv = o.leaves || (kind === 'blossom' ? ['#ffc8dd', '#ffafcc', '#f8a1c4'] : kind === 'dry' ? LEAVES.dry : (LEAVES[season] || LEAVES.summer));
        const trunk = o.trunk || '#8a5a33';
        let s = '';
        if (kind === 'poplar') {
            s += `<path d="M-4 0 L-2 -60 L2 -60 L4 0Z" fill="${trunk}" ${S(1.6)}/>`;
            s += `<g ${c.anim('sv-sway', c.rand(4, 6))}>${blob([[0, -64, 13], [0, -88, 15], [0, -112, 12], [0, -132, 8]], lv[0], 2)}` +
                `<path d="M-4 -120 Q-2 -90 -6 -60 M4 -130 Q6 -100 3 -70" stroke="${lv[2]}" stroke-width="2" fill="none"/></g>`;
            return s;
        }
        if (kind === 'pine') {
            s += `<rect x="-4" y="-18" width="8" height="18" fill="${trunk}" ${S(1.6)}/>`;
            s += `<g ${c.anim('sv-sway', c.rand(4, 6))}>` + [[-28, -16, 0, -58], [-22, -40, 0, -78], [-15, -62, 0, -96]].map(([x, y, cx, ty]) =>
                `<path d="M${x} ${y} L${cx} ${ty} L${-x} ${y}Z" fill="${season === 'winter' ? '#2f6f57' : '#2f7d52'}" ${S(1.8)}/>`).join('');
            if (season === 'winter') s += `<path d="M-20 -46 Q-8 -52 0 -76 Q6 -54 18 -48 Z M-12 -66 Q-4 -72 0 -94 Q4 -74 10 -68Z" fill="#fff"/>`;
            return s + `</g>`;
        }
        if (kind === 'bare' || (season === 'winter' && kind !== 'willow')) {
            s += `<path d="M-6 0 C-5 -20 -6 -40 -2 -58 L4 -58 C6 -40 5 -20 6 0Z" fill="${trunk}" ${S(1.8)}/>`;
            s += ptube('M0 -40 Q-18 -54 -30 -70 M0 -48 Q16 -60 26 -78 M-14 -56 Q-10 -74 -8 -86 M12 -62 Q20 -70 34 -72', 3, trunk);
            if (season === 'winter') s += `<path d="M-34 -72 q6 -4 10 0 M22 -80 q6 -4 10 0 M-12 -88 q5 -4 8 0" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`;
            return s;
        }
        s += `<path d="M-7 0 C-6 -20 -7 -36 -3 -52 L3 -52 C7 -36 6 -20 7 0Z" fill="${trunk}" ${S(1.8)}/>`;
        s += `<path d="M-2 -30 L-14 -44 M2 -36 L12 -48" stroke="${trunk}" stroke-width="4" stroke-linecap="round"/>`;
        const big = kind === 'big';
        const k = big ? 1.45 : 1;
        const circles = [[-24, -62, 22], [22, -64, 22], [0, -86, 27], [-12, -56, 18], [14, -54, 18], [-2, -64, 20]].map(([x, y, r]) => [x * k, y * (big ? 1.2 : 1), r * k]);
        let crown = blob(circles, lv[0], 2.2);
        crown += `<circle cx="${-12 * k}" cy="${-84 * (big ? 1.15 : 1)}" r="${12 * k}" fill="${lv[1]}" opacity=".8"/><circle cx="${14 * k}" cy="${-72 * (big ? 1.15 : 1)}" r="${8 * k}" fill="${lv[1]}" opacity=".6"/>`;
        if (kind === 'blossom') {
            for (let i = 0; i < 18; i++) crown += `<circle cx="${n1(c.rand(-34, 34) * k)}" cy="${n1(c.rand(-100, -48))}" r="2.2" fill="#fff"/>`;
        }
        const fruit = o.fruit || (kind === 'apple' ? '#e63946' : kind === 'gold' ? '#fbbf24' : kind === 'pomegranate' ? '#c1121f' : kind === 'mulberry' ? '#5a189a' : kind === 'apricot' ? '#f8961e' : null);
        if (fruit) {
            const nFruit = o.n || 9;
            for (let i = 0; i < nFruit; i++) {
                const fx = c.rand(-32, 32) * k;
                const fy = c.rand(-96, -52);
                crown += kind === 'gold'
                    ? `<g transform="translate(${n1(fx)} ${n1(fy)})"><circle r="9" fill="${radial(c, 'fruitglow', '#fff3b0', 0.9)}"/><circle r="4.6" fill="${fruit}" ${S(1.2)}/></g>`
                    : `<circle cx="${n1(fx)}" cy="${n1(fy)}" r="${kind === 'mulberry' ? 2.4 : 4}" fill="${fruit}" ${S(1.1)}/>`;
            }
        }
        if (kind === 'willow') {
            for (let i = -5; i <= 5; i++) crown += `<path d="M${i * 7} -70 Q${i * 8 + 4} -40 ${i * 9} -20" stroke="${lv[2]}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
        }
        s += `<g ${c.anim('sv-sway', c.rand(4.5, 7))}>${crown}</g>`;
        return s;
    });

    Art.define('bush', (c, o) => {
        const lv = LEAVES[o.season || 'summer'];
        let s = blob([[-16, -10, 12], [0, -16, 15], [16, -10, 12]], lv[0], 2);
        s += `<rect x="-30" y="-6" width="60" height="6" fill="${lv[0]}"/>`;
        if (o.berries) for (let i = 0; i < 6; i++) s += `<circle cx="${n1(c.rand(-22, 22))}" cy="${n1(c.rand(-24, -6))}" r="2.2" fill="${o.berries}"/>`;
        return s;
    });

    Art.define('flowers', (c, o) => {
        const w = o.w || 60;
        const n = o.n || 7;
        const cols = o.colors || ['#ff8fab', '#ffd166', '#c77dff', '#ffffff', '#ef476f'];
        let s = '';
        for (let i = 0; i < n; i++) {
            const x = -w / 2 + (i + 0.5) * (w / n) + c.rand(-3, 3);
            const h = c.rand(10, 20);
            const col = cols[i % cols.length];
            s += `<path d="M${n1(x)} 0 Q${n1(x + 2)} ${n1(-h / 2)} ${n1(x)} ${n1(-h)}" stroke="#2d6a4f" stroke-width="1.6" fill="none"/>`;
            s += `<g transform="translate(${n1(x)} ${n1(-h)})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cy="-3.4" rx="2.2" ry="3.4" transform="rotate(${a})" fill="${col}" stroke="${OL}" stroke-width=".6"/>`).join('')}<circle r="1.8" fill="#ffd166"/></g>`;
        }
        return s;
    });

    Art.define('tulips', (c, o) => {
        const n = o.n || 5;
        const w = o.w || 50;
        let s = '';
        for (let i = 0; i < n; i++) {
            const x = -w / 2 + (i + 0.5) * (w / n) + c.rand(-3, 3);
            const h = c.rand(14, 24);
            s += `<path d="M${n1(x)} 0 L${n1(x)} ${n1(-h)}" stroke="#2d6a4f" stroke-width="2"/><path d="M${n1(x)} -4 q-7 -6 -6 -12 q5 4 6 10z" fill="#52b788"/>`;
            s += `<path d="M${n1(x - 5)} ${n1(-h)} C${n1(x - 6)} ${n1(-h - 9)} ${n1(x - 2)} ${n1(-h - 11)} ${n1(x)} ${n1(-h - 8)} C${n1(x + 2)} ${n1(-h - 11)} ${n1(x + 6)} ${n1(-h - 9)} ${n1(x + 5)} ${n1(-h)} Q${n1(x)} ${n1(-h + 4)} ${n1(x - 5)} ${n1(-h)}Z" fill="${o.color || '#e63946'}" ${S(1.2)}/>`;
        }
        return s;
    });

    Art.define('snowdrops', (c, o) => {
        let s = '';
        const n = o.n || 4;
        for (let i = 0; i < n; i++) {
            const x = (i - (n - 1) / 2) * 10;
            s += `<path d="M${x} 0 Q${x + 1} -12 ${x - 3} -18" fill="none" stroke="#2d6a4f" stroke-width="2"/>`;
            s += `<path d="M${x - 3} -18 Q${x - 9} -14 ${x - 7} -8 Q${x - 4} -10 ${x - 3} -18 Q${x - 1} -10 ${x + 1} -8 Q${x + 3} -14 ${x - 3} -18Z" fill="#fff" ${S(1)}/>`;
        }
        return s;
    });

    Art.define('grass', (c, o) => {
        const col = o.color || '#4e9a34';
        return `<path d="M-12 0 l3 -12 l3 10 l3 -16 l3 15 l3 -11 l3 12" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
    });

    Art.define('reeds', (c, o) => {
        let s = '';
        for (let i = 0; i < (o.n || 5); i++) {
            const x = i * 7 - 14;
            const h = 30 + (i % 3) * 8;
            s += `<path d="M${x} 0 Q${x + 2} ${-h / 2} ${x - 2} ${-h}" stroke="#5a8f3c" stroke-width="2" fill="none"/><ellipse cx="${x - 2}" cy="${-h + 4}" rx="2.2" ry="6" fill="#8b5a2b"/>`;
        }
        return `<g ${c.anim('sv-sway', 4)}>${s}</g>`;
    });

    Art.define('mushroom', (c, o) => `<rect x="-3" y="-10" width="6" height="10" rx="2" fill="#fff3e0" ${S(1.4)}/><path d="M-10 -9 Q0 -24 10 -9Z" fill="${o.color || '#e63946'}" ${S(1.6)}/><circle cx="-4" cy="-14" r="1.6" fill="#fff"/><circle cx="3" cy="-16" r="1.6" fill="#fff"/>`);

    Art.define('rock', (c, o) => {
        const k = o.big ? 2.6 : 1;
        return `<g transform="scale(${k})"><path d="M-18 0 Q-22 -14 -10 -20 Q0 -26 12 -18 Q22 -10 18 0Z" fill="${o.color || '#9aa3ad'}" ${S(2.2 / k)}/><path d="M-8 -16 Q0 -20 8 -14" fill="none" stroke="#fff" stroke-width="${2 / k}" opacity=".5"/></g>`;
    });

    Art.define('stump', () => `<path d="M-12 0 L-10 -16 L10 -16 L12 0Z" fill="#8a5a33" ${S(1.8)}/><ellipse cx="0" cy="-16" rx="10" ry="4" fill="#d9a86c" ${S(1.6)}/><path d="M-4 -16 a4 2 0 1 0 8 0" fill="none" stroke="#8a5a33" stroke-width="1"/>`);

    // ---------- buildings ----------

    Art.define('house', (c, o) => {
        const w = o.w || 110;
        const h = o.h || 66;
        const x0 = -w / 2;
        const wall = o.wall || '#e9cf9c';
        const night = !!o.night;
        let s = `<rect x="${x0}" y="${-h}" width="${w}" height="${h}" fill="${wall}" ${S()}/>`;
        for (let i = 0; i < 10; i++) s += `<path d="M${n1(x0 + c.rand(6, w - 10))} ${n1(-c.rand(6, h - 8))} l6 1" stroke="#caa56a" stroke-width="1.4"/>`;
        s += `<rect x="${x0 - 8}" y="${-h - 9}" width="${w + 16}" height="10" rx="2" fill="#a47148" ${S(2)}/>`;
        for (let x = x0 + 2; x < x0 + w - 4; x += 14) s += `<rect x="${x}" y="${-h + 1}" width="5" height="5" fill="#6b4424"/>`;
        if (o.grass) s += `<path d="M${x0} ${-h - 9} l3 -6 l3 5 l3 -7 l3 7 M${x0 + w - 20} ${-h - 9} l3 -5 l3 4 l3 -6 l3 6" fill="none" stroke="#6ab04c" stroke-width="2"/>`;
        const dx = o.doorX !== undefined ? o.doorX : -w * 0.18;
        s += `<rect x="${dx - 13}" y="-42" width="26" height="42" rx="2" fill="${o.door || '#2f7f8f'}" ${S()}/>`;
        s += `<path d="M${dx} -42 V0" stroke="${OL}" stroke-width="1.6"/><rect x="${dx - 10}" y="-38" width="7" height="16" fill="none" stroke="#1f5f6b" stroke-width="1.4"/><rect x="${dx + 3}" y="-38" width="7" height="16" fill="none" stroke="#1f5f6b" stroke-width="1.4"/>`;
        s += `<circle cx="${dx - 3}" cy="-20" r="1.8" fill="#e9c46a"/><circle cx="${dx + 3}" cy="-20" r="1.8" fill="#e9c46a"/>`;
        if (o.window !== false) {
            const wx = o.winX !== undefined ? o.winX : w * 0.24;
            const win = `<rect x="${wx - 12}" y="${-h + 16}" width="24" height="22" fill="${night ? '#ffd36b' : '#8ecae6'}" ${S(1.8)}/>` +
                `<path d="M${wx} ${-h + 16} V${-h + 38} M${wx - 12} ${-h + 27} H${wx + 12} M${wx - 12} ${-h + 16} L${wx + 12} ${-h + 38} M${wx + 12} ${-h + 16} L${wx - 12} ${-h + 38}" stroke="#7a4e2a" stroke-width="1.4"/>`;
            if (night) light(c, `<circle cx="${wx}" cy="${-h + 27}" r="34" fill="${radial(c, 'win', '#ffcf5c', 0.7)}"/>${win}`);
            else s += win;
        }
        if (o.porch) {
            s += `<rect x="${x0 + w - 4}" y="${-h + 4}" width="${o.porch}" height="${h - 4}" fill="none"/>`;
            s += `<rect x="${x0 + w - 6}" y="${-h - 6}" width="${o.porch + 10}" height="8" fill="#a47148" ${S(1.8)}/>`;
            for (let px = x0 + w + 10; px <= x0 + w + o.porch; px += 22) s += tube(px, -h + 2, px, 0, 3.4, '#9c6b3f');
        }
        if (o.nest) {
            s += `<g transform="translate(${x0 + w - 22} ${-h - 10})"><ellipse cx="0" cy="-3" rx="18" ry="6" fill="#8b5a2b" ${S(1.6)}/><path d="M-16 -4 l32 2 M-14 -7 l28 3" stroke="#5c3a1d" stroke-width="1.2"/>`;
            if (o.nest === 'swallow') s += '';
            s += `</g>`;
        }
        if (o.swallowNest) {
            s += `<g transform="translate(${x0 + 18} ${-h + 8})"><path d="M-9 0 Q0 12 9 0Z" fill="#a47148" ${S(1.4)}/><circle cx="-3" cy="-1" r="3" fill="#233d8f" ${S(1)}/><circle cx="3" cy="-1" r="3" fill="#233d8f" ${S(1)}/><path d="M-3 -2 l-1 -3 l2 1z M3 -2 l1 -3 l-2 1z" fill="#f4a261"/></g>`;
        }
        return s;
    });

    Art.define('hut', (c, o) => {
        const lit = o.lit !== undefined ? o.lit : !!o.night;
        let s = '';
        s += `<rect x="18" y="-86" width="11" height="24" fill="#9c6b3f" ${S(1.8)}/>`;
        if (o.smoke !== false) {
            for (let i = 0; i < 3; i++) s += `<g transform="translate(24 -90)"><g ${c.anim('sv-rise', 4, i * 1.33)}><circle r="${6 + i}" fill="#e5e7eb" opacity=".8"/></g></g>`;
        }
        s += `<path d="M-40 0 L-40 -40 Q-40 -48 -32 -50 L32 -50 Q40 -48 40 -40 L40 0Z" fill="#c89b6d" ${S()}/>`;
        s += `<ellipse cx="-24" cy="-12" rx="6" ry="3.4" fill="#b3855a"/><ellipse cx="22" cy="-8" rx="7" ry="3.4" fill="#b3855a"/><ellipse cx="0" cy="-40" rx="6" ry="3" fill="#b3855a"/>`;
        s += `<path d="M-54 -42 Q0 -104 54 -42 Q0 -54 -54 -42Z" fill="#cf9f45" ${S()}/>`;
        s += `<path d="M-40 -48 L-30 -64 M-24 -52 L-14 -74 M-6 -54 L2 -80 M12 -54 L18 -74 M28 -50 L34 -62" stroke="#a87a2c" stroke-width="1.6"/>`;
        s += `<path d="M-26 0 L-26 -28 Q-16 -40 -6 -28 L-6 0Z" fill="#7a4e2a" ${S()}/><circle cx="-10" cy="-14" r="1.6" fill="#e9c46a"/>`;
        const win = `<circle cx="18" cy="-26" r="9" fill="${lit ? '#ffcf5c' : '#8ecae6'}" ${S(1.8)}/><path d="M18 -35 V-17 M9 -26 H27" stroke="#7a4e2a" stroke-width="1.6"/>`;
        if (lit) light(c, `<circle cx="18" cy="-26" r="40" fill="${radial(c, 'hutwin', '#ffcf5c', 0.75)}"/>${win}`);
        else s += win;
        return s;
    });

    Art.define('yurt', (c, o) => {
        let s = `<path d="M-46 0 L-46 -30 Q-42 -60 0 -66 Q42 -60 46 -30 L46 0Z" fill="#f3ead7" ${S()}/>`;
        s += `<path d="M-46 -30 Q0 -40 46 -30 L46 -22 Q0 -32 -46 -22Z" fill="#c1121f" ${S(1.6)}/>`;
        s += `<path d="M-40 -26 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4" fill="none" stroke="#ffd166" stroke-width="1.4"/>`;
        s += `<path d="M-30 -48 L-20 -8 M-10 -60 L-6 -6 M10 -60 L6 -6 M30 -48 L20 -8" stroke="#d4c3a0" stroke-width="1.2"/>`;
        s += `<path d="M-12 0 L-12 -24 L12 -24 L12 0Z" fill="#d62828" ${S(1.8)}/><path d="M-8 -20 L8 -20 L8 -4 L-8 -4Z" fill="none" stroke="#ffd166" stroke-width="1.4"/>`;
        s += `<ellipse cx="0" cy="-64" rx="10" ry="3" fill="#8b5a2b" ${S(1.4)}/>`;
        return s;
    });

    Art.define('palace', (c) => {
        const tile = c.def('tileOut', (id) => `<pattern id="${id}" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#1d4ed8"/><path d="M5 0 L10 5 L5 10 L0 5Z" fill="#38bdf8"/><circle cx="5" cy="5" r="1.5" fill="#fff"/></pattern>`);
        const dome = linear(c, 'dome', [[0, '#5eead4'], [1, '#0f9fb0']], false);
        let s = '';
        for (const sd of [-1, 1]) {
            const x = sd * 96;
            s += `<path d="M${x - 10} 0 L${x - 7} -168 L${x + 7} -168 L${x + 10} 0Z" fill="#e3c08d" ${S()}/>`;
            for (let y = -30; y > -160; y -= 28) s += `<rect x="${x - 9}" y="${y}" width="18" height="6" fill="${tile}"/>`;
            s += `<rect x="${x - 12}" y="-182" width="24" height="14" fill="#e3c08d" ${S(1.8)}/><path d="M${x - 14} -182 Q${x} -202 ${x + 14} -182Z" fill="${dome}" ${S(1.8)}/>`;
        }
        s += `<rect x="-120" y="-74" width="240" height="74" fill="#e8c996" ${S()}/>`;
        for (const x of [-100, -76, 76, 100]) s += `<path d="M${x - 8} -10 L${x - 8} -40 Q${x} -54 ${x + 8} -40 L${x + 8} -10Z" fill="#1e3a8a" ${S(1.4)}/>`;
        s += `<rect x="-36" y="-156" width="72" height="26" fill="${tile}" ${S(1.8)}/>`;
        s += `<path d="M-42 -154 C-44 -212 44 -212 42 -154Z" fill="${dome}" ${S()}/>`;
        s += [-26, -12, 0, 12, 26].map((x) => `<path d="M${x} -154 Q${x * 0.55} -192 0 -198" fill="none" stroke="#0e7c89" stroke-width="1.6"/>`).join('');
        s += `<path d="M0 -198 V-214" stroke="#d4a017" stroke-width="2.4"/><path d="M-5 -218 A6 6 0 1 0 5 -218 A4.4 4.4 0 1 1 -5 -218Z" fill="#f4c542"/>`;
        s += `<rect x="-60" y="-164" width="120" height="164" fill="#e8c996" ${S()}/>`;
        s += `<rect x="-52" y="-156" width="104" height="156" fill="${tile}" ${S(1.6)}/>`;
        s += `<rect x="-42" y="-146" width="84" height="146" fill="#efd6a6" ${S(1.6)}/>`;
        s += `<path d="M-32 0 L-32 -86 Q-32 -122 0 -134 Q32 -122 32 -86 L32 0Z" fill="#1e3a8a" ${S()}/>`;
        s += `<path d="M-26 -90 Q-13 -100 0 -90 Q13 -100 26 -90 M-20 -104 Q-10 -114 0 -104 Q10 -114 20 -104 M-12 -118 Q0 -126 12 -118" fill="none" stroke="#60a5fa" stroke-width="2"/>`;
        s += `<path d="M-15 0 L-15 -38 Q0 -52 15 -38 L15 0Z" fill="#8b5a2b" ${S(1.8)}/><path d="M0 -48 V0" stroke="${OL}" stroke-width="1.4"/>`;
        s += Array.from({ length: 12 }, (_, i) => `<rect x="${-58 + i * 10}" y="-170" width="6" height="6" fill="#e8c996" ${S(1)}/>`).join('');
        return s;
    });

    Art.define('minaret', (c, o) => {
        const h = o.h || 170;
        let s = `<path d="M-15 0 L-10 ${-h} L10 ${-h} L15 0Z" fill="#d9b27c" ${S()}/>`;
        for (let y = -20; y > -h; y -= 22) s += `<path d="M${-14 + (-y / h) * 4} ${y} H${14 - (-y / h) * 4}" stroke="#b8864f" stroke-width="3"/>`;
        s += `<rect x="-13" y="${-h * 0.62}" width="26" height="8" fill="#2563eb"/>`;
        s += `<rect x="-15" y="${-h - 20}" width="30" height="20" fill="#e3c08d" ${S(1.8)}/>`;
        s += [-8, 0, 8].map((x) => `<path d="M${x - 3} ${-h - 4} L${x - 3} ${-h - 12} Q${x} ${-h - 17} ${x + 3} ${-h - 12} L${x + 3} ${-h - 4}Z" fill="#1e3a8a"/>`).join('');
        s += `<path d="M-17 ${-h - 20} Q0 ${-h - 36} 17 ${-h - 20}Z" fill="#c9a36b" ${S(1.8)}/>`;
        if (o.nest) {
            s += `<g transform="translate(0 ${-h - 30})"><ellipse cx="0" cy="-2" rx="18" ry="6" fill="#8b5a2b" ${S(1.6)}/><path d="M-16 -3 l32 2" stroke="#5c3a1d" stroke-width="1.2"/></g>`;
            s += Art.item(c, ['stork', 0, -h - 34, { s: 0.55 }]);
        }
        return s;
    });

    Art.define('wall', (c, o) => {
        const w = o.w || 140;
        const h = o.h || 50;
        let s = `<path d="M${-w / 2} 0 L${-w / 2} ${-h + 4} Q0 ${-h - 4} ${w / 2} ${-h + 4} L${w / 2} 0Z" fill="#dcb67a" ${S()}/>`;
        for (let i = 0; i < 8; i++) s += `<path d="M${n1(c.rand(-w / 2 + 6, w / 2 - 12))} ${n1(-c.rand(6, h - 8))} l6 1" stroke="#c49a5c" stroke-width="1.4"/>`;
        if (o.gate) {
            s += `<rect x="-18" y="${-h + 2}" width="36" height="${h - 2}" fill="#8b5a2b" ${S(2)}/><path d="M0 ${-h + 2} V0" stroke="${OL}" stroke-width="1.6"/>`;
            s += `<circle cx="-4" cy="${-h / 2}" r="2" fill="#e9c46a"/><circle cx="4" cy="${-h / 2}" r="2" fill="#e9c46a"/>`;
        }
        return s;
    });

    Art.define('well', (c, o) => {
        let s = tube(-24, -26, -24, -78, 4, '#8b5a2b') + tube(24, -26, 24, -78, 4, '#8b5a2b');
        s += `<path d="M-34 -74 L0 -98 L34 -74Z" fill="#a0522d" ${S()}/>`;
        s += tube(-24, -66, 24, -66, 3, '#8b5a2b');
        s += `<path d="M6 -66 V-${o.rope === 'broken' ? 56 : 42}" stroke="#d4a373" stroke-width="1.6"/>`;
        if (o.rope !== 'broken') s += `<path d="M0 -42 L12 -42 L10 -32 L2 -32Z" fill="#8b5a2b" ${S(1.4)}/>`;
        s += `<rect x="-30" y="-28" width="60" height="28" fill="#b0a595" ${S()}/>`;
        s += `<path d="M-30 -14 H30 M-14 -28 V-14 M10 -28 V-14 M-2 -14 V0 M20 -14 V0 M-22 -14 V0" stroke="#8a8073" stroke-width="1.6"/>`;
        s += `<ellipse cx="0" cy="-28" rx="30" ry="7" fill="#8a8073" ${S()}/><ellipse cx="0" cy="-28" rx="23" ry="4.6" fill="#1f2a4a"/>`;
        if (o.moon) light(c, `<g ${c.anim('sv-shimmer', 2.4)}><path d="M-6 -29 A5 3 0 1 0 6 -29 A4 2.2 0 1 1 -6 -29Z" fill="#fef3c7"/></g>`);
        return s;
    });

    Art.define('soru', (c, o) => {
        const w = o.w || 130;
        let s = '';
        for (const x of [-w / 2 + 4, w / 2 - 12]) s += `<rect x="${x}" y="-24" width="8" height="24" fill="#8b5a2b" ${S(1.6)}/>`;
        s += `<path d="M${-w / 2 + 16} -48 L${w / 2 - 16} -48 L${w / 2 - 16} -70" fill="none" ${S(2)}/>`;
        for (let x = -w / 2 + 16; x <= w / 2 - 16; x += 14) s += tube(x, -48, x, -68, 2.2, '#b07a45');
        s += tube(-w / 2 + 16, -70, w / 2 - 16, -70, 3, '#9c6b3f');
        s += `<path d="M${-w / 2} -26 L${w / 2} -26 L${w / 2 - 16} -48 L${-w / 2 + 16} -48Z" fill="#c1121f" ${S()}/>`;
        s += `<path d="M${-w / 2 + 12} -30 L${w / 2 - 12} -30 L${w / 2 - 22} -44 L${-w / 2 + 22} -44Z" fill="none" stroke="#ffd166" stroke-width="1.6" stroke-dasharray="4 3"/>`;
        s += `<rect x="${-w / 2}" y="-26" width="${w}" height="8" fill="#9c6b3f" ${S(1.8)}/>`;
        return s;
    });

    function teapot() {
        return `<path d="M-10 -2 Q-12 -16 0 -16 Q12 -16 10 -2Z" fill="#1d4ed8" ${S(1.5)}/>` +
            `<path d="M10 -8 Q16 -10 18 -16" fill="none" stroke="${OL}" stroke-width="4.6" stroke-linecap="round"/><path d="M10 -8 Q16 -10 18 -16" fill="none" stroke="#1d4ed8" stroke-width="2.4" stroke-linecap="round"/>` +
            `<path d="M-10 -12 Q-17 -10 -10 -5" fill="none" ${S(1.8)}/><circle cx="0" cy="-17" r="2" fill="#1d4ed8" ${S(1)}/>` +
            `<path d="M-4 -9 q1 -3 3 0 q1 -3 3 0 q-3 3 -3 3 q0 0 -3 -3z" fill="#fff"/>`;
    }

    Art.define('dasturxon', (c, o) => {
        const w = o.w || 130;
        const k = w / 130;
        let s = `<ellipse cx="0" cy="0" rx="${w / 2}" ry="${n1(w / 6.5)}" fill="#c1121f" ${S()}/>`;
        s += `<ellipse cx="0" cy="0" rx="${w / 2 - 7}" ry="${n1(w / 6.5 - 5)}" fill="none" stroke="#ffd166" stroke-width="2" stroke-dasharray="5 3"/>`;
        const bread = (x, y) => `<g transform="translate(${n1(x * k)} ${n1(y * k)})"><ellipse rx="12" ry="5" fill="#d9954a" ${S(1.4)}/><ellipse rx="6.5" ry="2.6" fill="#f3c98b"/><circle cx="-2" cy="0" r=".8" fill="#8a4b1a"/><circle cx="2" cy="0" r=".8" fill="#8a4b1a"/></g>`;
        if (o.empty) return s + bread(0, -2);
        s += bread(-42, -1) + bread(40, 3);
        s += `<g transform="translate(0 ${-4 * k})"><ellipse rx="24" ry="8" fill="#f8fafc" ${S(1.6)}/><ellipse rx="20" ry="6" fill="none" stroke="#1d4ed8" stroke-width="1.6" stroke-dasharray="3 2"/>` +
            `<path d="M-16 -1 Q0 -20 16 -1Z" fill="#f4a236" ${S(1.4)}/><path d="M-8 -6 l4 -2 M2 -10 l4 1 M6 -5 l4 -1" stroke="#e76f51" stroke-width="2" stroke-linecap="round"/>` +
            `<circle cx="-2" cy="-9" r="2.4" fill="#7f4f24"/><circle cx="4" cy="-6" r="2.4" fill="#7f4f24"/></g>`;
        s += `<g transform="translate(${-22 * k} ${6 * k})">${teapot()}</g>`;
        s += `<g transform="translate(${22 * k} ${7 * k})"><path d="M-9 -2 Q0 8 9 -2Z" fill="#fff" ${S(1.3)}/>` +
            [[-4, -5], [0, -7], [4, -5], [-2, -9], [2, -9], [0, -11]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#7b2cbf" ${S(0.8)}/>`).join('') + `</g>`;
        s += `<g transform="translate(${56 * k} -4)"><circle r="6" fill="#c1121f" ${S(1.3)}/><path d="M-2 -6 l2 -3 l2 3" fill="#c1121f" ${S(1)}/></g>`;
        return s;
    });

    Art.define('teapot', () => teapot());

    Art.define('tandir', (c, o) => {
        let s = `<path d="M-26 0 C-28 -34 -16 -46 0 -46 C16 -46 28 -34 26 0Z" fill="#c98b55" ${S()}/>`;
        s += `<path d="M-22 -12 Q0 -18 22 -12 M-24 -26 Q0 -32 24 -26" fill="none" stroke="#ad7240" stroke-width="1.6"/>`;
        s += `<ellipse cx="-6" cy="-38" rx="10" ry="5" fill="#3b1f12" ${S(1.6)}/>`;
        light(c, `<ellipse cx="-6" cy="-38" rx="8" ry="3.6" fill="#ff9f1c" opacity=".85"/><circle cx="-6" cy="-40" r="22" fill="${radial(c, 'tandir', '#ffb703', 0.6)}"/>`);
        if (o.bread) s += `<g transform="translate(34 -4)"><ellipse rx="12" ry="5" fill="#d9954a" ${S(1.4)}/><ellipse rx="6" ry="2.4" fill="#f3c98b"/></g>`;
        return s;
    });

    Art.define('qozon', (c, o) => {
        const content = { sumalak: '#6b3e26', osh: '#f4a236', soup: '#e9d8a6' }[o.content || 'sumalak'];
        let s = `<ellipse cx="-26" cy="-4" rx="10" ry="7" fill="#8d8d8d" ${S(1.6)}/><ellipse cx="26" cy="-4" rx="10" ry="7" fill="#8d8d8d" ${S(1.6)}/>`;
        if (!o.noFire) s += `<g transform="translate(0 -4)">${flames(c, 0.9)}</g>`;
        s += `<path d="M-34 -30 Q-32 0 0 2 Q32 0 34 -30Z" fill="#2b2b2b" ${S()}/>`;
        s += `<ellipse cx="0" cy="-30" rx="36" ry="8" fill="#4a4a4a" ${S()}/><ellipse cx="0" cy="-31" rx="30" ry="5.4" fill="${content}"/>`;
        if (o.steam !== false) {
            for (let i = 0; i < 3; i++) s += `<g transform="translate(${-14 + i * 14} -38)"><g ${c.anim('sv-rise', 3.2, i * 1.07)}><path d="M0 0 q-5 -6 0 -12 q5 -6 0 -12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/></g></g>`;
        }
        if (!o.noFire) light(c, `<circle cx="0" cy="-8" r="34" fill="${radial(c, 'fire', '#ff9f1c', 0.55)}"/>`);
        return s;
    });

    Art.define('fire', (c) => {
        let s = tube(-18, -2, 18, -8, 5, '#7a4e2a') + tube(-18, -8, 18, -2, 5, '#8b5a2b');
        s += flames(c, 1);
        light(c, `<circle cx="0" cy="-16" r="60" fill="${radial(c, 'campfire', '#ffb347', 0.6)}"/>`);
        return s;
    });

    Art.define('lamp', (c) => {
        const flame = `<g ${c.anim('sv-flicker', 0.9)}><path d="M12 -14 Q8 -22 12 -28 Q16 -22 12 -14Z" fill="#ffb703" stroke="#e76f51" stroke-width="1"/></g>`;
        light(c, `<circle cx="12" cy="-20" r="46" fill="${radial(c, 'lamp', '#ffd166', 0.7)}"/>${flame}`);
        return `<path d="M-12 -8 Q0 4 12 -8 Q14 -12 12 -14 L-12 -14Z" fill="#d6a940" ${S(1.6)}/><path d="M-4 -2 L4 -2 L6 0 L-6 0Z" fill="#b58b2a" ${S(1.2)}/>`;
    });

    // ---------- props ----------

    Art.define('chest', (c, o) => {
        const w = o.w || 66;
        const h = o.h || 42;
        const st = o.state || 'closed';
        const base = o.color || '#b23a2b';
        const tin = c.def('tin' + base, (id) => `<pattern id="${id}" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="${base}"/><path d="M7 1 L13 7 L7 13 L1 7Z" fill="#e9c46a" opacity=".85"/><path d="M7 4 L10 7 L7 10 L4 7Z" fill="#2a9d8f"/></pattern>`);
        let s = '';
        const open = st !== 'closed';
        if (open) {
            s += `<path d="M${-w / 2} ${-h} L${-w / 2 + 6} ${-h - 30} L${w / 2 - 6} ${-h - 30} L${w / 2} ${-h}Z" fill="#5a1f14" ${S()}/>`;
            s += `<path d="M${-w / 2 + 6} ${-h - 30} L${w / 2 - 6} ${-h - 30}" stroke="#e9c46a" stroke-width="3"/>`;
        }
        if (st === 'gold') {
            light(c, `<circle cx="0" cy="${-h - 10}" r="${w * 1.2}" fill="${radial(c, 'gold', '#ffe066', 0.9)}"/>` +
                `<g transform="translate(0 ${-h - 6})"><g ${c.anim('sv-spin', 18)}>${Array.from({ length: 10 }, (_, i) => `<path d="M-4 -20 L0 -${w} L4 -20Z" transform="rotate(${i * 36})" fill="#fff3b0" opacity=".55"/>`).join('')}</g></g>`);
            s += `<path d="M${-w / 2 + 4} ${-h + 2} Q0 ${-h - 26} ${w / 2 - 4} ${-h + 2}Z" fill="#fbbf24" ${S(1.8)}/>`;
            for (let i = 0; i < 9; i++) s += `<ellipse cx="${n1(c.rand(-w / 2 + 10, w / 2 - 10))}" cy="${n1(-h - c.rand(0, 14))}" rx="5" ry="2.6" fill="#fde047" ${S(1)}/>`;
            s += `<path d="M${-w / 2 + 12} ${-h - 4} Q0 ${-h + 8} ${w / 2 - 12} ${-h - 6}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="0.1 5" stroke-linecap="round"/>`;
            s += `<path d="M-8 ${-h - 18} l5 -6 l5 6 l-5 7z" fill="#ef476f" ${S(1.2)}/><path d="M10 ${-h - 12} l4 -5 l4 5 l-4 6z" fill="#06d6a0" ${S(1.2)}/><path d="M-22 ${-h - 8} l4 -5 l4 5 l-4 6z" fill="#118ab2" ${S(1.2)}/>`;
        }
        if (st === 'clothes') {
            s += `<path d="M${-w / 2 + 6} ${-h + 4} Q-10 ${-h - 22} 8 ${-h - 12} Q24 ${-h - 22} ${w / 2 - 6} ${-h + 4}Z" fill="${fabric(c, { pattern: 'ikat', color: '#1f9d6b', color2: '#ffd166', color3: '#ef476f' })}" ${S(1.6)}/>`;
            s += `<g transform="translate(-6 ${-h - 16}) scale(.7)"><path d="M-15.6 -8 L-14 -20.6 Q0 -26 14 -20.6 L15.6 -8 Q0 -11.6 -15.6 -8Z" fill="#1f1d2b" ${S(1.8)}/><path d="M0 -12 C-3 -14 -2.8 -18 0 -19.6 C1.6 -18 1.8 -15.6 0 -12Z" fill="#fff"/></g>`;
        }
        if (st === 'snakes') {
            light(c, `<circle cx="0" cy="${-h - 10}" r="${w}" fill="${radial(c, 'bad', '#8338ec', 0.4)}"/>`);
            s += Art.item(c, ['snake', -12, -h + 6, { s: 0.85, f: 1 }]);
            s += Art.item(c, ['snake', 14, -h + 8, { s: 0.95 }]);
        }
        s += `<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="4" fill="${tin}" ${S()}/>`;
        s += `<rect x="${-w / 2 + 6}" y="${-h}" width="6" height="${h}" fill="#d9b44a" ${S(1.2)}/><rect x="${w / 2 - 12}" y="${-h}" width="6" height="${h}" fill="#d9b44a" ${S(1.2)}/>`;
        s += `<rect x="-6" y="${-h * 0.62}" width="12" height="13" rx="2" fill="#e9c46a" ${S(1.4)}/><path d="M0 ${-h * 0.62 + 4} v5" stroke="${OL}" stroke-width="2"/>`;
        if (!open) {
            s += `<path d="M${-w / 2 - 2} ${-h} L${-w / 2} ${-h - 12} Q0 ${-h - 19} ${w / 2} ${-h - 12} L${w / 2 + 2} ${-h}Z" fill="${tin}" ${S()}/>`;
            s += `<path d="M${-w / 2 + 6} ${-h - 1} L${-w / 2 + 7} ${-h - 13} M${w / 2 - 6} ${-h - 1} L${w / 2 - 7} ${-h - 13}" stroke="#d9b44a" stroke-width="5"/>`;
        }
        if (o.glowing) light(c, `<circle cx="0" cy="${-h / 2}" r="${w}" fill="${radial(c, 'chestglow', '#ffe066', 0.7)}"/>`);
        if (o.dust) s += `<path d="M${-w / 2} ${-h - 4} l12 12 M${-w / 2} ${-h + 4} q8 -4 12 -12 M${-w / 2 + 4} ${-h + 8} q6 -2 8 -8" stroke="#fff" stroke-width="1" fill="none" opacity=".7"/>`;
        return s;
    });

    Art.define('watermelon', (c, o) => {
        const st = o.state || 'whole';
        const r = o.r || 20;
        let s = '';
        if (st === 'whole') {
            const clip = c.def('melonclip' + r, (id) => `<clipPath id="${id}"><ellipse cx="0" cy="${-r * 0.86}" rx="${r * 1.3}" ry="${r * 0.88}"/></clipPath>`);
            s += `<ellipse cx="0" cy="${-r * 0.86}" rx="${r * 1.3}" ry="${r * 0.88}" fill="#3a8f3c" ${S()}/>`;
            s += `<g clip-path="${clip}">` + [-3, -2, -1, 0, 1, 2, 3].map((i) => `<path d="M${n1(i * r * 0.38)} ${n1(-r * 1.8)} q${n1(r * 0.12)} ${n1(r * 0.25)} 0 ${n1(r * 0.45)} q${n1(-r * 0.12)} ${n1(r * 0.25)} 0 ${n1(r * 0.45)} q${n1(r * 0.12)} ${n1(r * 0.25)} 0 ${n1(r * 0.45)} q${n1(-r * 0.12)} ${n1(r * 0.25)} 0 ${n1(r * 0.45)}" fill="none" stroke="#1f5f28" stroke-width="${n1(r * 0.16)}"/>`).join('') + `</g>`;
            s += `<ellipse cx="${-r * 0.5}" cy="${-r * 1.25}" rx="${r * 0.4}" ry="${r * 0.18}" fill="#fff" opacity=".3" transform="rotate(-18 ${-r * 0.5} ${-r * 1.25})"/>`;
            s += `<path d="M${r * 0.9} ${-r * 1.5} q6 -8 12 -4 q-4 4 0 8" fill="none" stroke="#2d6a4f" stroke-width="2.4" stroke-linecap="round"/>`;
            if (o.glow) light(c, `<circle cx="0" cy="${-r * 0.9}" r="${r * 2.2}" fill="${radial(c, 'melonglow', '#fff3b0', 0.7)}"/>`);
            return s;
        }
        const gold = st === 'gold';
        const bad = st === 'bees';
        const flesh = bad ? '#7a3b2e' : '#ef476f';
        if (gold) light(c, `<circle cx="0" cy="${-r}" r="${r * 3}" fill="${radial(c, 'melongold', '#ffe066', 0.85)}"/>`);
        // two halves lying rind-down, cut faces tipped towards the viewer
        for (const sd of [-1, 1]) {
            const cx = sd * r * 1.08;
            s += `<g transform="translate(${n1(cx)} ${n1(-r * 0.62)}) rotate(${sd * 10})">`;
            s += `<path d="M${-r} 0 A${r} ${r * 0.72} 0 0 0 ${r} 0Z" fill="#3a8f3c" ${S()}/>`;
            s += `<path d="M${-r * 0.55} ${r * 0.2} q${r * 0.1} ${r * 0.2} 0 ${r * 0.4} M0 ${r * 0.25} q${r * 0.1} ${r * 0.2} 0 ${r * 0.45} M${r * 0.55} ${r * 0.2} q${r * 0.1} ${r * 0.2} 0 ${r * 0.4}" fill="none" stroke="#1f5f28" stroke-width="${n1(r * 0.14)}"/>`;
            s += `<ellipse rx="${r}" ry="${r * 0.46}" fill="#3a8f3c" ${S()}/>`;
            s += `<ellipse rx="${r * 0.86}" ry="${r * 0.38}" fill="#f1faee"/>`;
            s += `<ellipse rx="${r * 0.76}" ry="${r * 0.32}" fill="${flesh}"/>`;
            if (!bad) for (let i = 0; i < 7; i++) s += `<ellipse cx="${n1(c.rand(-r * 0.55, r * 0.55))}" cy="${n1(c.rand(-r * 0.18, r * 0.18))}" rx="1.3" ry="2" fill="#222"/>`;
            if (bad) s += `<path d="M${-r * 0.4} 0 q${r * 0.2} ${-r * 0.1} ${r * 0.4} 0 q${r * 0.2} ${r * 0.1} ${r * 0.4} 0" fill="none" stroke="#3b1f15" stroke-width="2"/>`;
            if (gold) {
                s += `<path d="M${-r * 0.62} ${r * 0.04} Q0 ${-r * 0.95} ${r * 0.62} ${r * 0.04}Z" fill="#fbbf24" ${S(1.4)}/>`;
                s += [[-0.34, -0.12], [0, -0.3], [0.34, -0.1], [-0.16, -0.5], [0.18, -0.52], [0, -0.7]].map(([a, b]) => `<ellipse cx="${n1(a * r)}" cy="${n1(b * r)}" rx="${n1(r * 0.17)}" ry="${n1(r * 0.08)}" fill="#fde047" ${S(0.9)}/>`).join('');
            }
            s += `</g>`;
        }
        if (gold) {
            for (let i = 0; i < 10; i++) {
                const x = c.rand(-r * 2.2, r * 2.2);
                s += `<ellipse cx="${n1(x)}" cy="${n1(-c.rand(0, 5))}" rx="5.4" ry="2.8" fill="#fde047" ${S(1)}/>`;
            }
            s += Art.parts.sparkles(c, { w: r * 4, h: r * 2, y: -r * 1.6, n: 6 });
        }
        if (bad) {
            for (let i = 0; i < 5; i++) s += Art.item(c, ['bee', n1(c.rand(-r * 2.4, r * 2.4)), n1(-r * 1.2 - c.rand(10, 50)), { s: 1.2, f: i % 2 }]);
        }
        return s;
    });

    Art.define('coins', (c, o) => {
        const n = o.n || 7;
        let s = light(c, `<circle cx="0" cy="-8" r="40" fill="${radial(c, 'coins', '#ffe066', 0.7)}"/>`) || '';
        for (let i = 0; i < n; i++) s += `<ellipse cx="${n1(c.rand(-16, 16))}" cy="${n1(-i * 3 - c.rand(0, 2))}" rx="8" ry="3.4" fill="#fde047" ${S(1.2)}/>`;
        return s;
    });

    Art.define('club', (c, o) => {
        let s = '';
        const inner = `${tube(0, 22, 0, -4, 4.4, '#9c6b3f')}<rect x="-11" y="-32" width="22" height="30" rx="8" fill="#a8743f" ${S(2)}/><path d="M-11 -24 H11 M-11 -10 H11" stroke="#7a4f2a" stroke-width="2.4"/>`;
        if (o.fly) {
            s += `<path d="M-30 -30 h-16 M-26 -16 h-22 M-30 -2 h-14" stroke="${OL}" stroke-width="2" stroke-linecap="round" opacity=".45"/>`;
            s += `<g ${c.anim('sv-bonk', 0.6)}>${inner}</g>`;
        } else {
            s += `<g transform="rotate(${o.lying ? 80 : 0})">${inner}</g>`;
        }
        return s;
    }, { actor: true, breath: 1 });

    Art.define('sticks', (c, o) => {
        if (o.broken) {
            return tube(-20, -2, -4, -6, 3, '#9c6b3f') + tube(4, -4, 20, 0, 3, '#9c6b3f') + tube(-14, 2, 0, -10, 3, '#9c6b3f') +
                `<path d="M-4 -6 l3 -2 M4 -4 l-3 -3" stroke="#e9d8a6" stroke-width="2"/>`;
        }
        return [-6, -3, 0, 3, 6].map((x) => tube(-28, x * 0.6, 28, x, 3, '#9c6b3f')).join('') + `<rect x="-4" y="-6" width="8" height="12" rx="2" fill="#d62828" ${S(1.2)}/>`;
    });

    Art.define('nest', (c, o) => {
        let s = `<path d="M-18 -8 Q0 8 18 -8Z" fill="#8b5a2b" ${S(1.8)}/><path d="M-16 -6 L16 -4 M-14 -2 L14 -3" stroke="#5c3a1d" stroke-width="1.2"/>`;
        const n = o.chicks || 0;
        for (let i = 0; i < n; i++) {
            const x = (i - (n - 1) / 2) * 10;
            s += `<g transform="translate(${x} -10)"><circle r="5" fill="#233d8f" ${S(1.2)}/><path d="M-2 -3 L0 -9 L2 -3Z" fill="#f4a261" ${S(0.8)}/><circle cx="-2" cy="-1" r=".9" fill="#fff"/><circle cx="2" cy="-1" r=".9" fill="#fff"/></g>`;
        }
        if (o.eggs) s += `<ellipse cx="-4" cy="-10" rx="4" ry="5" fill="#fff" ${S(1)}/><ellipse cx="4" cy="-10" rx="4" ry="5" fill="#fff" ${S(1)}/>`;
        return s;
    });

    Art.define('signpost', (c, o) => {
        const text = Art.esc(o.text || '');
        const w = Math.max(60, text.length * 8 + 22);
        return tube(0, 0, 0, -70, 5, '#8b5a2b') +
            `<path d="M-10 -78 L${w - 18} -78 L${w - 6} -66 L${w - 18} -54 L-10 -54Z" fill="#c8923f" ${S()}/>` +
            `<text x="${(w - 28) / 2}" y="-61" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-size="13" font-weight="700" fill="#4b2e1a">${text}</text>`;
    });

    Art.define('cave', (c, o) => {
        let s = `<path d="M-110 0 Q-120 -80 -60 -120 Q0 -150 60 -120 Q120 -80 110 0Z" fill="#8c8f99" ${S()}/>`;
        s += `<path d="M-70 -40 Q-50 -60 -30 -50 M40 -90 Q60 -100 76 -84 M-60 -100 Q-40 -110 -24 -104" fill="none" stroke="#b7bac2" stroke-width="3" stroke-linecap="round"/>`;
        s += `<path d="M-52 0 Q-56 -70 0 -84 Q56 -70 52 0Z" fill="#2b2530" ${S()}/>`;
        return s;
    });

    Art.define('arava', (c, o) => {
        const wheel = (x) => `<g transform="translate(${x} -34)"><circle r="34" fill="none" stroke="${OL}" stroke-width="8"/><circle r="34" fill="none" stroke="#9c6b3f" stroke-width="4.4"/>` +
            Array.from({ length: 8 }, (_, i) => `<path d="M0 0 L${n1(Math.cos(i * Math.PI / 4) * 32)} ${n1(Math.sin(i * Math.PI / 4) * 32)}" stroke="#9c6b3f" stroke-width="3"/>`).join('') +
            `<circle r="5" fill="#6b4424" ${S(1.4)}/></g>`;
        let s = '';
        if (o.puller) s += Art.item(c, [o.puller, 138, 0, Object.assign({ walk: true }, o.pullerOpts || {})]);
        s += tube(-10, -50, 120, -46, 4, '#8b5a2b');
        s += `<path d="M-60 -48 L40 -48 L44 -62 L-64 -62Z" fill="#b07a45" ${S()}/>`;
        s += `<path d="M-62 -62 L-62 -76 M-40 -62 L-40 -74 M-10 -62 L-10 -74 M20 -62 L20 -74 M40 -62 L40 -76 M-62 -74 L42 -74" stroke="${OL}" stroke-width="2.4"/>`;
        s += wheel(-14);
        if (o.rider) s += Art.item(c, [o.rider, -20, -62, Object.assign({ seated: true, s: 0.9 }, o.riderOpts || {})]);
        return s;
    });

    Art.define('carpet', (c, o) => {
        const w = o.w || 170;
        const pat = c.def('rug', (id) => `<pattern id="${id}" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#b5172f"/><path d="M8 2 L14 8 L8 14 L2 8Z" fill="#1d3557"/><circle cx="8" cy="8" r="2" fill="#ffd166"/></pattern>`);
        let s = '';
        s += `<path d="M${-w / 2} 0 L${w / 2} 0 L${w / 2 - 20} -20 L${-w / 2 + 20} -20Z" fill="${pat}" ${S()}/>`;
        s += `<path d="M${-w / 2 + 10} -3 L${w / 2 - 10} -3 L${w / 2 - 24} -17 L${-w / 2 + 24} -17Z" fill="none" stroke="#ffd166" stroke-width="2"/>`;
        (o.riders || []).forEach(([name, dx, ro]) => {
            s += Art.item(c, [name, dx, -8, Object.assign({ seated: true, noLegs: true, s: 0.8 }, ro || {})]);
        });
        s += `<path d="M${-w / 2} 0 L${w / 2} 0 L${w / 2} 6 L${-w / 2} 6Z" fill="#8f1d2c" ${S(1.8)}/>`;
        for (let x = -w / 2 + 4; x <= w / 2 - 4; x += 8) s += `<path d="M${x} 6 v6" stroke="#ffd166" stroke-width="2"/>`;
        return `<g ${c.anim('sv-float', 3.6)}>${s}</g>`;
    });

    Art.define('swing', (c, o) => {
        let s = tube(-36, 0, -24, -110, 4, '#8b5a2b') + tube(36, 0, 24, -110, 4, '#8b5a2b') + tube(-30, -108, 30, -108, 4, '#8b5a2b');
        let seat = `<path d="M-8 -108 L-10 -30 M8 -108 L10 -30" stroke="#d4a373" stroke-width="2"/><rect x="-16" y="-32" width="32" height="6" rx="2" fill="#c1121f" ${S(1.6)}/>`;
        if (o.rider) seat += Art.item(c, [o.rider, 0, -32, Object.assign({ seated: true, s: 0.9 }, o.riderOpts || {})]);
        s += `<g transform="translate(0 -108)"><g ${c.anim('sv-swing', 3)}><g transform="translate(0 108)">${seat}</g></g></g>`;
        return s;
    });

    Art.define('kite', (c, o) => {
        const [tx, ty] = o.to || [-60, 120];
        let s = `<path d="M0 12 Q${tx / 2 + 20} ${ty / 2} ${tx} ${ty}" fill="none" stroke="#6b7280" stroke-width="1"/>`;
        s += `<g ${c.anim('sv-sway', 2.6)}><path d="M0 -24 L16 0 L0 12 L-16 0Z" fill="#ef476f" ${S(1.8)}/><path d="M0 -24 L0 12 M-16 0 L16 0" stroke="${OL}" stroke-width="1.4"/><path d="M0 -24 L16 0 L0 0Z" fill="#ffd166"/><path d="M0 0 L-16 0 L0 12Z" fill="#118ab2"/>` +
            `<path d="M0 12 Q-6 24 2 34 Q8 44 0 54" fill="none" stroke="${OL}" stroke-width="1.2"/><path d="M-4 24 l8 2 l-8 2z M-2 40 l8 2 l-8 2z" fill="#06d6a0"/></g>`;
        return s;
    });

    Art.define('rocket', (c) => {
        light(c, `<circle cx="0" cy="6" r="30" fill="${radial(c, 'rocket', '#ffb347', 0.7)}"/>`);
        return `<g transform="translate(0 4)">${flames(c, 0.7)}</g>` +
            `<path d="M-16 -10 L-26 6 L-14 2Z M16 -10 L26 6 L14 2Z" fill="#e63946" ${S(1.6)}/>` +
            `<path d="M-14 4 L-14 -40 Q0 -76 14 -40 L14 4Z" fill="#f8fafc" ${S()}/>` +
            `<circle cx="0" cy="-34" r="7" fill="#8ecae6" ${S(1.8)}/><path d="M-14 -8 H14" stroke="#e63946" stroke-width="4"/>`;
    });

    Art.define('telescope', () => tube(-12, 0, 0, -40, 2.6, '#6b4424') + tube(12, 0, 0, -40, 2.6, '#6b4424') + tube(0, 0, 0, -40, 2.6, '#6b4424') +
        `<g transform="translate(0 -44) rotate(-32)"><rect x="-6" y="-8" width="44" height="14" rx="4" fill="#3d5a80" ${S(1.8)}/><rect x="36" y="-10" width="8" height="18" rx="2" fill="#e0b84e" ${S(1.4)}/></g>`);

    Art.define('throne', (c, o) => {
        let s = `<path d="M-40 0 L-40 -96 Q0 -120 40 -96 L40 0Z" fill="#d4a017" ${S()}/>`;
        s += `<path d="M-32 -40 L-32 -90 Q0 -108 32 -90 L32 -40Z" fill="#8f1d2c" ${S(1.8)}/>`;
        s += `<circle cx="0" cy="-86" r="6" fill="#2a9d8f" ${S(1.4)}/>`;
        s += `<rect x="-46" y="-40" width="92" height="22" rx="6" fill="#b5172f" ${S()}/>`;
        s += `<rect x="-52" y="-54" width="12" height="54" rx="4" fill="#d4a017" ${S(1.8)}/><rect x="40" y="-54" width="12" height="54" rx="4" fill="#d4a017" ${S(1.8)}/>`;
        if (o.rider) s += Art.item(c, [o.rider, 0, -36, Object.assign({ seated: true, s: 0.95 }, o.riderOpts || {})]);
        return s;
    });

    Art.define('bigbook', (c) => {
        light(c, `<circle cx="0" cy="-40" r="90" fill="${radial(c, 'book', '#fff3b0', 0.7)}"/>`);
        return `<path d="M-80 -10 Q-40 -26 0 -8 Q40 -26 80 -10 L80 -70 Q40 -86 0 -68 Q-40 -86 -80 -70Z" fill="#fffaf0" ${S()}/>` +
            `<path d="M0 -68 V-8" stroke="${OL}" stroke-width="2"/>` +
            [-60, -44, -28].map((x) => `<path d="M${x} -62 Q${x + 20} -70 ${x + 40 > -8 ? -12 : x + 40} -58" fill="none" stroke="#c9b48a" stroke-width="2"/>`).join('') +
            `<path d="M14 -60 Q34 -68 64 -60 M14 -48 Q34 -56 64 -48 M14 -36 Q34 -44 64 -36" fill="none" stroke="#c9b48a" stroke-width="2"/>` +
            `<path d="M-82 -8 Q-40 -22 0 -4 Q40 -22 82 -8 L82 -2 Q40 -16 0 2 Q-40 -16 -82 -2Z" fill="#b5172f" ${S(1.8)}/>`;
    });

    Art.define('stall', (c, o) => {
        const col = o.color || '#e63946';
        let s = tube(-44, 0, -44, -70, 3, '#8b5a2b') + tube(44, 0, 44, -70, 3, '#8b5a2b');
        s += `<path d="M-54 -70 L54 -70 L48 -52 L-48 -52Z" fill="#fff" ${S()}/>`;
        for (let x = -48; x < 48; x += 16) s += `<path d="M${x} -70 L${x + 8} -70 L${x + 8} -52 L${x - 1} -52Z" fill="${col}"/>`;
        s += `<path d="M-48 -52 q8 8 16 0 q8 8 16 0 q8 8 16 0 q8 8 16 0 q8 8 16 0 q8 8 16 0" fill="${col}" ${S(1.4)}/>`;
        s += `<rect x="-46" y="-26" width="92" height="26" fill="#b07a45" ${S()}/>`;
        s += Art.item(c, ['watermelon', -24, -26, { r: 11 }]) + Art.item(c, ['watermelon', 4, -26, { r: 9 }]);
        s += [[26, -30, '#7b2cbf'], [34, -30, '#7b2cbf'], [30, -36, '#7b2cbf'], [-40, -30, '#f8961e'], [-34, -32, '#f8961e']].map(([x, y, f]) => `<circle cx="${x}" cy="${y}" r="4" fill="${f}" ${S(1)}/>`).join('');
        return s;
    });

    Art.define('arrow', (c) => `<path d="M-60 0 h-10 M-54 8 h-14 M-58 -8 h-8" stroke="${OL}" stroke-width="2" stroke-linecap="round" opacity=".4"/>` +
        `<path d="M-40 0 L14 0" stroke="#6b4424" stroke-width="3"/><path d="M14 0 l-9 -5 l0 10z" fill="#9aa5b1" ${S(1.2)}/><path d="M-40 0 l-8 -6 l4 6 l-4 6z" fill="#e63946" ${S(1)}/>`);

    Art.define('goldegg', (c) => {
        light(c, `<circle cy="-8" r="22" fill="${radial(c, 'egg', '#ffe066', 0.8)}"/>`);
        return `<ellipse cy="-8" rx="7" ry="9" fill="#fbbf24" ${S(1.6)}/><ellipse cx="-2.4" cy="-11" rx="2" ry="3" fill="#fff" opacity=".7"/>`;
    });

    Art.define('trash', (c, o) => `<path d="M-14 0 L-12 -14 L-4 -14 L-2 0Z" fill="#7fa8c9" ${S(1.4)}/><path d="M-12 -14 h8 v-3 h-8z" fill="#5a7fa0" ${S(1)}/>` +
        `<path d="M2 0 q-2 -8 4 -10 q6 -2 8 4 q4 6 -4 6z" fill="#e5e7eb" ${S(1.4)}/><path d="M18 0 l4 -8 l8 2 l-2 6z" fill="#b08968" ${S(1.2)}/>`);

    Art.define('basket', (c, o) => {
        let s = `<path d="M-22 -18 L22 -18 L16 0 L-16 0Z" fill="#c8923f" ${S(1.8)}/><path d="M-20 -12 H20 M-18 -6 H18" stroke="#9a6a2b" stroke-width="1.4"/>`;
        const fruit = o.fruit || ['#e63946', '#f8961e', '#e63946', '#fbbf24', '#e63946'];
        s = fruit.map((f, i) => `<circle cx="${-14 + i * 7}" cy="${-20 - (i % 2) * 5}" r="5.4" fill="${f}" ${S(1.2)}/>`).join('') + s;
        if (o.carrot) s += `<path d="M6 -26 l14 -10 l-4 12z" fill="#f77f00" ${S(1.2)}/><path d="M20 -36 l4 -4 M20 -36 l5 0" stroke="#2d6a4f" stroke-width="2"/>`;
        return s;
    });

    Art.define('wheat', (c, o) => {
        let s = '';
        const n = o.n || 7;
        for (let i = 0; i < n; i++) {
            const x = (i - (n - 1) / 2) * 7;
            const h = 34 + (i % 3) * 6;
            s += `<path d="M${x} 0 Q${x + 2} ${-h / 2} ${x + 1} ${-h}" stroke="#c9a227" stroke-width="1.8" fill="none"/>`;
            for (let k = 0; k < 4; k++) s += `<ellipse cx="${x + 1 + (k % 2 ? 2.4 : -2.4)}" cy="${-h + k * 4}" rx="2" ry="3.4" fill="#e9c46a" ${S(0.6)}/>`;
        }
        return `<g ${c.anim('sv-sway', 3.5)}>${s}</g>`;
    });

    Art.define('grain', () => Array.from({ length: 14 }, (_, i) => `<ellipse cx="${(i * 37) % 30 - 15}" cy="${-((i * 13) % 6)}" rx="2" ry="1.3" fill="#e9c46a" stroke="${OL}" stroke-width=".5"/>`).join(''));

    Art.define('boat', () => `<path d="M-44 -14 Q0 8 44 -14 L38 -2 Q0 14 -38 -2Z" fill="#9c6b3f" ${S()}/><path d="M-40 -10 Q0 8 40 -10" fill="none" stroke="#7a4e2a" stroke-width="2"/>`);

    Art.define('bridge', () => `<path d="M-70 0 Q0 -46 70 0 L60 0 Q0 -34 -60 0Z" fill="#a0673a" ${S()}/>` +
        Array.from({ length: 7 }, (_, i) => `<path d="M${-54 + i * 18} ${-10 - Math.sin((i / 6) * Math.PI) * 30} v-16" stroke="${OL}" stroke-width="2.4"/>`).join('') +
        `<path d="M-60 -24 Q0 -70 60 -24" fill="none" ${S(2.6)}/>`);

    Art.define('ariq', (c, o) => {
        const w = o.w || 220;
        return `<path d="M${-w / 2} 0 Q0 -8 ${w / 2} 0 L${w / 2} 10 Q0 2 ${-w / 2} 10Z" fill="${o.dry ? '#c7a76e' : '#5fb3e4'}" ${S(1.8)}/>` +
            (o.dry ? `<path d="M${-w / 4} 4 l6 2 l-4 3 M${w / 5} 3 l5 3" stroke="#8a6a3a" stroke-width="1.4"/>` : `<g ${c.anim('sv-shimmer', 2.6)}><path d="M${-w / 3} 4 h18 M0 3 h22 M${w / 4} 5 h14" stroke="#e0f4ff" stroke-width="2" stroke-linecap="round"/></g>`);
    });

    Art.define('gush', (c) => `<g ${c.anim('sv-shimmer', 1.2)}><path d="M-8 0 C-20 -30 -10 -50 0 -60 C10 -50 20 -30 8 0Z" fill="#7cc6ff" ${S(1.8)}/><path d="M-2 -10 C-6 -26 -2 -40 2 -48" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>` +
        [[-24, -40], [22, -48], [-14, -62], [16, -66]].map(([x, y]) => `<path d="M${x} ${y} q-3 5 0 7 q3 -2 0 -7z" fill="#7cc6ff" ${S(0.8)}/>`).join(''));

    Art.define('sun', (c, o) => {
        const face = Art.face(c, { mood: o.mood || 'happy' });
        return sun(c, 0, 0, o.r || 26, '#ffd84d') + `<g transform="scale(${(o.r || 26) / 22})">${face}</g>`;
    });

    Art.define('moon', (c, o) => {
        light(c, moon(c, 0, 0, o.r || 22));
        return '';
    });

    Art.define('cloud', (c, o) => cloud(c, 0, 0, o.k || 1, 1));

    Art.define('rainbow', (c, o) => {
        const cols = ['#ef476f', '#f78c6b', '#ffd166', '#06d6a0', '#118ab2', '#8338ec'];
        const cx = o.cx || 200;
        const cy = o.cy || 250;
        const r = o.r || 170;
        return `<g opacity="${o.op || 0.55}">` + cols.map((col, i) => `<path d="M${cx - r + i * 7} ${cy} A${r - i * 7} ${r - i * 7} 0 0 1 ${cx + r - i * 7} ${cy}" fill="none" stroke="${col}" stroke-width="7"/>`).join('') + `</g>`;
    });

    Art.define('beam', (c, o) => {
        light(c, `<path d="M-20 ${-(o.h || 260)} L20 ${-(o.h || 260)} L${o.w || 60} 0 L${-(o.w || 60)} 0Z" fill="${linear(c, 'beam', [[0, 'rgba(255,247,194,.05)'], [1, 'rgba(255,247,194,.55)']])}"/>`);
        return '';
    });
})(window.Art);
