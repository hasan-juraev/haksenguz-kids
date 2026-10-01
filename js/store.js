/*
 * Store: what the app remembers between visits. Everything stays on this
 * device (localStorage); nothing is sent anywhere.
 *
 * Each child has a profile with their own points, an optional age (it picks
 * their shelf in the library, see js/levels.js) and, per book:
 *   page      last story page they were on (0 = nothing to continue)
 *   answers   page questions answered so far (see BookEngine.answer)
 *   finished  reached the last page at least once
 *   quiz      passed the final quiz (its points are given only once)
 *   order     solved the story-order game (likewise paid once)
 *   compare   sorted a twin tale's "find the differences" cards (likewise)
 * Settings (script, menu language, page sound) belong to the device.
 */
(function (root) {
    'use strict';

    const KEY = 'ertaklar-olami';
    const VERSION = 1;
    const AVATARS = ['🦊', '🐰', '🐻', '🦉', '🐱', '🐶', '🐴', '🐝'];
    const DEFAULT_NAME = 'Bolajon';

    // A child's age in years, or null when not given (or not believable).
    const cleanAge = (age) => (Number.isInteger(age) && age >= 2 && age <= 18 ? age : null);

    const blank = () => ({ v: VERSION, settings: { script: 'lat', lang: 'uz', sound: true }, active: null, profiles: {} });

    function read() {
        try {
            const data = JSON.parse(root.localStorage.getItem(KEY));
            if (data && data.v === VERSION && data.profiles) return data;
        } catch (e) {
            /* storage blocked or unreadable: start fresh */
        }
        return blank();
    }

    class Store {
        constructor() {
            this.data = read();
            this.data.settings = Object.assign(blank().settings, this.data.settings);
            if (!this.profile()) {
                const first = this.profiles()[0];
                if (first) this.use(first.id);
                else this.addProfile(DEFAULT_NAME);
            }
        }

        save() {
            try {
                root.localStorage.setItem(KEY, JSON.stringify(this.data));
            } catch (e) {
                /* private mode or full: keep going in memory */
            }
        }

        get settings() {
            return this.data.settings;
        }

        setSetting(name, value) {
            this.data.settings[name] = value;
            this.save();
        }

        // ---------- profiles ----------

        profiles() {
            return Object.values(this.data.profiles).sort((a, b) => a.created - b.created);
        }

        profile() {
            return this.data.profiles[this.data.active] || null;
        }

        use(id) {
            if (!this.data.profiles[id]) return;
            this.data.active = id;
            this.save();
        }

        addProfile(name, avatar, age) {
            const taken = new Set(this.profiles().map((p) => p.avatar));
            const id = 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
            this.data.profiles[id] = {
                id,
                name: String(name || '').trim() || DEFAULT_NAME,
                avatar: avatar || AVATARS.find((a) => !taken.has(a)) || AVATARS[0],
                age: cleanAge(age),
                points: 0,
                books: {},
                last: null,
                created: Date.now(),
            };
            this.use(id);
            return this.data.profiles[id];
        }

        updateProfile(id, { name, avatar, age }) {
            const p = this.data.profiles[id];
            if (!p) return;
            if (name !== undefined) p.name = String(name).trim() || p.name;
            if (avatar) p.avatar = avatar;
            if (age !== undefined) p.age = cleanAge(age);
            this.save();
        }

        removeProfile(id) {
            delete this.data.profiles[id];
            if (this.data.active === id) {
                const next = this.profiles()[0];
                if (next) this.use(next.id);
                else this.addProfile(DEFAULT_NAME);
            }
            this.save();
        }

        // ---------- reading progress ----------

        // The active child's record for a book (created on first use).
        book(key) {
            const books = this.profile().books;
            return books[key] || (books[key] = { page: 0, answers: {}, finished: false, quiz: false, order: false, compare: false });
        }

        addPoints(n) {
            this.profile().points += n;
            this.save();
            return this.profile().points;
        }
    }

    Store.AVATARS = AVATARS;
    root.Store = Store;
})(window);
