/*
 * The page loads nothing from other sites, and the built files it loads
 * (css/tailwind.css, css/icons.css, css/fonts.css, fonts/) match the code.
 * Run with: node tests/assets.test.js   (after `npm install` it also checks
 * that css/tailwind.css is up to date; without it that check is skipped).
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

let failed = 0;
let total = 0;
const check = (cond, msg) => {
    total++;
    if (!cond) {
        failed++;
        console.log(`✗ ${msg}`);
    }
};

// ---------- nothing from other sites ----------

const html = read('index.html');
const outside = [...html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="(https?:)?\/\/[^"]+"/g)].map((m) => m[0]);
check(outside.length === 0, `index.html loads scripts/styles from other sites: ${outside.join(' ')}`);
const local = [...html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"#:]+)"/g)].map((m) => m[1]);
local.forEach((f) => check(fs.existsSync(path.join(ROOT, f)), `index.html refers to a missing file: ${f}`));

// ---------- icons ----------

const { usedIcons, tailwind } = require('../tools/build-assets.js');
const iconsCss = read('css/icons.css');
usedIcons().forEach((name) => check(iconsCss.includes(`.fa-${name}::before`), `icon "fa-${name}" is used but not built: run npm run build`));
check(fs.existsSync(path.join(ROOT, 'fonts/icons.woff2')), 'fonts/icons.woff2 is missing');

// ---------- fonts ----------

const fontsCss = read('css/fonts.css');
const fontFiles = [...fontsCss.matchAll(/url\(\.\.\/(fonts\/[^)]+)\)/g)].map((m) => m[1]);
check(fontFiles.length >= 6, 'css/fonts.css lists the font files');
fontFiles.forEach((f) => check(fs.existsSync(path.join(ROOT, f)), `missing font file ${f}`));
['Fredoka', 'Nunito'].forEach((family) => check(fontsCss.includes(`font-family: '${family}'`), `css/fonts.css has ${family}`));
check(/U\+0400-045F/.test(fontsCss) && /U\+0460-052F/.test(fontsCss), 'Nunito covers Cyrillic, incl. ў қ ғ ҳ');

// ---------- app manifest and offline worker ----------

const manifest = JSON.parse(read('manifest.webmanifest'));
check(manifest.name && manifest.short_name && manifest.start_url && manifest.display === 'standalone', 'manifest has name, start_url, display');
(manifest.icons || []).forEach((i) => check(fs.existsSync(path.join(ROOT, i.src)), `manifest icon missing: ${i.src}`));
check((manifest.icons || []).some((i) => i.sizes === '512x512') && (manifest.icons || []).some((i) => i.sizes === '192x192'), 'manifest has 192 and 512 icons');
check(fs.existsSync(path.join(ROOT, 'sw.js')), 'sw.js exists');

// ---------- Tailwind up to date (needs npm install) ----------

let tailwindChecked = false;
if (fs.existsSync(path.join(ROOT, 'node_modules/.bin/tailwindcss'))) {
    const tmp = path.join(os.tmpdir(), `tailwind-check-${process.pid}.css`);
    tailwind(tmp);
    check(fs.readFileSync(tmp, 'utf8') === read('css/tailwind.css'), 'css/tailwind.css is out of date: run npm run build');
    fs.unlinkSync(tmp);
    tailwindChecked = true;
}

console.log(`${total - failed}/${total} passed${tailwindChecked ? '' : ' (Tailwind freshness skipped: run npm install to check it)'}`);
process.exit(failed ? 1 : 0);
