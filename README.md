# pumptounlock.com

The website of PumpToUnlock. Built with [Astro](https://astro.build), published with GitHub Pages.

## Pages

| Address | File |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/privacy/` | `src/pages/privacy.astro`, text in `src/content/legal/` |
| `/terms/` | `src/pages/terms.astro` |
| `/support/` | `src/pages/support.astro` |
| `/blog/` and articles | `src/pages/blog/`, articles in `src/content/blog/*.md` |

Facts used on several pages (App Store link, email, questions, the review) are in `src/data/site.ts`.
Colours, type and layout are in `src/styles/global.css`; they follow the Figma page "Website (Github pages)".

## Rules

- No prices anywhere on the site.
- No Press page.
- Old links `/#privacy` and `/#contact` must keep working. The app, the paywalls and the App Store
  use them. The home page forwards them (see the script at the top of `src/pages/index.astro`).
- The footer keeps the credit for the 3D iPhone with both links for as long as the site or the
  App Store images show that phone.

## Writing an article

Add a Markdown file to `src/content/blog/`, or use the browser editor at https://app.pagescms.org
(settings in `.pages.yml`). An article with `draft: true` shows only while working on the site.
The Blog link in the menu and footer appears once one article is published.

An article written outside this repository is copied in with
`node scripts/import-article.mjs "/path/to/article.md"`. It always arrives as a draft.
A table in an article becomes a comparison table: a grid on wide screens, one block for each
row on a phone (the column names become the labels). The row whose first cell says
PumpToUnlock is the white one. Pictures for articles go into `public/img/blog/`.

## Pictures

Every picture is served in two formats: AVIF (about a third of the weight, for current
browsers) and WebP (for older ones), each at two widths. Make them from the original with
`node scripts/make-picture.mjs source.png name 720 1440` (add `--dir blog` for an article)
and show them with the `Pic` component. The width hint (`sizes`) must not be larger than the
width the picture is shown at, or screens fetch the bigger file. Every picture that shows
something gets an alt text that says what is on it; icons that only decorate keep an empty one.

## Working on the site

```bash
npm install
npm run dev      # http://localhost:4321, drafts are shown
npm run build    # the live version, into dist/
```

## Going live

GitHub Pages serves the branch `gh-pages`, which holds the built site and nothing else.
`npm run publish-site` builds the site, runs the checks and pushes the result to that branch.
It refuses to run while there are uncommitted changes or while something still waits for a
decision (`npm run prepublish-check`).

Work happens on a branch and reaches `main` through a pull request, never directly.

Publishing by itself after every merge is prepared in `scripts/github-actions-deploy.yml`.
To switch it on, move that file to `.github/workflows/deploy.yml` (pushing it needs a GitHub
sign-in with the `workflow` right) and set the repository's Pages source to "GitHub Actions".
The browser editor needs this: an article saved there is only a commit, and without the
workflow someone still has to run `npm run publish-site`.
