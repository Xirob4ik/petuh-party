// Переводит стикеры из tools/sticker-svg/*.svg в public/stickers/*.webp (400×400).
// Зачем: Safari на iPhone рисует SVG с тенью и обводкой в низком разрешении — стикеры мылятся.
// Готовая картинка 400×400 выглядит чётко на любом экране.
// Рисует настоящий браузер (Chromium из Playwright), чтобы эмодзи и эффекты вышли как на сайте.
// Запуск:  node tools/rasterize.mjs   (нужны playwright и sharp; на хостинге не запускается — webp лежат в репозитории)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const sharp = require('sharp');

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, 'tools', 'sticker-svg');
const out = path.join(root, 'public', 'stickers');

fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(out)) if (/\.(webp|svg)$/.test(f)) fs.rmSync(path.join(out, f));

const files = fs.readdirSync(src).filter((f) => f.endsWith('.svg'));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 200, height: 200 }, deviceScaleFactor: 2 });
let bytes = 0;
for (const f of files) {
  const data = fs.readFileSync(path.join(src, f)).toString('base64');
  await page.setContent(
    `<html><body style="margin:0;background:transparent"><img id="s" width="200" height="200" src="data:image/svg+xml;base64,${data}"></body></html>`,
  );
  await page.waitForFunction(() => document.getElementById('s').complete);
  const png = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: 200, height: 200 } });
  const buf = await sharp(png).webp({ quality: 90, alphaQuality: 100, effort: 4, smartSubsample: true }).toBuffer();
  fs.writeFileSync(path.join(out, f.replace(/\.svg$/, '.webp')), buf);
  bytes += buf.length;
}
await browser.close();

// фото-стикеры: уже готовые картинки, только переводим в WebP
const photos = path.join(root, 'tools', 'sticker-photos');
for (const f of fs.existsSync(photos) ? fs.readdirSync(photos).filter((x) => x.endsWith('.png')) : []) {
  const buf = await sharp(path.join(photos, f)).webp({ quality: 88, alphaQuality: 100, effort: 4 }).toBuffer();
  fs.writeFileSync(path.join(out, f.replace(/\.png$/, '.webp')), buf);
  bytes += buf.length;
}
console.log(`${files.length} стикеров → public/stickers, ${(bytes / 1024 / 1024).toFixed(1)} МБ`);
