/*
 * Narration audio for read-aloud. Fill it by running
 *   node tools/generate-narration.mjs          (neural Uzbek voice, see the guide)
 * or by adding recorded files by hand.
 *
 * Keys: "<story>:<view>" — view 0 is the title page, 1..N the story pages,
 * N+1 the ending — and "<story>:<view>:q" for a page's question.
 * Paths are relative to index.html. Pages without a file are read by the
 * browser's own voice.
 */
window.narrationManifest = window.narrationManifest || { voice: null, files: {} };
