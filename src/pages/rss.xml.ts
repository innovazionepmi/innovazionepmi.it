import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../data/site';

export async function GET(context: APIContext) {
  const articoli = (await getCollection('articoli')).sort((a, b) => +b.data.date - +a.data.date);
  return rss({
    title: `${site.name} – Blog`,
    description: 'Contenuti su AI, automazione e innovazione dei processi per le PMI.',
    site: context.site ?? site.url,
    customData: '<language>it-IT</language>',
    items: articoli.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      pubDate: a.data.date,
      link: `/blog/${a.id}/`,
      categories: a.data.categories,
      author: `${site.email} (${site.name})`,
    })),
  });
}
