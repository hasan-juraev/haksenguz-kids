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
* Offline/PWA and bundling the CDN styles and fonts. (Hosting is done: Netlify publishes `main` and builds a preview for every pull request.)
* Issue C (`page.imageUrl` artwork) as before.

---

## 10. Update: No CDNs, Offline, Installable, Sharing (Roadmap Phase 1, step 3)

The guideline in section 6 ("Zero External CSS/JS Dependencies") now holds: the page loads nothing from other sites.

### Built files (`tools/build-assets.js`, run with `npm run build` after `npm install`)
The generated files are committed, so the site still needs no build step. Rebuild when you add Tailwind classes or icons; `npm test` fails if you forget.
* **`css/tailwind.css`** is built by the Tailwind CLI from `index.html` and `js/**/*.js`, using `tailwind.config.js` (the old inline config: brand/fairy colours and font families) and `css/tailwind.src.css`. It is about 27 KB and replaces the ~350 KB development CDN that built the styles on every visit. It is loaded *before* `book.css`, the order the CDN effectively had, so the app's own rules win ties.
* **`css/icons.css` + `fonts/icons.woff2`**: the build scans the code for `fa-*` icon names and cuts a font with only those Font Awesome Free (solid) icons, about 2.5 KB. An unknown icon name stops the build. Only solid icons are available.
* **`css/fonts.css` + `fonts/*.woff2`**: Fredoka (Latin) and Nunito (Latin + Cyrillic) variable fonts from Fontsource, split by alphabet with `unicode-range`, so a page loads only the files it needs, and a Korean font (section 11). Licences are in `fonts/LICENSE-*.txt` (OFL; Font Awesome icons CC BY 4.0).
* **`tests/assets.test.js`** checks that:
  * nothing loads from other sites;
  * every file `index.html` refers to exists;
  * every icon used is built;
  * the fonts, manifest and service worker are present;
  * after `npm install`, `css/tailwind.css` is exactly what a fresh build gives.

### Installable app
* `manifest.webmanifest`: name "Ertaklar", standalone display, icons in `icons/`.
  * The PNGs are rendered from `icons/icon.svg`: the header logo, i.e. Font Awesome's book on the orange gradient. There is a maskable version and a full-bleed apple-touch icon.
* "Telefonga o'rnatish" in the banner:
  * Android/Chrome: appears when the browser fires `beforeinstallprompt`, and opens its prompt.
  * iPhone/iPad: always shown (outside the installed app), and explains Safari's Share → Add to Home Screen (공유 → 홈 화면에 추가).

### Offline (`sw.js`)
* Every request for the app's own files goes to the network first. After 4 s, or when offline, a kept copy is used, so updates reach users on their next visit.
* After loading, the page sends the worker the list of files it used, plus every font in `css/fonts.css` (Cyrillic and Korean too, needed or not), so all of them are kept on the first visit.
* Audio files are left to the browser: playback asks for parts of a file, and serving a kept whole file breaks playback on iPhones. Family recordings live in IndexedDB and work offline; built-in narration does too once a book is saved with ⬇️ (section 14).
* The worker only registers over http(s), not from `file://`.

### Sharing and book links
* "Ulashish" (banner) and "📤 Ulashish" (a book's last page) use the Web Share API, i.e. the phone's share sheet with Telegram and KakaoTalk. Without it, the link is copied.
* An open book is in the address (`…/#zumrad`, via `history.replaceState`), so a shared link or a reload opens that book. `hashchange` is handled too.

### Current file structure (additions)
```text
package.json, package-lock.json  # build tools only (Tailwind CLI, Font Awesome, Fontsource, subset-font)
tailwind.config.js               # Tailwind theme (was inline in index.html)
css/tailwind.src.css             # -> css/tailwind.css (built)
css/icons.css, css/fonts.css     # built
fonts/                           # built font files + licences
icons/                           # app icons (icon.svg + rendered PNGs)
manifest.webmanifest             # installable app
sw.js                            # offline support
tools/build-assets.js            # npm run build
tests/assets.test.js             # part of npm test
```

### Still open
* Nothing from this step; built-in narration offline is in section 14.

## 11. Update: Korean Helper and Korean Menus (Roadmap Phase 1, step 2)

Korean supports the Uzbek text and never replaces it: story text is always shown in Uzbek, and its Korean appears only when asked for.

### Korean text (`js/stories-ko.js`)
* `window.storiesKorean[key]` holds a book's Korean: `title`, `tag`, `moral`, `quiz` (`[question, ...answers]`), `words` and `pages`.
* `pages[i].s` is the page title, then each sentence, in the order `BookEngine.segments(page)` splits the Uzbek, so the Korean lines up sentence by sentence. `pages[i].q` is the page question, then its answers in the Uzbek order.
* `words`: `[term, Korean meaning, forms]`. A form matches words in the text that start with it (`sandiq` → `sandiqni`); `=in` matches only that exact word, for short words.
* `reviewed: false` until the bilingual reviewer has checked the book.
* So far *Zumrad va Qimmat*, *Oltin tarvuz*, *Hungbu va Nolbu* and the three "Koreyadagi hayotim" books. The Korean is told the way picture books are read aloud (…했대요). Names are spelled by their Uzbek sounds (Zumrad → 줌라드, Qimmat → 킴마트); greetings keep the Uzbek with the meaning in brackets.

### In the book (`js/book.js`, `js/app.js`)
* **🇰🇷 button:** on a text page (next to the page number), on the moral on the last page, and in the quiz header. It shows the Korean under each Uzbek sentence, the question and its answers. It turns off when the page changes (`koView`).
* **Tap a word:** `glossHTML` wraps glossary words in `.gloss` spans (dotted green underline). Tapping one opens `#glossCard` with the Korean meaning. 🔊 says it with `speechSynthesis` (`ko-KR`). The card closes on a tap elsewhere, Escape, a page turn or leaving the book.
* The "Yangi so'z" card shows the Korean meaning too while 🇰🇷 is on.
* Elements that are always Korean carry `lang="ko"`.

### Korean menus (`js/i18n.js`, `js/translit.js`)
* The header switch has three options: Lotin, Кирилл, 한국어. `js/store.js` keeps `settings.lang` (`uz`/`ko`) and `settings.script` (`lat`/`cyr`); in Korean mode Uzbek is shown in Latin.
* `I18n.translate(text, 'ko')`: `EXACT` maps a whole UI text to Korean; `PATTERNS` handle texts with numbers or names, each with an example of the Uzbek. Unknown texts stay as they are.
* It runs in the display layer that already shows Cyrillic: text nodes and `title`/`aria-label`/`placeholder`/`alt` are converted when shown, the originals are kept, and switching back restores them. The page title is converted too.
* **`data-content`** marks story content (titles, text, questions, answers, names, the moral). It is never translated, only shown in the chosen script. Anything new that shows story text needs this attribute.
* Native dialogs (`confirm`) and share texts don't pass through the page, so the app runs them through `app.tx()`.
* Praise words (Barakalla!, Ofarin!…) stay in Uzbek, because children learn them.
* Library cards show the Korean title under the Uzbek one when the book has Korean.

### Korean font
* Gowun Dodum (OFL), from `@expo-google-fonts/gowun-dodum`. `tools/build-assets.js` collects every Hangul letter in `index.html` and `js/` and cuts the font down to those: `fonts/gowun-dodum-ko.woff2`, about 50 KB, with the list in `fonts/gowun-dodum-ko.txt`.
* It comes after Fredoka and Nunito in the font stacks, since they have no Hangul. A letter missing from it falls back to the phone's own Korean font.
* **After adding Korean text, run `npm run build`**; `npm test` names any letters that are missing.

### Checking the Korean
* `node tools/korean-review.js > korean-review.csv` (or `… zumrad`, `… menu` for part of it) makes a table with one row per sentence, question, answer, word and menu text. Its columns are ID, place, Uzbek, Korean, and two empty ones for a fix and a note. It opens in Excel or Google Sheets.
* `tests/korean.test.js` (part of `npm test`) checks that:
  * every book's Korean lines up with its pages, sentences, questions and quiz;
  * all of it is Hangul, and every glossary word appears in its book;
  * the menu texts and every library genre have Korean, and each pattern's example gets that pattern's Korean;
  * the Korean font has every letter used;
  * every row of the review table has Korean.

### Adding Korean for another book
1. Add its entry to `js/stories-ko.js`, split the way `BookEngine.segments` splits the page. `node tests/korean.test.js` says which page is off.
2. Run `npm run build` for the font, then `npm test`.
3. Send `node tools/korean-review.js <key>` to the reviewer, apply the fixes, and set `reviewed: true`.

### Current file structure (additions)
```text
js/stories-ko.js         # Korean for books: helper text, words, quiz
js/i18n.js               # Korean menus
tools/korean-review.js   # side-by-side table for the reviewer
tests/korean.test.js     # part of npm test
fonts/gowun-dodum-ko.*   # built Korean font + the letters in it
```

### Still open
* The reviewer's corrections for the two books.
* Korean for the other 21 books.

## 12. Update: Play Corner (Roadmap item 13)

### Colouring page (`js/games.js` → `Games.color`, `css/play.css`)
* The 🎨 button on every picture (and on the "Tamom!" picture) opens that page's scene as a colouring page. The scene is rendered again in daylight, with no weather or vignette (`Art.render(scene, { coloring: true })`), and then turned into line art (`Games.toLineArt`):
  * The engine's outline colour and near-black details (eyes, dark hats) stay. Every other filled or thick-stroked shape turns white and remembers whether a tap paints its fill or its stroke (`data-c`). Soft shading, blush and glows disappear.
  * Shapes the engine draws without an outline (clouds, hills, mountains, sparkles) get an ink rim from an SVG filter. Runs of same-coloured outline-less shapes, such as a treeline's circles, are grouped so they read and fill as one area. `blob()` in `js/art/core.js` puts a crown's or cloud's circles in one `<g class="fg">` for the same reason.
* 13 colours and an eraser, undo, clear, **save as PNG**, and **print** (a page with the picture and its heading, blank or as coloured so far, for community classes).
* Painting plays the chime; read-along stops while the page is open.

### Story-order game (`Games.order`)
* **🧩 Voqealar tartibi** on the last spread shows four pictures from the story: the first page, the last page and two in between, shuffled. The child taps them in the order they happened. A wrong tap shakes the card, and after two misses the right card pulses as a hint.
* The first win per book and child gives +30 points (`record.order` in `js/store.js`, like `record.quiz`).

### Notes
* Both open in `#playModal`. While it is open, the arrow keys don't turn the book's pages; Escape or ✕ closes it.
* The Cyrillic and 한국어 switches cover both: the page-wide display layer in `js/translit.js` converts the window's text as it is drawn, and `js/i18n.js` has the Korean for its buttons and messages. Story text in it (the page title in the colouring heading, the order cards' captions) is marked `data-content`, so it stays Uzbek. The printed heading is taken as shown, so it prints in Cyrillic, or with the Korean word for "colouring", when those are on.
* Neither uses a computer voice, in line with the narration decision in `ROADMAP.md`.

## 13. Update: Reading Levels (Roadmap Phase 1, item 4)

### Ages and shelves (`js/levels.js`)
* Every book has `age: [youngest, oldest]`: from a grown-up reading it with the child, to the child reading it alone. The current values are a first estimate from sentence length, vocabulary and theme. The folk tales mostly suit 4–8, Afandi and *Donishmand qiz* 7–10, and Navoiy and Qodiriy 9–12.
* The library has three shelves: `4-6`, `7-8` and `9+`. A book stands on every shelf its ages touch (`Levels.fits`), so a 5–8 book is on both 4–6 and 7–8.
* `Levels.shelfFor(age)` gives a child's shelf. Children under 4 use the 4–6 shelf.

### In the app (`js/app.js`, `js/store.js`)
* A profile may have an `age` (the form offers 4 to 11+, and tapping the chosen age again clears it). `Store.updateProfile` keeps only believable ages, from 2 to 18.
* Choosing a child opens their shelf, marked with their face. "Barcha yoshlar" shows every book. The category counts and the heading count the books on the chosen shelf. A category with no book for that age shows a message with "Barcha kitoblarni ko'rsatish".
* With no book in progress, the banner suggests the first book on the child's shelf that they haven't finished (`suggestedBook`).
* Cards and title pages show a book's ages ("5–8 yosh"); in Korean, "5~8세".

### Tests
* `tests/stories.test.js` (part of `npm test`) checks every book: its key, title, category and age range, at least three pages with a title, text and picture, and questions and quizzes whose right answer exists. It also checks the shelf rules, and that each shelf has at least five books. Run it after adding or lengthening books.

## 14. Update: Built-in Narration Offline

* For a book with built-in narration (`audio/narration.js`), a ⬇️ button appears next to "Tinglash". It downloads the book's recordings and saves them in IndexedDB, next to the family recordings, keyed by the built-in voice (`Voices.saveBook`). It shows progress (3/12), then ✅. Tapping ✅ removes the saved copies after asking (`Voices.unsaveBook`).
* `Voices.clip` gives a built-in clip its saved audio when there is a copy of that same recording (same file and length), so it plays without internet. A re-recorded page is downloaded again.
* `sw.js` no longer keeps audio files, so a downloaded recording isn't stored twice. Playback still goes straight to the network as before.
* An audio file that fails to load now ends the clip (`Player` listens for `error`). If the phone is offline, read-along says to save the book with ⬇️ first.
* Nothing changes until the narrator's recordings are imported, because no book has built-in narration yet.

## 15. Update: Ikki xalq — bir ertak, Korean Twin Tales (Roadmap Phase 2, item 5)

### Twin tales (`js/stories-twins.js`)
* A Korean folk tale retold in Uzbek, with the usual book fields plus:
  * `twin`: the Uzbek tale it pairs with (`hungbu_nolbu` → `oltin_tarvuz`);
  * `compare`: `{ icons: [uzbek tale, korean tale], cards: [[emoji, text, 'uz' | 'ko' | 'both'], ...] }`.
* Category `twins`, the shelf "🇰🇷 Ikki xalq — bir ertak".
* The first one is *Hungbu va Nolbu* (흥부와 놀부): 12 pages, 5 questions, word cards for the Korean words (*choga*, *bak*, *dokkebi*), and the Korean helper in `js/stories-ko.js`.

### Locked until the Uzbek tale is read (`js/app.js`)
* `isLocked(key)`: a twin opens once the active child has finished its Uzbek tale. Locked cards show 🔒 and "«Oltin Tarvuz»ni o'qib tugating". Tapping one explains this, and the banner never suggests a locked book. A shared link still opens it, for grown-ups.
* The first time the Uzbek tale is finished, a toast says the twin is open. That tale's last page shows "🇰🇷 Egizak ertak ochildi!" with the twin's title (`data-action="twin"`).

### Find the differences (`Games.compare` in `js/games.js`, `css/play.css`)
* On the twin's last page, "🔍 Farqlarni toping" opens the game in `#playModal`. The two covers are on top, then one card at a time with three answers: only in the Uzbek tale, in both, only in the Korean one.
* A right answer moves the card into a three-column table, so the finished game shows what the tales share and where they differ. A wrong answer shakes the card.
* The first win per child and book gives +30 points (`record.compare` in `js/store.js`).
* Card words are story content (`data-content`) and stay Uzbek in Korean mode; the game's buttons and messages are in `js/i18n.js`.

### Korean pictures (`js/art/world.js`, `js/art/people.js`)
* Backgrounds `kvillage` (soft green mountains with pines, distant straw roofs) and `kyard`, a madang inside an earthen wall capped with straw, or with tiles when the scene has `wall: 'tile'`.
* `chogajip` (straw roof, hanji doors, maru porch; options `gourds`, `glow`, `nest`, `lit`), `giwajip` (tiled roof with upturned eaves, on a stone terrace), `gourd` (whole, or `open: 'gold' | 'rice' | 'smoke'`), `saw` (also as a held item), `onggi` jars.
* People: outfits `hanbok` (jeogori and wide baji tied at the ankle), `durumagi` (long coat) and `chima` (short jeogori over a long skirt; `jacket` colour). All have the dark collar band, white dongjeong and goreum ribbon. `saekdong: true` gives a child rainbow sleeves.
* Heads: `gat` (horsehair hat), `sangtu` (topknot with headband), `jjok` (bun with a binyeo pin) and `daenggi` (braid with a ribbon).
* Cast presets: `hungbu`, `hungbuxotin`, `nolbu`, `nolbuxotin`, `hkid1`–`hkid3`, and the goblins `dokkebi` and `dokkebi2`, which are the `dev` part recoloured, with its club.

### Adding the next twin
1. Write the tale in `js/stories-twins.js` with `twin` and `compare`. The Uzbek tale needs no change; it finds its twin.
2. Add its Korean to `js/stories-ko.js`, then run `npm run build` (font) and `npm test`. `tests/stories.test.js` checks the twin and the cards.

## 16. Update: Koreyadagi hayotim, My Life in Korea (Roadmap Phase 2, item 6)

### Stories (`js/stories-korea.js`)
* Category `korea`, the shelf "🏙️ Koreyadagi hayotim" (한국에서의 내 생활 in Korean mode).
* The stories:
  * *Mening ismim — Asal* (`asal_ismi`, ages 5–8)
  * *Osh va tteok* (`osh_tteok`, ages 4–7)
  * *Buvijon bilan videoqo'ng'iroq* (`buvijon_qongiroq`, ages 4–7)
* They are everyday stories, so they use the plain past tense (-di), not the fairy-tale -ibdi.
* Korean words in them have word cards. All three have their Korean in `js/stories-ko.js`.

### Today's Korea in pictures (`js/art/world.js`, `js/art/people.js`)
* Backgrounds:
  * `seoul`: apartment blocks (apateu) with numbered gables, trees and a paved square.
  * `flat`: a living room with a big window onto the blocks. Options: `windowX`; `clock: false` hides the clock.
  * `classroom`: a chalkboard, a window and a clock. `board: ['안녕하세요', ...]` writes lines in chalk; Hangul uses the Korean font.
  * `hall`: an apartment landing with the lift.
    * The floor number is `floor`, 12 unless given. It shows on the lift and on a "12F" sign; `lift: x` moves the lift and `lift: false` removes it.
    * Front doors are `door` items standing on the wall line at y 236, so people stand in front of them.
* Items:
  * `school`, `desk` (`book: true` opens a book on it), `drawing` and `slide`.
  * `table`: a low table at home. Things on it stand at y −42 from its base, e.g. a `tablet` at y 260 on a table at 302.
  * `tablet` on a stand, video-calling: `show: 'buvi' | 'apricot'`, with her `mood`.
  * `door`, a flat's front door: `no`, `color`, a keypad lock, and `open: true`, which swings it open onto the lit flat.
  * Food: `lagan` (osh), `tteok`, `kimbap`, `somsa`, `honey` and `kimchi`. Children can also hold `osh` and `tteok` (`pose: 'hold', hold: 'osh'`).
* People:
  * Heads `modern`, `ponytail`, `bob` and `perm` (a halmeoni's perm), and `glasses: true`.
  * Cast presets: `asal`, `malika` and `bobur` (Uzbek children); `minjun`, `seoyeon` and `jiho` (classmates); `kimteacher`, `halmeoni` (the neighbour) and `dada`.

### Adding a story
1. Write it in `js/stories-korea.js` with `category: "korea"` and an `age`.
2. For the Korean helper, add its Korean to `js/stories-ko.js`, then run `npm run build` (font) and `npm test`.

## 17. Update: Bayramlar, the Holiday Shelf (Roadmap Phase 2, item 7)

### When holidays come (`js/holidays.js`)
* `Holidays.DAYS` lists each holiday: its `name`, its `date` as `[month, day]` and the calendar `cal` it is counted in.
  * Fixed days use the ordinary calendar: Navro'z, Hangul kuni, O'zbek tili bayrami, both Children's Days and Mustaqillik kuni.
  * Seollal and Chusok use the Korean lunar calendar (`'dangi'`).
  * Ramazon and Qurbon hayiti use the Islamic one (`'islamic-umalqura'`).
  * `long: 1` means the day after still counts: Seollal and Chusok are three days off in Korea.
* For the moving holidays, the browser's own `Intl` calendars find the next day the calendar reads that month and day. Nothing needs updating each year.
  * Hayit is announced in Uzbekistan and can fall a day either side of this date.
  * A browser without these calendars gets no date, rather than a wrong one.
* The functions:
  * `next(id, today)`: the holiday's next date.
  * `upcoming(story)`: the book's first holiday, as `{ id, name, date, days }`.
  * `soon(story)`: the same, but only from 21 days (`SOON`) before the holiday until it is over.
  * `when(days)`: the banner's words, e.g. "🎉 8 kundan keyin bayram:".
  * `dateLabel(date)`: "9-oktabr".

### Stories (`js/stories-holiday.js`)
* Category `holiday`, the shelf "🎉 Bayramlar" (명절과 기념일).
* A book names its days in `holidays: ['hangul', 'uztili']`. `tests/stories.test.js` checks that only holiday books have them, and that each id is in `Holidays.DAYS`.
* *Harflar bayrami* (`harflar_bayrami`, 5–8) and *Ikki Yangi yil* (`ikki_yangi_yil`, 4–8). They reuse the children of "Koreyadagi hayotim" (Asal, Bobur, Kim buvi), and both have Korean in `js/stories-ko.js`.

### In the app (`js/app.js`, `index.html`)
* Library cards of holiday books show "🎉 9-oktabr" (`holidayChip`); the holiday's name is the chip's `title`.
* `suggestedBook()` offers a holiday's book first while its holiday is `soon`, as long as the book suits the child's age and they haven't finished it. `#heroHoliday` in the banner then says which holiday it is.
* Korean menus: the holiday names and the banner's words are in `js/i18n.js`, e.g. "🎉 8일 뒤는 한글날". A pattern turns "🎉 9-oktabr" into "🎉 10월 9일".

### Pictures (`js/art/world.js`, `js/art/people.js`)
* `sejong`: King Sejong's golden statue on its pedestal, seated with a book. He wears the `ikseon` head: the king's hat with two wings standing up behind.
* `paper`: a sheet of handwriting, one line per item of `lines`. `keep: true` keeps each line as written in every script, so "Ўзбек" and "O'zbek" stay side by side.
* Food on a table: `tteokguk` (New Year soup), `sumalak` in a blue cotton-pattern kosa (`stone: true` adds the lucky pebble), and `maysa`, a plate of wheat sprouts.
* `yut`: yut sticks over the mat. `air: true` shows them mid-throw.
* People can kneel or sit on the floor with `noLegs: true`. `rot` leans the whole figure, e.g. for a bow.

### Text
* A page that opens with a number ("9-oktabr — ...") has no big first letter (`.no-cap` in `css/book.css`), so the number stays with its word.
* SVG text collapses spaces, so chalkboard lines are one idea each: "ㅁ = og'iz".

### Tests
* `tests/holidays.test.js` covers:
  * fixed days, and the next year's once a day has passed;
  * Seollal and Chusok for 2026–2028, as published in Korea;
  * Hayit to within a day;
  * which of a book's holidays comes first, the three-week window and the three-day Seollal;
  * a browser without lunar calendars.

