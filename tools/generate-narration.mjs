#!/usr/bin/env node
/*
 * Ertaklar Olami — natural Uzbek narration for every page.
 *
 * Reads the books with Azure AI Speech's neural Uzbek voices
 * (uz-UZ-MadinaNeural, uz-UZ-SardorNeural) and writes
 *   audio/<story>/vNN.mp3     view NN: 00 title page, 01..N pages, N+1 ending
 *   audio/<story>/vNNq.mp3    the question on page NN, with its answers
 *   audio/manifest.js         loaded by index.html; read-aloud prefers these
 *                             files over the browser's own voice
 *
 *   AZURE_SPEECH_KEY=<key> AZURE_SPEECH_REGION=<region> node tools/generate-narration.mjs
 *
 * Options:
 *   --voice <name>   uz-UZ-MadinaNeural (default) or uz-UZ-SardorNeural
 *   --story <keys>   only these books, comma separated (e.g. zumrad,susambil)
 *   --rpm <n>        requests per minute, default 18 (the free F0 tier allows 20)
 *   --rate <pct>     speaking rate, default -8% (a little slower, for children)
 *   --force          regenerate files that are already up to date
 *   --dry-run        list what would be generated; needs no key
 *   --out <dir>      write audio/ under <dir> instead of the site folder
 *   --ascii          keep plain ' apostrophes (default: oʻ gʻ and ʼ)
 *
 * AZURE_TTS_ENDPOINT overrides the full synthesis URL.
 *
 * Every sentence is synthesised on its own and the MP3 frames are joined, so
 * the manifest can record where each sentence starts and stops. The player
 * uses these marks to keep the word highlight in step with the voice. A
 * re-run only synthesises pages whose text or voice settings changed, and the
 * manifest is saved after every page, so an interrupted run can be resumed.
 *
 * Node 18+, no dependencies.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FORMAT = 'audio-24khz-48kbitrate-mono-mp3';

// Spoken texts that come from the page templates in js/book.js and the
// answer prefixes in js/reader.js. Keep them in step with those files: the
// player ignores a file's marks when its sentence count differs from the page.
const OPENING = "«Bir bor ekan, bir yo'q ekan...»";
const THE_END = 'Ertak tugadi!';
const MORAL_PREFIX = 'Ertakdan saboq:';
const DEFAULT_MORAL = "Yaxshilik va ezgulik har doim g'alaba qiladi.";
const QUESTION_PREFIX = 'Savol:';
const ORDINALS = ['Birinchi javob:', 'Ikkinchi javob:', 'Uchinchi javob:', "To'rtinchi javob:"];

// Silence added after a sentence (ms). Azure also leaves about TAIL ms of
// natural silence after the last word.
const PAUSE = { title: 700, text: 320 };
const TAIL = 120;

const HELP = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').match(/\/\*([\s\S]*?)\*\//)[1].replace(/^ \* ?/gm, '');

function fail(msg) {
    console.error(`✖ ${msg}`);
    process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseArgs(argv) {
    const o = { voice: 'uz-UZ-MadinaNeural', rpm: 18, rate: '-8%', out: ROOT, stories: null, force: false, dry: false, ascii: false };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        const val = () => (i + 1 < argv.length ? argv[++i] : fail(`${a} needs a value`));
        if (a === '--voice') o.voice = val();
        else if (a === '--story') o.stories = val().split(',').map((s) => s.trim()).filter(Boolean);
        else if (a === '--rpm') o.rpm = Number(val());
        else if (a === '--rate') o.rate = val();
        else if (a === '--out') o.out = path.resolve(val());
        else if (a === '--force') o.force = true;
        else if (a === '--dry-run') o.dry = true;
        else if (a === '--ascii') o.ascii = true;
        else if (a === '-h' || a === '--help') {
            console.log(HELP);
            process.exit(0);
        } else fail(`Unknown option ${a} (see --help)`);
    }
    if (!(o.rpm > 0)) fail('--rpm must be a positive number');
    if (!/^[+-]?\d+(\.\d+)?%$/.test(o.rate)) fail('--rate looks like -8% or +5%');
    if (!/^[a-z]{2,3}-[A-Z]{2}-\w+$/.test(o.voice)) fail(`--voice ${o.voice} is not a voice name like uz-UZ-MadinaNeural`);
    return o;
}

// ---------- the books ----------

// Runs the site's own scripts in a sandbox: the story files named in
// index.html, and js/speech.js, which splits text into sentences exactly as
// the book does.
function loadLibrary() {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const storyFiles = [...html.matchAll(/<script[^>]+src="(js\/stories[^"]*\.js)"/g)].map((m) => m[1]);
    if (!storyFiles.length) fail('No story scripts found in index.html');
    const sandbox = { console };
    sandbox.window = sandbox;
    vm.createContext(sandbox);
    for (const f of ['js/speech.js', ...storyFiles]) {
        vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f });
    }
    return { Speech: sandbox.Speech, db: sandbox.storiesDatabase };
}

const pad = (n) => String(n).padStart(2, '0');

// What read-aloud reads on each view, sentence by sentence, in page order.
function plan(key, st, Speech) {
    const items = [];
    // One entry per sentence span on the page, sounding or not, so that the
    // marks line up with the page's sentences one to one.
    const seg = (text, kind = 'text', prefix = '') => Speech.segment(text).map((sg, i) => {
        const words = sg.toks.filter((t) => t !== '•').join(' ');
        return { kind, q: sg.q, prefix: i === 0 ? prefix : '', text: words, silent: !Speech.hasSound(words) };
    });
    const add = (id, file, segs) => items.push({ id, src: `audio/${key}/${file}.mp3`, segs });
    add(`${key}:0`, 'v00', [...seg(st.title, 'title'), ...seg(st.tag), ...seg(OPENING)]);
    st.pages.forEach((p, i) => {
        const v = i + 1;
        add(`${key}:${v}`, `v${pad(v)}`, [...seg(p.title, 'title'), ...seg(p.text)]);
        if (p.question) {
            add(`${key}:${v}:q`, `v${pad(v)}q`, [
                ...seg(p.question.q, 'text', QUESTION_PREFIX),
                ...p.question.a.flatMap((a, j) => seg(a, 'text', ORDINALS[j] || '')),
            ]);
        }
    });
    const end = st.pages.length + 1;
    add(`${key}:${end}`, `v${pad(end)}`, [...seg(THE_END, 'title'), ...seg(st.moral || DEFAULT_MORAL, 'text', MORAL_PREFIX)]);
    return items.filter((it) => it.segs.some((sg) => !sg.silent));
}

// ---------- SSML ----------

const xml = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[ch]));

// Official Uzbek Latin letters: oʻ gʻ (U+02BB) and the tutuq belgisi ʼ (U+02BC).
function spell(text, o, Speech) {
    const t = Speech.norm(text);
    return o.ascii ? t : t.replace(/([OoGg])'/g, '$1ʻ').replace(/'/g, 'ʼ');
}

function ssml(sg, o, Speech) {
    let text = spell(sg.text, o, Speech);
    if (sg.kind === 'title' && !/[.!?…»]$/.test(text)) text += '.';
    const prefix = sg.prefix ? `${xml(spell(sg.prefix, o, Speech))}<break time="250ms"/> ` : '';
    // Dialogue sounds livelier: a little higher and quicker, as in the browser voice.
    const prosody = sg.q ? `rate="${bump(o.rate, 4)}" pitch="+8%"` : `rate="${o.rate}"`;
    const lang = o.voice.split('-').slice(0, 2).join('-');
    return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${lang}">` +
        `<voice name="${xml(o.voice)}"><prosody ${prosody}>${prefix}${xml(text)}</prosody>` +
        `<break time="${PAUSE[sg.kind] || PAUSE.text}ms"/></voice></speak>`;
}

function bump(rate, by) {
    const v = parseFloat(rate) + by;
    return `${v >= 0 ? '+' : ''}${v}%`;
}

// ---------- MP3 ----------

const KBPS = {
    v1: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
    v2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
};
const RATES = { 3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000] };

// MPEG layer III frame header at b[i] → { len, samples, rate } or null.
function frameHeader(b, i) {
    if (b[i] !== 0xff || (b[i + 1] & 0xe0) !== 0xe0) return null;
    const ver = (b[i + 1] >> 3) & 3;
    const layer = (b[i + 1] >> 1) & 3;
    const bri = b[i + 2] >> 4;
    const sri = (b[i + 2] >> 2) & 3;
    if (ver === 1 || layer !== 1 || bri === 0 || bri === 15 || sri === 3) return null;
    const samples = ver === 3 ? 1152 : 576;
    const rate = RATES[ver][sri];
    const kbps = (ver === 3 ? KBPS.v1 : KBPS.v2)[bri];
    return { len: Math.floor(((samples / 8) * kbps * 1000) / rate) + ((b[i + 2] >> 1) & 1), samples, rate };
}

// The audio frames of an MP3, without ID3 tags or the Xing/Info frame (which
// would announce the wrong length once several files are joined).
function mp3Frames(buf) {
    let i = 0;
    if (buf.length > 10 && buf.toString('latin1', 0, 3) === 'ID3') {
        i = 10 + (((buf[6] & 0x7f) << 21) | ((buf[7] & 0x7f) << 14) | ((buf[8] & 0x7f) << 7) | (buf[9] & 0x7f));
    }
    const frames = [];
    let ms = 0;
    while (i + 4 <= buf.length) {
        const h = frameHeader(buf, i);
        if (!h || i + h.len > buf.length) {
            i++;
            continue;
        }
        const frame = buf.subarray(i, i + h.len);
        i += h.len;
        if (!frames.length && /Xing|Info|VBRI/.test(frame.toString('latin1', 4, Math.min(h.len, 48)))) continue;
        frames.push(frame);
        ms += (h.samples / h.rate) * 1000;
    }
    return { frames, ms };
}

// ---------- Azure ----------

class HttpError extends Error {
    constructor(msg, status) {
        super(msg);
        this.status = status;
    }
}

function limiter(rpm) {
    let next = 0;
    return async () => {
        const now = Date.now();
        const at = Math.max(now, next);
        next = at + 60000 / rpm;
        if (at > now) await sleep(at - now);
    };
}

async function synthesize(body, o) {
    for (let attempt = 1; ; attempt++) {
        await o.slot();
        let res;
        try {
            res = await fetch(o.endpoint, {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': o.key,
                    'Content-Type': 'application/ssml+xml',
                    'X-Microsoft-OutputFormat': FORMAT,
                    'User-Agent': 'ertaklar-olami-narration',
                },
                body,
            });
        } catch (err) {
            if (attempt >= 5) throw new Error(`Cannot reach ${o.endpoint}: ${err.cause ? err.cause.message : err.message}`);
            await sleep(1000 * 2 ** attempt);
            continue;
        }
        if (res.ok) return Buffer.from(await res.arrayBuffer());
        const detail = (await res.text().catch(() => '')).trim().slice(0, 300);
        if ((res.status === 429 || res.status >= 500) && attempt < 7) {
            const wait = Number(res.headers.get('retry-after')) * 1000 || 1000 * 2 ** attempt;
            console.log(`  … Azure ${res.status}, waiting ${Math.round(wait / 1000)} s`);
            await sleep(wait);
            continue;
        }
        const hint = res.status === 401 || res.status === 403 ? ' (check AZURE_SPEECH_KEY and that AZURE_SPEECH_REGION is the resource\'s region)'
            : res.status === 400 ? ` (was the voice ${o.voice} rejected?)` : '';
        throw new HttpError(`Azure answered ${res.status}${hint}${detail ? `: ${detail}` : ''}`, res.status);
    }
}

async function narrate(item, o, Speech) {
    const chunks = await Promise.all(item.segs.map((sg) => (sg.silent ? null : synthesize(ssml(sg, o, Speech), o))));
    const frames = [];
    const marks = [];
    let at = 0;
    chunks.forEach((buf, k) => {
        if (!buf) {
            marks.push([Math.round(at), Math.round(at)]);
            return;
        }
        const a = mp3Frames(buf);
        if (!a.frames.length) throw new Error(`no audio in Azure's answer for sentence ${k + 1}`);
        const speech = Math.max(a.ms * 0.5, a.ms - (PAUSE[item.segs[k].kind] || PAUSE.text) - TAIL);
        marks.push([Math.round(at), Math.round(at + speech)]);
        frames.push(...a.frames);
        at += a.ms;
    });
    const file = path.join(o.out, item.src);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, Buffer.concat(frames));
    return { marks, ms: Math.round(at) };
}

// ---------- manifest ----------

function readManifest(file) {
    if (!fs.existsSync(file)) return { files: {} };
    const sandbox = { window: {} };
    try {
        vm.runInNewContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
    } catch (err) {
        fail(`Cannot read ${file}: ${err.message}`);
    }
    const m = sandbox.window.narrationManifest || {};
    return { voice: m.voice || null, files: m.files || {} };
}

function writeManifest(file, m) {
    const order = (k) => k.split(':').map((x) => (/^\d+$/.test(x) ? x.padStart(4, '0') : x)).join(':');
    const keys = Object.keys(m.files).sort((a, b) => (order(a) < order(b) ? -1 : 1));
    const lines = keys.map((k) => `        ${JSON.stringify(k)}: ${JSON.stringify(m.files[k])}`);
    const text = `/*
 * Narration audio for read-aloud, written by tools/generate-narration.mjs.
 *
 * Keys: "<story>:<view>" (view 0 is the title page, 1..N the story pages,
 * N+1 the ending) and "<story>:<view>:q" for a page's question. A value is a
 * path relative to index.html, or { src, marks } where marks holds each
 * sentence's [start, end] in ms. Pages without a file are read by the
 * browser's own voice. Hand-made entries (plain paths) are kept on re-runs.
 */
window.narrationManifest = {
    voice: ${JSON.stringify(m.voice || null)},
    files: {
${lines.join(',\n')}${lines.length ? '\n' : ''}    },
};
`;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(`${file}.tmp`, text);
    fs.renameSync(`${file}.tmp`, file);
}

// ---------- main ----------

async function main() {
    const o = parseArgs(process.argv.slice(2));
    const { Speech, db } = loadLibrary();
    const keys = o.stories || Object.keys(db);
    const unknown = keys.filter((k) => !db[k]);
    if (unknown.length) fail(`Unknown book: ${unknown.join(', ')}. Books: ${Object.keys(db).join(', ')}`);

    const manifestFile = path.join(o.out, 'audio', 'manifest.js');
    const manifest = readManifest(manifestFile);
    const items = keys.flatMap((k) => plan(k, db[k], Speech));
    const signature = (it) => crypto.createHash('sha1').update(JSON.stringify([FORMAT, TAIL, it.segs.map((sg) => ssml(sg, o, Speech))])).digest('hex').slice(0, 12);

    const todo = [];
    let kept = 0;
    let handMade = 0;
    for (const it of items) {
        it.hash = signature(it);
        const have = manifest.files[it.id];
        if (typeof have === 'string') {
            handMade++;
            continue;
        }
        const fresh = have && have.hash === it.hash && fs.existsSync(path.join(o.out, have.src));
        if (fresh && !o.force) kept++;
        else todo.push(it);
    }
    // Generated entries for pages that no longer exist (a whole-library run only).
    const stale = o.stories ? [] : Object.keys(manifest.files).filter((k) => typeof manifest.files[k] === 'object' && !items.some((it) => it.id === k));

    const requests = todo.reduce((n, it) => n + it.segs.filter((sg) => !sg.silent).length, 0);
    const chars = todo.reduce((n, it) => n + it.segs.reduce((m, sg) => m + sg.prefix.length + sg.text.length, 0), 0);
    console.log(`${keys.length} book(s), ${items.length} narration files: ${todo.length} to make, ${kept} up to date${handMade ? `, ${handMade} hand-made kept` : ''}.`);
    if (todo.length) {
        console.log(`${requests} sentences, ${chars.toLocaleString('en')} characters, voice ${o.voice}, about ${Math.ceil(requests / o.rpm)} min at ${o.rpm} requests/min.`);
    }
    if (o.dry) {
        todo.forEach((it) => console.log(`  ${it.id.padEnd(18)} ${it.src}  (${it.segs.length} sentences)`));
        return;
    }
    if (!todo.length && !stale.length) return;

    o.key = process.env.AZURE_SPEECH_KEY;
    const region = process.env.AZURE_SPEECH_REGION;
    o.endpoint = process.env.AZURE_TTS_ENDPOINT || (region && `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`);
    if (todo.length && (!o.key || !o.endpoint)) fail('Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION (see docs/ or --help).');
    if (typeof fetch !== 'function') fail('Node 18 or newer is needed.');
    o.slot = limiter(o.rpm);

    manifest.voice = o.voice;
    stale.forEach((k) => delete manifest.files[k]);
    if (stale.length) console.log(`Removed ${stale.length} entries for pages that no longer exist.`);
    writeManifest(manifestFile, manifest);

    let failed = 0;
    for (const [n, it] of todo.entries()) {
        try {
            const r = await narrate(it, o, Speech);
            manifest.files[it.id] = { src: it.src, marks: r.marks, hash: it.hash };
            writeManifest(manifestFile, manifest);
            console.log(`✔ [${n + 1}/${todo.length}] ${it.id}  ${it.segs.length} sentences, ${(r.ms / 1000).toFixed(1)} s`);
        } catch (err) {
            failed++;
            console.error(`✖ [${n + 1}/${todo.length}] ${it.id}: ${err.message}`);
            if (err.status === 401 || err.status === 403 || (err.status === 400 && failed === n + 1 && failed >= 3)) {
                fail('Stopping: every request is being refused.');
            }
        }
    }
    const shown = path.relative(process.cwd(), manifestFile);
    console.log(failed ? `Done with ${failed} failure(s); run again to retry them.` : `Done. ${shown.startsWith('..') ? manifestFile : shown} is up to date.`);
    if (failed) process.exitCode = 1;
}

main().catch((err) => fail(err.stack || err.message));
