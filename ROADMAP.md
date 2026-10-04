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
14. **Bedtime mode, a character maker, "make your own story".** ✅ All
    three built.

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

    ✅ **Character maker and "make your own story" built ("✍️ Ertak
    yozish").** Each child's own shelf, "✍️ Mening ertaklarim", holds their
    heroes and the books they wrote.
    - **Heroes.** The hero maker shows the hero as they are made:
      - a boy, a girl, a man, a woman, a grandfather or a grandmother;
      - a do'ppi, braids, a daenggi, a gat, a crown...;
      - Uzbek clothes, everyday clothes or a hanbok, in atlas, stripes or
        dots and 8 colours;
      - skin and hair colour, and something to hold (a book, a flower, a
        nay...).
    - **Pages.** A book has up to 8 pages. On each, the child chooses:
      - who stands on the left, in the middle and on the right, and what
        flies in the sky: their heroes, or 68 people, animals, things and
        things that fly, each with a mood and turned either way;
      - one of 20 places, from a meadow and a hovli to Seoul, a classroom
        and space, and the time of day (morning, day, evening, night,
        winter, a rainbow);
      - a title and up to 320 letters of text. Buttons add sentence
        starters ("Bir bor ekan...") and the names of who is on the page.
    - **Reading.** A made book reads like any other. Its author's name
      shows at the end, with "✏️ Tahrirlash" to go on writing. It has no
      quiz or story-order game, so it earns no points.
    - **Sharing.** After the grown-ups' sum, "📤 Ulashish" sends the book
      as a link. The whole book is in the address, with no server. On
      another phone it opens as a gift, and "📥 Javonimga qo'shish" keeps
      it on that child's shelf.

## Phase 4 — Family, language bridges and play

Ideas built on what already exists, in the order they are being built. All of
them stay on the device, like everything else (see Privacy).

15. **Tap anything in a picture.** Touching a fox in any illustration shows
    "Tulki · 여우" and, with 가 on, how it sounds. Every page becomes a picture
    dictionary, and the words found join *Mening lug'atim*.

    ✅ **Built.** Every thing the books draw has a word: 168 words for
    animals, birds by kind, trees by kind, food, the home, buildings and the
    sky, and people by age (*qiz bola, bobo*) or calling (*podshoh, dehqon,
    cho'pon*).
    - **Touching it** makes it bounce, and a card shows the thing itself, its
      word, its Korean and a 🔊. With 가 on, the card also shows how the word
      sounds.
    - **The first time** a child finds a word, it joins their dictionary
      (+2 points). Its card there says where it was found, and "📖 Kitobda"
      opens that page. The words play in the dictionary's games too.
    - Sparkles, hearts and the riddle's cloth have no word, so a riddle
      gives nothing away. It works in made books, in Cyrillic and with
      Korean menus.
16. **Ertak estafetasi (a story relay).** A child writes a page of a story in
    the story maker and sends it; a grandparent adds the next page and sends
    it back. The link carries the whole book, as it already does.

    ✅ **Built.**
    - **Sending and continuing.** The link now says "O'qing va davomini
      yozib, qaytarib yuboring!" (read it, write what happens next, send it
      back). At the end of a book received as a gift, "✍️ Davomini yozish"
      keeps it and opens a new last page. Its "✍️ Kim yozdi?" field (who
      wrote it) is ready for the grandparent's name.
    - **Coming back.** Each book keeps a relay id wherever it travels. When
      it comes back, the child's own copy is updated ("🔄 Ertagimni
      yangilash") instead of a second copy appearing. Heroes with the same
      name and look are matched, so Asal doesn't appear twice.
    - **Who wrote what.** A book written by more than one person shows, at
      the top of each page, who wrote it ("✍️ Buvijon"). The relay goes on
      until the book has 8 pages.
17. **Qo'shimcha ↔ 조사.** Uzbek and Korean are grammar cousins: the verb
    comes last and endings stack on words. A game teaches the Uzbek endings
    through the Korean particles children already know: -ni ↔ 을/를,
    -ga ↔ 에게/에, -da ↔ 에서/에, -dan ↔ 에서/부터, -ning ↔ 의, -lar ↔ 들.

    ✅ **Built.** The dictionary's fourth game, "🧩 Qo'shimcha ↔ 조사"
    (조사 짝꿍 in Korean menus), is open from the first day, with no words
    needed.
    - **The table first.** It opens on the six endings, each with its Korean
      twins and an example (*tulkini* = 여우를, *ertalabdan* = 아침부터).
    - **Then six sentences**, one for each ending, from 142. Each has a
      picture and the Korean sentence with its particle marked. Below is the
      Uzbek sentence with the ending left out, and the child taps the
      ending. The sentences come from animals, places (Toshkent, Seul,
      Samarqand, Xiva...) and food, and some stand on their own
      (*Ertalabdan kechgacha o'ynadim*, *Bolalar o'ynayapti*).
    - **A wrong pick says why.** 에서 is both -da and -dan ("qayerda? →
      -da, qayerdan? → -dan"), and 에 is both -ga and -da. A right pick
      fills the gap and says the sentence aloud.
    - **The spelling rule.** The game only asks for -ga where Uzbek writes
      it so: after k, g it is -ka, and after q, g' it is -qa (*mushukka,
      tog'qa*).
    - The first win each day is worth 10 points, as with the other games.
18. **Five words a day.** A short daily review of the child's own
    dictionary, each word coming back just before it would be forgotten.

    ✅ **Built.** "📅 Kunlik 5 so'z" sits at the top of the dictionary
    once it has 4 words. On the home screen, the dictionary button shows how
    many words wait today ("📅 5").
    - **Each day**, up to five of the child's own words come back. The ones
      due come first, the longest waiting first, and then new ones. A card
      shows the word's picture and what it means (with the word itself left
      out) and its Korean, and the child picks the word from three.
    - **The schedule.** A word known comes back after 1, 2, 4, 8 and 16
      days, then every 32. A word missed shows the right one, comes again at
      the end of the round, and comes back the next day.
    - **A garden of words** shows how they grow: 🌱 new, 🌿 growing, 🌳 known.
      There are no rankings and no streaks. The day's five are worth 5
      points.
19. **A hidden star on every page.** Find it, collect it, and look closer at
    the pictures.

    ✅ **Built.** Every page of every library book (317 pages) hides one
    small gold star in its picture. It is always in the same place on that
    page, in the part every screen shows, and clear of the people and
    things drawn there.
    - **Touching it** collects it: it spins and stays, faint, so the child
      sees it was found (+2 points, once). The book's toolbar counts the
      stars found ("🌟 3/12").
    - **The title page** invites the child: "Har sahifada bitta yulduz
      yashiringan. Topa olasizmi?" Then it counts the stars found.
    - **The last page** says how many were found, or invites the child to
      look again.
    - Books a child made have no stars: the pictures are theirs.
20. **Reading tree.** A tree that grows a leaf for every book read, with no
    rankings and no pressure.

    ✅ **Built.** "🌳 Daraxtim" on the home screen opens the child's tree.
    - **A leaf for each book finished**, in the order read: the first books
      at the heart of the tree, the newest at its edge. Leaves take their
      shelf's colour, and Korean books bloom pink, like a cherry tree.
    - **A white flower** for each story the child wrote.
    - **It grows** from a sprout to a big tree as the books add up.
    - **Touching a leaf** names its book, and "📖 Ochish" opens it.
    - There are no points, goals, rankings or streaks: the tree just grows.
21. **Birga o'qiymiz (reading together on a video call).** A link to the
    page a child is on, and big page numbers, so a grandparent on a call can
    turn to the same page.

    ✅ **Built.** "📞 Birga o'qiymiz" in the book's toolbar turns on reading
    together.
    - **Big page numbers** on both pages ("4-sahifa", "4 / 12").
    - **A page picker** for jumping to the page the other one names.
    - **"🔗 Shu sahifa havolasi"** sends a link to the page (`#zumrad/4`)
      with "«Zumrad va Qimmat», 4-sahifa — birga o'qiymiz!". Opened on the
      grandparent's phone, it opens the same book at the same page, with
      big page numbers on. A page past the end opens the last page, and old
      book links work as before.
    - A book a child made has no page link (its link is the whole book),
      but its picker and big numbers work.
    - On a narrow phone, the book's toolbar takes two tidy rows instead of
      squeezing its buttons together.
22. **Men o'qidim (I read it).** The child records themselves reading a page,
    sends it to the grandparents, and hears how much they have grown.

    ✅ **Built.** Each page has a 🎙️ ("Men o'qiyman", I'll read).
    - **Record.** The card shows the page to read, then a big
      "⏺ Yozishni boshlash" with a level meter and a timer. After "⏹", the
      child listens, then keeps it ("💾 Saqlash") or tries again
      ("🔁 Qaytadan").
    - **Send it to grandma.** "📤" sends the recording as an audio file
      ("Asal - Zumrad va Qimmat, 3-sahifa.webm") through the phone's share
      sheet, to Telegram or KakaoTalk. Where a phone can't share files, the
      file is saved to send by hand.
    - **Hear how much you've grown.** Every reading of a page is kept with
      how long ago it was ("bugun", "3 oy oldin"). Once a page has more than
      one, the first (🌱) and the newest (🌳) can be heard side by side.
    - The recordings stay on the device, for each child separately, until
      sent. Closing the card turns the microphone off. Bedtime stays calm,
      with no 🎙️, and so does a browser that can't record.
23. **Mening oilam (my family).** A family tree made with the hero maker,
    and the kinship words: both languages tell the father's side from the
    mother's (amma ↔ 고모, xola ↔ 이모, amaki ↔ 삼촌, tog'a ↔ 외삼촌).
24. **Printable booklets.** Any book, a child's own too, printed as a small
    folded booklet to post to the grandparents or take to class.
25. **Parents' corner.** Behind the grown-ups' sum: what the child read,
    the words learned, how often they read, and a sheet to print for their
    Uzbek teacher.
26. **Class mode.** For Uzbek weekend schools and multicultural family
    centres (다문화가족지원센터): a projector view, questions for the whole
    group, and printable worksheets.
27. **Naqsh ustasi (pattern master).** Design an atlas or suzani pattern and
    dress a hero in it.
28. **Doira.** Tap the Uzbek frame drum to folk rhythms.
29. **Oshxona (kitchen).** Cooking with a grown-up, step by step: plov,
    somsa, sumalak at Navro'z, and tteok for Seollal.
30. **Ikki xalq — bir o'yin (two peoples, one game).** Traditional games side
    by side, each with a little game to play: chillak ↔ 자치기, besh tosh ↔
    공기, varrak ↔ 연날리기.

## Privacy

Korean law (PIPA) requires a guardian's consent to collect personal data from
children under 14. The app avoids the question entirely:
- No accounts and no server.
- Profiles, progress and voice recordings stay on the device (voice
  recordings in IndexedDB).
- Recordings leave the device only when a grown-up sends the file themselves.
- The recording studio sits behind a small sum, so children don't wander in.
- A book a child writes leaves the device only in a link a grown-up sends,
  after the same sum. The book travels inside the link itself and is never
  stored on a server.
