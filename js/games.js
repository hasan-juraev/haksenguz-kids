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
                <div class="play-head"><h3><span>🎨 Bo'yash</span> — <span data-content>${esc(title)}</span></h3><button type="button" class="play-x" data-close aria-label="Yopish">✕</button></div>
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
                // The heading as shown, so it prints in Cyrillic (or with Korean menus) when that is on.
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
                <span class="order-caption" data-content>${esc(story.pages[c.idx].title)}</span>
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

    // ---------- find the differences (twin tales) ----------

    // One card at a time: is it only in the first tale, only in the second,
    // or in both? Each right answer adds the card to a table of what the two
    // tales share and where they differ.
    function compare({ left, right, icons, cards, seed, onRight, onWrong, onWin }) {
        const deck = shuffle(cards.map((c, i) => ({ c, order: i }))).map((x) => x.c);
        const name = (i, st) => `<span aria-hidden="true">${icons[i]}</span> <span data-content>${esc(st.title)}</span>`;
        const pic = (i, st) => `<figure class="cmp-pic"><span class="cmp-art">${root.Art.render(st.cover || st.pages[0].scene, { still: true, seed: `${seed}:cmp:${i}` })}</span><figcaption>${name(i, st)}</figcaption></figure>`;
        const col = (where, head) => `<div class="cmp-col cmp-col--${where}" data-col="${where}"><p class="cmp-head">${head}</p><ul></ul></div>`;
        const card = openModal(`
            <div class="cmp-game">
                <div class="play-head"><h3>🔍 Farqlarni toping</h3><button type="button" class="play-x" data-close aria-label="Yopish">✕</button></div>
                <div class="cmp-pics">${pic(0, left)}${pic(1, right)}</div>
                <p class="play-sub">Bu qaysi ertakda bor?</p>
                <div class="cmp-card"><span class="cmp-emoji" aria-hidden="true"></span><span class="cmp-text" data-content></span><span class="cmp-count"></span></div>
                <div class="cmp-choices">
                    <button type="button" data-where="uz">${name(0, left)}</button>
                    <button type="button" data-where="both"><span aria-hidden="true">✨</span> Ikkalasida ham</button>
                    <button type="button" data-where="ko">${name(1, right)}</button>
                </div>
                <div class="cmp-board">${col('uz', name(0, left))}${col('both', '<span aria-hidden="true">✨</span> Ikkalasida ham')}${col('ko', name(1, right))}</div>
                <p class="order-result" aria-live="polite"></p>
            </div>`, 'play-card--compare');
        const box = card.querySelector('.cmp-card');
        const result = card.querySelector('.order-result');
        let i = 0;
        const show = () => {
            box.querySelector('.cmp-emoji').textContent = deck[i][0];
            box.querySelector('.cmp-text').textContent = deck[i][1];
            box.querySelector('.cmp-count').textContent = `${i + 1} / ${deck.length}`;
        };
        show();
        card.querySelector('.cmp-choices').addEventListener('click', (e) => {
            const b = e.target.closest('[data-where]');
            if (!b || i >= deck.length) return;
            const [emoji, text, where] = deck[i];
            if (b.dataset.where !== where) {
                box.classList.remove('is-wrong');
                void box.offsetWidth;
                box.classList.add('is-wrong');
                result.textContent = "🤔 Yana o'ylab ko'ring!";
                if (onWrong) onWrong();
                return;
            }
            const li = document.createElement('li');
            li.innerHTML = `<span aria-hidden="true">${esc(emoji)}</span> <span data-content>${esc(text)}</span>`;
            card.querySelector(`[data-col="${where}"] ul`).appendChild(li);
            result.textContent = '';
            if (++i < deck.length) {
                show();
                if (onRight) onRight();
                return;
            }
            box.classList.add('hidden');
            card.querySelector('.cmp-choices').classList.add('hidden');
            card.querySelector('.cmp-game').classList.add('is-won');
            result.textContent = "🎉 Barakalla! Ikki ertakning o'xshash va farqli tomonlarini topdingiz!";
            if (onWin) onWin();
        });
        return card;
    }

    // ---------- tracing a letter (Alifbo) ----------

    // The letter is drawn pale and big; the child goes over it with a finger.
    // A trace counts once it covers most of the letter without wandering far
    // off it: the letter's shape is a mask, sampled on a coarse grid.
    const TRACE_COVER = 0.6; // share of the letter that must be gone over
    const TRACE_PART = 0.35; // ...and of each part of it (a 3 × 3 grid over the letter)
    const TRACE_OFF = 0.5; // share of the drawing allowed outside the letter

    function trace({ letters, onStroke, onDone }) {
        const card = openModal(`
            <div class="trace-game">
                <div class="play-head"><h3>✍️ Harfni yozing</h3><button type="button" class="play-x" data-close aria-label="Yopish">✕</button></div>
                <p class="play-sub">Barmog'ingiz bilan harf ustidan yurgizing.</p>
                <div class="trace-steps">${letters.map((l, i) => `<span data-step="${i}" translate="no">${esc(l)}</span>`).join('')}</div>
                <div class="trace-pad"><canvas class="trace-canvas" aria-label="Harf yozish maydoni"></canvas></div>
                <div class="trace-meter" aria-hidden="true"><span></span></div>
                <div class="trace-actions"><button type="button" class="trace-clear">🔄 Qaytadan</button></div>
                <p class="order-result" aria-live="polite"></p>
            </div>`, 'play-card--trace');
        const canvas = card.querySelector('.trace-canvas');
        const ctx = canvas.getContext('2d');
        const meter = card.querySelector('.trace-meter span');
        const result = card.querySelector('.order-result');
        const dpr = Math.min(root.devicePixelRatio || 1, 2);
        let size = 0;
        let step = 0;
        let fontPx = 0;
        let brush = 0;
        let mask = null; // Uint8Array over the grid: 1 inside the letter
        let drawn = null; // grid cells the child has gone over
        let cell = 0;
        let cols = 0;
        let last = null;
        let done = false;
        let waiting = false; // a letter is done; the next one isn't drawn yet

        function fitFont(letter) {
            let px = size * 0.78;
            for (; px > 20; px -= 4) {
                ctx.font = `800 ${px}px Nunito, Fredoka, sans-serif`;
                const m = ctx.measureText(letter);
                const h = (m.actualBoundingBoxAscent || px * 0.72) + (m.actualBoundingBoxDescent || 0);
                if (m.width <= size * 0.84 && h <= size * 0.8) break;
            }
            return px;
        }

        function drawLetter(c2, letter, fill) {
            c2.font = `800 ${fontPx}px Nunito, Fredoka, sans-serif`;
            c2.textAlign = 'center';
            c2.textBaseline = 'alphabetic';
            const m = c2.measureText(letter);
            const asc = m.actualBoundingBoxAscent || fontPx * 0.72;
            const desc = m.actualBoundingBoxDescent || 0;
            const y = size / 2 + (asc - desc) / 2;
            c2.fillStyle = fill;
            c2.fillText(letter, size / 2, y);
            return y;
        }

        function setup() {
            const letter = letters[step];
            size = Math.round(canvas.getBoundingClientRect().width * dpr) || 600;
            canvas.width = size;
            canvas.height = size;
            fontPx = fitFont(letter);
            brush = Math.max(10, fontPx * 0.13);
            // the guide: pale letter with a dashed edge
            ctx.clearRect(0, 0, size, size);
            const y = drawLetter(ctx, letter, '#f6e7c8');
            ctx.setLineDash([size / 60, size / 60]);
            ctx.lineWidth = Math.max(2, size / 220);
            ctx.strokeStyle = '#d4a65a';
            ctx.strokeText(letter, size / 2, y);
            ctx.setLineDash([]);
            // the mask, on a grid of cells
            const off = document.createElement('canvas');
            off.width = size;
            off.height = size;
            const o = off.getContext('2d');
            drawLetter(o, letter, '#000');
            const px = o.getImageData(0, 0, size, size).data;
            cell = Math.max(2, Math.round(size / 120));
            cols = Math.ceil(size / cell);
            mask = new Uint8Array(cols * cols);
            for (let gy = 0; gy < cols; gy++) {
                for (let gx = 0; gx < cols; gx++) {
                    const x = Math.min(size - 1, gx * cell + (cell >> 1));
                    const yy = Math.min(size - 1, gy * cell + (cell >> 1));
                    if (px[(yy * size + x) * 4 + 3] > 100) mask[gy * cols + gx] = 1;
                }
            }
            drawn = new Uint8Array(cols * cols);
            waiting = false;
            meter.style.width = '0%';
            card.querySelectorAll('.trace-steps span').forEach((s, i) => s.classList.toggle('is-now', i === step));
        }

        function mark(x, y) {
            const r = brush / 2;
            const g0 = Math.max(0, Math.floor((x - r) / cell));
            const g1 = Math.min(cols - 1, Math.floor((x + r) / cell));
            const h0 = Math.max(0, Math.floor((y - r) / cell));
            const h1 = Math.min(cols - 1, Math.floor((y + r) / cell));
            for (let gy = h0; gy <= h1; gy++) {
                for (let gx = g0; gx <= g1; gx++) {
                    const cx = gx * cell + cell / 2 - x;
                    const cy = gy * cell + cell / 2 - y;
                    if (cx * cx + cy * cy <= r * r) drawn[gy * cols + gx] = 1;
                }
            }
        }

        // How much of the letter is gone over, overall and in its weakest part
        // (so the legs of an A count, not only its top), and how much ink is off it.
        function score() {
            let inLetter = 0;
            let covered = 0;
            let ink = 0;
            let off = 0;
            let x0 = cols;
            let x1 = 0;
            let y0 = cols;
            let y1 = 0;
            for (let i = 0; i < mask.length; i++) {
                if (mask[i]) {
                    inLetter++;
                    const gx = i % cols;
                    const gy = (i - gx) / cols;
                    x0 = Math.min(x0, gx);
                    x1 = Math.max(x1, gx);
                    y0 = Math.min(y0, gy);
                    y1 = Math.max(y1, gy);
                }
                if (drawn[i]) {
                    ink++;
                    if (mask[i]) covered++;
                    else off++;
                }
            }
            const parts = Array.from({ length: 9 }, () => [0, 0]);
            for (let i = 0; i < mask.length; i++) {
                if (!mask[i]) continue;
                const gx = i % cols;
                const gy = (i - gx) / cols;
                const p = Math.min(2, Math.floor(((gx - x0) / (x1 - x0 + 1)) * 3)) + 3 * Math.min(2, Math.floor(((gy - y0) / (y1 - y0 + 1)) * 3));
                parts[p][0]++;
                if (drawn[i]) parts[p][1]++;
            }
            const weakest = Math.min(1, ...parts.filter(([n]) => n >= inLetter * 0.03).map(([n, d]) => d / n));
            return { cover: inLetter ? covered / inLetter : 0, part: weakest, off: ink ? off / ink : 0 };
        }

        function at(e) {
            const r = canvas.getBoundingClientRect();
            return [((e.clientX - r.left) / r.width) * size, ((e.clientY - r.top) / r.height) * size];
        }

        function line(a, b) {
            ctx.strokeStyle = '#f97316';
            ctx.lineWidth = brush;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(a[0], a[1]);
            ctx.lineTo(b[0], b[1]);
            ctx.stroke();
            const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / (cell * 0.8)));
            for (let i = 0; i <= n; i++) mark(a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n);
        }

        function check() {
            const { cover, part, off } = score();
            meter.style.width = `${Math.min(100, Math.round(Math.min(cover / TRACE_COVER, part / TRACE_PART) * 100))}%`;
            meter.parentElement.dataset.score = `${cover.toFixed(2)} ${part.toFixed(2)} ${off.toFixed(2)}`; // for tests
            if (cover >= TRACE_COVER && part >= TRACE_PART && off <= TRACE_OFF) {
                card.querySelector(`.trace-steps [data-step="${step}"]`).classList.add('is-done');
                if (step + 1 < letters.length) {
                    result.textContent = '⭐ Barakalla! Endi kichik harf.';
                    if (onStroke) onStroke();
                    step++;
                    waiting = true;
                    setTimeout(setup, 700);
                } else {
                    done = true;
                    result.textContent = "🎉 Barakalla! Harfni o'rgandingiz!";
                    card.querySelector('.trace-game').classList.add('is-won');
                    if (onDone) onDone();
                }
            } else if (off > TRACE_OFF) {
                result.textContent = "🤔 Harfdan chetga chiqib ketdi. Qaytadan urinib ko'ring!";
            } else {
                result.textContent = "👍 Davom eting, harf ustidan yurgizing!";
            }
        }

        canvas.addEventListener('pointerdown', (e) => {
            if (done || waiting) return;
            e.preventDefault();
            canvas.setPointerCapture(e.pointerId);
            last = at(e);
            line(last, last);
        });
        canvas.addEventListener('pointermove', (e) => {
            if (!last || waiting) return;
            const p = at(e);
            line(last, p);
            last = p;
        });
        const end = () => {
            if (!last) return;
            last = null;
            if (!waiting) check();
        };
        canvas.addEventListener('pointerup', end);
        canvas.addEventListener('pointercancel', end);
        card.querySelector('.trace-clear').addEventListener('click', () => {
            if (done) return;
            result.textContent = '';
            setup();
        });
        const ready = document.fonts && document.fonts.load ? document.fonts.load('800 100px Nunito').catch(() => null) : Promise.resolve();
        ready.then(() => requestAnimationFrame(setup));
        return card;
    }

    // ---------- Mening lug'atim: games with the child's own words ----------

    // Steps along the bottom, a message, and the end of a game.
    function dictFrame(title, sub, steps, body, cls) {
        return openModal(`
            <div class="dict-game ${cls}">
                <div class="play-head"><h3>${title}</h3><button type="button" class="play-x" data-close aria-label="Yopish">✕</button></div>
                <p class="play-sub">${sub}</p>
                ${body}
                <div class="order-steps">${Array.from({ length: steps }, (_, i) => `<span data-step="${i}">${i + 1}</span>`).join('')}</div>
                <p class="order-result" aria-live="polite"></p>
            </div>`, 'play-card--dict');
    }

    function shake(el) {
        el.classList.remove('is-wrong');
        void el.offsetWidth;
        el.classList.add('is-wrong');
        setTimeout(() => el.classList.remove('is-wrong'), 700);
    }

    // 🔊 Eshit va top: hear a word, tap its picture. With no voice on the
    // phone the word is written instead, to read.
    function listen({ entries, say, rounds = 5, onRight, onWrong, onWin }) {
        const D = root.Dictionary;
        const pool = D.pick(entries, Math.min(rounds, entries.length));
        const card = dictFrame('🔊 Eshit va top', say ? "So'zni tinglang va uning rasmini toping." : "So'zni o'qing va uning rasmini toping.", pool.length,
            `<div class="listen-word">${say ? '<button type="button" class="listen-say">🔊 Yana eshitish</button>' : ''}<span class="listen-text" data-content></span></div><div class="listen-grid"></div>`, 'listen-game');
        const grid = card.querySelector('.listen-grid');
        const text = card.querySelector('.listen-text');
        const result = card.querySelector('.order-result');
        let round = 0;
        function show() {
            const target = pool[round];
            const options = D.pick([target, ...D.pick(entries.filter((e) => e !== target), 3)], 4);
            grid.innerHTML = options.map((e) => `<button type="button" class="listen-card" data-key="${esc(e.key)}" aria-label="Rasm">${root.Art.render(e.scene, { still: true, seed: 'dict:' + e.key })}</button>`).join('');
            text.textContent = say ? '' : target.term;
            if (say) say(target.term);
        }
        grid.addEventListener('click', (e) => {
            const b = e.target.closest('.listen-card');
            if (!b || round >= pool.length || b.disabled) return;
            const target = pool[round];
            if (b.dataset.key !== target.key) {
                shake(b);
                text.textContent = target.term; // a wrong pick shows the word
                result.textContent = "🤔 Yana bir bor tinglang!";
                if (say) say(target.term);
                if (onWrong) onWrong();
                return;
            }
            b.classList.add('is-right');
            grid.querySelectorAll('.listen-card').forEach((x) => { x.disabled = true; });
            text.textContent = target.term;
            card.querySelector(`[data-step="${round}"]`).classList.add('is-done');
            round++;
            if (round === pool.length) {
                result.textContent = "🎉 Barakalla! Hammasini topdingiz!";
                card.querySelector('.dict-game').classList.add('is-won');
                if (onWin) onWin();
            } else {
                result.textContent = '⭐ Barakalla!';
                if (onRight) onRight();
                setTimeout(() => {
                    result.textContent = '';
                    show();
                }, 900);
            }
        });
        const again = card.querySelector('.listen-say');
        if (again) again.addEventListener('click', () => say(pool[Math.min(round, pool.length - 1)].term));
        show();
        return card;
    }

    // 🇰🇷 Juftini top: match each Uzbek word to its Korean meaning.
    function match({ entries, pairs = 5, onRight, onWrong, onWin }) {
        const D = root.Dictionary;
        const list = D.pick(entries.filter((e) => e.ko), pairs);
        const short = (ko) => ko.split(/ — |\(|,/)[0].trim();
        const card = dictFrame("🇰🇷 Juftini top", "O'zbekcha so'zni bosing, keyin uning koreyscha ma'nosini toping.", list.length,
            `<div class="match-cols"><div class="match-col">${list.map((e) => `<button type="button" class="match-item" data-side="uz" data-key="${esc(e.key)}" data-content>${esc(e.term)}</button>`).join('')}</div>` +
            `<div class="match-col">${D.pick(list, list.length).map((e) => `<button type="button" class="match-item" data-side="ko" data-key="${esc(e.key)}" lang="ko">${esc(short(e.ko))}</button>`).join('')}</div></div>`, 'match-game');
        const result = card.querySelector('.order-result');
        let chosen = null;
        let done = 0;
        card.querySelector('.match-cols').addEventListener('click', (e) => {
            const b = e.target.closest('.match-item');
            if (!b || b.disabled) return;
            if (!chosen || chosen.dataset.side === b.dataset.side) {
                if (chosen) chosen.classList.remove('is-picked');
                chosen = b;
                b.classList.add('is-picked');
                return;
            }
            const a = chosen;
            chosen = null;
            a.classList.remove('is-picked');
            if (a.dataset.key !== b.dataset.key) {
                shake(a);
                shake(b);
                result.textContent = "🤔 Bu juft emas. Yana urinib ko'ring!";
                if (onWrong) onWrong();
                return;
            }
            [a, b].forEach((x) => {
                x.classList.add('is-right');
                x.disabled = true;
            });
            card.querySelector(`[data-step="${done}"]`).classList.add('is-done');
            done++;
            if (done === list.length) {
                result.textContent = "🎉 Barakalla! Hamma juftlar topildi!";
                card.querySelector('.dict-game').classList.add('is-won');
                if (onWin) onWin();
            } else {
                result.textContent = '⭐ Barakalla!';
                if (onRight) onRight();
            }
        });
        return card;
    }

    // 🔤 So'zni yig'ing: put the word's letters in order under its picture.
    function spell({ entries, rounds = 3, onRight, onWrong, onWin }) {
        const D = root.Dictionary;
        const pool = D.pick(entries.filter(D.spellable), rounds);
        const card = dictFrame("🔤 So'zni yig'ing", "Rasmga qarang va harflarni to'g'ri tartibda bosing.", pool.length,
            `<div class="spell-art"></div><p class="spell-mean"><span data-content></span><span class="spell-ko" lang="ko"></span></p><div class="spell-slots" translate="no"></div><div class="spell-tiles" translate="no"></div>`, 'spell-game');
        const result = card.querySelector('.order-result');
        let round = 0;
        let tiles = [];
        let next = 0;
        function show() {
            const e = pool[round];
            tiles = D.letters(e.term);
            next = 0;
            card.querySelector('.spell-art').innerHTML = root.Art.render(e.scene, { still: true, seed: 'dict:' + e.key });
            card.querySelector('.spell-mean span[data-content]').textContent = e.meaning;
            card.querySelector('.spell-ko').textContent = e.ko ? `🇰🇷 ${e.ko.split(/ — /)[0]}` : '';
            card.querySelector('.spell-slots').innerHTML = tiles.map(() => '<span class="spell-slot"></span>').join('');
            card.querySelector('.spell-tiles').innerHTML = D.pick(tiles.map((t, i) => ({ t, i })), tiles.length).map(({ t }) => `<button type="button" class="spell-tile" data-t="${esc(t.toLowerCase())}">${esc(t.toLowerCase())}</button>`).join('');
        }
        card.querySelector('.spell-tiles').addEventListener('click', (e) => {
            const b = e.target.closest('.spell-tile');
            if (!b || b.disabled || round >= pool.length) return;
            if (b.dataset.t !== tiles[next].toLowerCase()) {
                shake(b);
                result.textContent = "🤔 Bu harf emas. Qaysi harf keladi?";
                if (onWrong) onWrong();
                return;
            }
            b.disabled = true;
            b.classList.add('is-used');
            card.querySelectorAll('.spell-slot')[next].textContent = tiles[next].toLowerCase();
            next++;
            result.textContent = '';
            if (next < tiles.length) return;
            card.querySelector(`[data-step="${round}"]`).classList.add('is-done');
            round++;
            if (round === pool.length) {
                result.textContent = "🎉 Barakalla! So'zlarni yig'dingiz!";
                card.querySelector('.dict-game').classList.add('is-won');
                if (onWin) onWin();
            } else {
                result.textContent = '⭐ Barakalla!';
                if (onRight) onRight();
                setTimeout(() => {
                    result.textContent = '';
                    show();
                }, 900);
            }
        });
        show();
        return card;
    }

    root.Games = { color, order, compare, trace, listen, match, spell, close: closeModal, toLineArt };
})(window);
