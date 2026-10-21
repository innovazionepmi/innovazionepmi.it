import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const faq = z.array(z.object({ q: z.string(), a: z.string() })).optional();

const articoli = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/articoli' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      seoTitle: z.string().max(65).optional(), // <title> (max ~60 caratteri); se manca: "titolo | Innovazione PMI"
      date: z.coerce.date(),
      updated: z.coerce.date().optional(), // data ultimo aggiornamento sostanziale
      description: z.string().max(165), // meta description: tienila sotto i 160 caratteri
      categories: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      faq, // domande/risposte: visibili in pagina + markup FAQPage
    }),
});

// Pagine "statiche" (servizi, privacy). Il nome file = URL (/<id>/).
const pagine = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/pagine' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      seoTitle: z.string().optional(), // <title> alternativo, se diverso dall'H1
      description: z.string().max(165),
      eyebrow: z.string().optional(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      cta: z.boolean().default(true),
      hero: z.boolean().default(true), // hero con immagine a lato
      service: z.string().optional(), // se presente: markup Service (nome servizio)
      faq,
      heroVideo: z.string().optional(), // video di sfondo nell'hero (path in public/), al posto dell'immagine
      imageFit: z.enum(['cover', 'contain']).default('cover'), // 'contain' per loghi e immagini da non ritagliare
      ctaLabel: z.string().default('Contattaci'), // testo del bottone nell'hero
      metaPixel: z.boolean().default(false), // carica il Meta Pixel (PageView) su questa pagina
      leadForm: z.object({
        endpoint: z.string().url(), // webhook n8n che riceve il lead
        redirect: z.string(), // thank-you dopo l'invio
        phone: z.boolean().default(false),
        submitLabel: z.string().optional(),
        note: z.string().optional(),
      }).optional(),
      hubspotForm: z.string().optional(), // ID del form HubSpot da incorporare al posto del form di contatto
      formTitle: z.string().optional(), // titolo del form di contatto in fondo alla pagina
      formIntro: z.string().optional(),
      noindex: z.boolean().default(false),
    }),
});

export const collections = { articoli, pagine };
