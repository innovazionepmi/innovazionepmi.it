// Dati globali del sito: modificali qui e si aggiornano ovunque.

export const site = {
  name: 'Innovazione PMI',
  shortName: 'Innovazione PMI',
  tagline: 'Portiamo prosperità alle PMI',
  description:
    'Innovazione PMI è una società di consulenza che aiuta le PMI italiane a innovare e automatizzare i processi di lavoro con l’introduzione dell’Intelligenza Artificiale.',
  url: 'https://www.innovazionepmi.it',
  email: 'hello@innovazionepmi.it',
  city: 'Roma',
  parent: { name: 'Emilio Zucca Web Strategies', url: 'https://www.emiliozucca.com', vat: '14454021008' },
  gtmId: 'GTM-5WKZWRCD',
  hubspotPortalId: '4160510',
  metaPixelId: '128947471074189', // usato solo sulle pagine del percorso Acceleratore (come nelle ex landing)
  // Widget Iubenda (banner cookie) e privacy policy ospitata da Iubenda
  iubendaWidget: 'https://embeds.iubenda.com/widgets/a495720d-7b95-4967-8385-f06be13e9c4f.js',
  privacyUrl: 'https://www.iubenda.com/privacy-policy/28936980',
  // Webhook n8n universale (workflow "Leadgen universale"): riceve i lead di tutti i form LeadForm delle pagine del programma
  leadWebhook: 'https://n8n.srv976702.hstgr.cloud/webhook/5d0e8c1a-3b7f-4e2a-9c64-a1f27d83be50',
  // Prenotazione HubSpot Meetings mostrata nelle thank-you
  meetingsUrl: 'https://meetings.hubspot.com/info9088',
  // Form HubSpot di contatto del sito (home, /contatti/); dopo l'invio reindirizza a /grazie/
  contactFormId: 'f8abb35c-98ce-45d7-bc1c-45e2e221b4bf',
  knowsAbout: [
    'Innovazione dei processi',
    'Automazione intelligente',
    'Intelligenza artificiale per le PMI',
    'Knowledge management',
    'Formazione sull’intelligenza artificiale',
    'Marketing e sviluppo business',
  ],
};

// PMI Innovation Program: un solo percorso a fasi. La gerarchia degli URL riflette questa struttura.
export interface Voce {
  href: string;
  label: string;
  title: string;
  kicker: string;
  text: string;
  external?: boolean;
  figli?: Voce[];
}

export const programma = {
  href: '/pmi-innovation-program/',
  label: 'PMI Innovation Program',
  fasi: [
    {
      href: '/acceleratore-adozione-ai-call/',
      label: 'Ingresso gratuito',
      title: 'Acceleratore per Adozione AI',
      kicker: 'Fase 0 · Gratuito',
      text: 'Una call live gratuita di 30 minuti con un consulente per capire se e dove l’AI ha senso nella tua azienda, prima di spendere.',
    },
    {
      href: '/pmi-innovation-program/ai-adoption-roadmap/',
      label: 'AI Adoption Roadmap',
      title: 'AI Adoption Roadmap: l’assessment',
      kicker: 'Fase 1 · Assessment',
      text: 'Una panoramica di tutta l’azienda per capire dove conviene intervenire, con priorità, casi d’uso e prossimo passo.',
    },
    {
      href: '/pmi-innovation-program/process-roadmap/',
      label: 'Process Roadmap',
      title: 'Process Roadmap: progettare i processi',
      kicker: 'Fase 2 · Progettazione',
      text: 'Mappiamo e ridisegniamo nel dettaglio i processi che contano, con KPI e una roadmap di automazione pronta da realizzare.',
    },
    {
      href: '/pmi-innovation-program/implementazione/',
      label: 'Implementazione',
      title: 'Implementazione: automazione e AIBox',
      kicker: 'Fase 3 · Realizzazione',
      text: 'Realizziamo quanto progettato: automazioni dei processi e AIBox, la knowledge base aziendale interrogabile con l’AI.',
      figli: [
        {
          href: '/pmi-innovation-program/implementazione/aibox/',
          label: 'AIBox',
          title: 'AIBox: la knowledge base intelligente',
          kicker: 'Fase 3 · Prodotto',
          text: 'Documenti, procedure e know-how aziendale diventano una knowledge base interrogabile in linguaggio naturale, con la fonte di ogni risposta.',
        },
      ],
    },
    {
      href: '/formazione/',
      label: 'Formazione',
      title: 'Formazione su due livelli',
      kicker: 'Fase 4 · Trasversale',
      text: 'Alla direzione si insegna a governare il cambiamento, agli operativi si insegnano gli strumenti.',
      figli: [
        {
          href: '/formazione/introduzione-ai-organizzazione/',
          label: 'Introduzione dell’AI nell’organizzazione',
          title: 'Introduzione dell’AI nell’organizzazione',
          kicker: 'Livello 1 · Direzione',
          text: 'Una giornata per titolare e responsabili: priorità, ruoli, regole e un piano dei primi novanta giorni.',
        },
        {
          href: '/formazione/corso-claude/',
          label: 'Corso operativo su Claude',
          title: 'Corso operativo su Claude',
          kicker: 'Livello 2 · Operativo',
          text: 'Due giornate pratiche per il personale operativo, sui compiti di tutti i giorni.',
        },
      ],
    },
  ] as Voce[],
};

export const marketing: Voce = {
  href: 'https://www.emiliozucca.com/',
  label: 'Marketing e sviluppo business',
  title: 'Marketing e sviluppo business',
  kicker: 'Area complementare',
  text: 'Strategie di marketing e sviluppo commerciale su misura, con il team di Emilio Zucca Web Strategies.',
  external: true,
};

// Elenco piatto di tutte le pagine di servizio (alimenta footer, schema.org, llms.txt)
export const servizi: Voce[] = [
  {
    href: programma.href,
    label: programma.label,
    title: programma.label,
    kicker: 'Percorso',
    text: 'Un unico percorso a fasi, dal processo alla tecnologia: puoi seguirlo in ordine o entrare dalla fase che ti serve.',
  },
  ...programma.fasi.flatMap((f) => [f, ...(f.figli ?? [])]),
  marketing,
];
