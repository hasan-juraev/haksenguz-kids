#!/usr/bin/env node
/*
 * Adds a narrator's voice pack to the built-in narration.
 *
 * The pack is the .json file the app's "Yuborish" button makes in the
 * recording studio. Its recordings are written to audio/<voice>/<book>/NN.<ext>
 * and audio/narration.js is rewritten to list them, so every copy of the app
 * can read those pages aloud.
 *
 *   node tools/import-narration.js ovoz-Hikoyachi-zumrad.json [--id hikoyachi] [--name Hikoyachi]
 *
 * Re-importing a page replaces it. --id picks the folder and voice id
 * (default: from the voice name).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MANIFEST = path.join(ROOT, 'audio', 'narration.js');
const HEADER = `/*
 * Built-in narration: recordings shipped with the app (see js/voices.js).
 * Written by tools/import-narration.js — don't edit by hand.
 */
`;
const EXT = { 'audio/webm': 'webm', 'audio/mp4': 'm4a', 'audio/x-m4a': 'm4a', 'audio/aac': 'aac', 'audio/mpeg': 'mp3', 'audio/ogg': 'ogg', 'audio/wav': 'wav', 'audio/x-wav': 'wav' };

function fail(msg) {
    console.error(`✗ ${msg}`);
    process.exit(1);
}

function load(file) {
    const window = {};
    new Function('window', fs.readFileSync(file, 'utf8'))(window);
    return window;
}

function main() {
    const args = process.argv.slice(2);
    const opt = (name) => {
        const i = args.indexOf(`--${name}`);
        return i >= 0 ? args.splice(i, 2)[1] : undefined;
    };
    const idArg = opt('id');
    const nameArg = opt('name');
    const packFile = args[0];
    if (!packFile) fail('usage: node tools/import-narration.js <pack.json> [--id hikoyachi] [--name Hikoyachi]');

    let pack;
    try {
        pack = JSON.parse(fs.readFileSync(packFile, 'utf8'));
    } catch (e) {
        fail(`can't read ${packFile}: ${e.message}`);
    }
    if (!pack || pack.format !== 'ertaklar-ovoz' || pack.version !== 1 || !Array.isArray(pack.clips)) fail(`${packFile} is not an Ertaklar Olami voice pack`);

    const name = nameArg || (pack.voice && pack.voice.name) || 'Hikoyachi';
    const id = (idArg || name).toLowerCase().replace(/o'/g, 'o').replace(/g'/g, 'g').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!/^[a-z0-9][a-z0-9-]{1,40}$/.test(id)) fail(`pick a voice id with --id (got "${id}")`);

    const stories = Object.assign({}, load(path.join(ROOT, 'js/stories-folk.js')).storiesDatabase, load(path.join(ROOT, 'js/stories-classic.js')).storiesDatabase);
    const data = fs.existsSync(MANIFEST) ? load(MANIFEST).narrationData || { voices: [] } : { voices: [] };
    let voice = data.voices.find((v) => v.id === id);
    if (!voice) data.voices.push(voice = { id, name, avatar: (pack.voice && pack.voice.avatar) || '🎙️', books: {} });
    voice.name = name;

    const done = {};
    for (const c of pack.clips) {
        // Book keys become folder names: only plain keys of books that exist.
        if (!/^[a-z0-9_]+$/.test(c.book) || !stories[c.book]) {
            console.warn(`  skipped: unknown book "${c.book}"`);
            continue;
        }
        if (!Number.isInteger(c.page) || c.page < 1 || c.page > stories[c.book].pages.length) {
            console.warn(`  skipped: ${c.book} has no page ${c.page}`);
            continue;
        }
        const ext = EXT[String(c.mime).split(';')[0].trim()];
        if (!ext || typeof c.audio !== 'string') {
            console.warn(`  skipped: ${c.book} page ${c.page} (audio type "${c.mime}")`);
            continue;
        }
        const rel = `audio/${id}/${c.book}/${String(c.page).padStart(2, '0')}.${ext}`;
        fs.mkdirSync(path.dirname(path.join(ROOT, rel)), { recursive: true });
        // Replacing a page recorded in another format: remove the old file.
        const old = (voice.books[c.book] || {})[c.page];
        if (old && old.src !== rel && fs.existsSync(path.join(ROOT, old.src))) fs.unlinkSync(path.join(ROOT, old.src));
        fs.writeFileSync(path.join(ROOT, rel), Buffer.from(c.audio, 'base64'));
        const round = (n) => Math.round(Number(n) * 100) / 100;
        (voice.books[c.book] = voice.books[c.book] || {})[c.page] = {
            src: rel,
            mime: c.mime,
            duration: round(c.duration),
            marks: (c.marks || []).map(round),
            sig: String(c.sig || ''),
        };
        (done[c.book] = done[c.book] || []).push(c.page);
    }

    fs.writeFileSync(MANIFEST, HEADER + `window.narrationData = ${JSON.stringify(data, null, 2)};\n`);
    const books = Object.keys(done);
    if (!books.length) fail('nothing imported');
    books.forEach((b) => {
        const have = Object.keys(voice.books[b]).length;
        console.log(`✓ ${stories[b].title}: pages ${done[b].sort((x, y) => x - y).join(', ')} (${have} / ${stories[b].pages.length} recorded by ${name})`);
    });
    if (pack.clips.some((c) => /webm|ogg/.test(c.mime))) {
        console.log('  note: these are WebM/Ogg recordings (made on Android or a computer). Older iPhones may not play them; recordings made on an iPhone (m4a) play everywhere.');
    }
}

main();
