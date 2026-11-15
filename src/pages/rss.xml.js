import rss from '@astrojs/rss';
import { getPosts } from '../data/posts';
import { site } from '../data/site';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: `${site.name} Blog`,
    description: 'Notes on screen time, push-ups and how the app works.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
    })),
  });
}
