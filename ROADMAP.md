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
2. **Korean helper.** ✅ Built for *Zumrad va Qimmat*, *Oltin tarvuz*, *Hungbu
   va Nolbu* and the three "Koreyadagi hayotim" books; waiting for the
   reviewer.
   - **Tap a word:** words a child growing up in Korea may not know are
     underlined. Tapping one shows its Korean meaning, and 🔊 says it with the
     phone's own Korean voice (almost every phone has one).
   - **🇰🇷 on a page** shows the Korean of each sentence under the Uzbek, and of
     the question and its answers. It appears only when tapped and turns off on
     the next page, so the child reads the Uzbek first. The last page's moral,
     the "Yangi so'z" card and the quiz have it too.
   - **한국어 in the header** puts the menus, buttons and messages in Korean, for
     Korean parents in multicultural families (다문화 가정) and for teachers.
     The stories stay in Uzbek.
   - It also works the other way: children who recently arrived from Uzbekistan
     (중도입국) can learn Korean from tales they already know.
   - **Checking the Korean:** `node tools/korean-review.js > korean-review.csv`
     makes a table (Uzbek, Korean, a column for fixes) that opens in Excel or
     Google Sheets. A book is marked `reviewed` in `js/stories-ko.js` once
     checked.
   - Korean text uses Gowun Dodum, a rounded Korean font, cut down to the
     letters the app uses (about 50 KB), because Fredoka and Nunito have no
     Hangul.
   - Next: Korean for more books, a few at a time as reviews come back.
3. **Online and offline.** ✅ Done.
   - Hosted on Netlify: `main` is the live site, and every pull request gets
     its own preview link.
   - Nothing loads from CDNs any more. Styles, fonts (Latin + Cyrillic) and
     icons ship with the app (`npm run build`), and the page is far lighter
     on phones.
   - **Installable:** "Telefonga o'rnatish" uses Android's install prompt; on
     iPhone it explains Safari's "Add to Home Screen" (with the Korean menu
     name).
   - **Offline:** after one visit the app opens without internet, family
     recordings included. A book's built-in narration plays offline once
     saved with the ⬇️ next to "Tinglash".
   - **Sharing:** "Ulashish" shares the app or a book through the phone's
     share sheet (Telegram, KakaoTalk). A link ending in `#zumrad` opens that
     book.
4. **Reading levels.** ✅ Built.
   - Every book has an age range (`age: [5, 8]`), from being read to the
     child to reading it alone. It shows on the library cards and the book's
     title page.
   - The library has three shelves: 4–6 (listening first), 7–8 (starting to
     read) and 9+ (reading alone: Navoiy, Qodiriy).
   - A child's profile can have an age. It opens their shelf, marked with
     their face, and "Kitobni Ochish" suggests the first unread book on it.
   - The ages are a first estimate from each book's sentences, words and
     theme; change them in the story files if a book feels too hard or too
     easy.

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

   ✅ **Built: Oltin tarvuz ↔ 흥부와 놀부 ("Hungbu va Nolbu").** A 12-page
   Uzbek retelling, with Korean pictures drawn by the art engine (straw-roofed
   choga, tiled giwajip, gourds on the roof, hanbok and gat, 도깨비 goblins).
   - It sits on its own shelf, "🇰🇷 Ikki xalq — bir ertak", locked until the
     child finishes *Oltin tarvuz*. That book's last page then announces and
     opens it.
   - Its last page has **🔍 Farqlarni toping**: the child sorts 12 cards into
     "only in Oltin tarvuz", "in both" or "only in Hungbu va Nolbu", building
     a table of what the two tales share (+30 points once).
   - It has the Korean helper too (🇰🇷 and tap-a-word), so a child who knows
     흥부와 놀부 from a Korean kindergarten can read it both ways. Its Korean
     is in the review table with the rest.
   - Next twins, in order: 콩쥐 팥쥐, 도깨비 방망이, 팥죽 할멈과 호랑이,
     봉이 김선달.
6. **New shelf: "Koreyadagi hayotim" (my life in Korea).** Uzbek children as
   heroes in Korean places.

   ✅ **Built, with three stories** on the shelf "🏙️ Koreyadagi hayotim":
   - *Mening ismim — Asal* (5–8, 10 pages): Asal's first weeks at a Korean
     school. Her classmates can't say her name, until she tells them that
     *Asal* means honey, 꿀. Then they write it in both alphabets and learn
     words from each other.
   - *Osh va tteok* (4–7, 8 pages): Bobur takes osh to Kim halmeoni next
     door, and the lagan comes back full of tteok. Neither people returns a
     dish empty.
   - *Buvijon bilan videoqo'ng'iroq* (4–7, 8 pages): Malika's Sunday video
     call with buvi in Samarkand. They talk about the four-hour time
     difference, the apricot tree in bloom and kimchi. Malika teaches buvi
     to count in Korean, and buvi tells her a riddle.

   They are told in the plain past tense, not the fairy-tale "-ibdi". Korean
   words in them (annyonghaseyo, kkul, mashita, tteok, kimchi, Chusok) have
   word cards, and all three have the Korean helper.

   New pictures:
   - Seoul streets with apartment blocks.
   - A flat, a classroom with chalk writing, and an apartment landing with
     the lift.
   - Today's clothes and hairstyles.
   - Uzbek and Korean food.

   Next ideas:
   - flying from Incheon to Tashkent for the summer
   - two languages are a superpower
   - Navro'z in a Korean neighbourhood (see the holiday shelf)

   The best story ideas will come from real families.
7. **Holiday shelf.** Stories that fit the time of year:
   - Navro'z ↔ 설날
   - 추석 ↔ harvest time
   - 한글날 (Oct 9) ↔ O'zbek tili bayrami (Oct 21)
   - Children's Day: May 5 ↔ June 1
   - Hayit and Mustaqillik kuni

   ✅ **Built: the "🎉 Bayramlar" shelf, with the first two stories.**
   - *Harflar bayrami* (5–8): Hangul kuni and O'zbek tili bayrami. Asal learns
     how King Sejong made Hangul for everyone, visits his golden statue on
     9 October, and recites her own poem on 21 October. Her friend Seoyeon
     learns that O' and G' "wear little hats", and Asal learns that Korean
     letters "live together in little houses".
   - *Ikki Yangi yil* (4–8): Seollal and Navro'z, with Bobur and Kim halmeoni
     from *Osh va tteok*. In winter Bobur gets a hanbok, does sebe and eats
     tteokguk ("one bowl, one year older"). In spring Kim halmeoni stirs the
     sumalak and finds the lucky pebble.

   **Time of year.** Each holiday book knows its days, so:
   - Its library card shows the next date (🎉 9-oktabr).
   - In the three weeks before a holiday, the banner offers its book with a
     line like "🎉 8 kundan keyin bayram: Hangul kuni".

   Seollal, Chusok and the two Hayits move every year. The phone's own
   calendars work out their dates, so nothing needs updating by hand.

   Next holiday stories:
   - Chusok and harvest time
   - Children's Day (May 5 ↔ June 1)
   - Hayit
   - Mustaqillik kuni
8. **Longer short books.** The 10 classic, Navoiy and modern books were 5
   short pages each with no word cards.

   ✅ **Done for 9 of them.** Each is now an 8–9 page story with 3–5 word
   cards, page questions and a final quiz, and new pictures.
   - **Navoiy, retold for children:**
     - *Farhod va Shirin*: Farhod's learning and crafts, Iskandar's mirror,
       the canal in Arman yurti, Shirin and Xusrav's trick. The sad ending is
       told gently (9–12).
     - *Lison ut-tayr*: the birds' council, their excuses, Hudhud, the seven
       valleys, and the thirty birds who find that they are the Simurg'
       (7–12).
   - **Qodiriy:** *O'tkan kunlar* (10–12): old Tashkent, Otabek and Kumush,
     Homid's forged letter. The rest of the novel is left "for when you are
     older".
   - *Shoh va dehqon*: the old man who plants a walnut tree he will never
     eat from ("they planted, we ate; we plant, others will eat"). It is an
     Eastern parable, not a Navoiy work, so it moved to the classics shelf
     (6–10).
   - *Buvijonning sandig'i*: Malika visits buvi in Samarkand, and buvi's chest
     holds Margilan atlas, a Chust do'ppi, a so'zana and a Rishton bowl. Back
     in Seoul, her class holds a "Mening merosim" show.
   - **The app's own tales:**
     - *Sehrli olma*: an apple that multiplies when shared.
     - *Oyqiz sirlari*: Yetti qaroqchi and Temirqoziq; mirrors send her home.
     - *Yulduz bola*: a star that shines brighter with every kindness.
     - *Sehrli gilam sayohati*: Registon and Ulug'bek's observatory, Minorai
       Kalon, Kalta minor.
   - **Left as it is: *Sariq devni minib*.** It is Xudoyberdi To'xtaboyev's
     novel and still under copyright. Its short text also doesn't follow his
     plot. A longer version needs either the rights holder's permission or
     a short, faithful summary written by a person. Until then it stays at 5
     pages.
   - These books have no Korean helper yet; they can join the review table
     a few at a time.

## Phase 3 — Learning and play

9. **Alifbo book.** Uzbek letters, including O' G' Sh Ch Ng, one picture per
   letter from the art engine, and letter tracing. Beginners can turn on
   Korean-letter sound hints (*Assalomu alaykum* → 앗살로무 알라이쿰).

   ✅ **Built.**
   - **The book.** *Alifbo* (shelf "🔤 Alifbo") has a page for each of the 29
     letters in their official order, and one for the tutuq belgisi.
     - Each page has the letter big ("A a"), a word that starts with it
       (*anor, baliq, daraxt … o'rdak, g'oz, shar, choynak*) and its picture.
     - Ng never starts a word, so its page explains that (*dengiz, tong,
       ming*).
     - With the menus in Cyrillic, the letters show in Cyrillic.
     - The book has word cards, a few questions and the Korean helper.
   - **✍️ Yozib ko'r (tracing).** The child traces the letter with a finger,
     first the capital, then the small letter.
     - A trace counts once most of the letter is gone over, every part of it
       too, without straying far outside it.
     - +5 points per letter, the first time.
   - **가 (sound hints).** A button on every story page, not only the Alifbo,
     shows each sentence, question and answer in Hangul, the way it sounds.
     - Examples: *Assalomu alaykum* → 앗살로무 알라이쿰, *Toshkent* → 토시켄트.
     - It stays on from page to page and is remembered.
     - 🇰🇷 still shows the meaning instead, on the page where it's tapped.
     - The readings are made by rules (`js/hangul.js`): Uzbek spelling is
       regular. So they work for every book, with no translation needed.

10. **Mening lug'atim (my dictionary).** New words become picture cards, with
    games: listen and pick, match Uzbek to Korean, build the word from letters.

    ✅ **Built.**
    - **Collecting words.** Each "Yangi so'z" card a child meets joins their
      own dictionary, opened from the banner ("📖 Mening lug'atim (12)"). It
      collects when its page is opened, and all the words of a finished book
      count too.
    - **The cards.** Each word shows the picture of its page, its meaning
      and its Korean meaning. 🔊 says it, and "📖 Kitobda" opens its page.
      The cards are in Uzbek alphabet order (… z, o', g', sh, ch, ng).
    - **🔊 Eshit va top.** The child hears a word and taps its picture.
      - Few phones have an Uzbek voice. Without one, the Korean voice says
        the word's 가 reading ("anor" → 아노르).
      - With no voice at all, the child reads the word instead.
    - **🇰🇷 Juftini top.** Match five Uzbek words to their Korean meanings.
    - **🔤 So'zni yig'ing.** Build a word from its letters, under its picture.
      O', g', sh, ch and ng are one tile each.
    - The games open once a child has 4 words. Each game's first win of the
      day is worth +10 points.

11. **Culture passport and map of Uzbekistan.** Each book belongs to a region.
    Finishing it stamps the passport. Points buy stickers.

    ✅ **Built.**
    - **Places.** Every book takes the child to one of the 14 regions or to
      Korea, their second home. The link is real where it can be: *Afandi*
      to Buxoro, Navoiy's books to Navoiy, the melon field of *Oltin tarvuz*
      to Xorazm, Malika's grandmother to Samarqand, the stars of *Oyqiz* to
      the Maydanak observatory in Qashqadaryo.
    - **Stamps.** Finishing a book stamps its place, with the date, and
      says so ("🗺️ Yangi muhr: Xorazm!"). The book's last page carries the
      stamp in its corner; tapping it opens the passport.
    - **🗺️ Pasportim.** It opens from the banner and has three parts:
      - **The map.** A real map of Uzbekistan's regions (Natural Earth
        borders), each coloured once it is stamped. Korea sits in a corner,
        with the way from Tashkent (4,900 km).
      - **Muhrlar.** A page of 15 stamps.
      - **Stikerlar albomi.** The album of 30 stickers.
    - **A place's card.** It has a true fact about the place, the books that
      go there and its two stickers. The fact is also in Korean with the
      Korean menus.
    - **Stickers.** Each costs 50 points, once its place is stamped. They are
      drawn by the art engine and cut out with a white edge: Registon, the
      Kalta minor, a Chust do'ppi, the Tashkent metro, a snow leopard,
      Marg'ilon atlas, and more.
12. **Short pieces.** Riddles, proverbs, lullabies and tongue twisters. Folk
    material is free to use; modern authors need permission.

    ✅ **Built**: a new shelf, "🧩 Qisqa va qiziq" (short and fun), with four
    books and no modern author's text.
    - **Topishmoqlar.** 10 riddles on the images of Uzbek folk riddles: an
      onion in seven coats, stars as scattered millet, letters as black
      seeds on a white field.
      - The picture stays under a cloth until the child guesses the answer
        (+10 points).
      - Then the cloth comes off ("🎉 Javob: Piyoz"), and the picture shows
        the answer.
    - **Ikki xalq — bir maqol.** 10 real Uzbek proverbs, each explained for
      children.
      - Each has the Korean proverb that says the same, under its picture,
        with what it says word for word.
      - *Tomchi-tomchi ko'l bo'lur* ↔ 티끌 모아 태산; *Yetti o'lchab, bir
        kes* ↔ 돌다리도 두들겨 보고 건너라; *Nima eksang, shuni o'rasan* ↔
        콩 심은 데 콩 나고 팥 심은 데 팥 난다.
    - **Alla, bolam, alla.** 6 lullabies written in the way of Uzbek allas,
      set out line by line.
      - The beshik rocks in the pictures.
      - One is sung by a grandmother over a video call from far away.
      - They are meant for a grandparent to record in the studio.
    - **Tez ayting!** 8 tongue twisters written for this book. Each works on
      two sounds that Korean doesn't tell apart: q/k, x/h, o/o', g/g',
      sh/ch, ng, l/r, v/b. The 가 readings help with them too.
    - These books have no story-order game and no passport place.
13. **Colouring mode.** ✅ Built. Any story picture becomes a colouring page,
    printable for community classes and multicultural lessons. The 🎨 on a
    picture opens it; colour on screen, save it as a picture, or print it
    blank. Also built: **Voqealar tartibi**, a game at the end of each book
    where four pictures from the story are put in order (+30 points once).
14. **Later:** bedtime mode, a character maker, "make your own story".

    ✅ **Bedtime mode built ("🌙 Uxlash vaqti").** A grown-up picks one of 12
    calm books (no monsters, snakes or wolves in their pictures) and
    tonight's pages: 3, 5 or the whole book. The button glows after 7 pm.
    - **Reading.** The room goes dark and starry, and the book warm, like
      under a night lamp. The bar shows "🌙 2 / 5".
      - The questions rest, the page sound is a whisper, and there are no
        chimes.
      - If someone has read the book aloud, their voice reads on by itself.
    - **Good night.** After tonight's last page, "Xayrli tun, Asal! 🌙"
      appears and fades to dark (a tap wakes it).
      - Tomorrow the book opens on the next page ("▶ 4-sahifadan").
      - A book read to the end counts as read, and its passport stamp
        shows on the good-night screen.

## Privacy

Korean law (PIPA) requires a guardian's consent to collect personal data from
children under 14. The app avoids the question entirely:
- No accounts and no server.
- Profiles, progress and voice recordings stay on the device (voice
  recordings in IndexedDB).
- Recordings leave the device only when a grown-up sends the file themselves.
- The recording studio sits behind a small sum, so children don't wander in.
