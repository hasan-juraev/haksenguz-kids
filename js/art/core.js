/*
 * Ertaklar Olami — procedural storybook illustration engine (core).
 *
 * Every page of every book describes its picture as a small scene spec:
 *
 *   { bg: 'forest', time: 'night', season: 'autumn', fx: ['fireflies'],
 *     items: [ ['hut', 290, 250], ['zumrad', 150, 290, { mood: 'scared' }] ] }
 *
 * Art.render(scene) turns that spec into an inline <svg>. Parts (characters,
 * animals, places, props, effects) are registered in the other js/art/*.js
 * files and all draw at their own origin (feet / base centre at 0,0); the
 * item wrapper positions, scales and mirrors them.
 *
 * Two properties matter for the 3D book:
 *  - Rendering is deterministic (seeded PRNG), so the copy of a page drawn on
 *    the turning leaf is identical to the static page underneath it.
 *  - Ambient animations are pinned to a shared clock through negative
 *    animation-delay, so both copies are also in the same animation phase and
 *    nothing jumps when the leaf lands and the static page takes over.
 */
(function (root) {
    'use strict';

    const OL = '#4b2e1a';
    const W = 400;
    const H = 320;
    const TALL = 64;
    let seq = 0;

    const Art = { parts: {}, meta: {}, cast: {}, OL, W, H };

    function hash(str) {
        let h = 2166136261;
        for (let i = 0; i < str.length; i++) {
            h ^= str.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return h >>> 0;
    }

    function prng(seed) {
        let a = seed >>> 0;
        return function () {
            a = (a + 0x6D2B79F5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    const n1 = (v) => Math.round(v * 10) / 10;

    class Ctx {
        constructor(seed, opts) {
            this.p = 'art' + (++seq);
            this.defs = new Map();
            this.lights = [];
            this.r = prng(seed);
            this.now = (root.performance ? root.performance.now() : Date.now()) / 1000;
            this.still = !!opts.still;
            // Tall renders (left book pages) extend the picture upwards so it
            // fills a near-square frame without cropping the sides.
            this.top = opts.tall ? -TALL : 0;
        }

        id(name) {
            return `${this.p}-${name}`;
        }

        // Registers a <defs> entry once per render and returns its url(#id).
        def(name, make) {
            const key = String(name).replace(/[^a-z0-9_-]/gi, '');
            if (!this.defs.has(key)) this.defs.set(key, make(this.id(key)));
            return `url(#${this.id(key)})`;
        }

        rand(a = 0, b = 1) {
            return a + (b - a) * this.r();
        }

        pick(list) {
            return list[Math.floor(this.r() * list.length) % list.length];
        }

        // class + style attributes for an ambient animation, phase-locked to
        // the page clock. Still renders (library thumbnails) skip animation.
        anim(cls, dur, phase) {
            const ph = phase === undefined ? this.rand(0, dur) : phase;
            if (this.still) return '';
            const d = -((((this.now + ph) % dur) + dur) % dur);
            return `class="${cls}" style="animation-duration:${n1(dur)}s;animation-delay:${d.toFixed(2)}s"`;
        }
    }

    // ---------- shared drawing helpers ----------

    const S = (w = 2.2) => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

    // An outlined round-capped stroke: limbs, sleeves, poles, tails.
    function tube(x1, y1, x2, y2, w, col) {
        const a = `x1="${n1(x1)}" y1="${n1(y1)}" x2="${n1(x2)}" y2="${n1(y2)}" stroke-linecap="round"`;
        return `<line ${a} stroke="${OL}" stroke-width="${n1(w + 4)}"/><line ${a} stroke="${col}" stroke-width="${n1(w)}"/>`;
    }

    // Same idea for a polyline / path.
    function ptube(d, w, col) {
        return `<path d="${d}" fill="none" stroke="${OL}" stroke-width="${n1(w + 4)}" stroke-linecap="round" stroke-linejoin="round"/>` +
            `<path d="${d}" fill="none" stroke="${col}" stroke-width="${n1(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;
    }

    // Circles merged into one outlined silhouette (tree crowns, clouds, wool).
    function blob(circles, fill, outline = 2.2) {
        const back = outline <= 0 ? '' : circles.map(([x, y, r]) => `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r + outline)}" fill="${OL}"/>`).join('');
        const front = circles.map(([x, y, r]) => `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r)}" fill="${fill}"/>`).join('');
        // One group, so the colouring studio can fill a whole crown or cloud at once.
        return `${back}<g class="fg">${front}</g>`;
    }

    function esc(s) {
        return String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
    }

    function radial(c, name, color, alpha = 0.85) {
        return c.def(`rad-${name}-${color}`, (id) =>
            `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${alpha}"/>` +
            `<stop offset=".45" stop-color="${color}" stop-opacity="${alpha * 0.35}"/>` +
            `<stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`);
    }

    function linear(c, name, stops, vertical = true) {
        return c.def(`lin-${name}`, (id) =>
            `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}">` +
            stops.map(([o, col]) => `<stop offset="${o}" stop-color="${col}"/>`).join('') + `</linearGradient>`);
    }

    // Fabric fills: Uzbek atlas (ikat), striped chapan, dotted ro'mol.
    function fabric(c, o) {
        const a = o.color || '#3aa36b';
        const b = o.color2 || '#f4c542';
        const d = o.color3 || '#e0457b';
        if (o.pattern === 'ikat') {
            return c.def(`ikat${a}${b}${d}`, (id) =>
                `<pattern id="${id}" width="18" height="16" patternUnits="userSpaceOnUse">` +
                `<rect width="18" height="16" fill="${a}"/>` +
                `<path d="M1 0h4l2 8-2 8H1l2-8z" fill="${b}"/>` +
                `<path d="M10 0h4l-2 8 2 8h-4l2-8z" fill="${d}"/>` +
                `<path d="M3 0v16M12 0v16" stroke="#fff" stroke-opacity=".4" stroke-width="1"/></pattern>`);
        }
        if (o.pattern === 'stripes') {
            return c.def(`str${a}${b}${d}`, (id) =>
                `<pattern id="${id}" width="12" height="10" patternUnits="userSpaceOnUse">` +
                `<rect width="12" height="10" fill="${a}"/><rect x="4" width="2.6" height="10" fill="${b}"/>` +
                `<rect x="8.6" width="1.4" height="10" fill="${d}"/></pattern>`);
        }
        if (o.pattern === 'dots') {
            return c.def(`dot${a}${b}`, (id) =>
                `<pattern id="${id}" width="10" height="10" patternUnits="userSpaceOnUse">` +
                `<rect width="10" height="10" fill="${a}"/><circle cx="3" cy="3" r="1.3" fill="${b}"/>` +
                `<circle cx="8" cy="8" r="1.3" fill="${b}"/></pattern>`);
        }
        if (o.pattern === 'patch') {
            return c.def(`pat${a}${b}`, (id) =>
                `<pattern id="${id}" width="26" height="24" patternUnits="userSpaceOnUse">` +
                `<rect width="26" height="24" fill="${a}"/><rect x="14" y="10" width="9" height="8" fill="${b}" stroke="${OL}" stroke-width=".8" stroke-dasharray="1.5 1.5"/></pattern>`);
        }
        return a;
    }

    // ---------- registry ----------

    // meta.actor: living thing — gets the "poke" hop and a subtle breathing loop.
    Art.define = function (name, fn, meta = {}) {
        Art.parts[name] = fn;
        Art.meta[name] = meta;
    };

    Art.item = function (c, spec) {
        const [name, x = W / 2, y = H * 0.8, o = {}] = spec;
        let partName = name;
        let opts = o;
        if (!Art.parts[name] && Art.cast[name]) {
            const preset = Art.cast[name];
            partName = preset.part || 'person';
            opts = Object.assign({}, preset, o);
        }
        const fn = Art.parts[partName];
        if (!fn) {
            if (root.console) console.warn('[Art] unknown part:', name);
            return '';
        }
        const meta = Art.meta[partName] || {};
        const s = opts.s || 1;
        const flip = opts.f ? -1 : 1;
        const rot = opts.rot ? ` rotate(${opts.rot})` : '';
        const xf = `translate(${n1(x)} ${n1(y)})${rot} scale(${n1(s * flip * 100) / 100} ${n1(s * 100) / 100})`;
        // Lights emitted by this part are drawn later, above the night tint,
        // so they need the full transform chain of any enclosing items.
        const parentXf = c.xf;
        c.xf = parentXf ? `${parentXf} ${xf}` : xf;
        let inner;
        try {
            inner = fn(c, opts);
        } finally {
            c.xf = parentXf;
        }
        if (meta.actor && !opts.still) {
            inner = `<g ${c.anim('sv-breathe', meta.breath || 3.4)}>${inner}</g>`;
        }
        if (opts.anim) {
            const [cls, dur] = Array.isArray(opts.anim) ? opts.anim : [opts.anim, 3];
            inner = `<g ${c.anim(cls, dur)}>${inner}</g>`;
        }
        const actor = meta.actor ? ' class="art-actor"' : '';
        const op = opts.op !== undefined ? ` opacity="${opts.op}"` : '';
        return `<g transform="${xf}"${op}><g${actor}>${inner}</g></g>`;
    };

    Art.render = function (scene, opts = {}) {
        const sc = scene || {};
        const seed = hash(opts.seed || JSON.stringify(sc));
        const c = new Ctx(seed, opts);
        let body = Art.background ? Art.background(c, sc) : '';
        body += (sc.items || []).map((it) => Art.item(c, it)).join('');
        // Colouring pages (games.js) want line art: no time-of-day wash,
        // weather or vignette.
        if (Art.tint && !opts.coloring) body += Art.tint(c, sc);
        body += c.lights.join('');
        if (Art.effects && !opts.coloring) body += Art.effects(c, sc);
        if (!opts.coloring) {
            body += `<rect y="${c.top}" width="${W}" height="${H - c.top}" fill="${c.def('vignette', (id) =>
                `<radialGradient id="${id}" cx=".5" cy=".45" r=".75"><stop offset=".62" stop-color="#3b1d0a" stop-opacity="0"/>` +
                `<stop offset="1" stop-color="#3b1d0a" stop-opacity=".28"/></radialGradient>`)}" pointer-events="none"/>`;
        }
        const label = opts.label ? ` role="img" aria-label="${esc(opts.label)}"` : ' aria-hidden="true"';
        return `<svg class="story-art-svg" viewBox="0 ${c.top} ${W} ${H - c.top}" preserveAspectRatio="xMidYMax slice"${label} xmlns="http://www.w3.org/2000/svg">` +
            `<defs>${[...c.defs.values()].join('')}</defs>${body}</svg>`;
    };

    Object.assign(Art, { S, tube, ptube, blob, esc, radial, linear, fabric, n1, hash, TALL });
    root.Art = Art;
})(window);
