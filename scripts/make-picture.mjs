// Makes the web versions of a picture: AVIF (small, for current browsers) and WebP (fallback),
// each at the given widths, as public/img[/sub]/<name>-<width>.<ext>.
// Usage: node scripts/make-picture.mjs source.png name 720 1440 [--dir blog] [--avif-only]
import sharp from 'sharp';
import { statSync } from 'node:fs';

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  if (i < 0) return null;
  const takesValue = name === '--dir';
  return args.splice(i, takesValue ? 2 : 1)[takesValue ? 1 : 0];
};
const sub = flag('--dir');
const avifOnly = flag('--avif-only') !== null;
const [source, name, ...widths] = args;
if (!source || !name || !widths.length) {
  console.error('Usage: node scripts/make-picture.mjs source.png name 720 1440 [--dir blog] [--avif-only]');
  process.exit(1);
}
const dir = new URL(`../public/img/${sub ? sub + '/' : ''}`, import.meta.url).pathname;
for (const w of widths.map(Number)) {
  const base = `${dir}${name}-${w}`;
  await sharp(source).resize({ width: w }).avif({ quality: 50, effort: 6 }).toFile(`${base}.avif`);
  if (!avifOnly) await sharp(source).resize({ width: w }).webp({ quality: 82, alphaQuality: 88, effort: 6 }).toFile(`${base}.webp`);
  const kb = (f) => Math.round(statSync(f).size / 1024);
  console.log(`${name}-${w}: avif ${kb(base + '.avif')} KB, webp ${kb(base + '.webp')} KB`);
}
