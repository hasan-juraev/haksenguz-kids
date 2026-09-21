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
