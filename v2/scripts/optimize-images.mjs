#!/usr/bin/env node
/**
 * Phase 4 — image pipeline
 *
 * Reads every PNG/JPG under ../img (resolved through the v2/public/img
 * symlink) and writes a sibling .webp and .avif. Originals are kept
 * untouched so the legacy site still works.
 *
 * Run:   npm run optimize
 */
import { readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMG_ROOT = join(__dirname, '..', '..', 'img'); // resolves to /home/user/listentotw/img

const RASTER_EXT = new Set(['.png', '.jpg', '.jpeg']);
// PNG that needs alpha (UI sprites). JPGs are always opaque.
const isAlphaCandidate = (file) => extname(file).toLowerCase() === '.png';

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let totalIn = 0;
let totalOut = 0;
let count = 0;

for await (const file of walk(IMG_ROOT)) {
  const ext = extname(file).toLowerCase();
  if (!RASTER_EXT.has(ext)) continue;

  const base = file.slice(0, -ext.length);
  const webpOut = `${base}.webp`;
  const avifOut = `${base}.avif`;

  // Skip if both already exist and are newer than source
  const src = await stat(file);
  const fresh = async (out) =>
    existsSync(out) && (await stat(out)).mtimeMs > src.mtimeMs;
  if ((await fresh(webpOut)) && (await fresh(avifOut))) {
    console.log(`skip   ${basename(file)} (up to date)`);
    continue;
  }

  const img = sharp(file).rotate(); // honor EXIF
  const meta = await img.metadata();

  // Cap the longest side at 1600px — none of the legacy assets need more
  const targetW = Math.min(meta.width ?? 1600, 1600);
  const targetH = Math.min(meta.height ?? 1600, 1600);

  const pipeline = sharp(file)
    .rotate()
    .resize({ width: targetW, height: targetH, fit: 'inside', withoutEnlargement: true });

  const alpha = isAlphaCandidate(file) && meta.channels === 4;

  await pipeline
    .clone()
    .webp({ quality: alpha ? 88 : 80, alphaQuality: 90, effort: 5 })
    .toFile(webpOut);

  await pipeline
    .clone()
    .avif({ quality: alpha ? 60 : 55, effort: 5 })
    .toFile(avifOut);

  const inSize = src.size;
  const outWebp = (await stat(webpOut)).size;
  const outAvif = (await stat(avifOut)).size;
  const best = Math.min(outWebp, outAvif);

  totalIn += inSize;
  totalOut += best;
  count += 1;

  const pct = ((1 - best / inSize) * 100).toFixed(0);
  const fmt = (n) => `${(n / 1024).toFixed(1)}KB`;
  console.log(
    `${basename(file).padEnd(28)} ${fmt(inSize).padStart(8)} -> webp ${fmt(outWebp).padStart(8)}, avif ${fmt(outAvif).padStart(8)}  (-${pct}%)`,
  );
}

console.log(
  `\n${count} images. total ${(totalIn / 1024 / 1024).toFixed(2)} MB -> ${(totalOut / 1024 / 1024).toFixed(2)} MB (best of webp/avif)`,
);
