# innovazionepmi.it

Sito di Innovazione PMI (brand di Emilio Zucca Web Strategies). Astro (statico) + contenuti in Markdown/MDX, deploy su Vercel. Migrato da WordPress (Salient); include le ex landing di `landing.innovazionepmi.it` (AIBox, Acceleratore per Adozione AI), ora pagine normali del sito.

## Dove si modifica cosa
- `src/content/articoli/*.md`: articoli del blog (URL `/blog/<nome-file>/`). Front matter: title, seoTitle, date, updated, description, categories, cover (`../../assets/articoli/...`), coverAlt, faq.
- `src/content/pagine/*.mdx`: pagine servizi (URL `/<nome-file>/`): innovazione-dei-processi, automazione-intelligente, aibox, acceleratore-adozione-ai. Front matter: title, seoTitle, description, eyebrow, image/imageAlt/imageFit, hero, ctaLabel, service, faq, `hubspotForm` (ID form HubSpot incorporato) oppure `leadForm` (form custom verso webhook n8n: endpoint, redirect, phone), formTitle/formIntro, `metaPixel`, `noindex`.
- `src/data/site.ts`: contatti, ID di tracciamento (GTM, HubSpot, Meta Pixel), Iubenda, elenco `aree` (3 aree di intervento) e `percorsi` (AIBox, Acceleratore). `servizi` = aree + percorsi: alimenta menu "Servizi", footer, `/servizi/`, schema.org, llms.txt.
- `src/pages/index.astro` (home), `servizi.astro` (hub), `contatti.astro`, `grazie.astro` (thank-you generico, noindex), `blog/`.
- Thank-you delle ex landing, con gli stessi path di prima (le conversioni GTM/HubSpot/Meta li usano): `src/pages/aibox/typ-aibox.astro`, `src/pages/acceleratore-adozione-ai/typ-ai-adoption-accelerator.astro` (invia anche l'evento Meta `Lead`).
- Acceleratore, due varianti con webhook n8n diversi: `acceleratore-adozione-ai-call` (call live di 30 minuti, thank-you con prenotazione HubSpot Meetings) è quella principale, indicizzata, in menu, hub e sitemap; `acceleratore-adozione-ai` (questionario assistito) è `noindex`, fuori da menu e sitemap, raggiunta solo da link diretti/annunci.
- `src/components/mdx/`: Callout, Card/Cards, Split, Stats, ChatDemo, Infographic (zoom), usabili negli `.mdx`.
- `src/components/LeadForm.astro`: form lead delle landing Acceleratore (solo email aziendali, invio al webhook n8n, redirect alla thank-you che invia l'evento dataLayer `lead_form_submit`).
- `src/components/ContactForm.astro`: form di contatto del sito = form HubSpot "Contatti sito" (`site.contactFormId`); in HubSpot il redirect post-invio è `/grazie/` (che invia l'evento dataLayer `lead_form_submit`, form_name `contatti_sito`).
- `src/styles/global.css`: token del design system Innovazione PMI (slate, teal #12a0b8, magenta, oro; Manrope + Inter; bottoni a pillola, niente emoji).
- `_migrazione/`: materiale grezzo del vecchio sito WordPress, solo riferimento. `scripts/import-wp.mjs` e `scripts/postprocess-articoli.mjs` sono importer una tantum.

## SEO e GEO (già implementati, da mantenere)
- `src/layouts/Base.astro` genera title, meta, canonical, Open Graph/Twitter e il grafo JSON-LD (`src/lib/seo.ts`: Organization con società madre, WebSite, WebPage, BreadcrumbList, Article, Service, FAQPage).
- Front matter: `description` ≤160 caratteri, `seoTitle` ≤65, alt sempre compilati, `faq: [{q, a}]` (visibili in pagina + FAQPage), `updated` quando un articolo viene rivisto davvero.
- Un solo H1 per pagina (lo mette il template): nei file `.md`/`.mdx` si parte da `##`.
- Immagini sempre in `src/assets/` (ottimizzate da Astro); `public/` solo per favicon, robots, manifest e `media/` (video).
- `llms.txt`, `llms-full.txt`, `rss.xml`, sitemap si rigenerano a ogni build.
- Dopo ogni modifica sostanziale: `npm run build && node scripts/audit.mjs`.
- Non linkare internamente URL che sono redirect in `vercel.json`.

## Tracciamento e consenso
- Iubenda (widget) + GTM caricati solo in produzione; gli script marketing (Meta Pixel) sono `type="text/plain"` finché manca il consenso.
- AIBox e il form di contatto usano form HubSpot (portale 4160510) incorporati; le landing Acceleratore usano il form custom con webhook n8n. Le conversioni GTM sono eventi dataLayer `lead_form_submit` (form_name) inviati dalle thank-you.

## Regole
- Mantenere gli URL storici (SEO). Se si cambia uno slug, aggiungere un redirect in `vercel.json`.
- Italiano, tono diretto e professionale, senza emoji. Accenti corretti.
- Comandi: `npm run dev`, `npm run build`.

## Git
- I commit e i push li fa Emilio: non fare `git push` (né creare PR o collegare servizi esterni) senza una richiesta esplicita. Si possono preparare modifiche e, se richiesto, commit locali.
- Remote: https://github.com/innovazionepmi/innovazionepmi.it.git (branch `main`). Vercel pubblica a ogni push su `main` (da collegare).
