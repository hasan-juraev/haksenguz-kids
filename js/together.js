/*
 * Birga o'qiymiz, reading together on a video call (ROADMAP Phase 4, item
 * 21). A grandparent in Tashkent and a child in Seoul each open the same
 * book on their own phone. A link names the page ("#zumrad/3"), and big page
 * numbers let them say "3-sahifa" and be on the same page. Here: the page
 * links. The toolbar, page picker and big numbers are in js/app.js and
 * css/book.css.
 */
(function (root) {
    'use strict';

    // "#zumrad/3" -> { key: 'zumrad', page: 3 }; "#zumrad" -> { key: 'zumrad', page: 0 }.
    function parse(hash) {
        let h = String(hash || '').replace(/^#/, '');
        try {
            h = decodeURIComponent(h);
        } catch (e) {
            return { key: '', page: 0 };
        }
        const m = /^(.+)\/(\d{1,3})$/.exec(h);
        return m ? { key: m[1], page: +m[2] } : { key: h, page: 0 };
    }

    // The link to a page of a library book.
    const link = (base, key, page) => `${String(base).split('#')[0]}#${encodeURIComponent(key)}${page >= 1 ? `/${page}` : ''}`;

    root.Together = { parse, link };
})(window);
