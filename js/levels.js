/*
 * Reading levels: which books suit which children (ROADMAP Phase 1, item 4).
 *
 * Every book has `age: [youngest, oldest]`, the ages it suits when a grown-up
 * reads it with the child (the youngest) up to reading it alone (the oldest).
 * The library has three shelves, after the two groups in the roadmap
 * (4–6 listen first, 7–10 get help with reading) with the older half split off:
 *   4–6   listening first
 *   7–8   starting to read
 *   9+    reading alone (Navoiy, Qodiriy)
 * A book stands on every shelf its ages touch. A child's profile may have an
 * age, which picks their shelf in the library.
 */
(function (root) {
    'use strict';

    const SHELVES = [
        { id: '4-6', label: '4–6 yosh', from: 0, to: 6 },
        { id: '7-8', label: '7–8 yosh', from: 7, to: 8 },
        { id: '9+', label: '9+ yosh', from: 9, to: Infinity },
    ];
    // Ages offered in the profile form; 11 stands for "11 and older".
    const AGES = [4, 5, 6, 7, 8, 9, 10, 11];

    // The shelf for a child of this age (null when the age isn't set).
    function shelfFor(age) {
        if (!age) return null;
        return SHELVES.find((s) => age >= s.from && age <= s.to).id;
    }

    // Whether a book stands on a shelf ('all' holds every book).
    function fits(story, shelf) {
        if (!shelf || shelf === 'all') return true;
        const s = SHELVES.find((x) => x.id === shelf);
        if (!s) return true;
        const [lo, hi] = story.age || [0, Infinity];
        return lo <= s.to && hi >= s.from;
    }

    // "5–8 yosh", as shown on library cards and title pages.
    const label = (story) => (story.age ? `${story.age[0]}–${story.age[1]} yosh` : '');
    const ageLabel = (age) => (age >= 11 ? '11+ yosh' : `${age} yosh`);

    root.Levels = { SHELVES, AGES, shelfFor, fits, label, ageLabel };
})(window);
