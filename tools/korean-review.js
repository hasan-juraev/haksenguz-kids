#!/usr/bin/env node
/*
 * The app's Korean next to the Uzbek it translates, as one table for a
 * bilingual reviewer. It opens in Excel, Google Sheets or Numbers:
 *
 *   node tools/korean-review.js > korean-review.csv
 *   node tools/korean-review.js zumrad > zumrad.csv     (one book; "menu" for the menus)
 *
 * One row per title, sentence, question, answer, word and menu text. The
 * reviewer writes a better Korean in the "To'g'risi / 수정" column, or a note
 * in the last one, and sends the file back. The ID says where a row lives:
 * "zumrad 3.2" is Zumrad va Qimmat, page 3, sentence 2 (3.0 is the page title).
 */
'use strict';

global.window = { matchMedia: () => ({ matches: false }) };
require('../js/book.js');
require('../js/stories-folk.js');
require('../js/stories-classic.js');
require('../js/stories-twins.js');
require('../js/stories-korea.js');
require('../js/stories-ko.js');
require('../js/i18n.js');

const { segments } = window.BookEngine;
const db = window.storiesDatabase;
const { EXACT, PATTERNS, translate } = window.I18n;
const only = process.argv.slice(2);
const want = (key) => !only.length || only.includes(key);
const unknown = only.filter((key) => key !== 'menu' && !window.storiesKorean[key]);
if (unknown.length) {
    console.error(`No Korean for: ${unknown.join(', ')}. Books with Korean: ${Object.keys(window.storiesKorean).join(', ')}, or "menu".`);
    process.exit(1);
}

const rows = [['ID', 'Qayer / 위치', "O'zbekcha / 우즈베크어", 'Koreyscha / 한국어', "To'g'risi / 수정", 'Izoh / 메모']];
const add = (id, where, uz, ko) => rows.push([id, where, uz, ko || '', '', '']);

Object.entries(window.storiesKorean).filter(([key]) => want(key)).forEach(([key, book]) => {
    const st = db[key];
    add(`${key} nomi`, 'Kitob nomi / 책 제목', st.title, book.title);
    add(`${key} tag`, 'Janr / 장르', st.tag, book.tag);
    st.pages.forEach((p, i) => {
        const n = i + 1;
        const k = book.pages[i] || { s: [] };
        segments(p).forEach((uz, j) => add(`${key} ${n}.${j}`, j ? `${n}-sahifa, ${j}-gap / ${n}쪽 ${j}번째 문장` : `${n}-sahifa, sarlavha / ${n}쪽 제목`, uz, k.s[j]));
        if (p.question) {
            add(`${key} ${n}.savol`, `${n}-sahifa, savol / ${n}쪽 질문`, p.question.q, k.q && k.q[0]);
            p.question.a.forEach((a, j) => add(`${key} ${n}.javob${j + 1}`, `${n}-sahifa, ${j + 1}-javob / ${n}쪽 ${j + 1}번 답`, a, k.q && k.q[j + 1]));
        }
    });
    add(`${key} saboq`, 'Ertakdan saboq / 이야기의 교훈', st.moral, book.moral);
    if (st.quiz && book.quiz) {
        add(`${key} test`, 'Bilimdon testi: savol / 퀴즈 질문', st.quiz.q, book.quiz[0]);
        st.quiz.a.forEach((a, j) => add(`${key} test${j + 1}`, `Bilimdon testi: ${j + 1}-javob / 퀴즈 ${j + 1}번 답`, a, book.quiz[j + 1]));
    }
    (book.words || []).forEach(([term, meaning]) => add(`${key} so'z: ${term}`, "So'z (bosilganda) / 낱말 (누르면 나옴)", term, meaning));
});

if (want('menu')) {
    Object.entries(EXACT).forEach(([uz, ko], i) => add(`menyu ${i + 1}`, 'Menyu, tugma / 메뉴, 버튼', uz, ko));
    PATTERNS.forEach(([, , example], i) => add(`menyu* ${i + 1}`, 'Menyu, raqam yoki ism bilan / 메뉴 (숫자나 이름 포함)', example, translate(example, 'ko')));
}

// CSV that Excel opens as UTF-8 (the byte-order mark) with Korean intact.
const cell = (v) => (/[",\r\n]/.test(v) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
process.stdout.write('\ufeff' + rows.map((r) => r.map(cell).join(',')).join('\r\n') + '\r\n');
