// /llms.txt — indice del sito pensato per gli LLM (https://llmstxt.org/).
// Si rigenera da solo a ogni build leggendo le collezioni: non va modificato a mano.
import { getCollection } from 'astro:content';
import { site, servizi } from '../data/site';

export async function GET() {
  const articoli = (await getCollection('articoli')).sort((a, b) => +b.data.date - +a.data.date);
  const pagine = await getCollection('pagine');
  const abs = (p: string) => new URL(p, site.url).toString();
  const svcDesc = (href: string) => pagine.find((p) => `/${p.id}/` === href)?.data.description ?? '';

  const out = `# ${site.name}

> ${site.description}

${site.name} è un brand di ${site.parent.name}, con base a ${site.city}. Lavora con le PMI italiane su innovazione dei processi, automazione intelligente, intelligenza artificiale e sviluppo del business. Il sito è in italiano.

## Servizi
${servizi.map((s) => `- [${s.label}](${s.external ? s.href : abs(s.href)}): ${svcDesc(s.href) || s.text}`).join('\n')}

## Blog
${articoli.map((a) => `- [${a.data.title}](${abs(`/blog/${a.id}/`)}): ${a.data.description}`).join('\n')}

## Contatti e informazioni
- [Contatti](${abs('/contatti/')}): email ${site.email}, ${site.city}
- [Privacy e Cookie Policy](${site.privacyUrl})
- [${site.parent.name}](${site.parent.url}): marketing e comunicazione digitale

## Optional
- [Testo completo per LLM](${abs('/llms-full.txt')}): servizi, FAQ e tutti gli articoli in un unico file
- [Feed RSS](${abs('/rss.xml')})
`;
  return new Response(out, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
