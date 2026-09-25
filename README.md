# haksenguz-kids

**Ertaklar Olami** is an interactive 3D picture book of Uzbek folk tales for children. You open the cover, turn pages by dragging their edge (or with the buttons or ← → keys), tap pictures to make the characters move, and answer questions as you read.

* **Read-aloud in Uzbek:** ▶ reads the page aloud and highlights each word as it is spoken. It uses a family member's recording of the page, a generated neural narration file, or the browser's voice. Microsoft Edge has natural Uzbek voices (Madina and Sardor). Tap any word to hear it, and turn on 🔁 to have pages turn by themselves.
* **Family voice:** parents can record each page in their own voice. Recordings stay on the device.
* **Play corner:** turn any picture into a colouring page (🎨), or put the story's pictures in order (🧩).
* **Saved progress:** points, answers and the last page read are remembered, so a book can be continued later.

Open `index.html` in a browser; no build step is needed. To generate natural narration audio for every page with Azure AI Speech, run `node tools/generate-narration.mjs --help`.

See `uzbek_kids_platform_claude_guide.md` for the architecture, how stories and their illustrations are described, and how narration works (sections 7 and 8).
