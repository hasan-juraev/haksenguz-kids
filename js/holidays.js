/*
 * Holidays (ROADMAP Phase 2, item 7): when each one comes round, so the
 * library can show a holiday book's date and the banner can offer the book
 * in the weeks before. A book on the holiday shelf names its days:
 * `holidays: ['hangul', 'uztili']`.
 *
 * Most days are fixed. Seollal and Chusok follow the Korean lunar calendar,
 * the two Hayits the Islamic one, so their dates move every year; the
 * browser's own calendars ('dangi', 'islamic-umalqura') find them. Hayit is
 * announced in Uzbekistan each year and can fall a day either side. A
 * browser without these calendars shows no date for them.
 */
(function (root) {
    'use strict';

    // date: [month, day], in the calendar `cal` (Gregorian when not given).
    // long: days after it that are still the holiday (Seollal and Chusok are
    // three days off in Korea: the day before, the day and the day after).
    const DAYS = {
        navruz: { name: "Navro'z", date: [3, 21] },
        seollal: { name: 'Seollal', cal: 'dangi', date: [1, 1], long: 1 },
        chuseok: { name: 'Chusok', cal: 'dangi', date: [8, 15], long: 1 },
        hangul: { name: 'Hangul kuni', date: [10, 9] },
        uztili: { name: "O'zbek tili bayrami", date: [10, 21] },
        eorini: { name: 'Koreyada bolalar kuni', date: [5, 5] },
        bolalar: { name: 'Bolalar kuni', date: [6, 1] },
        mustaqillik: { name: 'Mustaqillik kuni', date: [9, 1] },
        ramazon: { name: 'Ramazon hayiti', cal: 'islamic-umalqura', date: [10, 1] },
        qurbon: { name: 'Qurbon hayiti', cal: 'islamic-umalqura', date: [12, 10] },
    };
    const MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
    // The banner offers a holiday's book from SOON days before it until it is over.
    const SOON = 21;

    const day = (y, m, d) => new Date(y, m, d, 12); // noon: safe from clock changes
    const noon = (d) => day(d.getFullYear(), d.getMonth(), d.getDate());

    // The first day from `from` on which the calendar `cal` reads month/day.
    const found = {};
    function inCalendar(cal, [month, dd], from) {
        const key = `${cal} ${month}/${dd} ${from.toDateString()}`;
        if (key in found) return found[key];
        let fmt = null;
        try {
            fmt = new Intl.DateTimeFormat(`en-u-ca-${cal}`, { month: 'numeric', day: 'numeric' });
            if (fmt.resolvedOptions().calendar !== cal) fmt = null; // not supported: it fell back to Gregorian
        } catch (e) {
            fmt = null;
        }
        found[key] = null;
        for (let i = 0; fmt && i < 400; i++) {
            const d = day(from.getFullYear(), from.getMonth(), from.getDate() + i);
            const parts = fmt.formatToParts(d);
            const part = (type) => (parts.find((p) => p.type === type) || {}).value;
            if (part('month') === String(month) && part('day') === String(dd)) {
                found[key] = d;
                break;
            }
        }
        return found[key];
    }

    // The holiday's next date, counting from `back` days before today.
    function next(id, today = new Date(), back = 0) {
        const h = DAYS[id];
        if (!h) return null;
        const from = day(today.getFullYear(), today.getMonth(), today.getDate() - back);
        if (h.cal) return inCalendar(h.cal, h.date, from);
        const [m, d] = h.date;
        const date = day(from.getFullYear(), m - 1, d);
        return date < from ? day(from.getFullYear() + 1, m - 1, d) : date;
    }

    // Whole days from today to `date`; negative once it has passed.
    const daysTo = (date, today = new Date()) => Math.round((noon(date) - noon(today)) / 864e5);

    // "9-oktabr"
    const dateLabel = (date) => `${date.getDate()}-${MONTHS[date.getMonth()]}`;

    // A book's holiday that comes first, including one that is on now:
    // { id, name, date, days } or null. `days` is negative on the days
    // after the main one.
    function upcoming(story, today = new Date()) {
        let first = null;
        ((story && story.holidays) || []).forEach((id) => {
            if (!DAYS[id]) return;
            const date = next(id, today, DAYS[id].long || 0);
            if (!date) return;
            const days = daysTo(date, today);
            if (!first || days < first.days) first = { id, name: DAYS[id].name, date, days };
        });
        return first;
    }

    // That holiday, if it is near enough for the banner.
    function soon(story, today = new Date()) {
        const u = upcoming(story, today);
        return u && u.days <= SOON ? u : null;
    }

    // The banner's words before the holiday's name.
    function when(days) {
        if (days < 0) return '🎉 Bayram kunlari:';
        if (days === 0) return '🎉 Bugun bayram:';
        if (days === 1) return '🎉 Ertaga bayram:';
        return `🎉 ${days} kundan keyin bayram:`;
    }

    root.Holidays = { DAYS, MONTHS, SOON, next, daysTo, dateLabel, upcoming, soon, when };
})(window);
