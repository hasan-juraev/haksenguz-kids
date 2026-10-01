# haksenguz-kids

**Ertaklar Olami** is an interactive 3D picture book of Uzbek folk tales for children, made for Uzbek kids growing up in Korea. You open the cover, turn pages by dragging their edge (or with the buttons or ← → keys), tap pictures to make the characters move, and answer questions as you read. Each child in the family has a profile that remembers their points and where they stopped reading, and all text can be shown in Uzbek Latin or Cyrillic.

Books can be read aloud with each sentence lit up as it is read. A grown-up records the reading in the app's recording studio ("Ovoz yozish"). A grandparent can record a book on their phone and send it to the family on Telegram as one file.

A Korean helper supports children who read Korean best. Tapping an underlined word shows its Korean meaning, and a 🇰🇷 button shows a page's sentences in Korean under the Uzbek. The 한국어 option puts the app's menus in Korean for Korean-speaking parents and teachers, while the stories stay in Uzbek. For now the helper covers *Zumrad va Qimmat*, *Oltin tarvuz*, *Hungbu va Nolbu* and the "Koreyadagi hayotim" books.

For children who read Korean letters first, the 가 button on any page shows the Uzbek in Hangul, the way it sounds (*Assalomu alaykum* → 앗살로무 알라이쿰). The *Alifbo* book has one page per letter of the Uzbek alphabet, with a picture, and the child can trace each letter with a finger.

Every new word a child meets in a book goes into their own dictionary, *Mening lug'atim*, as a picture card with its Korean meaning. It has three games: hear a word and find its picture, match Uzbek words to Korean, and build a word from its letters.

Every book takes the child somewhere: to one of Uzbekistan's 14 regions, or to Korea. Finishing a book stamps that place in the child's passport (*Pasportim*). Its map of Uzbekistan colours each place visited, and each place has a card with a true fact about it. Points buy each place's stickers (Registon, the Kalta minor, a Chust do'ppi, the Tashkent metro...) for the passport's album.

The library has shelves by age (4–6, 7–8, 9+); a child's profile can have an age, which opens their shelf.

"Ikki xalq — bir ertak": finishing *Oltin tarvuz* opens its Korean twin, 흥부와 놀부 retold in Uzbek as *Hungbu va Nolbu*, which ends with a game of finding what the two tales share and where they differ.

On the "Koreyadagi hayotim" shelf (my life in Korea), Uzbek children live in today's Korea:
- Asal teaches her Korean classmates what her name means.
- Bobur takes osh to the neighbour, who sends the dish back full of tteok.
- Malika video-calls her grandmother in Samarkand.

The "Bayramlar" shelf has holiday stories that pair an Uzbek holiday with a Korean one: Hangul kuni with O'zbek tili bayrami, and Seollal with Navro'z. A holiday book's card shows its next date. In the three weeks before a holiday, the banner offers its story.

Navoiy's *Farhod va Shirin* and *Lison ut-tayr*, and Qodiriy's *O'tkan kunlar*, are retold for children over 8–9 illustrated pages, next to the app's own modern tales.

Any picture can become a colouring page (🎨) to colour on screen, save or print, and each book ends with a game of putting the story's pictures in order (🧩).

The app can be installed on a phone's home screen and works offline after the first visit; a book's built-in narration can be saved for offline listening with ⬇️. "Ulashish" shares it, or a single book, to Telegram or KakaoTalk; a link ending in `#zumrad` opens that book.

Open `index.html` in a browser; no build step is needed (recording and offline use need `https://` or `localhost`). See `uzbek_kids_platform_claude_guide.md` for the architecture and how stories, illustrations and narration work, and `ROADMAP.md` for what comes next.

- **Tests:** `npm test` checks the Latin → Cyrillic spelling, the sentence timing for read-along, that every book is complete (pages, pictures, questions, ages), that the Korean lines up with the Uzbek, and that the built styles, fonts and icons match the code. The individual files in `tests/` also run with plain `node`.
- **After adding Tailwind classes, icons or Korean text:** run `npm install` once, then `npm run build`. This rebuilds `css/tailwind.css`, the icon font and the font files; commit the results.
- **Checking the Korean:** `node tools/korean-review.js > korean-review.csv` makes a side-by-side Uzbek–Korean table for a bilingual reviewer.
- **Adding a narrator's recordings to the app:** `node tools/import-narration.js <voice-pack.json>`.
