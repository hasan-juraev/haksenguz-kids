/*
 * Men o'qidim (js/myreading.js): how long ago a reading was, in words a
 * child knows; the name of the file sent to the grandparents; and the
 * menus in Korean.
 * Run with: node tests/myreading.test.js
 */
'use strict';

global.window = { navigator: {} };
require('../js/myreading.js');
require('../js/i18n.js');
const { MyReading: M, I18n } = window;

let failed = 0;
let total = 0;
const check = (cond, msg) => {
    total++;
    if (!cond) {
        failed++;
        console.log(`✗ ${msg}`);
    }
};
const hangul = (t) => /[가-힣]/.test(t || '');

// ---------- how long ago ----------

const now = new Date(2026, 9, 4, 9, 30).getTime(); // 4 October 2026, morning
const back = (days, hour = 12) => new Date(2026, 9, 4 - days, hour, 0).getTime();
[
    [0, 'bugun'], [1, 'kecha'], [2, '2 kun oldin'], [13, '13 kun oldin'], [14, '2 hafta oldin'], [20, '2 hafta oldin'], [21, '3 hafta oldin'],
    [59, '8 hafta oldin'], [60, '2 oy oldin'], [95, '3 oy oldin'], [364, '12 oy oldin'], [365, '1 yil oldin'], [800, '2 yil oldin'],
].forEach(([days, want]) => check(M.ago(back(days), now) === want, `${days} days ago: "${want}" (${M.ago(back(days), now)})`));
check(M.ago(new Date(2026, 9, 3, 23, 59).getTime(), new Date(2026, 9, 4, 0, 1).getTime()) === 'kecha', 'a minute before midnight was yesterday');
check(M.ago(now + 5000, now) === 'bugun', 'a clock a little ahead is still today');
check(M.ago(new Date(2026, 2, 28, 12).getTime(), new Date(2026, 2, 30, 12).getTime()) === '2 kun oldin', 'calendar days, whatever the clocks do');

// ---------- the file sent ----------

check(M.ext('audio/webm;codecs=opus') === 'webm' && M.ext('audio/mp4;codecs=mp4a.40.2') === 'm4a' && M.ext('audio/ogg;codecs=opus') === 'ogg' && M.ext('audio/wav') === 'wav' && M.ext('') === 'webm', 'the file type by the recording\'s');
check(M.fileName('Asal', 'Zumrad va Qimmat', 3, 'audio/webm') === 'Asal - Zumrad va Qimmat, 3-sahifa.webm', `a plain name (${M.fileName('Asal', 'Zumrad va Qimmat', 3, 'audio/webm')})`);
check(M.fileName("O'g'iloy", "Bo'ri va tulki", 2, 'audio/mp4') === 'Oʼgʼiloy - Boʼri va tulki, 2-sahifa.m4a', `apostrophes kept as ʼ (${M.fileName("O'g'iloy", "Bo'ri va tulki", 2, 'audio/mp4')})`);
check(!/[\\/:*?"<>|]/.test(M.fileName('A/B', 'C:D?*<>|"', 1, 'audio/webm')), 'nothing a phone cannot save in a name');
check(M.fileName('', '', 5, 'audio/webm') === 'Bolajon - Ertak, 5-sahifa.webm', 'no name, no title: still a name');
check(M.fileName('Минжун 민준', 'Хунбу', 1, 'audio/webm') === 'Минжун 민준 - Хунбу, 1-sahifa.webm', 'Cyrillic and Hangul names stay');

// ---------- the menus in Korean ----------

[
    "Men o'qiyman", "🎙️ Men o'qidim", "Sahifani ovoz chiqarib o'qing — buvijon va bobojon eshitadi!", '⏺ Yozishni boshlash', "⏹ To'xtatish", '💾 Saqlash', '🔁 Qaytadan',
    '✅ Saqlandi! Endi buvijonga yuborishingiz mumkin.', '🎙️ Mikrofon topilmadi yoki ruxsat berilmadi.', "🎧 Shu sahifani o'qishlaringiz",
    "🌱 Birinchi o'qishingizni va eng yangisini tinglang — qanchalik o'sdingiz!", 'Yuborish', "O'chirish", "Bu yozuv o'chirilsinmi?",
    "💾 Fayl saqlandi — uni Telegram yoki KakaoTalk'da yuboring", 'bugun', 'kecha', '5 kun oldin', '3 hafta oldin', '7 oy oldin', '2 yil oldin',
    "Asal «Zumrad va Qimmat» ertagining 3-sahifasini o'qidi! 🎙️",
].forEach((uz) => {
    const ko = I18n.translate(uz, 'ko');
    const rest = ko.replace(/«[^»]*»/g, '').replace(/^Asal: /, '');
    check(ko !== uz && hangul(ko) && !/[a-z]{2}/i.test(rest), `Korean menus: "${uz}" → "${ko}"`);
});
const read = (f) => require('fs').readFileSync(require('path').join(__dirname, '..', f), 'utf8');
const src = read('js/app.js') + read('js/book.js');
["Men o'qiyman", "🎙️ Men o'qidim", "Sahifani ovoz chiqarib o'qing — buvijon va bobojon eshitadi!", '⏺ Yozishni boshlash', "⏹ To'xtatish", '💾 Saqlash', '🔁 Qaytadan',
    '✅ Saqlandi! Endi buvijonga yuborishingiz mumkin.', '🎙️ Mikrofon topilmadi yoki ruxsat berilmadi.', "🎧 Shu sahifani o'qishlaringiz",
    "🌱 Birinchi o'qishingizni va eng yangisini tinglang — qanchalik o'sdingiz!", "Bu yozuv o'chirilsinmi?", "💾 Fayl saqlandi — uni Telegram yoki KakaoTalk'da yuboring",
    "ertagining ${view}-sahifasini o'qidi! 🎙️"]
    .forEach((t) => check(src.includes(t), `"${t}" is what the app shows`));

console.log(failed ? `\n${failed} of ${total} checks FAILED` : `\nall ${total} checks passed`);
process.exit(failed ? 1 : 0);
