/*
 * The holiday calendar (js/holidays.js): fixed days, the Korean lunar
 * holidays and Hayit, how far away a holiday is, and what the banner says.
 * Run with: node tests/holidays.test.js
 */
'use strict';

process.env.TZ = 'Asia/Seoul';
global.window = {};
require('../js/holidays.js');
const H = window.Holidays;

let failed = 0;
let total = 0;
const check = (cond, msg) => {
    total++;
    if (!cond) {
        failed++;
        console.log(`✗ ${msg}`);
    }
};
const ymd = (d) => (d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : 'none');
const on = (s) => {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d, 9, 30);
};
const is = (id, today, want) => {
    const got = ymd(H.next(id, on(today)));
    check(got === want, `${id} after ${today}: ${want}, got ${got}`);
};

// ---------- dates ----------

// fixed days: this year's, or next year's once it has passed
is('hangul', '2026-10-01', '2026-10-09');
is('hangul', '2026-10-09', '2026-10-09');
is('hangul', '2026-10-10', '2027-10-09');
is('uztili', '2026-10-01', '2026-10-21');
is('navruz', '2026-10-01', '2027-03-21');
is('mustaqillik', '2026-10-01', '2027-09-01');
is('eorini', '2026-10-01', '2027-05-05');
is('bolalar', '2026-10-01', '2027-06-01');

// the Korean lunar calendar (as published in Korea)
is('seollal', '2026-01-01', '2026-02-17');
is('seollal', '2026-10-01', '2027-02-07');
is('seollal', '2027-03-01', '2028-01-27');
is('chuseok', '2026-09-01', '2026-09-25');
is('chuseok', '2026-10-01', '2027-09-15');
is('chuseok', '2027-10-01', '2028-10-03');

// Hayit (Umm al-Qura; Uzbekistan's own announcement can differ by a day)
const near = (id, today, want) => {
    const got = H.next(id, on(today));
    const off = got ? Math.abs(H.daysTo(got, on(want))) : 99;
    check(off <= 1, `${id} after ${today}: about ${want}, got ${ymd(got)}`);
};
near('ramazon', '2026-01-01', '2026-03-20');
near('ramazon', '2026-10-01', '2027-03-09');
near('qurbon', '2026-01-01', '2026-05-27');
near('qurbon', '2026-10-01', '2027-05-16');

// every holiday has a date in the next year
Object.keys(H.DAYS).forEach((id) => {
    const d = H.next(id, on('2026-10-01'));
    check(d && H.daysTo(d, on('2026-10-01')) >= 0 && H.daysTo(d, on('2026-10-01')) <= 366, `${id} comes within a year (${ymd(d)})`);
});
check(H.next('nonsense', on('2026-10-01')) === null, 'an unknown holiday has no date');

// ---------- distances and words ----------

check(H.daysTo(on('2026-10-09'), on('2026-10-01')) === 8, 'Hangul kuni is 8 days after 1 October');
check(H.daysTo(on('2026-10-01'), on('2026-10-03')) === -2, 'negative once passed');
check(H.dateLabel(on('2026-10-09')) === '9-oktabr' && H.dateLabel(on('2027-02-07')) === '7-fevral' && H.dateLabel(on('2027-12-31')) === '31-dekabr', 'dates read "9-oktabr"');
check(H.when(8) === '🎉 8 kundan keyin bayram:' && H.when(1) === '🎉 Ertaga bayram:' && H.when(0) === '🎉 Bugun bayram:' && H.when(-1) === '🎉 Bayram kunlari:', 'the banner\'s words');

const letters = { holidays: ['hangul', 'uztili'] };
const newYears = { holidays: ['seollal', 'navruz'] };
const u = (story, today) => H.upcoming(story, on(today));
check(u(letters, '2026-10-01').id === 'hangul' && u(letters, '2026-10-01').days === 8, 'two holidays: the nearer one first');
check(u(letters, '2026-10-10').id === 'uztili' && u(letters, '2026-10-10').days === 11, 'the day after Hangul kuni: O\'zbek tili bayrami is next');
check(u(letters, '2026-10-22').id === 'hangul' && ymd(u(letters, '2026-10-22').date) === '2027-10-09', 'after both: next year');
check(u(newYears, '2026-10-01').id === 'seollal' && ymd(u(newYears, '2026-10-01').date) === '2027-02-07', 'Seollal comes before Navro\'z');
check(u(newYears, '2027-02-08').id === 'seollal' && u(newYears, '2027-02-08').days === -1, 'Seollal is three days long: the day after still counts');
check(u(newYears, '2027-02-09').id === 'navruz', 'then Navro\'z is next');
check(u({}, '2026-10-01') === null && u({ holidays: ['nonsense'] }, '2026-10-01') === null, 'no holidays, no date');

// the banner offers the book from three weeks before until the holiday is over
const soon = (story, today) => H.soon(story, on(today));
check(soon(letters, '2026-09-17') === null, 'more than three weeks before: not yet');
check(soon(letters, '2026-09-18').days === 21, 'three weeks before');
check(soon(letters, '2026-10-09').days === 0, 'on the day');
check(soon(letters, '2026-10-10').id === 'uztili', 'the day after Hangul kuni the next holiday is near');
check(soon(newYears, '2027-02-08') && soon(newYears, '2027-02-08').days === -1, 'during Seollal');

// ---------- a browser without the lunar calendars ----------

const Real = Intl.DateTimeFormat;
Intl.DateTimeFormat = function (locale, opts) {
    const f = new Real('en', opts);
    return { formatToParts: (d) => f.formatToParts(d), resolvedOptions: () => Object.assign(f.resolvedOptions(), { calendar: 'gregory' }) };
};
check(H.next('seollal', on('2030-06-01')) === null && H.next('ramazon', on('2030-06-01')) === null, 'no lunar calendar: no date rather than a wrong one');
check(ymd(H.next('hangul', on('2030-06-01'))) === '2030-10-09', 'fixed days still work');
Intl.DateTimeFormat = Real;

console.log(`${total - failed}/${total} passed`);
process.exit(failed ? 1 : 0);
