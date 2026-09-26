# Roadmap: Ertaklar Olami for Uzbek kids in Korea

The book is for Uzbek children growing up in Korea. For most of them Korean is
the language they read best, Uzbek is the language of home, and their
grandparents are far away. This plan adds what that situation needs, on top of
the 3D book, the illustration engine and the 23 books that already exist.

**Guiding principle:** the child still reads in Uzbek, and Korean only helps.
A Korean hint should help them understand an Uzbek sentence, not let them skip
reading it.

## Decisions so far

| Question | Decision |
|---|---|
| Ages | Both groups: 4–6 (listening first) and 7–10 (help with reading) |
| Narration | A native Uzbek speaker will record it in the app's recording studio. No computer voices. |
| Korean translations | Claude drafts them; a bilingual Uzbek–Korean reviewer checks every page |
| Russian | Not in scope. The Cyrillic switch is for Uzbek Cyrillic (for grandparents) |
| Accounts and servers | None. Everything stays on the device (see Privacy below) |

## Phase 0 — Quick fixes ✅ done

- **Lotin ↔ Кирилл switch converts all text.** Rule-based, in `js/translit.js`,
  with tests in `tests/translit.test.js`.
- **Progress is saved, with a profile per child.** Points, answers, stars, last
  page and "Davom ettirish" (continue) live in `js/store.js` on the device.
- **The fake "AI Ovoz" button is gone.** It said a page was being read aloud,
  but nothing played. Real narration comes in Phase 1.

## Phase 1 — Core features for kids in Korea

1. **Listen in Uzbek, with each sentence highlighted.** ✅ Built; waiting for
   the narrator's recordings. This is the most important item for ages 4–6.
   - **Tinglash (Listen):** reads the page on screen and lights up each
     sentence as it's read, which also teaches ages 7–10 to read.
     - Turns the page by itself and waits at a question until the child
       answers it.
     - Tapping a sentence plays just that sentence.
     - Highlighting is per sentence. Lighting up single words would need
       Uzbek speech recognition.
   - **Ovoz yozish (the recording studio)** is for grown-ups, behind a small
     sum. Read a page, and the app finds where each sentence starts from the
     pauses.
   - **"Buvijon o'qib bersin" (let grandma read it):** a grandparent records a
     book on their phone and taps "Yuborish". The whole book becomes one
     `.json` file for Telegram. The family in Korea adds it with "Fayldan
     qo'shish". Recordings stay on the device.
   - **Built-in narration.** The narrator uses the same studio and sends the
     `.json` file. `node tools/import-narration.js <file>` adds it to
     `audio/`, so every copy of the app can read those pages.
   - **Record on an iPhone if possible.** Its recordings (AAC) play on every
     phone. Android and computer recordings are WebM/Opus, which older iPhones
     may not play.
   - **Works on the Netlify site** (https, which phones require for the
     microphone), so a grandparent only needs the link.
2. **Korean helper.**
   - Tap a word to see its Korean meaning (extends the "Yangi so'z" card).
   - A 🇰🇷 button shows a sentence's Korean translation, only when asked.
   - Korean text-to-speech already works on almost every phone, so Korean audio
     is free.
   - A 한국어 option for the menus, for Korean parents in multicultural families
     (다문화 가정) and for teachers.
   - It also works the other way: children who recently arrived from Uzbekistan
     (중도입국) can learn Korean from tales they already know.
   - Needs a rounded Korean font such as Jua, because Fredoka and Nunito have no
     Hangul.
3. **Online and offline.**
   - ✅ Hosted on Netlify: `main` is the live site, and every pull request
     gets its own preview link.
   - Make it installable on the home screen and usable offline.
   - Stop loading styles from CDNs: `cdn.tailwindcss.com` is development-only,
     and fonts and icons should ship with the app.
   - Add a Share button for Telegram and KakaoTalk.
4. **Reading levels.** Tag books by age and level so the library can show a
   4-year-old and a 9-year-old the right shelf.

## Phase 2 — Stories that connect both worlds

5. **"Ikki xalq — bir ertak / 두 나라, 한 이야기" (two peoples, one tale).**
   After finishing a book, the child unlocks its Korean twin, retold in Uzbek,
   plus a "find the differences" page.

   | In the library | Korean twin | What they share |
   |---|---|---|
   | Oltin tarvuz | 흥부와 놀부 | Almost the same plot: a healed swallow, a magic seed, treasure; a greedy neighbour hurts a swallow and gets trouble; both end with forgiveness |
   | Zumrad va Qimmat | 콩쥐 팥쥐 | A kind, hardworking stepdaughter vs. a spoiled stepsister |
   | Ur, to'qmoq! | 도깨비 방망이 | A magic club, and greed punished ("Ur, to'qmoq!" ↔ "금 나와라 뚝딱!") |
   | Susambil | 팥죽 할멈과 호랑이 | Small helpers team up against a big bully |
   | Nasriddin Afandi | 봉이 김선달 | The clever trickster |

   The first one to build is 흥부와 놀부.
6. **New shelf: "Koreyadagi hayotim" (my life in Korea).** Uzbek children as
   heroes in Korean places:
   - first day at a Korean school
   - classmates who can't say my name (*Asal* means "honey")
   - palov for Korean neighbours, who bring tteok back
   - a video call with buvi in Samarkand
   - flying from Incheon to Tashkent
   - Navro'z in a Korean neighbourhood
   - two languages are a superpower

   New art needed: apartment, classroom, playground and Seoul backgrounds;
   plane, phone, backpack and bus; modern clothes and a hanbok; Korean foods.
   The best story ideas will come from real families.
7. **Holiday shelf.** Stories that fit the time of year:
   - Navro'z ↔ 설날
   - 추석 ↔ harvest time
   - 한글날 (Oct 9) ↔ O'zbek tili bayrami (Oct 21)
   - Children's Day: May 5 ↔ June 1
   - Hayit and Mustaqillik kuni
8. **Longer short books.** The 10 classic, Navoiy and modern books are 5 short
   pages each with no word cards.

## Phase 3 — Learning and play

9. **Alifbo book.** Uzbek letters, including O' G' Sh Ch Ng, one picture per
   letter from the art engine, and letter tracing. Beginners can turn on
   Korean-letter sound hints (*Assalomu alaykum* → 앗살로무 알라이쿰).
10. **Mening lug'atim (my dictionary).** New words become picture cards, with
    games: listen and pick, match Uzbek to Korean, build the word from letters.
11. **Culture passport and map of Uzbekistan.** Each book belongs to a region.
    Finishing it stamps the passport. Points buy stickers.
12. **Short pieces.** Riddles, proverbs, lullabies and tongue twisters. Folk
    material is free to use; modern authors need permission.
13. **Colouring mode.** ✅ Built. Any story picture becomes a colouring page,
    printable for community classes and multicultural lessons. The 🎨 on a
    picture opens it; colour on screen, save it as a picture, or print it
    blank. Also built: **Voqealar tartibi**, a game at the end of each book
    where four pictures from the story are put in order (+30 points once).
14. **Later:** bedtime mode, a character maker, "make your own story".

## Privacy

Korean law (PIPA) requires a guardian's consent to collect personal data from
children under 14. The app avoids the question entirely:
- No accounts and no server.
- Profiles, progress and voice recordings stay on the device (voice
  recordings in IndexedDB).
- Recordings leave the device only when a grown-up sends the file themselves.
- The recording studio sits behind a small sum, so children don't wander in.
