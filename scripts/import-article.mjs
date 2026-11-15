// Copies an article written outside this repository into src/content/blog/ as a draft.
// Usage: node scripts/import-article.mjs "/path/to/article.md"
// The file name comes from the article's `slug`. Changes made for the site:
//   - the picture slot becomes the article's picture (see article-pictures.json)
//   - other HTML comments (working notes) are removed
//   - links to pumptounlock.com become internal links
//   - the closing "free to download" line and its App Store link are left out,
//     because the article page ends with the download card that says the same
//   - a new article arrives as a draft without a date: publishing is a separate, deliberate step;
//     an article that is already published keeps its date and stays published
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';

const source = process.argv[2];
if (!source) {
  console.error('Usage: node scripts/import-article.mjs "/path/to/article.md"');
  process.exit(1);
}
const text = readFileSync(source, 'utf8');
const split = text.indexOf('\n---\n', 4);
const front = text.slice(4, split);
let body = text.slice(split + 5);

const field = (key) => {
  const m = front.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  return m ? m[1].trim() : '';
};
const slug = field('slug').replace(/^["']|["']$/g, '');
if (!slug) throw new Error('The article has no slug.');

// The picture slot (an HTML comment that starts with "Picture slot" and names the caption)
// becomes the article's picture, if scripts/article-pictures.json has one for this article.
const pictures = JSON.parse(readFileSync(new URL('./article-pictures.json', import.meta.url), 'utf8'));
const picture = pictures[slug];
let pictureUsed = false;
if (picture) {
  body = body.replace(/<!--\s*Picture slot[\s\S]*?-->/, (slot) => {
    const caption = (slot.match(/Caption:\s*"([^"]+)"/) ?? [])[1] ?? '';
    const file = (suffix) => `/img/blog/${picture.base}${suffix}.webp`;
    pictureUsed = true;
    return `<figure>
  <picture>
    <source media="(max-width: 899px)" srcset="${file('-phone-700')} 700w, ${file('-phone-1050')} 1050w" sizes="100vw" />
    <img src="${file('-1440')}" srcset="${file('-720')} 720w, ${file('-1440')} 1440w" sizes="720px" width="${picture.width}" height="${picture.height}" loading="lazy" alt="${picture.alt}" />
  </picture>
  <figcaption>${caption}</figcaption>
</figure>`;
  });
}
body = body.replace(/<!--[\s\S]*?-->\n*/g, '');
body = body.replaceAll('https://pumptounlock.com/#privacy', '/privacy/');
body = body.replace(/\]\(https:\/\/pumptounlock\.com\/?\)/g, '](/)');
body = body.replace(
  /PumpToUnlock is free to download for iPhone with iOS 16 or later\.\n\n\[[^\]]*\]\(https:\/\/apps\.apple\.com\/app\/id\d+\)\n\n/,
  '',
);
body = body.replace(/^\n+/, '');

const dir = new URL('../src/content/blog/', import.meta.url);

// An article that is already published stays published with its date: a new copy of the
// text must not take it offline. A new article arrives as a draft without a date.
let dateLine = 'date: ""            # set on the day it is published';
let draftLine = 'draft: true';
try {
  const existing = readFileSync(new URL(`${slug}.md`, dir), 'utf8');
  const date = existing.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);
  if (/^draft:\s*false\s*$/m.test(existing) && date) {
    dateLine = `date: ${date[1]}`;
    draftLine = 'draft: false';
  }
} catch {
  // no copy yet
}

const marker = `# Source: ${source}`;
const out = `---
${marker}
# Copied by scripts/import-article.mjs. Edit the source, then copy again.
title: ${field('title')}
description: ${field('description')}
listLine: ${field('listLine')}
${dateLine}
factsChecked: ${field('factsChecked')}
author: ${field('author')}${pictureUsed ? `\nimage: /img/blog/${picture.base}-1440.webp` : ''}
${draftLine}
---

${body}`;

for (const name of readdirSync(dir)) {
  if (!name.endsWith('.md') || name === `${slug}.md`) continue;
  const other = readFileSync(new URL(name, dir), 'utf8');
  const sameSource = other.includes(marker) || other.includes(source.split('/').slice(-3).join('/'));
  if (sameSource) {
    unlinkSync(new URL(name, dir));
    console.log(`Removed the copy under its old name: ${name}`);
  }
}
writeFileSync(new URL(`${slug}.md`, dir), out);
const links = [...body.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]);
console.log(`Wrote src/content/blog/${slug}.md: ${body.split(/\s+/).length} words, ${links.length} links, internal: ${links.filter((l) => l.startsWith('/')).join(' ')}`);
