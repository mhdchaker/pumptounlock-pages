// Checks every internal link, image and anchor in dist/ after a build.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const pages = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) pages.push(p);
  }
};
walk(dist);

const problems = [];
let checked = 0;
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const set of html.matchAll(/(?:srcset|imagesrcset)="([^"]+)"/g)) {
    for (const part of set[1].split(',')) refs.push(part.trim().split(/\s+/)[0]);
  }
  for (const ref of refs) {
    if (!ref.startsWith('/') || ref.startsWith('//')) continue;
    checked++;
    const [path, hash] = ref.split('#');
    let file = join(dist, path);
    if (path.endsWith('/')) file = join(file, 'index.html');
    if (!existsSync(file)) {
      problems.push(`${page.replace(dist, '/')}: ${ref} does not exist`);
      continue;
    }
    if (hash && file.endsWith('.html')) {
      const target = readFileSync(file, 'utf8');
      if (!target.includes(`id="${hash}"`)) problems.push(`${page.replace(dist, '/')}: ${ref} has no such anchor`);
    }
  }
}

console.log(`${pages.length} pages, ${checked} internal references checked.`);
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('All internal links, pictures and anchors exist.');
