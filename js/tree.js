/*
 * O'qish daraxti, the reading tree (ROADMAP Phase 4, item 20). A tree grows
 * a leaf for every library book this child has finished, in the order they
 * were read, coloured by the book's shelf (Korean books bloom pink), and a
 * flower for every story the child wrote. It counts nothing against anyone:
 * no rankings, no goals, no points. It opens from "🌳 Daraxtim" on the home
 * screen (js/app.js).
 */
(function (root) {
    'use strict';

    // A leaf's colour by the book's shelf (the library's categories, js/app.js).
    const COLORS = {
        alifbo: '#74c69d', folk: '#40916c', classic: '#90be6d', navoiy: '#2a9d8f', modern: '#52b788',
        twins: '#e9c46a', korea: '#f4a6c6', holiday: '#f8961e', kichik: '#a7c957',
    };
    const OTHER = '#6abf69';
    const W = 320;
    const GROUND = 268;
    const GOLDEN = Math.PI * (3 - Math.sqrt(5));
    const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
    const n1 = (v) => Math.round(v * 10) / 10;

    // The library books this child has finished, the first read first: { key, title, category }.
    function leaves(db, profile) {
        const books = (profile && profile.books) || {};
        const order = Object.keys(db);
        return order.filter((k) => books[k] && books[k].finished && !db[k].mine)
            .sort((a, b) => (books[a].finishedAt || 0) - (books[b].finishedAt || 0) || order.indexOf(a) - order.indexOf(b))
            .map((k) => ({ key: k, title: db[k].title, category: db[k].category }));
    }

    // The stories this child wrote, the first written first: { id, title }.
    function flowers(profile) {
        return Object.values((profile && profile.myBooks) || {})
            .filter((b) => b && Array.isArray(b.pages) && b.pages.length)
            .sort((a, b) => (a.created || 0) - (b.created || 0))
            .map((b) => ({ id: b.id, title: b.title || 'Mening ertagim' })); // the maker's own name for an untitled story
    }

    // The tree's shape for n leaves and flowers: trunk height, crown centre and radius.
    function shape(n) {
        const trunk = 34 + Math.min(40, 2 * n);
        const r = Math.min(104, 30 + 11.5 * Math.sqrt(n));
        return { trunk, r, cx: W / 2, cy: GROUND - trunk - r * 0.62 };
    }

    // Where each of n leaves grows in the crown: a sunflower spiral, the
    // first books at the heart of the tree and the newest at its edge.
    function spots(n) {
        const { r, cx, cy } = shape(n);
        return Array.from({ length: n }, (_, i) => {
            const d = r * 0.86 * Math.sqrt((i + 0.5) / n);
            const a = i * GOLDEN;
            return [n1(cx + d * Math.cos(a)), n1(cy + d * 0.82 * Math.sin(a)), Math.round((a * 180) / Math.PI) % 360];
        });
    }

    const leafPath = '<path d="M0 -10 C7 -6 7 6 0 10 C-7 6 -7 -6 0 -10Z" stroke="#2d6a4f" stroke-width="1.2"/><path d="M0 -7 V7" stroke="#2d6a4f" stroke-width=".8" opacity=".55"/>';
    const petals = (fill, r, edge) => Array.from({ length: 5 }, (_, i) => {
        const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        return `<circle cx="${n1(Math.cos(a) * r)}" cy="${n1(Math.sin(a) * r)}" r="${n1(r * 0.78)}" fill="${fill}" stroke="${edge}" stroke-width=".8"/>`;
    }).join('');

    // The tree as an SVG. Each leaf and flower is a button (data-key, data-mine) named for its book.
    function svg(read, wrote) {
        const all = read.map((b) => ({ b, mine: false })).concat(wrote.map((b) => ({ b, mine: true })));
        const n = all.length;
        let s = `<circle cx="${W / 2}" cy="150" r="138" fill="#f1faee"/>`;
        s += `<ellipse cx="${W / 2}" cy="${GROUND + 12}" rx="148" ry="22" fill="#95d5b2"/><ellipse cx="${W / 2}" cy="${GROUND + 6}" rx="60" ry="8" fill="#74c69d" opacity=".6"/>`;
        if (!n) {
            // a sprout, waiting for the first book
            s += `<path d="M160 ${GROUND} C160 ${GROUND - 18} 158 ${GROUND - 26} 160 ${GROUND - 34}" fill="none" stroke="#2d6a4f" stroke-width="3" stroke-linecap="round"/>`;
            s += `<path d="M160 ${GROUND - 30} C150 ${GROUND - 44} 136 ${GROUND - 38} 138 ${GROUND - 30} C146 ${GROUND - 26} 154 ${GROUND - 26} 160 ${GROUND - 30}Z" fill="#74c69d" stroke="#2d6a4f" stroke-width="1.4"/>`;
            s += `<path d="M160 ${GROUND - 32} C170 ${GROUND - 48} 186 ${GROUND - 42} 183 ${GROUND - 33} C175 ${GROUND - 28} 166 ${GROUND - 28} 160 ${GROUND - 32}Z" fill="#95d5b2" stroke="#2d6a4f" stroke-width="1.4"/>`;
            return `<svg class="tree-svg" viewBox="0 0 ${W} 300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
        }
        const { trunk, r, cx, cy } = shape(n);
        const top = GROUND - trunk;
        const w = 7 + Math.min(9, n / 3);
        // crown, behind the leaves
        s += [[0, 0, 1], [-0.55, 0.18, 0.62], [0.55, 0.18, 0.62], [-0.3, -0.42, 0.6], [0.32, -0.4, 0.6]]
            .map(([dx, dy, k]) => `<ellipse cx="${n1(cx + dx * r)}" cy="${n1(cy + dy * r * 0.8)}" rx="${n1(r * k)}" ry="${n1(r * k * 0.82)}" fill="#b7e4c7"/>`).join('');
        // trunk and branches
        s += `<path d="M${n1(cx - w)} ${GROUND} C${n1(cx - w * 0.6)} ${n1(GROUND - trunk * 0.5)} ${n1(cx - 3)} ${n1(top + 10)} ${n1(cx - 3)} ${n1(top - 6)} L${n1(cx + 3)} ${n1(top - 6)} C${n1(cx + 3)} ${n1(top + 10)} ${n1(cx + w * 0.6)} ${n1(GROUND - trunk * 0.5)} ${n1(cx + w)} ${GROUND}Z" fill="#8d5524" stroke="#5c3317" stroke-width="1.6"/>`;
        s += [[-1, 0.55], [1, 0.5], [-0.4, 0.9], [0.45, 0.85]].slice(0, Math.min(4, 1 + Math.floor(n / 3)))
            .map(([dx, k]) => `<path d="M${cx} ${n1(top + 6)} Q${n1(cx + dx * r * 0.3)} ${n1(top - r * 0.2)} ${n1(cx + dx * r * 0.62)} ${n1(top - r * k * 0.7)}" fill="none" stroke="#5c3317" stroke-width="${n1(2 + w / 4)}" stroke-linecap="round"/>`).join('');
        // the leaves and flowers
        const at = spots(n);
        s += all.map(({ b, mine }, i) => {
            const [x, y, rot] = at[i];
            const attrs = `class="tree-leaf${mine ? ' tree-flower' : ''}" ${mine ? `data-mine="${esc(b.id)}"` : `data-key="${esc(b.key)}"`} role="button" tabindex="0" aria-label="${esc(b.title)}"`;
            // the child's own stories: white daisies; Korean books: cherry blossom
            if (mine) return `<g ${attrs} transform="translate(${x} ${y})"><circle r="15" fill="transparent"/>${petals('#fff', 5.4, '#d4a017')}<circle r="3.6" fill="#ffb703" stroke="#b7791f" stroke-width=".8"/></g>`;
            if (b.category === 'korea') return `<g ${attrs} transform="translate(${x} ${y}) rotate(${rot})"><circle r="15" fill="transparent"/>${petals(COLORS.korea, 4.6, '#9d4b73')}<circle r="2.6" fill="#fff" opacity=".9"/></g>`;
            return `<g ${attrs} transform="translate(${x} ${y}) rotate(${rot})"><circle r="15" fill="transparent"/><g fill="${COLORS[b.category] || OTHER}">${leafPath}</g></g>`;
        }).join('');
        return `<svg class="tree-svg" viewBox="0 0 ${W} 300" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
    }

    root.ReadingTree = { COLORS, leaves, flowers, shape, spots, svg };
})(window);
