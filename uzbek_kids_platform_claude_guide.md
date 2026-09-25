# Project Technical Documentation & Handoff Guide

## 1. Project Overview & Vision
* **Platform Name:** Bolalar Uchun Ertaklar & Kitoblar (Uzbek Interactive Kids' Storytelling Web Platform)
* **Target Audience:** Uzbek children (ages 4–12), parents, diaspora families, and young learners.
* **Mission:** Revitalize Uzbek folklore, traditional epics (*dostons*), and classical Uzbek literature (Alisher Navoiy, Abdulla Qodiriy, G'afur G'ulom, Anvar Obidjon) through a rich, gamified, interactive 3D digital picture-book web experience.
* **Core Value Proposition:**
  * Two-page open book layout: Left page features high-quality, kid-friendly fairytale illustrations; right page features authentic literary narrative text.
  * Interactive 3D physical page-turn mechanics (skeuomorphic book feel with paper sounds and shading).
  * Educational micro-interactions: moral decision branching, vocabulary quizzes, Latin-to-Cyrillic script switching.
  * Future-ready AI integrations: natural Uzbek AI voice narration (TTS) and dynamic scene generation.

---

## 2. Architecture & Design Patterns
* **Frontend Paradigm:** Single Page Application (SPA) built using vanilla HTML5, CSS3 3D transforms (`preserve-3d`, `rotateY`), and modern ES6+ JavaScript.
* **Layout Paradigm:**
  * Fixed aspect-ratio open-book container (`.book-stage` -> `.book-spread`).
  * CSS `table` / block layouts for multi-panel rendering (avoiding unstable flex wrappers inside 3D transform nodes).
  * Web Audio API for synthetic, zero-asset sound effects (paper rustle, celebration jingles).
* **Content Store (`StoryDatabase`):**
  * Array-of-objects data model supporting 20+ stories categorized into:
    * *Mumtoz Adabiyot* (Alisher Navoiy, Abdulla Qodiriy)
    * *Xalq Ertaklari* (Zumrad va Qimmat, Oltin Tarvuz, Susabil, Ur to'qmoq)
    * *Sarguzasht & Zamonaviy* (Sariq devni minib, Shum bola)
    * *Hikmatlar & Rivoyatlar* (Luqmoni Hakim, To'maris)
  * Each story contains `pages` (array of objects), each having:
    * `pageNumber`, `chapterTitle`, `illustrationScene`, `text`, `moralPrompt`, `choices`, and `vocabulary`.

---

## 3. Current Implementation Status

### Working Features
1. **Catalog & Library View:** Filter tabs by category, search by title/author, and responsive book cards showing cover art, age level, and read time.
2. **Open Book Spread Layout:**
   * Left page reserved for visual art (`#leftIllustration`).
   * Right page reserved for narrative typography, golden drop caps, moral decisions, and progress indicators.
3. **Procedural Vector Illustration Engine (`FairytaleScenes`):**
   * SVG-based rich scenes rendered directly into DOM (avoids broken external asset links).
   * Visual themes for *Sariq Dev*, *Farhod va Shirin*, *Lison ut-Tayr*, *O'tkan Kunlar*, *Zumrad va Qimmat*, *Susabil*, etc.
4. **Interactive Quiz & Moral Choices:** Interactive choice buttons that provide immediate visual feedback, points, and moral commentary.
5. **Alphabet Switcher (Lotin / Kirill):** Transliteration toggle between Uzbek Latin and Cyrillic scripts.
6. **Web Audio Sound Effects:** Procedural white-noise bandpass filter simulating book page turning rustle without external `.mp3` downloads.

---

## 4. Known Issues & Features Needing Fixes / Claude's Action Items

### Issue A: 3D Page Turn Animation Glitches & Desynchronization
* **Problem:** When clicking "Keyingi Sahifa" (Next) or "Oldingi Sahifa" (Previous), the flipping leaf animation (`#flipLeaf`) can occasionally flicker, desync from the right page content, or fail to render the back-face properly in certain Chromium/WebKit viewports.
* **Root Causes:**
  1. CSS `backface-visibility: hidden` failing when GPU acceleration triggers subpixel shifts.
  2. The turning leaf content (`.leaf-front` and `.leaf-back`) is injected synchronously while the rotation transition is executing.
  3. Lack of page flipping lock: Rapid double-clicks cause state overlap where `currentPage` increments twice during a single animation frame.
* **Claude Task:**
  * Implement an animation lock (`isFlipping = true`) that disables pagination clicks until the `transitionend` event completes.
  * Re-architect the flipping leaf to strictly separate:
    * Static Left Page (Page $N$)
    * Static Right Page (Page $N+1$)
    * Transient Flipping Sheet (Page $N+1$ front / Page $N+2$ back)
  * Use CSS `@keyframes` or well-defined CSS classes (`.flipping-next`, `.flipping-prev`) with clean `transform: rotateY(-180deg)` rather than inline style overrides.

### Issue B: Missing Staged Flip-Turn from Left to Right (Backward Flipping)
* **Problem:** Flipping forward works partially, but flipping backward (turning a page from left back to right) often feels like a sudden cut or reverse-pops awkwardly without proper paper depth.
* **Claude Task:**
  * Build a mirrored reverse leaf with `transform-origin: right center` or appropriate spine-aligned origin (`transform-origin: 0% 50%` vs `transform-origin: 100% 50%`).
  * Ensure the reverse leaf displays Page $N-1$ text on front and Page $N-2$ illustration on back.

### Issue C: Left Illustration Scalability & Dynamic AI Image Integration
* **Problem:** While procedural SVGs render well, they need seamless replacement when dynamic AI images (via Nano-palette, Gemini image API, or local generated art) are loaded.
* **Claude Task:**
  * Provide a dual-mode illustration component:
    1. If `page.imageUrl` is provided, render `<img class="story-art" src="..." loading="lazy" />` with subtle zoom/ken-burns animation.
    2. If `imageUrl` is empty or fails, seamlessly fall back to `FairytaleScenes.get(page.illustrationScene)`.
  * Ensure illustrations are contained (`object-fit: cover` with rounded borders, ambient inner shadow, and page-fold gradients).

### Issue D: Natural Uzbek Voice Narration Integration (AI Voice)
* **Problem:** Native browser `window.speechSynthesis` lacks natural Uzbek voice timbre and sounds robotic or defaults to Russian/Turkish voices.
* **Claude Task:**
  * Set up an audio engine abstraction:
    ```typescript
    interface AudioNarrator {
      playPage(storyId: string, pageNum: number): Promise<void>;
      pause(): void;
      resume(): void;
      setRate(speed: number): void;
    }
    ```
  * Integrate audio endpoint support for external pre-recorded Uzbek speech or streaming AI TTS (e.g., ElevenLabs / Coqui / local fine-tuned Uzbek VITS/Kokoro models).
  * Add a synchronized word/sentence highlighter (`<mark class="active-word">`) driven by audio timestamps (`timeupdate` event).

### Issue E: Mobile & Tablet Responsiveness (Single-Page vs. Two-Page Spread)
* **Problem:** The two-page spread (Left Image + Right Text) breaks or becomes unreadable on vertical smartphone screens ($< 768px$).
* **Claude Task:**
  * Implement a responsive mode query:
    * **Desktop & Landscape Tablets ($\ge 768px$):** Two-page spread with 3D physical spine and book flipping.
    * **Mobile Screens ($< 768px$):** Single-card swipeable storybook mode with stacked vertical layout (Image top, narrative bottom) or card-stack slide transition.

---

## 5. File Structure & Component Specifications

```text
bolalar-ertaklari/
├── index.html              # Core DOM structure, book stage, modal dialogs
├── css/
│   ├── main.css            # Base design system, typography, animations
│   ├── book-3d.css         # Skeuomorphic 3D transforms, spine, shadows, leaves
│   └── responsive.css      # Mobile single-page fallbacks
├── js/
│   ├── database.js         # 20+ authentic Uzbek stories & literary excerpts
│   ├── scenes.js           # Procedural SVG fairytale illustration engine
│   ├── audio.js            # Web Audio sound generator & AI voice streamer
│   ├── transliterate.js    # Uzbek Latin <-> Cyrillic conversion engine
│   └── app.js              # State manager, 3D flip controller, quiz engine
└── assets/
    └── covers/             # Static book covers and icon assets
```

---

## 6. Implementation Guidelines for Claude
1. **Zero External CSS/JS Dependencies:** Keep the application self-contained (no reliance on unstable third-party CDNs).
2. **Preserve Cultural Authenticity:** Maintain respectful, accurate literary citations for Alisher Navoiy (*Hamsa* extracts), Abdulla Qodiriy (*O'tkan Kunlar*), and classic folklore (*Zumrad va Qimmat*, *Ertaklar*).
3. **Child-Centric Accessibility:**
   * High-contrast fonts, legible typography (min font size 18px on tablets/desktop).
   * Large, tactile button targets (min $48\times48$px).
   * Positive reinforcement feedback loops (stars, cheering sounds, encouraging Uzbek praise phrases: *Barakalla!*, *Ofarin!*, *Juda to'g'ri!*).

---
*Document prepared for handover to Claude AI Engineer.*

---

## 7. Update: Real-Book Paging, Longer Folk Tales, Per-Page Illustrations

### What changed
* **3D paging now behaves like a real book** (`js/book.js`, `css/book.css`). Resolves Issues A, B and E.
  * The book is a sequence of spreads: closed cover → endpaper | title page → story pages (picture | text) → "Tamom!" | moral + quiz.
  * Turning forward lifts the right-hand sheet: its front is the current right page, its back is the next left page. The next right page appears **underneath** as soon as the sheet lifts, and the old left page is covered only when the sheet lands. Turning back is the exact mirror. The cover opens and closes the same way, and the book slides to centre when closed.
  * Static pages and both faces of the turning sheet are built from the **same templates**, so nothing jumps or flickers when a turn completes.
  * Turns are driven frame by frame (`requestAnimationFrame`). The same code handles buttons, ← → keys, page-corner taps and **dragging a page by its edge**. A drag past the middle (or a quick flick) completes the turn; otherwise the page falls back. Only one turn runs at a time (animation lock).
  * Paper realism: shading on the sheet as it tilts, a shadow cast on the page beneath, spine gutter shadows, and page-stack edges whose thickness follows reading progress.
  * Below 768px there is no spread: picture and text stack vertically, and a page change is a short slide (swipe left or right).
  * Text that would overflow a page is shrunk step by step until it fits.
* **Illustration engine** (`js/art/*.js`, `css/art.css`) replaces the four fixed SVGs and the icon fallback. Every page of every book has its own composed scene: Uzbek-dressed characters (atlas, chapan, do'ppi, salla, ro'mol), animals, places (mud-brick hovli, forest kulba, palace portal, bazaar, steppe, mountains) and props (sandiq, tarvuz, dasturxon, qozon, arava, flying gilam). Scenes carry gentle ambient motion (breathing characters, drifting clouds, twinkling stars, flickering fire). Tapping a picture makes the characters hop.
  * Rendering is deterministic and animations follow a shared clock, so the copy of a page on the turning sheet matches the page underneath exactly.
  * A page scene is a short spec, for example `{ bg: 'forest', time: 'night', items: [['hut', 290, 260, { lit: true }], ['zumrad', 150, 300, { mood: 'scared' }]] }`.
* **Content** (`js/stories-folk.js`, `js/stories-classic.js`):
  * Folk tales now run 8–12 pages each, retold in full: *Zumrad va Qimmat* (12), *Uch og'a-ini botirlar*, *Nasriddin Afandi latifalari*, *Donishmand qiz* (10 each), plus six 8-page tales.
  * Three new folk tales: *Oltin tarvuz*, *Susambil*, *Ur, to'qmoq!* (10 pages each).
  * Pages can carry a question (`question: { q, a, ok }`, +10 points, gentle retry on a wrong answer) and a "Yangi so'z" vocabulary card (`word: [term, meaning]`). Each book has its own `moral`, final `quiz`, cover colour (`hue`) and cover scene.
  * The classic, Navoiy and modern books keep their 5-page texts and now have a picture for every page. *Sariq devni minib* is now credited to Xudoyberdi To'xtaboyev.

### Current file structure
```text
index.html              # shell: header, library, story view, quiz, modal
css/book.css            # book, covers, pages, turning sheet, phone layout
css/art.css             # illustration animations
js/art/core.js          # Art.render(scene): registry, seeded RNG, shared animation clock
js/art/people.js        # parametric Uzbek characters + cast presets, dev, star child
js/art/animals.js       # fox/wolf/dog, donkey/horse, ram, goat, birds, stork, fish...
js/art/world.js         # skies, landscapes, interiors, buildings, props
js/art/fx.js            # sparkles, bubbles, notes, snow/leaves/confetti
js/stories-folk.js      # O'zbek xalq ertaklari
js/stories-classic.js   # classic, Navoiy and modern books
js/book.js              # BookEngine (paging, drag, cover, mobile slide)
js/app.js               # AppController (library, controls, points, sound, quiz)
```

### Still open
* Issue C: dual-mode `page.imageUrl` artwork with SVG fallback is not implemented. Scenes are procedural only.
* Issue D (AI voice narration) is unchanged.
* The Lotin/Кирилл toggle still only shows a message and does not transliterate the text.

---

## 8. Update: Saved Progress, Child Profiles, Real Cyrillic (Roadmap Phase 0)

The audience is Uzbek children growing up in Korea; `ROADMAP.md` has the plan built around that and the decisions made so far.

### What changed
* **Lotin / Кирилл now converts every piece of Uzbek text** (`js/translit.js`). Content stays written in Latin only. With Cyrillic on, a display layer converts text nodes (and `title`, `aria-label`, `placeholder`, `alt`) as they appear and keeps the Latin originals, so switching back restores them exactly. A MutationObserver catches whatever the app draws later; the book calls the converter directly before fitting page text, so both copies of a turning page match.
  * Spelling is rule-based: `yo'l → йўл`, `eshik → эшик`, `poyezd → поезд`, `ma'no → маъно`, `ketsa → кетса` (t+s is never ц). A few loanwords (months, `kompyuter`) are listed as exceptions. Checks: `node tests/translit.test.js`.
  * `translate="no"` keeps text out of it (the toggle's own labels, the sleeping "Zzz"); words with digits (`3D`) are left alone.
  * App code must not read Uzbek text back from the DOM, which may be showing Cyrillic. The category counts, for example, live in their own `<span data-count>`.
  * Fredoka has no Cyrillic letters, so every font stack now falls back to Nunito (which has ў қ ғ ҳ).
* **Progress is saved on the device, one profile per child** (`js/store.js`, localStorage). A profile has a name, an animal avatar, points and, per book, the last page, the answers to page questions, `finished` and `quiz`.
  * New profiles start at 0 points (the old hard-coded 150 is gone). A book's final quiz pays its 50 points only once.
  * The library cards show a progress bar for half-read books and stars for finished ones. The hero button turns into "Davom ettirish" and jumps straight back to the page, and the title page of a half-read book offers the same.
  * The header button (avatar and name) opens "Kim o'qiyapti?" to switch, add, rename or delete a child.
  * `BookEngine.load(key, story, record)` now takes the reading record instead of keeping answers in memory; `BookEngine.score()` gives the stars for both the finale page and the library.
* **The "AI Ovoz" button is removed.** It showed a message about reading aloud, but played nothing. Narration by a native speaker is Phase 1 of the roadmap.

### Current file structure
```text
index.html              # shell: header, library, story view, quiz, modals
css/book.css            # book, covers, pages, turning sheet, phone layout
css/art.css             # illustration animations
js/art/*.js             # illustration engine (see section 7)
js/stories-folk.js      # O'zbek xalq ertaklari
js/stories-classic.js   # classic, Navoiy and modern books
js/translit.js          # Uzbek Latin -> Cyrillic + page-wide script switch
js/store.js             # profiles, points and reading progress (localStorage)
js/book.js              # BookEngine (paging, drag, cover, mobile slide)
js/app.js               # AppController (library, profiles, controls, sound, quiz)
tests/translit.test.js  # spelling checks: node tests/translit.test.js
ROADMAP.md              # plan for Uzbek kids in Korea
```

### Still open
* Issue C: dual-mode `page.imageUrl` artwork with SVG fallback.
* Issue D: narration, now planned as recordings by a native speaker (ROADMAP Phase 1).
* The page still loads Tailwind, Google Fonts and Font Awesome from CDNs; they must be bundled before the app can work offline.

---

## 9. Update: Read-Along Narration and the Recording Studio (Roadmap Phase 1, step 1)

Resolves Issue D, with recorded human voices instead of computer TTS.

### Listening (`js/narrator.js` — `ReadAlong`, `Player`)
* A story page is read as **pieces**: its title, then each sentence (`BookEngine.segments(page)`).
  * `BookEngine.sentences(text)` splits on `. ! ? …`, but keeps «quoted speech» whole and carries on after a dash or a small letter. So `«Salom!» — debdi.` is one sentence, while `«…kel!» Chol…` is two.
  * The text page renders the title as `h2[data-seg="0"]` and each sentence as `span.sent[data-seg]`. Tapping one plays just that sentence (`data-action="say"`).
* The "Tinglash" button appears in the bottom bar once someone has read the book. It plays the page on screen and puts `.is-reading` on the piece being read (checked every frame, so it survives redraws).
  * When a page ends, it turns the page. At an unanswered question it waits, and continues after the right answer (`reader.onAnswer`).
  * It stops at a page nobody has read yet, and at the end of the book.
  * Pressing it on the cover or title page opens the book at page 1.
* A clip is `{ voice, book, page, blob | src, mime, duration, marks, sig }`. `marks[i]` is the second where piece *i* starts; `marks[0]` is always 0.
  * `sig` fingerprints the text the clip was read from. If the page text changes later, the audio still plays but nothing is highlighted.
* When a book has several voices, a face button next to "Tinglash" switches between them (remembered in `settings.voice`).

### Finding where each sentence starts (`Narrator.marks`)
Nobody marks sentence starts by hand. After a page is recorded:
1. Its loudness is measured in 20 ms frames.
2. Voice is anything well above the quietest frames and within 22 dB of the loudest. This keeps out room noise that gets through before the phone's noise filter settles; the first and last real voice must last at least 0.1 s, which ignores screen taps.
3. Silences of 0.12 s or more inside the speech are candidate pauses.
4. An evenly paced reader would reach each sentence at a time proportional to its text length. A small dynamic program then picks one pause per sentence break, in order, trading pause length against distance from that expected time. A long comma pause in the wrong place loses.

`tests/narration.test.js` covers clean reading, misleading comma pauses, a reader who never pauses, silence, and room noise plus taps. In the browser, a fake microphone reading a page gave marks within 0.03 s of the true starts.

### Recording studio (`js/studio.js`, `css/studio.css`)
* Opened from "Ovoz yozish" in the story bar, behind a grown-ups gate: a random `a × b` sum, remembered for 15 minutes.
* "Kimning ovozi?" chooses or creates a voice (name + avatar), receives a pack file ("Fayldan qo'shish"), and can send or delete a voice.
* The studio shows the page picture, the title and numbered sentences, and a big record button whose ring follows the voice. Space starts and stops recording.
  * After recording, "Tinglab ko'rish" plays the page back with highlighting.
  * Page dots turn green when a page is recorded.
  * "Yuborish" shares the book's recordings as one file.
* Recording uses MediaRecorder at 48 kbps. It prefers AAC in MP4 (Safari/iPhone; plays everywhere), then WebM/Opus. Echo cancellation, noise suppression and auto gain are on. A page is limited to 3 minutes.

### Storage and sharing (`js/voices.js`, `audio/narration.js`, `tools/import-narration.js`)
* Family voices and clips live in IndexedDB (`ertaklar-olami-ovoz`: stores `voices`, `clips` keyed `[voice, book, page]`). `navigator.storage.persist()` is requested so the browser keeps them.
* A **voice pack** is JSON: `{ format: 'ertaklar-ovoz', version: 1, voice, clips: [{ book, page, mime, duration, marks, sig, audio: base64 }] }`.
  * It is JSON rather than ZIP because Android's share sheet (Web Share with files) accepts `.json` and refuses `.zip`, so "Yuborish" can hand it straight to Telegram. Browsers without file sharing download it instead.
* **Built-in narration** is listed in `audio/narration.js` (`window.narrationData.voices[].books[book][page] = { src, mime, duration, marks, sig }`).
  * `node tools/import-narration.js pack.json --id hikoyachi` writes the audio under `audio/<id>/<book>/NN.<ext>` and rewrites that list.
  * It only accepts books and pages that exist, so a pack can't write outside `audio/`.

### Current file structure (additions)
```text
audio/narration.js         # built-in narration list (empty until the narrator's recordings arrive)
css/studio.css             # recording studio
js/voices.js               # voices + clips: IndexedDB, built-in list, voice packs
js/narrator.js             # sentence timing, Player, ReadAlong, Recorder
js/studio.js               # recording studio, voice manager, grown-ups gate
tools/import-narration.js  # add a narrator's pack to audio/
tests/narration.test.js    # node tests/narration.test.js
```

### Still open
* The narrator's recordings: record in the studio (ideally on an iPhone), send the `.json`, then run the import tool.
* Hosting (GitHub Pages), so grandparents can open the link; offline/PWA; bundling the CDN styles and fonts.
* Issue C (`page.imageUrl` artwork) as before.
