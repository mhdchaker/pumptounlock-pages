import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const emptyToUndefined = (value: unknown) => (value === '' || value === null ? undefined : value);

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    // One line under the title in the blog list, also used for search engines.
    description: z.string(),
    // Shorter line for the blog list. Without it the description is used.
    listLine: z.string().optional(),
    // Empty while an article is a draft; set on the day it is published.
    date: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
    // The day the facts in the article were last checked.
    factsChecked: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
    // A draft is shown while working on the site (npm run dev) and left out of the live site.
    draft: z.boolean().default(false),
    author: z.string().default('Lisa Perlmann'),
    // The article's main picture (a path under /img/blog/), for search engines.
    image: z.string().optional(),
  }),
});

export const collections = { blog };
