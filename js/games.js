/*
 * Play corner: a colouring page made from any page's picture, and a
 * "put the pictures in story order" game for the end of a book.
 * Styles live in css/play.css.
 */
(function (root) {
    'use strict';

    const OL = '#4b2e1a';
    const PALETTE = ['#ef476f', '#f94144', '#f8961e', '#ffd166', '#fff3b0', '#90be6d', '#43aa8b', '#4cc9f0', '#277da1', '#7b2cbf', '#f6cda5', '#8d5524', '#adb5bd', '#ffffff'];
    const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

    // ---------- modal ----------

    let lastFocus = null;

    function openModal(html, cls) {
        const m = document.getElementById('playModal');
        const card = m.querySelector('.play-card');
        lastFocus = document.activeElement;
        card.className = `play-card ${cls || ''}`;
        card.innerHTML = html;
        m.classList.remove('hidden');
        const close = card.querySelector('[data-close]');
        if (close) close.focus();
        return card;
    }

    function closeModal() {
        const m = document.getElementById('playModal');
        if (!m || m.classList.contains('hidden')) return;
        m.classList.add('hidden');
        m.querySelector('.play-card').innerHTML = '';
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
    document.addEventListener('click', (e) => {
        const m = document.getElementById('playModal');
        if (!m || m.classList.contains('hidden')) return;
        if (e.target === m || e.target.closest('[data-close]')) closeModal();
    });

    // ---------- colouring ----------

    function rgb(c) {
        if (!c) return null;
        c = c.trim().toLowerCase();
        if (c === 'white') return [255, 255, 255];
        if (c === 'black') return [0, 0, 0];
        let m = c.match(/^#([0-9a-f]{3})$/);
        if (m) return m[1].split('').map((h) => parseInt(h + h, 16));
        m = c.match(/^#([0-9a-f]{6})$/);
        if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
        m = c.match(/^rgba?\(([^)]+)\)$/);
        if (m) return m[1].split(',').slice(0, 3).map((x) => parseFloat(x));
        return null;
    }

    const dark = (c) => {
        const v = rgb(c);
        return !!v && (0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]) / 255 < 0.16;
    };

    // The engine's outline colour and near-black details (eyes, dark hats)
    // are ink: they stay as they are on a colouring page.
    const ink = (c) => !!c && (c.trim().toLowerCase() === OL || dark(c));
    const num = (el, attr) => {
        const v = parseFloat(el.getAttribute(attr));
        return Number.isFinite(v) ? v : 1;
    };
    const NS = 'http://www.w3.org/2000/svg';
    let filterSeq = 0;

    function node(tag, attrs, parent) {
        const el = document.createElementNS(NS, tag);
        Object.keys(attrs).forEach((k) => el.setAttribute(k, attrs[k]));
        if (parent) parent.appendChild(el);
        return el;
    }

    // Draws an ink rim around whatever it is applied to.
    function outlineFilter(svg) {
        const defs = svg.querySelector('defs') || svg.insertBefore(node('defs', {}), svg.firstChild);
        const id = `lineart-${++filterSeq}`;
        const f = node('filter', { id, x: '-30%', y: '-30%', width: '160%', height: '160%' }, defs);
        node('feMorphology', { in: 'SourceAlpha', operator: 'dilate', radius: '1.3', result: 'grow' }, f);
        node('feFlood', { 'flood-color': OL }, f);
        node('feComposite', { in2: 'grow', operator: 'in' }, f);
        const merge = node('feMerge', {}, f);
        node('feMergeNode', {}, merge);
        node('feMergeNode', { in: 'SourceGraphic' }, merge);
        return `url(#${id})`;
    }

    // Turns a rendered scene into line art: every coloured area becomes white
    // and remembers which attribute (fill or stroke) a tap should paint.
    // Ink stays. Soft shading, blush and glints disappear. Shapes the engine
    // draws without an outline (clouds, hills, mountains, sparkles) get one
    // from a filter, and runs of same-coloured ones (a treeline's circles)
    // are grouped so they read, and fill, as one area.
    function toLineArt(svg) {
        const loose = [];
        svg.querySelectorAll('rect, circle, ellipse, path, polygon, polyline, line').forEach((el) => {
            const fill = el.getAttribute('fill');
            const stroke = el.getAttribute('stroke');
            const alpha = Math.min(num(el, 'opacity'), num(el, 'fill-opacity'), fill && fill !== 'none' ? 1 : num(el, 'stroke-opacity'));
            if (fill && fill.startsWith('url(')) {
                const def = svg.querySelector(fill.slice(4, -1).replace(/["']/g, ''));
                if (def && def.tagName.toLowerCase() === 'radialgradient') {
                    el.remove();
                    return;
                }
            }
            if (fill && fill !== 'none') {
                if (alpha < 0.6) {
                    el.setAttribute('opacity', '0');
                    return;
                }
                if (ink(fill)) return;
                el.removeAttribute('opacity');
                el.removeAttribute('fill-opacity');
                el.setAttribute('fill', '#ffffff');
                el.dataset.c = 'fill';
                if (stroke && stroke !== 'none') {
                    if (!ink(stroke)) el.setAttribute('stroke', OL);
                } else if (!el.parentNode.classList.contains('fg')) {
                    loose.push([el, fill]);
                }
                return;
            }
            if (stroke && stroke !== 'none' && !ink(stroke)) {
                if (alpha < 0.6) {
                    el.setAttribute('opacity', '0');
                } else if (num(el, 'stroke-width') >= 2.5) {
                    el.setAttribute('stroke', '#ffffff');
                    el.dataset.c = 'stroke';
                } else {
                    el.setAttribute('stroke', OL);
                    el.setAttribute('stroke-opacity', '0.5');
                }
            }
        });
        svg.querySelectorAll('[style*="mix-blend-mode"]').forEach((el) => el.remove());

        const rim = outlineFilter(svg);
        // Blobs drawn with an outline have ink circles right before them.
        svg.querySelectorAll('g.fg').forEach((g) => {
            const back = g.previousElementSibling;
            if (!(back && back.tagName.toLowerCase() === 'circle' && ink(back.getAttribute('fill')))) g.setAttribute('filter', rim);
        });
        for (let i = 0; i < loose.length;) {
            let j = i + 1;
            while (j < loose.length && loose[j][1] === loose[i][1] && loose[j - 1][0].nextElementSibling === loose[j][0]) j++;
            const run = loose.slice(i, j).map(([el]) => el);
            if (run.length === 1) {
                run[0].setAttribute('filter', rim);
            } else {
                const g = node('g', { class: 'fg', filter: rim });
                run[0].parentNode.insertBefore(g, run[0]);
                run.forEach((el) => g.appendChild(el));
            }
            i = j;
        }
    }

    function savePng(svg, name) {
        const vb = (svg.getAttribute('viewBox') || '0 0 400 320').split(/\s+/).map(Number);
        const w = 1200;
        const h = Math.round((w * vb[3]) / vb[2]);
        const clone = svg.cloneNode(true);
        clone.setAttribute('width', w);
        clone.setAttribute('height', h);
        const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }));
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, w, h);
            ctx.drawImage(img, 0, 0, w, h);
            URL.revokeObjectURL(url);
            canvas.toBlob((blob) => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `${name}.png`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(a.href), 2000);
            }, 'image/png');
        };
        img.src = url;
    }

    // Prints the page on its own (blank for a class, or as coloured so far).
    function printPage(svg, heading) {
        const frame = document.createElement('iframe');
        frame.setAttribute('aria-hidden', 'true');
        frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
        document.body.appendChild(frame);
        const doc = frame.contentDocument;
        doc.open();
        doc.write(`<!doctype html><meta charset="utf-8"><title>${esc(heading)}</title>` +
            '<style>@page{margin:12mm}body{margin:0;font:700 18pt Nunito,sans-serif;text-align:center;color:#4b2e1a}' +
            'h1{font-size:18pt;margin:0 0 6mm}svg{display:block;width:100%;height:auto;max-height:230mm}</style>' +
            `<h1>${esc(heading)}</h1>${new XMLSerializer().serializeToString(svg)}`);
        doc.close();
        const done = () => frame.remove();
        frame.contentWindow.addEventListener('afterprint', done);
        setTimeout(done, 60000);
        frame.contentWindow.focus();
        frame.contentWindow.print();
    }

    function color({ scene, title, seed, onPaint }) {
        const daytime = Object.assign({}, scene, { time: 'day', fx: [], rainbow: false });
        const art = root.Art.render(daytime, { still: true, coloring: true, seed: `${seed}:color` });
        const swatches = PALETTE.map((c, i) => `<button type="button" class="swatch${i === 3 ? ' is-on' : ''}${c === '#ffffff' ? ' swatch--eraser' : ''}" data-color="${c}" style="--c:${c}" aria-label="${c === '#ffffff' ? "O'chirg'ich" : `Rang ${i + 1}`}"></button>`).join('');
        const card = openModal(`
            <div class="paint">
                <div class="play-head"><h3>🎨 Bo'yash — ${esc(title)}</h3><button type="button" class="play-x" data-close aria-label="Yopish">✕</button></div>
                <p class="play-sub">Rangni tanlang va rasmning istalgan joyiga bosing.</p>
                <div class="paint-art">${art}</div>
                <div class="paint-palette" role="radiogroup" aria-label="Ranglar">${swatches}</div>
                <div class="paint-tools">
                    <button type="button" data-tool="undo">↶ Orqaga</button>
                    <button type="button" data-tool="clear">🧹 Tozalash</button>
                    <button type="button" data-tool="save">💾 Rasmni saqlash</button>
                    <button type="button" data-tool="print">🖨 Chop etish</button>
                </div>
            </div>`, 'play-card--paint');
        const svg = card.querySelector('svg');
        toLineArt(svg);
        let current = PALETTE[3];
        const history = [];
        svg.addEventListener('click', (e) => {
            const el = e.target.closest('[data-c]');
            if (!el) return;
            const group = el.parentElement && el.parentElement.classList.contains('fg') ? [...el.parentElement.querySelectorAll('[data-c]')] : [el];
            history.push(group.map((x) => [x, x.dataset.c, x.getAttribute(x.dataset.c)]));
            group.forEach((x) => x.setAttribute(x.dataset.c, current));
            if (onPaint) onPaint();
        });
        card.querySelector('.paint-palette').addEventListener('click', (e) => {
            const b = e.target.closest('[data-color]');
            if (!b) return;
            current = b.dataset.color;
            card.querySelectorAll('.swatch').forEach((s) => s.classList.toggle('is-on', s === b));
        });
        card.querySelector('.paint-tools').addEventListener('click', (e) => {
            const t = e.target.closest('[data-tool]');
            if (!t) return;
            if (t.dataset.tool === 'undo') {
                const step = history.pop();
                if (step) step.forEach(([x, attr, v]) => x.setAttribute(attr, v));
            } else if (t.dataset.tool === 'clear') {
                history.length = 0;
                svg.querySelectorAll('[data-c]').forEach((x) => x.setAttribute(x.dataset.c, '#ffffff'));
            } else if (t.dataset.tool === 'save') {
                savePng(svg, `ertaklar-olami-${String(title).toLowerCase().replace(/[^a-z0-9]+/gi, '-')}`);
            } else if (t.dataset.tool === 'print') {
                // The heading as shown, so it prints in Cyrillic when that is on.
                printPage(svg, card.querySelector('.play-head h3').textContent.replace(/^🎨\s*/, ''));
            }
        });
        return card;
    }

    // ---------- story order game ----------

    function shuffle(list) {
        const a = list.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        if (a.length > 1 && a.every((x, i) => x.order === i)) [a[0], a[1]] = [a[1], a[0]];
        return a;
    }

    function order({ story, seed, onRight, onWrong, onWin }) {
        const n = story.pages.length;
        const picks = [...new Set([0, Math.round((n - 1) / 3), Math.round((2 * (n - 1)) / 3), n - 1])];
        const cards = shuffle(picks.map((idx, i) => ({ idx, order: i })));
        const instructions = "Rasmlarni ertakda bo'lgan tartibda bosing. Avval nima bo'ldi?";
        const html = cards.map((c) => `
            <button type="button" class="order-card" data-order="${c.order}">
                <span class="order-art">${root.Art.render(story.pages[c.idx].scene, { still: true, seed: `${seed}:order:${c.idx}` })}</span>
                <span class="order-badge" aria-hidden="true"></span>
                <span class="order-caption">${esc(story.pages[c.idx].title)}</span>
            </button>`).join('');
        const card = openModal(`
            <div class="order-game">
                <div class="play-head"><h3>🧩 Voqealar tartibi</h3><button type="button" class="play-x" data-close aria-label="Yopish">✕</button></div>
                <p class="play-sub">${instructions}</p>
                <div class="order-grid">${html}</div>
                <div class="order-steps">${picks.map((_, i) => `<span data-step="${i}">${i + 1}</span>`).join('')}</div>
                <p class="order-result" aria-live="polite"></p>
            </div>`, 'play-card--order');
        let step = 0;
        let wrong = 0;
        const result = card.querySelector('.order-result');
        card.querySelector('.order-grid').addEventListener('click', (e) => {
            const b = e.target.closest('.order-card');
            if (!b || b.classList.contains('is-placed') || step >= picks.length) return;
            if (+b.dataset.order === step) {
                b.classList.remove('is-wrong', 'is-hint');
                b.classList.add('is-placed');
                b.querySelector('.order-badge').textContent = step + 1;
                card.querySelector(`[data-step="${step}"]`).classList.add('is-done');
                step++;
                wrong = 0;
                if (step === picks.length) {
                    result.textContent = "🎉 Barakalla! Hammasi to'g'ri tartibda!";
                    card.querySelector('.order-game').classList.add('is-won');
                    if (onWin) onWin();
                } else if (onRight) {
                    onRight();
                }
            } else {
                b.classList.remove('is-wrong');
                void b.offsetWidth;
                b.classList.add('is-wrong');
                setTimeout(() => b.classList.remove('is-wrong'), 700);
                result.textContent = "🤔 Yana o'ylab ko'ring!";
                if (onWrong) onWrong();
                if (++wrong >= 2) {
                    const hint = card.querySelector(`.order-card[data-order="${step}"]`);
                    hint.classList.add('is-hint');
                    setTimeout(() => hint.classList.remove('is-hint'), 1600);
                }
            }
        });
        return card;
    }

    root.Games = { color, order, close: closeModal, toLineArt };
})(window);
