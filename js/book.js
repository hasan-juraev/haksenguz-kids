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
            return !!this.story && this.view < this.lastView;
        }

        canPrev() {
            return !!this.story && this.view > this.minView;
        }

        isBusy() {
            return !!this.turn;
        }

        next() {
            if (this.turn || !this.canNext()) return false;
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

        art(scene, tall, seedSuffix) {
            if (!root.Art) return '';
            return root.Art.render(scene, { tall, seed: `${this.key}:${seedSuffix}:${JSON.stringify(scene)}` });
        }

        leftHTML(view) {
            const st = this.story;
            if (view <= 0) return this.endpaperHTML();
            if (view > st.pages.length) {
                const last = st.pages[st.pages.length - 1].scene || {};
                const scene = Object.assign({}, last, { fx: [...(last.fx || []).filter((f) => f !== 'confetti'), 'confetti'] });
                return `<div class="sheet sheet--left sheet--end"><div class="page-pad">
                    <div class="page-head"><span></span><span class="running-head">${esc(st.title)}</span></div>
                    <figure class="page-art page-art--end" data-action="poke">${this.art(scene, true, 'end')}<figcaption class="tamom-banner">Tamom!</figcaption>${this.colorButton(view)}</figure>
                    <p class="art-hint">✨ Ertak shu yerda tugadi ✨</p>
                    <div class="page-foot"><span class="page-num"></span><span>Ertaklar Olami</span></div>
                </div></div>`;
            }
            const p = st.pages[view - 1];
            const note = p.word
                ? `<div class="word-card"><span class="word-label">📖 Yangi so'z</span><span class="word-term">${esc(p.word[0])}</span><span class="word-mean">${esc(p.word[1])}</span></div>`
                : `<p class="art-hint">👆 Rasmga bosing — qahramonlar jonlanadi!</p>`;
            return `<div class="sheet sheet--left"><div class="page-pad">
                <div class="page-head"><span class="chapter-chip">${view}-sahifa</span><span class="running-head">${esc(st.title)}</span></div>
                <figure class="page-art" data-action="poke" title="Rasmga bosing">${this.art(p.scene, true, view)}${this.colorButton(view)}</figure>
                ${note}
                <div class="page-foot"><span class="page-num">${this.pageNo(view, 'left')}</span><span>Ertaklar Olami</span></div>
            </div></div>`;
        }

        rightHTML(view) {
            const st = this.story;
            if (view <= 0) return this.titleHTML();
            if (view > st.pages.length) return this.endHTML();
            const p = st.pages[view - 1];
            // Title and sentences are separate pieces so read-along can light them up.
            const [title, ...sents] = BookEngine.segments(p);
            const sentHTML = sents.map((t, i) => `<span class="sent" data-action="say" data-seg="${i + 1}">${esc(t)}</span>`).join(' ');
            return `<div class="sheet sheet--right"><div class="page-pad">
                <div class="page-head"><span class="running-head">${esc(st.tag.split('•')[0].trim())}</span><span class="chapter-chip">${view} / ${st.pages.length}</span></div>
                <div class="page-body" data-fit="21">
                    <h2 class="page-title" data-action="say" data-seg="0">${esc(title)}</h2>
                    <p class="page-text">${sentHTML}</p>
                    <p class="page-flourish" aria-hidden="true">❦ ❦ ❦</p>
                    ${this.questionHTML(view, p)}
                </div>
                <div class="page-foot"><span class="turn-hint">${view < st.pages.length ? 'Varaqlang' : 'Yakun'} <b>➜</b></span><span class="page-num">${this.pageNo(view, 'right')}</span></div>
            </div></div>`;
        }

        questionHTML(view, p) {
            if (!p.question) return '';
            const state = this.record.answers[view] || {};
            const buttons = p.question.a.map((txt, i) => {
                let cls = 'choice';
                if (state.done && (i === p.question.ok || p.question.ok < 0) && i === state.pick) cls += ' choice--right';
                if (state.wrong && state.wrong.includes(i)) cls += ' choice--wrong';
                return `<button type="button" class="${cls}" data-action="answer" data-view="${view}" data-idx="${i}"${state.done ? ' disabled' : ''}>${esc(txt)}</button>`;
            }).join('');
            const feedback = state.done
                ? `<p class="quiz-feedback quiz-feedback--ok">⭐ ${esc(state.praise || 'Barakalla!')} +10 ball</p>`
                : state.wrong && state.wrong.length ? `<p class="quiz-feedback">🤔 Yana bir o'ylab ko'ring!</p>` : '';
            return `<div class="page-question">
                <div class="question-label">💡 Bolajonlar uchun savol</div>
                <p class="question-text">${esc(p.question.q)}</p>
                <div class="choices">${buttons}</div>${feedback}
            </div>`;
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
                    <span class="exlibris-title">${esc(st.title)}</span>
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
                <h1 class="title-name">${esc(st.title)}</h1>
                <p class="title-tag">${esc(st.tag)}</p>
                <div class="title-medallion" data-action="poke">${this.art(scene, false, 'title')}</div>
                <p class="title-meta">📄 ${st.pages.length} sahifa · ⏱ ~${mins} daqiqa</p>
                <p class="title-opening">«Bir bor ekan, bir yo'q ekan...»</p>
                ${resume
                    ? `<button type="button" class="btn-resume" data-action="resume">▶ Davom ettirish · ${resume}-sahifa</button>`
                    : `<p class="title-hint">Sahifa chetidan torting yoki ➜ tugmasini bosing</p>`}
            </div></div>`;
        }

        endHTML() {
            const st = this.story;
            const { asked, right, stars } = BookEngine.score(st, this.record.answers);
            return `<div class="sheet sheet--right sheet--finale"><div class="page-pad finale">
                <div class="title-ornament">❦</div>
                <h2 class="finale-title">Ertak tugadi!</h2>
                <div class="finale-stars" aria-label="${stars} yulduz">${'★'.repeat(stars)}<span>${'★'.repeat(3 - stars)}</span></div>
                <p class="finale-score">${asked ? `Savollarga javoblar: ${right} / ${asked}` : 'Ajoyib o\'qidingiz!'}</p>
                <div class="finale-moral"><b>Ertakdan saboq:</b> ${esc(st.moral || "Yaxshilik va ezgulik har doim g'alaba qiladi.")}</div>
                <div class="finale-actions">
                    <button type="button" class="btn-quiz" data-action="quiz">🏆 Bilimdon testi</button>
                    <button type="button" class="btn-game" data-action="order">🧩 Voqealar tartibi</button>
                    <button type="button" class="btn-reread" data-action="restart">↺ Boshidan o'qish</button>
                </div>
            </div></div>`;
        }

        coverHTML() {
            const st = this.story;
            const scene = st.cover || st.pages[0].scene;
            return `<div class="cover">
                <div class="cover-frame">
                    <span class="cover-corner cover-corner--tl"></span><span class="cover-corner cover-corner--tr"></span>
                    <span class="cover-corner cover-corner--bl"></span><span class="cover-corner cover-corner--br"></span>
                    <p class="cover-series">Ertaklar Olami</p>
                    <h1 class="cover-title">${esc(st.title)}</h1>
                    <div class="cover-medallion">${this.art(scene, false, 'cover')}</div>
                    <p class="cover-tag">${esc(st.tag)}</p>
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
            else if (act === 'poke') this.poke(a);
            else if (this.opts.onAction) this.opts.onAction(act, a);
        }

        poke(fig) {
            fig.classList.remove('art-poke');
            void fig.offsetWidth;
            fig.classList.add('art-poke');
            setTimeout(() => fig.classList.remove('art-poke'), 700);
            if (this.opts.onPoke) this.opts.onPoke();
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
            if (this.view === view) this.put(this.right, this.rightHTML(view));
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

    // Questions answered right out of those asked, as 1–3 stars (3 when a book asks none).
    BookEngine.score = function (story, answers = {}) {
        const asked = story.pages.filter((p) => p.question).length;
        const right = Object.values(answers).filter((a) => a && a.done).length;
        const stars = asked ? Math.max(1, Math.round((right / asked) * 3)) : 3;
        return { asked, right, stars };
    };

    root.BookEngine = BookEngine;
})(window);
