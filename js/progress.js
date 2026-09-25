/*
 * Progress — points, answers, stars and the last page read, kept in
 * localStorage so a child can close the tab and carry on later. Storage can
 * be unavailable (private mode, blocked site data): everything still works,
 * it just isn't remembered.
 */
(function (root) {
    'use strict';

    const KEY = 'ertaklar-olami:v1';

    const Progress = {
        data: { points: 150, books: {}, settings: {} },

        load() {
            try {
                const raw = root.localStorage.getItem(KEY);
                if (raw) {
                    const saved = JSON.parse(raw);
                    this.data = Object.assign({ points: 150, books: {}, settings: {} }, saved);
                }
            } catch (e) {
                /* not remembered this time */
            }
            return this;
        },

        save() {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => this.flush(), 150);
        },

        flush() {
            clearTimeout(this.timer);
            this.timer = null;
            try {
                root.localStorage.setItem(KEY, JSON.stringify(this.data));
            } catch (e) {
                /* not remembered this time */
            }
        },

        book(key) {
            const b = this.data.books[key] || (this.data.books[key] = {});
            return Object.assign(b, Object.assign({ last: 0, done: false, stars: 0, answers: {}, games: {} }, b));
        },

        settings() {
            return this.data.settings || (this.data.settings = {});
        },
    };

    // A save still waiting when the tab closes is written straight away.
    root.addEventListener('pagehide', () => {
        if (Progress.timer) Progress.flush();
    });
    root.Progress = Progress.load();
})(window);
