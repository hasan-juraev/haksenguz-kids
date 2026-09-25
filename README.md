# haksenguz-kids

**Ertaklar Olami** is an interactive 3D picture book of Uzbek folk tales for children, made for Uzbek kids growing up in Korea. You open the cover, turn pages by dragging their edge (or with the buttons or ← → keys), tap pictures to make the characters move, and answer questions as you read. Each child in the family has a profile that remembers their points and where they stopped reading, and all text can be shown in Uzbek Latin or Cyrillic.

Open `index.html` in a browser; no build step is needed. See `uzbek_kids_platform_claude_guide.md` for the architecture and how stories and their illustrations are described, and `ROADMAP.md` for what comes next.

Tests: `node tests/translit.test.js` (Latin → Cyrillic spelling).
