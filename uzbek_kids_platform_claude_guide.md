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

## 8. Update: Uzbek Read-Aloud, Family Voice, Play Corner, Saved Progress

### Read-aloud (Issue D)
* **▶ O'qib ber** in the story bar reads the open page aloud and highlights the sentence and the word being read. On the title page it carries on into the story. **🔁 Avto** turns the page after reading and waits while a question is unanswered. Space toggles reading. On phones the page scrolls with the reading, and a floating ▶/⏸ button appears once the story bar is out of view.
* Tap any word to hear it; the page's "Yangi so'z" is underlined in the text and has its own 🔊 button. Answers get spoken praise ("Juda to'g'ri!") or a gentle retry.
* For each page, read-aloud uses the best voice source it has:
  1. a **family recording** of that page (see below);
  2. a **narration file** listed in `audio/manifest.js` (for example generated with Azure, see below);
  3. the browser's own speech synthesis. A natural `uz-UZ` voice is preferred: Microsoft Edge offers the online natural voices **Madina** and **Sardor**. Without an Uzbek voice, a Kazakh, Azerbaijani, Kyrgyz, Turkish or Russian voice reads the text respelled in that language's alphabet (`Speech.respell`), and the reader shows a note suggesting Edge. With no voice at all, a friendly message appears instead.
* Browser voices are read sentence by sentence. Dialogue in «…» can use a livelier "character voice". Word highlighting follows the engine's word-boundary events, or an estimated pace when the engine sends none. Pause and resume are reliable because a paused sentence is restarted, and a watchdog covers engines that never fire `onend`. iOS speech is unlocked inside the tap.
* **⚙️ Ovoz** opens the settings: voice choice (ranked for Uzbek), speed (slow, normal, fast), character voices, auto-turn, spoken praise, a voice test, and the family-voice recorder. Settings are saved.
* The Issue D interface maps as follows: `ReadAloud.readCurrent()` plays a page, `Narrator.pause()` and `resume()`, `Narrator.speed` sets the rate, and `Narrator.play(parts)` accepts TTS text or audio files with highlight timing.

### Family voice (real human narration)
* In ⚙️ Ovoz, **🎙 N-sahifani yozish** records the current page in a parent's or grandparent's voice (up to 3 minutes per page). Recordings stay on the device in IndexedDB (`ertaklar-olami` / `recordings`, key `<story>:<view>`). They are never uploaded.
* Recorded pages play the recording instead of a synthetic voice, with sentence highlighting, and the read button shows 👵. A recording can be played, re-recorded or deleted from the panel.

### Neural narration files: `tools/generate-narration.mjs`
* This script synthesises every title page, story page, question and ending with Azure AI Speech's Uzbek neural voices (`uz-UZ-MadinaNeural`, default, or `uz-UZ-SardorNeural`). It writes `audio/<story>/vNN.mp3` and `vNNq.mp3`, plus `audio/manifest.js`. The site then plays these files on every browser, so no Uzbek voice is needed on the device.
  ```bash
  AZURE_SPEECH_KEY=<key> AZURE_SPEECH_REGION=<region> node tools/generate-narration.mjs
  node tools/generate-narration.mjs --dry-run            # what would be made; no key needed
  node tools/generate-narration.mjs --story zumrad --voice uz-UZ-SardorNeural
  ```
  * Options: `--rpm` (requests per minute; the default of 18 suits the free F0 tier's limit of about 20), `--rate` (default `-8%`), `--force`, `--out`, and `--ascii` (keep plain `'`; by default oʻ, gʻ and ʼ are sent).
* Each sentence is a separate request. The MP3 frames are then joined, and the manifest records every sentence's `[start, end]` in ms. The player uses these marks, so the highlight stays in step with the recorded voice.
* The whole library is 23 books: 260 files, about 1,030 sentences and 37,000 characters. That takes about an hour at the free tier's rate and produces roughly 15–20 MB of MP3. It is small next to the free tier's monthly character allowance (check current Azure pricing).
* Re-runs only synthesise pages whose text or voice settings changed. The manifest is saved after every page, so an interrupted run resumes where it stopped.
* To add your own studio recordings, put a plain path in the manifest (for example `"zumrad:3": "audio/studio/zumrad-3.mp3"`). The generator keeps such hand-made entries.
* No audio has been generated yet: this needs the project's own Azure key.

### Play corner
* **🎨** on every picture opens a **colouring page** made from that scene. The scene is drawn as line art: outlines stay, and areas become white and fillable. A tap fills an area, and tree crowns, clouds and wool fill as one piece. There are 13 colours and an eraser, plus undo, clear, and **save as PNG**.
* **🧩 Voqealar tartibi** on the last spread shows four pictures from the story to tap in the order they happened. Two wrong taps bring a hint, and completing it earns +30 points once per book.

### Saved progress
* `js/progress.js` stores points, and for each book the last page, finished state, stars, answers and games, plus the reader settings. They live in `localStorage` (`ertaklar-olami:v1`). The library shows badges ("📖 4 / 12 sahifa o'qildi", "✅ O'qildi ★★★"). Reopening a book offers **↪ N-sahifadan davom etish**, and points are never earned twice.

### New files
```text
css/reader.css               # read-aloud controls, highlights, panel, recorder, play corner
js/speech.js                 # sentence/word markup, Latin→Cyrillic, respelling, voice ranking
js/narrator.js               # speech/audio playback engine with highlight timing
js/reader.js                 # ReadAloud: page reading, auto mode, settings panel, recording UI
js/recorder.js               # FamilyVoice: microphone recording in IndexedDB
js/progress.js               # saved progress
js/games.js                  # colouring studio and story-order game
audio/manifest.js            # narration files (empty until generated)
tools/generate-narration.mjs # Azure neural narration generator (Node 18+, no dependencies)
```

### Testing notes
* Headless Chromium has no speech voices. Read-aloud was therefore tested with a scripted `speechSynthesis` stand-in: fake Madina, Sardor, Turkish and English voices with word-boundary events, plus "Turkish only" and "no voices" cases. Recording was tested with Chromium's fake microphone. The generator was tested against a local fake of the Azure endpoint, including throttling (429), resumed runs and changed pages, and its MP3 output was played back in Chromium with marks-driven highlighting.
* Real voices still need a check on devices: Edge on Windows, macOS or Android for Madina and Sardor, Chrome, and Safari on iOS.

### Still open
* Issue C: `page.imageUrl` artwork with SVG fallback is not implemented.
* The Lotin/Кирилл toggle still shows only a message. `Speech.toCyrillic` now exists and could be used to transliterate the pages.
