/*
 * Yashirin yulduz, a hidden star on every page (ROADMAP Phase 4, item 19).
 * Each page of a library book hides one small star in its picture, in the
 * same place every time. It sits where every screen shows the picture, and
 * clear of the people and things drawn there. Touching it collects it: the
 * book's record keeps the pages whose star was found (record.stars, see
 * js/book.js), and the book's toolbar, title page and last page count them
 * (js/app.js). Books a child made have none.
 */
(function (root) {
    'use strict';

    // Where a star may hide, in the picture's own units (400 × 320, js/art/core.js):
    // the lower part, which no screen crops, away from the 🎨 button's corner.
    const BOX = { x0: 44, x1: 356, y0: 170, y1: 296 };
    const TRIES = 16;

    // A small, steady hash: the same page always gives the same place.
    function hash(s) {
        let h = 2166136261;
        for (let i = 0; i < s.length; i++) {
            h ^= s.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return h >>> 0;
    }

    // Roughly where an item stands: [left, top, right, bottom] around its
    // anchor (an item is drawn upwards from its feet, see Art.item).
    function body(it) {
        const [, x = 200, y = 256, o = {}] = it;
        const s = (o && o.s) || 1;
        return [x - 40 * s, y - 112 * s, x + 40 * s, y + 10 * s];
    }
    const inside = (x, y, [l, t, r, b]) => x > l && x < r && y > t && y < b;

    // A page's star: [x, y]. Of a few places drawn from the page's own hash,
    // the first clear of everything in its picture, else the one farthest
    // from everything.
    function place(key, view, scene) {
        const boxes = ((scene && scene.items) || []).filter((it) => Array.isArray(it)).map(body);
        let best = null;
        let far = -1;
        for (let i = 0; i < TRIES; i++) {
            const h = hash(`${key}:${view}:${i}`);
            const x = Math.round(BOX.x0 + ((h % 1000) / 999) * (BOX.x1 - BOX.x0));
            const y = Math.round(BOX.y0 + ((Math.floor(h / 1000) % 1000) / 999) * (BOX.y1 - BOX.y0));
            if (!boxes.some((b) => inside(x, y, b))) return [x, y];
            const d = Math.min(...boxes.map(([l, t, r, b]) => Math.hypot(x - (l + r) / 2, y - (t + b) / 2)));
            if (d > far) {
                far = d;
                best = [x, y];
            }
        }
        return best;
    }

    // Which books hide stars: the library's own, not books a child made.
    const hides = (story) => !!story && !story.mine && Array.isArray(story.pages);

    // How many of a book's stars are found: { found, total }.
    function count(story, record) {
        const total = hides(story) ? story.pages.length : 0;
        const got = (record && record.stars) || {};
        const found = Object.keys(got).filter((v) => got[v] && +v >= 1 && +v <= total).length;
        return { found, total };
    }

    // The star itself: small, gold, with a gentle glint (css/book.css). Once
    // found it stays, faint, so the child can see it was found. A wider
    // see-through circle makes it easy for a finger to hit.
    function draw(c, o) {
        const r = 10;
        const pts = Array.from({ length: 10 }, (_, i) => {
            const a = -Math.PI / 2 + (i * Math.PI) / 5;
            const k = i % 2 ? r * 0.45 : r;
            return `${(Math.cos(a) * k).toFixed(1)},${(Math.sin(a) * k).toFixed(1)}`;
        }).join(' ');
        const shape = `<polygon points="${pts}" fill="#ffd166" stroke="#4b2e1a" stroke-width="1.6" stroke-linejoin="round"/>` +
            '<circle cx="-2.4" cy="-2.6" r="1.6" fill="#fff" opacity=".85"/>';
        return `<circle r="26" fill="transparent"/><g class="hs${o.found ? ' is-found' : ''}"><g class="hs-glint">${shape}</g></g>`;
    }
    if (root.Art) root.Art.define('hiddenstar', draw);

    root.HiddenStar = { BOX, place, hides, count, hash };
})(window);
