/*
 * BookEngine — a 3D picture book that pages like a real one.
 *
 * The book is a sequence of "views" (spreads):
 *   -1          closed: only the front cover is visible, centred
 *    0          inside cover (endpaper) | title page
 *    1 .. N     story page k: illustration (left) | text (right)
 *    N + 1      "Tamom!" picture | moral, quiz and re-read buttons
 *
 * Turning forward lifts the right-hand sheet around the spine: its front is
 * the current right page, its back is the next left page. The next right page
 * is placed underneath as soon as the sheet lifts, and the old left page stays
 * put until the sheet lands on it — exactly what you see with paper. Turning
 * back is the mirror image. Every page, static or on the turning sheet, is
 * produced by the same template, so nothing jumps when a turn completes.
 *
 * Turns are driven frame by frame (requestAnimationFrame), so the same code
 * serves button presses, keyboard, and dragging a page by its edge: a drag
 * past the middle (or a quick flick) completes the turn, otherwise the page
 * falls back. Only one turn runs at a time.
 *
 * Below 768px there is no spread: the two halves of a view stack vertically
 * and a page change is a short slide (swipe to turn).
 *
 * Reading state lives in a record passed to load(): { page, answers }. The
 * engine fills in answers as questions are answered and offers to continue
 * from record.page on the title page; saving it is the caller's business.
 */
(function (root) {
    'use strict';

    const FLIP_MS = 900;
    const COVER_MS = 1150;
    const MAX_STACK = 9;
    const PRAISE = ['Barakalla!', 'Ofarin!', "Juda to'g'ri!", 'Qoyil!', 'Zo\'r!'];

    const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    class BookEngine {
        constructor(el, opts = {}) {
            this.el = el;
            this.opts = opts;
            this.story = null;
            this.key = null;
            this.view = -1;
            this.turn = null;
            this.raf = 0;
            this.record = { page: 0, answers: {} };
            this.ko = null; // this book's Korean helper text (js/stories-ko.js), if any
            this.gloss = []; // its glossary words, as matchers
            this.koView = null; // the view whose Korean is shown (🇰🇷), until the page turns
            // 가: every page read out in Hangul, for children who read Korean letters first
            // (js/hangul.js); it stays on from page to page until turned off
            this.reading = !!opts.reading;
            // Bedtime (js/bedtime.js): `limit` is the last page that may be reached
            // (turning on calls opts.onLimit instead), and `calm` rests the questions.
            this.limit = null;
            this.calm = false;
            this.spread = this.isSpread();
            this.reduced = root.matchMedia ? root.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

            el.innerHTML = `
                <div class="book-board book-board--left"></div>
                <div class="book-board book-board--right"></div>
                <div class="page-stack page-stack--left"></div>
                <div class="page-stack page-stack--right"></div>
                <section class="book-page book-page--left" aria-label="Chap sahifa"><div class="page-content"></div><div class="page-shade"></div></section>
                <section class="book-page book-page--right" aria-live="polite" aria-label="O'ng sahifa"><div class="page-content"></div><div class="page-shade"></div></section>
                <div class="book-spine"></div>
                <div class="bookmark-ribbon"></div>
                <div class="leaf" hidden>
                    <div class="leaf-face leaf-face--front"><div class="face-content"></div><div class="face-shade"></div></div>
                    <div class="leaf-face leaf-face--back"><div class="face-content"></div><div class="face-shade"></div></div>
                </div>
                <button type="button" class="page-corner page-corner--next" data-action="next" aria-label="Keyingi sahifa"></button>
                <button type="button" class="page-corner page-corner--prev" data-action="prev" aria-label="Oldingi sahifa"></button>`;

            const q = (s) => el.querySelector(s);
            this.left = q('.book-page--left');
            this.right = q('.book-page--right');
            this.leaf = q('.leaf');
            this.front = q('.leaf-face--front');
            this.back = q('.leaf-face--back');

            el.addEventListener('click', (e) => this.onClick(e));
            el.addEventListener('pointerdown', (e) => this.onPointerDown(e));
            el.addEventListener('pointermove', (e) => this.onPointerMove(e));
            el.addEventListener('pointerup', (e) => this.onPointerUp(e));
            el.addEventListener('pointercancel', (e) => this.onPointerUp(e, true));
            root.addEventListener('resize', () => this.onResize());
        }

        // ---------- public API ----------

        load(key, story, record) {
            this.stopTurn();
            this.key = key;
            this.story = story;
            this.record = record || { page: 0, answers: {} };
            this.record.answers = this.record.answers || {};
            this.ko = (root.storiesKorean || {})[key] || null;
            this.gloss = ((this.ko && this.ko.words) || []).map(([, , forms], i) => ({ i, match: BookEngine.glossForms(forms) }));
            this.koView = null;
            this.limit = null;
            this.calm = false;
            this.spread = this.isSpread();
            this.view = this.spread ? -1 : 0;
            this.el.style.setProperty('--cover', story.hue || '#7c2d12');
            this.renderRest();
        }

        get lastView() {
            return this.story.pages.length + 1;
        }

        get minView() {
            return this.spread ? -1 : 0;
        }

        canNext() {
            return !!this.story && this.view < this.lastView && !this.atLimit();
        }

        atLimit() {
            return !!this.limit && this.view >= this.limit;
        }

        canPrev() {
            return !!this.story && this.view > this.minView;
        }

        isBusy() {
            return !!this.turn;
        }

        next() {
            if (this.turn) return false;
            if (!this.canNext()) {
                if (this.story && this.atLimit() && this.opts.onLimit) this.opts.onLimit();
                return false;
            }
            if (!this.spread) return this.slide(1);
            this.beginTurn('fwd');
            this.animateTo(1, this.turn.cover ? COVER_MS : FLIP_MS, easeInOut);
            return true;
        }

        prev() {
            if (this.turn || !this.canPrev()) return false;
            if (!this.spread) return this.slide(-1);
            this.beginTurn('bwd');
            this.animateTo(1, this.turn.cover ? COVER_MS : FLIP_MS, easeInOut);
            return true;
        }

        goTo(view) {
            this.stopTurn();
            this.view = clamp(view, this.minView, this.lastView);
            this.renderRest();
        }

        // ---------- page templates ----------

        pageNo(view, side) {
            return side === 'left' ? view * 2 - 1 : view * 2;
        }

        // top: items drawn above the whole picture (the hidden star), which leave the picture as it is.
        art(scene, tall, seedSuffix, top) {
            if (!root.Art) return '';
            return root.Art.render(scene, { tall, seed: `${this.key}:${seedSuffix}:${JSON.stringify(scene)}`, top });
        }

        // The page's hidden star (js/hiddenstar.js), found or not; none in a book a child made.
        starItem(view) {
            const H = root.HiddenStar;
            if (!H || !H.hides(this.story) || !root.Art || !root.Art.parts.hiddenstar) return null;
            const p = this.story.pages[view - 1];
            const [x, y] = H.place(this.key, view, p && p.scene);
            return [['hiddenstar', x, y, { found: !!(this.record.stars && this.record.stars[view]) }]];
        }

        leftHTML(view) {
            const st = this.story;
            if (view <= 0) return this.endpaperHTML();
            if (view > st.pages.length) {
                const last = st.pages[st.pages.length - 1].scene || {};
                const scene = Object.assign({}, last, { fx: [...(last.fx || []).filter((f) => f !== 'confetti'), 'confetti'] });
                return `<div class="sheet sheet--left sheet--end"><div class="page-pad">
                    <div class="page-head"><span></span><span class="running-head" data-content>${esc(st.title)}</span></div>
                    <figure class="page-art page-art--end" data-action="poke">${this.art(scene, true, 'end')}<figcaption class="tamom-banner">Tamom!</figcaption>${this.colorButton(view)}</figure>
                    <p class="art-hint">✨ Ertak shu yerda tugadi ✨</p>
                    <div class="page-foot"><span class="page-num"></span><span>Ertaklar Olami</span></div>
                </div></div>`;
            }
            const p = st.pages[view - 1];
            return `<div class="sheet sheet--left"><div class="page-pad">
                <div class="page-head"><span class="chapter-chip">${view}-sahifa</span><span class="running-head" data-content>${esc(st.title)}</span></div>
                <figure class="page-art" data-action="poke" data-view="${view}" title="Rasmga bosing">${this.art(this.sceneOf(view), true, view, this.starItem(view))}${this.colorButton(view)}</figure>
                ${this.noteHTML(view, p)}
                <div class="page-foot"><span class="page-num">${this.pageNo(view, 'left')}</span><span>Ertaklar Olami</span></div>
            </div></div>`;
        }

        // A riddle's page shows its hidden answer (`reveal.scene`) once it is guessed.
        sceneOf(view) {
            const p = this.story.pages[view - 1];
            if (!p) return null;
            return p.reveal && this.solved(view) ? p.reveal.scene : p.scene;
        }

        solved(view) {
            const st = this.record && this.record.answers[view];
            return !!(st && st.done);
        }

        // Under the picture: the page's new word, a proverb's Korean twin, a tongue
        // twister's sounds, a riddle's "guess first" or the poke hint.
        noteHTML(view, p) {
            if (p.proverbKo) {
                return `<div class="word-card proverb-card"><span class="word-label">🇰🇷 Koreyada ham shunday deyishadi:</span>` +
                    `<span class="proverb-ko" lang="ko">${esc(p.proverbKo[0])}</span><span class="word-mean" data-content>«${esc(p.proverbKo[1])}»</span></div>`;
            }
            if (p.sounds) {
                return `<div class="word-card twister-card"><span class="word-label">🔁 Uch marta, tez-tez ayting!</span>` +
                    `<span class="twister-sounds" data-content>${p.sounds.map(esc).join(' · ')}</span></div>`;
            }
            if (p.reveal && !this.solved(view)) return `<p class="art-hint">🤔 Javobini toping — rasm ochiladi!</p>`;
            if (!p.word) return `<p class="art-hint">👆 Rasmga bosing: qahramonlar jonlanadi, narsalar nomini aytadi!</p>`;
            const ko = this.koShown(view) ? this.koWord(p.word[0]) : null;
            return `<div class="word-card"><span class="word-label">📖 Yangi so'z</span><span class="word-term" data-content>${esc(p.word[0])}${this.readsOut(view) ? ` <span class="word-read" lang="ko">${esc(root.Hangul.read(p.word[0]))}</span>` : ''}</span><span class="word-mean" data-content>${esc(p.word[1])}</span>${ko ? `<span class="word-ko" lang="ko">🇰🇷 ${esc(ko[1])}</span>` : ''}</div>`;
        }

        rightHTML(view) {
            const st = this.story;
            if (view <= 0) return this.titleHTML();
            if (view > st.pages.length) return this.endHTML();
            const p = st.pages[view - 1];
            // Title and sentences are separate pieces so read-along can light them up;
            // with 🇰🇷 on, each is followed by its Korean.
            const [title, ...sents] = BookEngine.segments(p);
            const ko = this.koShown(view);
            const rd = this.readsOut(view);
            const koLine = (i) => (ko ? `<span class="ko-line" lang="ko">${esc(ko.s[i] || '')}</span>` : rd ? this.readLine(i ? sents[i - 1] : title) : '');
            const sentHTML = sents.map((t, i) => `<span class="sent" data-action="say" data-seg="${i + 1}">${this.glossHTML(t)}</span>${koLine(i + 1)}`).join(ko || rd ? '' : ' ');
            return `<div class="sheet sheet--right"><div class="page-pad">
                <div class="page-head"><span class="running-head" data-content>${esc(p.by ? `✍️ ${p.by}` : st.tag.split('•')[0].trim())}</span><span class="head-tools">${this.micButton(view)}${this.readButton()}${this.koButton(view)}<span class="chapter-chip">${view} / ${st.pages.length}</span></span></div>
                <div class="page-body" data-fit="21">
                    <h2 class="page-title" data-content data-action="say" data-seg="0">${esc(title)}</h2>${ko ? `<p class="ko-line ko-line--title" lang="ko">${esc(ko.s[0])}</p>` : rd ? `<p class="read-line read-line--title" lang="ko">${esc(root.Hangul.read(title))}</p>` : ''}
                    ${this.letterHTML(p)}
                    <p class="page-text${ko || rd ? ' is-ko' : ''}${st.verse ? ' is-verse' : ''}${/^\d/.test(sents[0] || '') ? ' no-cap' : ''}" data-content>${sentHTML}</p>
                    <p class="page-flourish" aria-hidden="true">❦ ❦ ❦</p>
                    ${this.questionHTML(view, p, ko, rd)}
                </div>
                <div class="page-foot"><span class="turn-hint">${view < st.pages.length ? 'Varaqlang' : 'Yakun'} <b>➜</b></span><span class="page-num">${this.pageNo(view, 'right')}</span></div>
            </div></div>`;
        }

        questionHTML(view, p, ko, rd) {
            if (!p.question || this.calm) return '';
            const state = this.record.answers[view] || {};
            const koQ = ko && ko.q;
            const readQ = !koQ && rd;
            const buttons = p.question.a.map((txt, i) => {
                let cls = 'choice';
                if (state.done && (i === p.question.ok || p.question.ok < 0) && i === state.pick) cls += ' choice--right';
                if (state.wrong && state.wrong.includes(i)) cls += ' choice--wrong';
                return `<button type="button" class="${cls}" data-content data-action="answer" data-view="${view}" data-idx="${i}"${state.done ? ' disabled' : ''}>${esc(txt)}${koQ ? `<span class="ko-line" lang="ko">${esc(koQ[i + 1] || '')}</span>` : readQ ? this.readLine(txt) : ''}</button>`;
            }).join('');
            const feedback = state.done
                ? `<p class="quiz-feedback quiz-feedback--ok">⭐ ${esc(state.praise || 'Barakalla!')} +10 ball</p>` +
                  (p.reveal ? `<p class="riddle-answer"><span>🎉 Javob:</span> <b data-content>${esc(p.reveal.answer)}</b></p>` : '')
                : state.wrong && state.wrong.length ? `<p class="quiz-feedback">🤔 Yana bir o'ylab ko'ring!</p>` : '';
            return `<div class="page-question">
                <div class="question-label">💡 Bolajonlar uchun savol</div>
                <p class="question-text" data-content>${esc(p.question.q)}</p>${koQ ? `<p class="ko-line" lang="ko">${esc(koQ[0])}</p>` : readQ ? `<p class="read-line" lang="ko">${esc(root.Hangul.read(p.question.q))}</p>` : ''}
                <div class="choices">${buttons}</div>${feedback}
            </div>`;
        }

        // ---------- Korean helper (js/stories-ko.js) ----------

        // The Korean for a view while 🇰🇷 is on for it: a story page's { s, q }, or { moral } at the end.
        koShown(view) {
            if (!this.ko || this.koView !== view) return null;
            return view > this.story.pages.length ? { moral: this.ko.moral } : this.ko.pages[view - 1] || null;
        }

        koButton(view) {
            if (!this.ko || (view <= this.story.pages.length && !this.ko.pages[view - 1])) return '';
            const on = this.koView === view;
            return `<button type="button" class="ko-toggle${on ? ' is-on' : ''}" data-action="korean" aria-pressed="${on}" aria-label="Koreyscha tarjima">🇰🇷</button>`;
        }

        toggleKorean() {
            const v = this.view;
            this.koView = this.koView === v ? null : v;
            if (v >= 1) this.put(this.left, this.leftHTML(v));
            this.put(this.right, this.rightHTML(Math.max(v, 0)));
        }

        // ---------- 가: Uzbek read out in Korean letters (js/hangul.js) ----------

        // On a story page while 가 is on, unless 🇰🇷 is showing that page's Korean.
        readsOut(view) {
            return this.reading && !!root.Hangul && view >= 1 && view <= this.story.pages.length && !this.koShown(view);
        }

        readLine(text) {
            return `<span class="read-line" lang="ko">${esc(root.Hangul.read(text))}</span>`;
        }

        // Men o'qidim (js/myreading.js): the child reads this page aloud and records it.
        // Not at bedtime, which stays calm, nor where there is no microphone.
        micButton(view) {
            if (!this.opts.canRecord || this.calm) return '';
            return `<button type="button" class="mic-toggle" data-action="myread" data-view="${view}" aria-label="Men o'qiyman" title="Men o'qiyman">🎙️</button>`;
        }

        readButton() {
            if (!root.Hangul) return '';
            return `<button type="button" class="read-toggle${this.reading ? ' is-on' : ''}" data-action="reading" aria-pressed="${this.reading}" aria-label="Koreys harflarida o'qilishi" title="Koreys harflarida o'qilishi" lang="ko">가</button>`;
        }

        toggleReading() {
            this.reading = !this.reading;
            if (this.reading) this.koView = null;
            const v = this.view;
            if (v >= 1) this.put(this.left, this.leftHTML(v));
            this.put(this.right, this.rightHTML(Math.max(v, 0)));
            if (this.opts.onReading) this.opts.onReading(this.reading);
        }

        // An Alifbo page's big letter, and the button to trace it.
        letterHTML(p) {
            if (!p.letter) return '';
            const traceable = /[A-Za-z]/.test(p.letter); // the tutuq belgisi is a sign, not a letter to trace
            return `<div class="alifbo-letter"><span class="alifbo-glyph" data-content>${esc(p.letter)}</span>` +
                (traceable ? `<button type="button" class="btn-trace" data-action="trace" data-letter="${esc(p.letter)}">✍️ Yozib ko'r</button>` : '') + `</div>`;
        }

        // Glossary entry for a word, e.g. the "Yangi so'z" card's term.
        koWord(word) {
            const hit = this.gloss.find((g) => g.match(String(word).split(/\s+/)[0]));
            return hit ? this.ko.words[hit.i] : null;
        }

        // Escaped text with glossary words wrapped so a tap shows their Korean meaning.
        glossHTML(text) {
            if (!this.gloss.length) return esc(text);
            return String(text).split(/([A-Za-z'ʻʼ‘’]+)/).map((part, i) => {
                if (i % 2 === 0) return esc(part);
                const hit = this.gloss.find((g) => g.match(part));
                return hit ? `<span class="gloss" data-action="gloss" data-gloss="${hit.i}">${esc(part)}</span>` : esc(part);
            }).join('');
        }

        // Opens the colouring page for this picture (js/games.js).
        colorButton(view) {
            return `<button type="button" class="art-btn" data-action="color" data-view="${view}" aria-label="Rasmni bo'yash" title="Rasmni bo'yash">🎨</button>`;
        }

        endpaperHTML() {
            const st = this.story;
            return `<div class="sheet sheet--left sheet--endpaper"><div class="endpaper">
                <div class="exlibris">
                    <span class="exlibris-top">Ushbu kitob</span>
                    <span class="exlibris-title" data-content>${esc(st.title)}</span>
                    <span class="exlibris-bottom">Ertaklar Olami kutubxonasidan</span>
                </div>
            </div></div>`;
        }

        // Story page to offer "continue" from (page 1 is just the next turn).
        resumePage() {
            const page = this.record.page || 0;
            return page >= 2 && page <= this.story.pages.length ? page : 0;
        }

        titleHTML() {
            const st = this.story;
            const mins = Math.max(2, Math.round(st.pages.reduce((n, p) => n + p.text.split(/\s+/).length, 0) / 90));
            const scene = st.cover || st.pages[0].scene;
            const resume = this.resumePage();
            return `<div class="sheet sheet--right sheet--title"><div class="page-pad title-page">
                <div class="title-ornament">❦</div>
                <h1 class="title-name" data-content>${esc(st.title)}</h1>
                <p class="title-tag" data-content>${esc(st.tag)}</p>
                <div class="title-medallion" data-action="poke">${this.art(scene, false, 'title')}</div>
                <p class="title-meta"><span>📄 ${st.pages.length} sahifa · ⏱ ~${mins} daqiqa</span>${st.age ? ` · <span>${st.age[0]}–${st.age[1]} yosh</span>` : ''}</p>
                <p class="title-opening" data-content>«Bir bor ekan, bir yo'q ekan...»</p>
                ${this.starsLine(true)}
                ${resume
                    ? `<button type="button" class="btn-resume" data-action="resume">▶ Davom ettirish · ${resume}-sahifa</button>`
                    : `<p class="title-hint">Sahifa chetidan torting yoki ➜ tugmasini bosing</p>`}
            </div></div>`;
        }

        endHTML() {
            const st = this.story;
            const view = this.lastView;
            const { asked, right, stars } = BookEngine.score(st, this.record.answers);
            const ko = this.koShown(view);
            // "Ikki xalq — bir ertak": this tale's Korean twin (js/stories-twins.js), or, at the end of a twin, its game.
            const db = root.storiesDatabase || {};
            const twin = Object.keys(db).find((k) => db[k].twin === this.key);
            const special = twin
                ? `<button type="button" class="btn-twin" data-action="twin" data-key="${esc(twin)}"><span>🇰🇷 Egizak ertak ochildi!</span> <b data-content>${esc(db[twin].title)}</b></button>`
                : st.compare ? `<button type="button" class="btn-twin" data-action="compare">🔍 Farqlarni toping</button>` : '';
            // A book a child made (js/maker.js): its author instead of stars, and
            // instead of the quiz, back to the editor (or, for a gift, keep it).
            const made = st.mine;
            const score = made
                ? (st.author ? `<p class="finale-score"><span>✍️ Muallif:</span> <b data-content>${esc(st.author)}</b></p>` : '')
                : `<div class="finale-stars" aria-label="${stars} yulduz">${'★'.repeat(stars)}<span>${'★'.repeat(3 - stars)}</span></div>
                <p class="finale-score">${asked ? `Savollarga javoblar: ${right} / ${asked}` : 'Ajoyib o\'qidingiz!'}</p>`;
            // a gift can be kept, or continued and sent back (Ertak estafetasi)
            const keep = st.update ? '🔄 Ertagimni yangilash' : "📥 Javonimga qo'shish";
            const first = made
                ? (st.guest
                    ? `<button type="button" class="btn-quiz" data-action="keep">${keep}</button>${st.more ? `<button type="button" class="btn-game" data-action="relay">✍️ Davomini yozish</button>` : ''}`
                    : `<button type="button" class="btn-quiz" data-action="edit">✏️ Tahrirlash</button>`)
                : `<button type="button" class="btn-quiz" data-action="quiz">🏆 Bilimdon testi</button>`;
            return `<div class="sheet sheet--right sheet--finale"><div class="page-pad finale">
                ${this.passportHTML()}
                <div class="title-ornament">❦</div>
                <h2 class="finale-title">Ertak tugadi!</h2>
                ${score}
                ${this.starsLine(false)}
                <div class="finale-moral"><b>Ertakdan saboq:</b> ${this.ko && this.ko.moral ? this.koButton(view) : ''}<span data-content>${esc(st.moral || "Yaxshilik va ezgulik har doim g'alaba qiladi.")}</span>${ko && ko.moral ? `<span class="ko-line" lang="ko">${esc(ko.moral)}</span>` : ''}</div>
                ${special}
                <div class="finale-actions">
                    ${first}
                    ${st.order === false ? '' : '<button type="button" class="btn-game" data-action="order">🧩 Voqealar tartibi</button>'}
                    <button type="button" class="btn-reread" data-action="restart">↺ Boshidan o'qish</button>
                    ${st.guest ? '' : '<button type="button" class="btn-reread" data-action="share">📤 Ulashish</button>'}
                </div>
            </div></div>`;
        }

        // The hidden stars (js/hiddenstar.js) on the title page and the last:
        // an invitation before any is found, then how many.
        starsLine(title) {
            const H = root.HiddenStar;
            if (!H || !H.hides(this.story)) return '';
            const { found, total } = H.count(this.story, this.record);
            const text = found === 0
                ? (title ? '🌟 Har sahifada bitta yulduz yashiringan. Topa olasizmi?' : '🌟 Rasmlarda yulduzlar yashiringan. Qaytadan qarab chiqing!')
                : found === total ? `🌟 Hamma yulduzlar topildi: ${found}/${total}` : `🌟 Yashirin yulduzlar: ${found}/${total}`;
            return `<p class="stars-line${found === total ? ' is-all' : ''}">${text}</p>`;
        }

        // Culture passport (js/passport.js): the place this book took the child to, with its stamp.
        passportHTML() {
            const P = root.Passport;
            const r = P && P.regionOf(this.story);
            if (!r) return '';
            const where = `📍 Bu ertak seni ${P.dative(r.name)} olib bordi!`;
            return `<button type="button" class="finale-stamp" data-action="passport" data-region="${esc(r.id)}" aria-label="${esc(where)}" title="${esc(where)}">${P.stampSVG(r)}<small>🗺️ Pasport</small></button>`;
        }

        coverHTML() {
            const st = this.story;
            const scene = st.cover || st.pages[0].scene;
            return `<div class="cover">
                <div class="cover-frame">
                    <span class="cover-corner cover-corner--tl"></span><span class="cover-corner cover-corner--tr"></span>
                    <span class="cover-corner cover-corner--bl"></span><span class="cover-corner cover-corner--br"></span>
                    <p class="cover-series">Ertaklar Olami</p>
                    <h1 class="cover-title" data-content>${esc(st.title)}</h1>
                    <div class="cover-medallion">${this.art(scene, false, 'cover')}</div>
                    <p class="cover-tag" data-content>${esc(st.tag)}</p>
                    <p class="cover-hint">👆 Kitobni ochish uchun bosing</p>
                </div>
            </div>`;
        }

        coverInsideHTML() {
            return `<div class="cover-inside"><div class="cover-inside-page">${this.endpaperHTML()}</div></div>`;
        }

        // ---------- rendering ----------

        isSpread() {
            return root.matchMedia ? root.matchMedia('(min-width: 768px)').matches : true;
        }

        put(host, html) {
            const box = host.querySelector('.page-content, .face-content');
            box.innerHTML = html;
            // e.g. switch the text to Cyrillic — before it is measured for fitting
            if (this.opts.decorate) this.opts.decorate(box);
            this.fit(box);
        }

        // Shrinks the text of a page until it fits (long pages, small screens).
        fit(box) {
            if (!this.spread) return;
            box.querySelectorAll('[data-fit]').forEach((body) => {
                let size = parseFloat(body.dataset.fit);
                body.style.setProperty('--fs', size + 'px');
                let guard = 0;
                while (body.scrollHeight > body.clientHeight + 1 && size > 12.5 && guard++ < 16) {
                    size -= 0.75;
                    body.style.setProperty('--fs', size + 'px');
                }
            });
        }

        setStacks(view) {
            const total = this.story.pages.length + 2;
            const done = clamp((view + 1) / total, 0, 1);
            const l = view >= 0 ? Math.max(1.5, done * MAX_STACK) : 0;
            const r = view < this.lastView ? Math.max(1.5, (1 - done) * MAX_STACK) : 0;
            this.el.style.setProperty('--stack-l', l.toFixed(1) + 'px');
            this.el.style.setProperty('--stack-r', r.toFixed(1) + 'px');
        }

        // Draws the book at rest for this.view.
        renderRest() {
            const v = this.view;
            if (this.koView !== v) this.koView = null; // 🇰🇷 is for one page at a time
            const closed = this.spread && v === -1;
            this.el.classList.toggle('is-closed', closed);
            this.el.classList.toggle('is-title', v <= 0);
            this.el.classList.toggle('is-end', v === this.lastView);
            this.el.style.setProperty('--closed', closed ? 1 : 0);
            this.el.classList.toggle('can-next', this.canNext());
            this.el.classList.toggle('can-prev', this.canPrev());

            this.put(this.left, v >= 0 ? this.leftHTML(v) : '');
            this.put(this.right, this.rightHTML(Math.max(v, 0)));
            this.setShade(this.left, 0);
            this.setShade(this.right, 0);

            if (closed) {
                this.leaf.className = 'leaf leaf--fwd leaf--cover is-resting';
                this.leaf.hidden = false;
                this.put(this.front, this.coverHTML());
                this.put(this.back, this.coverInsideHTML());
                this.leaf.style.transform = 'rotateY(0deg)';
                this.front.style.visibility = 'visible';
                this.back.style.visibility = 'hidden';
                this.setShade(this.front, 0);
            } else {
                this.leaf.hidden = true;
                this.leaf.className = 'leaf';
                this.front.querySelector('.face-content').innerHTML = '';
                this.back.querySelector('.face-content').innerHTML = '';
            }
            this.setStacks(v);
            if (this.opts.onChange) this.opts.onChange(this.state());
        }

        state() {
            return { view: this.view, pages: this.story.pages.length, closed: this.view === -1, end: this.view === this.lastView, canNext: this.canNext(), canPrev: this.canPrev(), busy: !!this.turn };
        }

        setShade(host, v) {
            const sh = host.querySelector('.page-shade, .face-shade');
            if (sh) sh.style.opacity = v.toFixed(3);
        }

        // ---------- turning ----------

        beginTurn(dir) {
            const from = this.view;
            const to = dir === 'fwd' ? from + 1 : from - 1;
            const cover = (dir === 'fwd' && from === -1) || (dir === 'bwd' && to === -1);
            this.turn = { dir, from, to, cover, p: 0 };
            this.el.classList.add('is-turning');
            this.leaf.className = `leaf leaf--${dir}${cover ? ' leaf--cover' : ''}`;
            // Laid out (but faces not yet shown) before filling, so text fitting
            // measures the sheet at its real size.
            this.front.style.visibility = 'hidden';
            this.back.style.visibility = 'hidden';
            this.leaf.hidden = false;

            if (dir === 'fwd') {
                this.put(this.front, cover ? this.coverHTML() : this.rightHTML(from));
                this.put(this.back, cover ? this.coverInsideHTML() : this.leftHTML(to));
                // What lies under the lifting sheet: the next right-hand page.
                this.put(this.right, this.rightHTML(to));
            } else {
                this.put(this.front, cover ? this.coverInsideHTML() : this.leftHTML(from));
                this.put(this.back, cover ? this.coverHTML() : this.rightHTML(to));
                if (cover) {
                    // The front board is lifting off the table: nothing beneath it.
                    this.el.classList.add('is-closed');
                } else {
                    this.put(this.left, this.leftHTML(to));
                }
            }
            this.setProgress(0);
            if (this.opts.onTurnStart) this.opts.onTurnStart(this.turn);
        }

        setProgress(p) {
            const t = this.turn;
            if (!t) return;
            t.p = p;
            const fwd = t.dir === 'fwd';
            this.leaf.style.transform = `rotateY(${(fwd ? -180 : 180) * p}deg)`;
            // Explicit face swap at 90° (don't rely on backface-visibility alone).
            const past = p > 0.5;
            this.front.style.visibility = past ? 'hidden' : 'visible';
            this.back.style.visibility = past ? 'visible' : 'hidden';
            // The sheet darkens as it tilts away from the light...
            this.setShade(this.front, Math.min(1, p * 2) * 0.6);
            this.setShade(this.back, Math.min(1, (1 - p) * 2) * 0.6);
            // ...and casts a shadow on the page it hovers over.
            const s = Math.sin(p * Math.PI);
            const near = fwd ? this.right : this.left;
            const far = fwd ? this.left : this.right;
            this.setShade(near, past ? s * 0.25 : s * 0.7);
            this.setShade(far, past ? s * 0.7 : 0);
            if (t.cover) this.el.style.setProperty('--closed', (fwd ? 1 - p : p).toFixed(4));
        }

        animateTo(target, duration, ease, done) {
            cancelAnimationFrame(this.raf);
            const t = this.turn;
            const from = t.p;
            const span = Math.abs(target - from);
            const dur = this.reduced ? 1 : Math.max(160, duration * span);
            if (document.hidden || span === 0) {
                this.setProgress(target);
                this.endTurn(target === 1);
                return;
            }
            const t0 = performance.now();
            const step = (now) => {
                const k = clamp((now - t0) / dur, 0, 1);
                this.setProgress(from + (target - from) * ease(k));
                if (k < 1) this.raf = requestAnimationFrame(step);
                else {
                    this.endTurn(target === 1);
                    if (done) done();
                }
            };
            this.raf = requestAnimationFrame(step);
        }

        endTurn(completed) {
            const t = this.turn;
            if (!t) return;
            if (completed) this.view = t.to;
            this.turn = null;
            this.el.classList.remove('is-turning');
            this.renderRest();
            if (this.opts.onTurnEnd) this.opts.onTurnEnd(completed);
        }

        // Finishes whatever is in flight immediately (resize, story change).
        stopTurn() {
            cancelAnimationFrame(this.raf);
            this.drag = null;
            if (this.turn) this.endTurn(this.turn.p > 0.5);
        }

        // ---------- mobile slide ----------

        slide(delta) {
            this.view = clamp(this.view + delta, this.minView, this.lastView);
            this.renderRest();
            const cls = delta > 0 ? 'book-slide-forward' : 'book-slide-backward';
            this.el.classList.remove('book-slide-forward', 'book-slide-backward');
            void this.el.offsetWidth;
            this.el.classList.add(cls);
            this.el.addEventListener('animationend', () => this.el.classList.remove(cls), { once: true });
            if (this.opts.onTurnStart) this.opts.onTurnStart({ dir: delta > 0 ? 'fwd' : 'bwd', cover: false });
            return true;
        }

        // ---------- input ----------

        onClick(e) {
            const a = e.target.closest('[data-action]');
            if (this.suppressClick) {
                this.suppressClick = false;
                return;
            }
            if (!a || this.turn) return;
            const act = a.dataset.action;
            if (act === 'next') this.next();
            else if (act === 'prev') this.prev();
            else if (act === 'answer') this.answer(+a.dataset.view, +a.dataset.idx);
            else if (act === 'korean') this.toggleKorean();
            else if (act === 'reading') this.toggleReading();
            else if (act === 'poke') this.poke(a, e.target);
            else if (this.opts.onAction) this.opts.onAction(act, a);
        }

        // A tap on a picture: its characters hop, and the thing touched says
        // its name (js/picwords.js). A riddle's cloth has no name, so it gives
        // nothing away.
        poke(fig, target) {
            const star = target && target.closest ? target.closest('[data-w="hiddenstar"]') : null;
            if (star && fig.dataset.view) {
                this.findStar(+fig.dataset.view, star);
                return;
            }
            fig.classList.remove('art-poke');
            void fig.offsetWidth;
            fig.classList.add('art-poke');
            setTimeout(() => fig.classList.remove('art-poke'), 700);
            const word = target && root.PicWords ? root.PicWords.at(target) : null;
            if (word) {
                const g = word.el.firstElementChild;
                if (g) {
                    g.classList.remove('art-tap');
                    void g.getBoundingClientRect();
                    g.classList.add('art-tap');
                    setTimeout(() => g.classList.remove('art-tap'), 700);
                }
                if (this.opts.onWord) this.opts.onWord(word);
            }
            if (this.opts.onPoke) this.opts.onPoke();
        }

        // A page's hidden star touched: found once, kept in the record (record.stars).
        findStar(view, el) {
            const stars = this.record.stars || (this.record.stars = {});
            if (stars[view]) return;
            stars[view] = 1;
            const g = el.querySelector('.hs');
            if (g) g.classList.add('is-found', 'is-collected');
            if (this.opts.onStar && root.HiddenStar) this.opts.onStar(root.HiddenStar.count(this.story, this.record));
        }

        answer(view, idx) {
            const p = this.story.pages[view - 1];
            if (!p || !p.question) return;
            const answers = this.record.answers;
            const st = answers[view] || (answers[view] = { wrong: [] });
            if (st.done) return;
            const right = p.question.ok < 0 || idx === p.question.ok;
            if (right) {
                st.done = true;
                st.pick = idx;
                st.praise = PRAISE[(view + idx) % PRAISE.length];
                if (this.opts.onAnswer) this.opts.onAnswer(true, st.praise);
            } else if (!st.wrong.includes(idx)) {
                st.wrong.push(idx);
                if (this.opts.onAnswer) this.opts.onAnswer(false);
            }
            if (this.view === view) {
                this.put(this.right, this.rightHTML(view));
                // a guessed riddle uncovers its picture
                if (right && p.reveal) this.put(this.left, this.leftHTML(view));
            }
        }

        onPointerDown(e) {
            if (!this.story || this.turn || (e.button !== undefined && e.button > 0)) return;
            // Page corners are the natural place to grab a page, so they may start a drag.
            if (e.target.closest('button:not(.page-corner), a, input')) return;
            const rect = this.el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const onRight = x > rect.width / 2;
            let dir = null;
            if (this.spread) {
                if (onRight && this.canNext()) dir = 'fwd';
                else if (!onRight && this.canPrev()) dir = 'bwd';
            } else {
                dir = 'swipe';
            }
            if (!dir) return;
            this.drag = { id: e.pointerId, dir, x0: e.clientX, y0: e.clientY, rect, active: false, lastX: e.clientX, lastT: e.timeStamp, v: 0 };
        }

        onPointerMove(e) {
            const d = this.drag;
            if (!d || d.id !== e.pointerId) return;
            const dx = e.clientX - d.x0;
            const dy = e.clientY - d.y0;
            if (d.dir === 'swipe') return;
            if (!d.active) {
                if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy)) return;
                if ((d.dir === 'fwd' && dx > 0) || (d.dir === 'bwd' && dx < 0)) {
                    this.drag = null;
                    return;
                }
                d.active = true;
                try { this.el.setPointerCapture(e.pointerId); } catch (err) { /* capture is best-effort */ }
                this.beginTurn(d.dir);
                d.spine = d.rect.left + d.rect.width / 2;
                d.page = d.rect.width / 2;
            }
            const dt = Math.max(1, e.timeStamp - d.lastT);
            d.v = 0.7 * d.v + 0.3 * ((e.clientX - d.lastX) / dt);
            d.lastX = e.clientX;
            d.lastT = e.timeStamp;
            const rel = d.dir === 'fwd' ? (e.clientX - d.spine) / d.page : (d.spine - e.clientX) / d.page;
            this.setProgress(clamp(Math.acos(clamp(rel, -1, 1)) / Math.PI, 0, 1));
            e.preventDefault();
        }

        onPointerUp(e, cancelled) {
            const d = this.drag;
            if (!d || d.id !== e.pointerId) return;
            this.drag = null;
            const dx = e.clientX - d.x0;
            if (d.dir === 'swipe') {
                if (!cancelled && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - d.y0)) {
                    if (dx < 0) this.next();
                    else this.prev();
                }
                return;
            }
            if (!d.active) {
                // A plain tap on the closed cover opens the book.
                if (!cancelled && this.view === -1 && d.dir === 'fwd') this.next();
                return;
            }
            this.suppressClick = true;
            setTimeout(() => { this.suppressClick = false; }, 0);
            const flick = d.dir === 'fwd' ? d.v < -0.45 : d.v > 0.45;
            const back = d.dir === 'fwd' ? d.v > 0.45 : d.v < -0.45;
            const done = !cancelled && !back && (this.turn.p > 0.5 || flick);
            this.animateTo(done ? 1 : 0, this.turn.cover ? COVER_MS : FLIP_MS, easeOut);
        }

        onResize() {
            if (!this.story) return;
            const spread = this.isSpread();
            if (spread !== this.spread) {
                this.stopTurn();
                this.spread = spread;
                if (!spread && this.view < 0) this.view = 0;
                this.renderRest();
                return;
            }
            // Same layout, new size: re-fit the page text once resizing settles.
            clearTimeout(this.refit);
            this.refit = setTimeout(() => {
                if (this.turn) return;
                this.fit(this.left.querySelector('.page-content'));
                this.fit(this.right.querySelector('.page-content'));
            }, 150);
        }
    }

    // Splits page text into sentences for read-along highlighting. Quoted
    // speech stays whole («Salom! Kiraqol.» is one piece), and so does a line
    // that carries on after a dash or a small letter: «Salom!» — debdi.
    BookEngine.sentences = function (text) {
        const s = String(text || '');
        const out = [];
        let depth = 0;
        let start = 0;
        // Where the next sentence starts if one ends just before `end`, else -1.
        const nextStart = (end) => {
            if (end >= s.length || !/\s/.test(s[end])) return -1;
            let k = end;
            while (k < s.length && /\s/.test(s[k])) k++;
            return k >= s.length || /[—–\-a-zа-яёўқғҳ]/.test(s[k]) ? -1 : k;
        };
        for (let i = 0; i < s.length; i++) {
            const ch = s[i];
            let end = -1;
            if (ch === '«' || ch === '“') {
                depth++;
            } else if (ch === '»' || ch === '”') {
                depth = Math.max(0, depth - 1);
                // «... tashlab kel!» Chol ... — the quote ended the sentence
                if (depth === 0 && '.!?…'.includes(s[i - 1])) end = i + 1;
            } else if (depth === 0 && '.!?…'.includes(ch)) {
                end = i + 1;
                while (end < s.length && '.!?…»”")'.includes(s[end])) end++;
            }
            const k = end < 0 ? -1 : nextStart(end);
            if (k < 0) continue;
            out.push(s.slice(start, end).trim());
            start = k;
            i = k - 1;
        }
        const rest = s.slice(start).trim();
        if (rest) out.push(rest);
        return out;
    };

    // What a narrator reads on a story page: its title, then each sentence.
    BookEngine.segments = function (page) {
        return [String(page.title || '').trim(), ...BookEngine.sentences(page.text)];
    };

    // Matches words against glossary forms: "sandiq" matches words that start
    // with it ("sandiqni"), "=in" only the word "in". Case and apostrophe style don't matter.
    BookEngine.glossForms = function (forms) {
        const norm = (w) => String(w).toLowerCase().replace(/[ʻʼ‘’`]/g, "'");
        const list = forms.map((f) => (f[0] === '=' ? { exact: true, f: norm(f.slice(1)) } : { exact: false, f: norm(f) }));
        return (word) => {
            const w = norm(word);
            return list.some(({ exact, f }) => (exact ? w === f : w.startsWith(f)));
        };
    };

    // Questions answered right out of those asked, as 1–3 stars (3 when a book asks none).
    BookEngine.score = function (story, answers = {}) {
        const asked = story.pages.filter((p) => p.question).length;
        const right = Object.values(answers).filter((a) => a && a.done).length;
        const stars = asked ? Math.max(1, Math.round((right / asked) * 3)) : 3;
        return { asked, right, stars };
    };

    root.BookEngine = BookEngine;
})(window);
