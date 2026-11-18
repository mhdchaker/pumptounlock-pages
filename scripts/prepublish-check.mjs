// Stops a deploy while something on the site still waits for the owner's decision.
// Run by .github/workflows/deploy.yml before the build.
import { readFileSync, readdirSync } from 'node:fs';

const problems = [];
const site = readFileSync(new URL('../src/data/site.ts', import.meta.url), 'utf8');

if (/byConfirmed:\s*false/.test(site)) {
  problems.push(
    'The review on the home page carries a name that is not confirmed (src/data/site.ts, review.by). ' +
      'Set the name the owner chose, or remove it, then set byConfirmed to true.',
  );
}

const blogDir = new URL('../src/content/blog/', import.meta.url);
const published = readdirSync(blogDir)
  .filter((f) => f.endsWith('.md'))
  .filter((f) => !/^draft:\s*true\s*$/m.test(readFileSync(new URL(f, blogDir), 'utf8')));

if (published.length && /blogAuthor:\s*\{[^}]*decided:\s*false/.test(site)) {
  problems.push(
    `An article would go live (${published.join(', ')}) but who the articles are by is not decided ` +
      '(src/data/site.ts, blogAuthor). The name in the articles is a pen name.',
  );
}

for (const file of ['privacy-body.html', 'privacy-meta.json']) {
  const legal = readFileSync(new URL(`../src/content/legal/${file}`, import.meta.url), 'utf8');
  if (legal.includes('PUBLISH-DATE')) {
    problems.push(
      `The privacy policy still says PUBLISH-DATE (src/content/legal/${file}). ` +
        'Put in the day it goes live, written like "November 13, 2026". ' +
        'It goes live together with the app version that contains the Meta SDK, not before.',
    );
  }
}

if (problems.length) {
  console.error('Not ready to go live:\n- ' + problems.join('\n- '));
  process.exit(1);
}
console.log('Pre-publish check passed.');
