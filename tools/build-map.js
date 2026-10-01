#!/usr/bin/env node
/*
 * Builds js/uzmap.js, the map of Uzbekistan in the culture passport
 * (js/passport.js): its 14 regions, the neighbouring countries and a small
 * map of Korea, as SVG paths. The borders come from Natural Earth (public
 * domain), via the datamaps (regions) and world-atlas (countries) packages.
 * The map rarely changes, so its packages are not in package.json:
 *
 *   npm install --no-save datamaps@0.5.10 world-atlas@2.0.2 topojson-client@3.1.0 topojson-simplify@3.0.3
 *   node tools/build-map.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const topo = require('topojson-client');
const simp = require('topojson-simplify');

const ROOT = path.join(__dirname, '..');
const NM = path.join(ROOT, 'node_modules');
const req = (p) => {
    try {
        return require(path.join(NM, p));
    } catch (e) {
        return require(p);
    }
};
const uzTopo = req('datamaps/src/js/data/uzb.topo.json');
const world = req('world-atlas/countries-50m.json');

const W = 1000;
const PAD = 14;
const KEEP = 0.35; // share of the border points kept

// The regions, by their HASC codes in the data.
const IDS = {
    'UZ.QR': 'qoraqalpogiston', 'UZ.KH': 'xorazm', 'UZ.BU': 'buxoro', 'UZ.NW': 'navoiy',
    'UZ.SA': 'samarqand', 'UZ.QA': 'qashqadaryo', 'UZ.SU': 'surxondaryo', 'UZ.JI': 'jizzax',
    'UZ.SI': 'sirdaryo', 'UZ.TK': 'toshkent', 'UZ.TA': 'toshkentvil', 'UZ.FA': 'fargona',
    'UZ.AN': 'andijon', 'UZ.NG': 'namangan',
};
// Where a label reads better than at the widest point of its region, on the map: [x, y].
const LABEL_XY = {
    toshkent: [724, 318], // Tashkent itself is tiny: its name sits to the north-west, by the star
    toshkentvil: [838, 288], // in the mountains north-east of the city
    sirdaryo: [722, 398],
    andijon: [962, 362],
    fargona: [880, 402],
    jizzax: [668, 422],
    surxondaryo: [668, 600],
};
// Neighbours (ISO numeric codes in world-atlas) and where their names go, on the map.
const NEIGHBOURS = {
    398: { id: 'kz', at: [470, 96] },
    795: { id: 'tm', at: [300, 520] },
    762: { id: 'tj', at: [880, 560] },
    417: { id: 'kg', at: [930, 470] },
    4: { id: 'af' },
};
const CASPIAN_AT = [92, 592];
const TASHKENT = [41.2995, 69.2401];
const SEOUL = [37.5665, 126.978];

// ---------- projection: Lambert conformal conic around Uzbekistan ----------
const rad = Math.PI / 180;
const P1 = 38.6 * rad;
const P2 = 44.2 * rad;
const L0 = 64.5 * rad;
const PH0 = 41.4 * rad;
const n = Math.log(Math.cos(P1) / Math.cos(P2)) / Math.log(Math.tan(Math.PI / 4 + P2 / 2) / Math.tan(Math.PI / 4 + P1 / 2));
const F = (Math.cos(P1) * Math.pow(Math.tan(Math.PI / 4 + P1 / 2), n)) / n;
const rho = (phi) => F / Math.pow(Math.tan(Math.PI / 4 + phi / 2), n);
const R0 = rho(PH0);
const lcc = (lon, lat) => {
    const r = rho(lat * rad);
    const t = n * (lon * rad - L0);
    return [r * Math.sin(t), r * Math.cos(t) - R0]; // y grows downwards
};

// ---------- the regions ----------
const pre = simp.presimplify(uzTopo);
const uz = simp.simplify(pre, simp.quantile(pre, KEEP));
const regions = topo.feature(uz, uz.objects.uzb).features;
const polysOf = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates);

let minx = Infinity;
let maxx = -Infinity;
let miny = Infinity;
let maxy = -Infinity;
regions.forEach((f) => polysOf(f.geometry).forEach((p) => p.forEach((r) => r.forEach(([lon, lat]) => {
    const [x, y] = lcc(lon, lat);
    minx = Math.min(minx, x);
    maxx = Math.max(maxx, x);
    miny = Math.min(miny, y);
    maxy = Math.max(maxy, y);
}))));
const K = (W - 2 * PAD) / (maxx - minx);
const H = Math.ceil((maxy - miny) * K + 2 * PAD);
const project = (lat, lon) => {
    const [x, y] = lcc(lon, lat);
    return [(x - minx) * K + PAD, (y - miny) * K + PAD];
};
const round = (v) => Math.round(v);

// Rings of projected points as a compact path: absolute M, then relative l.
function pathOf(rings) {
    let d = '';
    rings.forEach((ring) => {
        let px = 0;
        let py = 0;
        ring.forEach(([x, y], i) => {
            x = round(x);
            y = round(y);
            if (i && x === px && y === py) return;
            d += i ? `l${x - px} ${y - py}` : `M${x} ${y}`;
            px = x;
            py = y;
        });
        d += 'z';
    });
    return d.replace(/ -/g, '-');
}
const projectRings = (g, proj) => polysOf(g).flatMap((poly) => poly.map((ring) => ring.slice(0, -1).map(([lon, lat]) => proj(lat, lon))));

// The point inside a region farthest from its border (a grid search), for its label.
function inside(rings, x, y) {
    let odd = false;
    rings.forEach((r) => {
        for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
            const [xi, yi] = r[i];
            const [xj, yj] = r[j];
            if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) odd = !odd;
        }
    });
    return odd;
}
function edgeDist(rings, x, y) {
    let best = Infinity;
    rings.forEach((r) => {
        for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
            const [ax, ay] = r[j];
            const [bx, by] = r[i];
            const dx = bx - ax;
            const dy = by - ay;
            const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1)));
            best = Math.min(best, Math.hypot(x - ax - t * dx, y - ay - t * dy));
        }
    });
    return best;
}
function widest(rings) {
    const xs = rings.flat().map((p) => p[0]);
    const ys = rings.flat().map((p) => p[1]);
    let best = [0, 0, -1];
    for (let x = Math.min(...xs); x <= Math.max(...xs); x += 2) {
        for (let y = Math.min(...ys); y <= Math.max(...ys); y += 2) {
            if (!inside(rings, x, y)) continue;
            const d = edgeDist(rings, x, y);
            if (d > best[2]) best = [x, y, d];
        }
    }
    return best.slice(0, 2).map(round);
}

const out = { width: W, height: H, regions: {}, neighbours: {}, names: {} };
regions.forEach((f) => {
    const id = IDS[f.id];
    if (!id) throw new Error(`unknown region ${f.id}`);
    const rings = projectRings(f.geometry, project);
    out.regions[id] = { d: pathOf(rings), label: LABEL_XY[id] || widest(rings) };
});
if (Object.keys(out.regions).length !== 14) throw new Error('expected 14 regions');
// the country's own border, drawn over the regions
out.outline = pathOf(projectRings(topo.merge(uz, uz.objects.uzb.geometries), project));
out.capital = project(...TASHKENT).map(round);

// ---------- neighbours, cut to the frame ----------
function clip(ring, x0, y0, x1, y1) {
    const sides = [
        [(p) => p[0] >= x0, (a, b) => [x0, a[1] + ((b[1] - a[1]) * (x0 - a[0])) / (b[0] - a[0])]],
        [(p) => p[0] <= x1, (a, b) => [x1, a[1] + ((b[1] - a[1]) * (x1 - a[0])) / (b[0] - a[0])]],
        [(p) => p[1] >= y0, (a, b) => [a[0] + ((b[0] - a[0]) * (y0 - a[1])) / (b[1] - a[1]), y0]],
        [(p) => p[1] <= y1, (a, b) => [a[0] + ((b[0] - a[0]) * (y1 - a[1])) / (b[1] - a[1]), y1]],
    ];
    let pts = ring;
    sides.forEach(([keep, cut]) => {
        const src = pts;
        pts = [];
        src.forEach((b, i) => {
            const a = src[(i + src.length - 1) % src.length];
            if (keep(b)) {
                if (!keep(a)) pts.push(cut(a, b));
                pts.push(b);
            } else if (keep(a)) {
                pts.push(cut(a, b));
            }
        });
    });
    return pts;
}
const countries = topo.feature(world, world.objects.countries).features;
countries.forEach((f) => {
    const nb = NEIGHBOURS[+f.id];
    if (!nb) return;
    const rings = projectRings(f.geometry, project).map((r) => clip(r, -20, -20, W + 20, H + 20)).filter((r) => r.length > 2);
    out.neighbours[nb.id] = pathOf(rings);
    if (nb.at) out.names[nb.id] = nb.at;
});
out.names.caspian = CASPIAN_AT;

// ---------- Korea, in its own box at the top of the map ----------
const BOX = { x: 600, y: 10, w: 190, h: 220 };
const KLAT = [32.9, 43.2];
const KLON = [124.0, 131.2];
const kc = Math.cos(37.5 * rad);
const kk = Math.min((BOX.w - 24) / ((KLON[1] - KLON[0]) * kc), (BOX.h - 40) / (KLAT[1] - KLAT[0]));
const kx0 = BOX.x + (BOX.w - (KLON[1] - KLON[0]) * kc * kk) / 2;
const kproj = (lat, lon) => [kx0 + (lon - KLON[0]) * kc * kk, BOX.y + 30 + (KLAT[1] - lat) * kk];
const korea = { box: [BOX.x, BOX.y, BOX.w, BOX.h] };
countries.forEach((f) => {
    if (+f.id === 410) korea.south = pathOf(projectRings(f.geometry, kproj));
    if (+f.id === 408) korea.north = pathOf(projectRings(f.geometry, kproj));
});
korea.seoul = kproj(...SEOUL).map(round);
out.korea = korea;

// Tashkent to Seoul along the great circle, in km
const hav = (a, b) => {
    const [p1, l1] = a.map((v) => v * rad);
    const [p2, l2] = b.map((v) => v * rad);
    const h = Math.sin((p2 - p1) / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin((l2 - l1) / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.sqrt(h));
};
out.seoulKm = Math.round(hav(TASHKENT, SEOUL) / 100) * 100;

// ---------- write ----------
const num = (v) => +v.toPrecision(12);
const js = `/*
 * The map of Uzbekistan in the culture passport (js/passport.js): its 14
 * regions, the neighbouring countries and a small map of Korea, as SVG paths
 * in a ${W} x ${H} box. Built by tools/build-map.js; do not edit by hand.
 *
 * Borders: Natural Earth (public domain, naturalearthdata.com), taken from
 * - datamaps 0.5.10 (regions), MIT License, Copyright (c) 2012 Mark DiMarco:
 *   Permission is hereby granted, free of charge, to any person obtaining a
 *   copy of this software and associated documentation files (the
 *   "Software"), to deal in the Software without restriction, including
 *   without limitation the rights to use, copy, modify, merge, publish,
 *   distribute, sublicense, and/or sell copies of the Software, and to permit
 *   persons to whom the Software is furnished to do so, subject to the
 *   following conditions: The above copyright notice and this permission
 *   notice shall be included in all copies or substantial portions of the
 *   Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 * - world-atlas 2.0.2 (countries), ISC License, Copyright 2013-2019 Michael
 *   Bostock: Permission to use, copy, modify, and/or distribute this software
 *   for any purpose with or without fee is hereby granted, provided that the
 *   above copyright notice and this permission notice appear in all copies.
 *   THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES.
 */
(function (root) {
    'use strict';

    const map = ${JSON.stringify(out)};

    // Latitude and longitude to a point on the map: a Lambert conformal conic
    // (standard parallels 38.6° and 44.2°), scaled into the box.
    const rad = Math.PI / 180;
    map.project = function (lat, lon) {
        const r = ${num(F)} / Math.pow(Math.tan(Math.PI / 4 + (lat * rad) / 2), ${num(n)});
        const t = ${num(n)} * (lon * rad - ${num(L0)});
        return [(r * Math.sin(t) - ${num(minx)}) * ${num(K)} + ${PAD}, (r * Math.cos(t) - ${num(R0)} - ${num(miny)}) * ${num(K)} + ${PAD}];
    };

    root.UzMap = map;
})(window);
`;
fs.writeFileSync(path.join(ROOT, 'js/uzmap.js'), js);
console.log(`  wrote js/uzmap.js (${W} x ${H}, ${(js.length / 1024).toFixed(1)} KB)`);
