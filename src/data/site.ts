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
  // Form HubSpot di contatto del sito (home, /contatti/, pagine servizi); dopo l'invio reindirizza a /grazie/
  contactFormId: 'f8abb35c-98ce-45d7-bc1c-45e2e221b4bf',
  knowsAbout: [
    'Innovazione dei processi',
    'Automazione intelligente',
    'Intelligenza artificiale per le PMI',
    'Knowledge management',
    'Marketing e sviluppo business',
  ],
};

export const aree = [
  {
    href: '/innovazione-dei-processi/',
    label: 'Innovazione dei processi',
    title: 'Innovazione dei processi',
    text: 'Rendiamo più semplice e moderno il modo di lavorare della tua impresa: analizziamo i flussi, individuiamo gli sprechi e progettiamo processi più rapidi, chiari e sostenibili.',
    icon: 'processi' as const,
    external: false,
  },
  {
    href: '/automazione-intelligente/',
    label: 'Automazione intelligente',
    title: 'Automazione intelligente',
    text: 'Liberiamo risorse preziose automatizzando le attività ripetitive e a basso valore: dall’amministrazione alla gestione clienti, sistemi che fanno risparmiare tempo e riducono gli errori.',
    icon: 'automazione' as const,
    external: false,
  },
  {
    href: 'https://www.emiliozucca.com/',
    label: 'Marketing e sviluppo business',
    title: 'Marketing e sviluppo business',
    text: 'Strategie di marketing e sviluppo commerciale su misura per attrarre nuovi clienti e fidelizzare quelli esistenti, con il team di Emilio Zucca Web Strategies.',
    icon: 'marketing' as const,
    external: true,
  },
];

// Prodotti e percorsi (ex landing page, ora parte strutturale del sito)
export const percorsi = [
  {
    href: '/aibox/',
    label: 'AIBox',
    title: 'AIBox: la knowledge base intelligente',
    kicker: 'Prodotto',
    text: 'Documenti, procedure e know-how aziendale diventano una knowledge base interrogabile in linguaggio naturale, con risposte precise e la fonte di ogni risposta.',
    icon: undefined,
    external: false,
  },
  {
    href: '/acceleratore-adozione-ai-call/',
    label: 'Acceleratore per Adozione AI',
    title: 'Acceleratore per Adozione AI',
    kicker: 'Percorso gratuito',
    text: 'Una call live gratuita di 30 minuti con un consulente per capire dove l’AI ha senso nella tua azienda, prima di spendere.',
    icon: undefined,
    external: false,
  },
];

export const servizi = [...aree, ...percorsi];
