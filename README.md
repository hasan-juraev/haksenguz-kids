# haksenguz-kids

**Ertaklar Olami** is an interactive 3D picture book of Uzbek folk tales for children, made for Uzbek kids growing up in Korea. You open the cover, turn pages by dragging their edge (or with the buttons or ← → keys), tap pictures to make the characters move, and answer questions as you read. Each child in the family has a profile that remembers their points and where they stopped reading, and all text can be shown in Uzbek Latin or Cyrillic.

Books can be read aloud with each sentence lit up as it is read. A grown-up records the reading in the app's recording studio ("Ovoz yozish"). A grandparent can record a book on their phone and send it to the family on Telegram as one file.

The app can be installed on a phone's home screen and works offline after the first visit. "Ulashish" shares it, or a single book, to Telegram or KakaoTalk; a link ending in `#zumrad` opens that book.

Open `index.html` in a browser; no build step is needed (recording and offline use need `https://` or `localhost`). See `uzbek_kids_platform_claude_guide.md` for the architecture and how stories, illustrations and narration work, and `ROADMAP.md` for what comes next.

- **Tests:** `npm test` checks the Latin → Cyrillic spelling, the sentence timing for read-along, and that the built styles, fonts and icons match the code. The individual files in `tests/` also run with plain `node`.
- **After adding Tailwind classes or icons:** run `npm install` once, then `npm run build`. This rebuilds `css/tailwind.css`, the icon font and the font files; commit the results.
- **Adding a narrator's recordings to the app:** `node tools/import-narration.js <voice-pack.json>`.
