// Audit SEO/GEO sull'output di `npm run build` (cartella dist). Uso: npm run build && node scripts/audit.mjs
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = walk(dist);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const known = new Set(files.map((f) => '/' + path.relative(dist, f).replace(/\\/g, '/')));
const urlOf = (f) => '/' + path.relative(dist, f).replace(/\\/g, '/').replace(/index\.html$/, '');

let problems = 0;
const warn = (page, msg) => { problems++; console.log(`  ✗ ${page}: ${msg}`); };
const titles = new Map();
const descs = new Map();

for (const f of htmlFiles) {
  const url = urlOf(f);
  const h = fs.readFileSync(f, 'utf8');
  if (url === '/404.html' || url === '/grazie/') continue;
  const title = h.match(/<title>(.*?)<\/title>/s)?.[1] ?? '';
  const desc = h.match(/<meta name="description" content="(.*?)"/s)?.[1] ?? '';
  const h1s = (h.match(/<h1[\s>]/g) ?? []).length;
  const canon = h.match(/<link rel="canonical" href="(.*?)"/)?.[1];
  const imgs = [...h.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const noAlt = imgs.filter((i) => !/\balt=/.test(i)).length;
  const noDims = imgs.filter((i) => !/\bwidth=/.test(i) || !/\bheight=/.test(i)).length;

  if (!title) warn(url, 'manca <title>');
  else if (title.length > 65) warn(url, `title lungo (${title.length}): ${title}`);
  if (!desc) warn(url, 'manca meta description');
  else if (desc.length < 70 || desc.length > 165) warn(url, `meta description di ${desc.length} caratteri`);
  if (h1s !== 1) warn(url, `H1 trovati: ${h1s}`);
  if (!canon || !canon.endsWith(url)) warn(url, `canonical anomalo: ${canon}`);
  if (noAlt) warn(url, `${noAlt} immagini senza attributo alt`);
  const emptyAlt = url.startsWith('/blog/') ? imgs.filter((i) => /\balt=(""|'')/.test(i)).length : 0;
  if (emptyAlt) warn(url, `${emptyAlt} immagini con alt vuoto`);
  if (noDims) warn(url, `${noDims} immagini senza width/height (CLS)`);
  if (titles.has(title)) warn(url, `title duplicato con ${titles.get(title)}`); else titles.set(title, url);
  if (descs.has(desc)) warn(url, `description duplicata con ${descs.get(desc)}`); else descs.set(desc, url);

  // JSON-LD
  const ld = [...h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
  if (!ld.length) warn(url, 'nessun JSON-LD');
  const types = [];
  for (const m of ld) {
    try {
      const j = JSON.parse(m[1]);
      for (const n of j['@graph'] ?? [j]) types.push([].concat(n['@type']).join('/'));
    } catch (e) { warn(url, 'JSON-LD non valido: ' + e.message); }
  }

  // link interni
  for (const m of h.matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)/g)) {
    const href = m[1];
    if (href === '/') continue;
    const target = href.endsWith('/') ? href + 'index.html' : href;
    if (!known.has(target) && !known.has(href)) warn(url, `link interno rotto: ${href}`);
  }
  console.log(`✓ ${url.padEnd(62)} title ${String(title.length).padStart(2)} · desc ${String(desc.length).padStart(3)} · ${types.join(', ')}`);
}

for (const must of ['/robots.txt', '/llms.txt', '/llms-full.txt', '/rss.xml', '/sitemap-index.xml', '/site.webmanifest']) {
  if (!known.has(must)) warn(must, 'file mancante in dist');
}
console.log(problems ? `\n${problems} problemi` : '\nNessun problema rilevato');
process.exit(problems ? 1 : 0);
