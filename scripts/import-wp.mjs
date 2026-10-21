// One-off importer: WordPress REST JSON (+ HTML live per title/description SEO) -> Markdown in src/content/articoli,
// immagini scaricate in src/assets/articoli.
// Usage: node scripts/import-wp.mjs <dir-con-posts.json> (la sottocartella html/posts/<slug>.html è opzionale)
import fs from 'node:fs';
import path from 'node:path';
import TurndownService from 'turndown';

const dir = process.argv[2];
const root = path.resolve(import.meta.dirname, '..');
const posts = JSON.parse(fs.readFileSync(path.join(dir, 'posts.json'), 'utf8'));

const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-' });
td.remove(['script', 'style', 'noscript']);
td.addRule('figure', { filter: 'figure', replacement: (c) => `\n\n${c.trim()}\n\n` });

const ent = (s) =>
  s.replace(/&#8217;|&rsquo;/g, '’').replace(/&#8216;|&lsquo;/g, '‘').replace(/&#8220;|&ldquo;/g, '“').replace(/&#8221;|&rdquo;/g, '”')
    .replace(/&#8211;|&ndash;/g, '–').replace(/&#8212;|&mdash;/g, '—').replace(/&#038;|&amp;/g, '&').replace(/&#8230;|&hellip;/g, '…')
    .replace(/&nbsp;/g, ' ').replace(/&egrave;/g, 'è').replace(/&eacute;/g, 'é').replace(/&agrave;/g, 'à').replace(/&ograve;/g, 'ò')
    .replace(/&ugrave;/g, 'ù').replace(/&igrave;/g, 'ì').replace(/&quot;/g, '"').replace(/&#039;|&#8242;/g, "'");
const yamlStr = (s) => JSON.stringify(s);
const full = (u) => u.replace(/-\d+x\d+(\.\w+)$/, '$1');

async function download(url, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  for (const u of [full(url), url]) {
    const r = await fetch(u);
    if (r.ok) { fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer())); return true; }
  }
  return false;
}
const ext = (u) => path.extname(new URL(u).pathname).toLowerCase() || '.jpg';

for (const p of posts) {
  const slug = p.slug;
  const html = fs.existsSync(path.join(dir, 'html/posts', `${slug}.html`)) ? fs.readFileSync(path.join(dir, 'html/posts', `${slug}.html`), 'utf8') : '';
  const seoTitleRaw = ent(html.match(/<title>([^<]*)/)?.[1] ?? '').replace(/\s+-\s+Innovazione PMI$/, '').trim();
  const metaDesc = ent(html.match(/<meta name="description" content="([^"]*)/)?.[1] ?? '');
  const title = ent(p.title.rendered);

  // immagine di copertina
  let coverLine = '', coverAltLine = '';
  const fm0 = p._embedded?.['wp:featuredmedia']?.[0];
  if (fm0?.source_url) {
    const rel = `articoli/${slug}${ext(fm0.source_url)}`;
    if (await download(fm0.source_url, path.join(root, 'src/assets', rel))) {
      coverLine = `cover: ${yamlStr('../../assets/' + rel)}`;
      coverAltLine = `coverAlt: ${yamlStr(ent(fm0.alt_text || title))}`;
    }
  }

  // immagini nel testo
  let content = p.content.rendered.replace(/<!--[\s\S]*?-->/g, '').replace(/<div[^>]*aria-hidden="true"[^>]*><\/div>/g, '');
  let n = 0;
  const imgs = [...content.matchAll(/<img[^>]*>/g)].map((m) => m[0]);
  for (const tag of imgs) {
    const src = tag.match(/ src="([^"]+)"/)?.[1];
    const alt = ent(tag.match(/ alt="([^"]*)"/)?.[1] ?? '');
    if (!src) continue;
    n += 1;
    const rel = `articoli/inline/${slug}-${n}${ext(src)}`;
    const ok = await download(src, path.join(root, 'src/assets', rel));
    content = content.replace(tag, ok ? `<img src="@@${rel}" alt="${alt.replace(/"/g, '&quot;')}">` : '');
  }
  let body = ent(td.turndown(content)).replace(/@@([^)\s]+)/g, '../../assets/$1').replace(/\n{3,}/g, '\n\n').trim();

  const firstPara = body.split('\n\n').find((x) => x && !/^[#!\-\d]/.test(x) && x.length > 60) ?? '';
  let desc = (metaDesc || firstPara.replace(/[*_\[\]]/g, '')).trim();
  if (desc.length > 160) desc = desc.slice(0, 157).replace(/\s+\S*$/, '') + '…';

  const cats = (p._embedded?.['wp:term']?.[0] ?? []).map((c) => ent(c.name));
  const modified = p.modified.slice(0, 10), date = p.date.slice(0, 10);
  const days = (new Date(modified) - new Date(date)) / 864e5;
  const fm = [
    '---',
    `title: ${yamlStr(title)}`,
    seoTitleRaw && seoTitleRaw !== title && seoTitleRaw.length <= 65 ? `seoTitle: ${yamlStr(seoTitleRaw)}` : '',
    `date: ${date}`,
    days > 1 ? `updated: ${modified}` : '',
    `description: ${yamlStr(desc)}`,
    `categories: ${JSON.stringify(cats)}`,
    coverLine,
    coverAltLine,
    '---',
  ].filter(Boolean).join('\n');
  fs.writeFileSync(path.join(root, 'src/content/articoli', `${slug}.md`), `${fm}\n\n${body}\n`);
  console.log(slug, n, 'img', desc.length);
}
