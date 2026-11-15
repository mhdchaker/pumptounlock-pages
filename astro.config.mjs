import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// The blog list is only in the sitemap once an article is published.
const blogDir = new URL('./src/content/blog/', import.meta.url);
const hasPublishedPosts = readdirSync(blogDir)
  .filter((f) => f.endsWith('.md'))
  .some((f) => !/^draft:\s*true\s*$/m.test(readFileSync(new URL(f, blogDir), 'utf8')));

// Prepares article HTML for the page design:
// - comparison tables: every cell knows its column's name (used as its label on a phone),
//   the row of our own app is marked, and the table keeps its meaning for screen readers
//   although the CSS lays it out as a grid
// - headings: "push-up" never breaks at the hyphen
function rehypeArticle() {
  const text = (node) => (node.type === 'text' ? node.value : (node.children ?? []).map(text).join(''));
  const walk = (node, fn) => {
    fn(node);
    (node.children ?? []).forEach((child) => walk(child, fn));
  };
  const roles = { table: 'table', thead: 'rowgroup', tbody: 'rowgroup', tr: 'row', th: 'columnheader', td: 'cell' };
  return (tree) => {
    walk(tree, (node) => {
      if (node.type !== 'element') return;
      if (/^h[1-6]$/.test(node.tagName)) {
        walk(node, (n) => {
          if (n.type === 'text') n.value = n.value.replace(/push-up/gi, (m) => m.replace('-', '\u2011'));
        });
      }
      if (node.tagName !== 'table') return;
      const rows = [];
      walk(node, (n) => {
        if (n.type !== 'element') return;
        if (roles[n.tagName]) n.properties = { ...n.properties, role: roles[n.tagName] };
        if (n.tagName === 'tr') rows.push(n);
      });
      const cells = (tr) => tr.children.filter((c) => c.type === 'element' && (c.tagName === 'td' || c.tagName === 'th'));
      const heads = rows.length ? cells(rows[0]).map((c) => text(c).trim()) : [];
      node.properties = { ...node.properties, className: ['compare', `cols-${heads.length}`], style: `--cols:${heads.length}` };
      rows.slice(1).forEach((tr) => {
        const tds = cells(tr);
        tds.forEach((td, i) => {
          td.properties = { ...td.properties, dataLabel: heads[i] ?? '' };
        });
        if (tds[0] && text(tds[0]).trim() === 'PumpToUnlock') tr.properties = { ...tr.properties, className: ['own'] };
      });
    });
  };
}

export default defineConfig({
  site: 'https://pumptounlock.com',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  markdown: { rehypePlugins: [rehypeArticle] },
  integrations: [
    sitemap({
      filter: (page) => hasPublishedPosts || !page.includes('/blog/'),
    }),
  ],
});
