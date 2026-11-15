import { getCollection } from 'astro:content';

// Published articles, newest first. Drafts show only while working on the site.
export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts
    .map((post) => {
      if (!post.data.date && !post.data.draft) {
        throw new Error(`The article "${post.id}" is not a draft but has no date.`);
      }
      // A draft without a date shows today's date while working on the site.
      return { ...post, data: { ...post.data, date: post.data.date ?? new Date() } };
    })
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const shortDate = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export const longDate = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
