export const business = {
  name: 'Kube’s Yard Maintenance',
  phone: '780-919-8240',
  phoneHref: 'tel:+17809198240',
  email: 'kubesym@gmail.com',
  emailHref: 'mailto:kubesym@gmail.com',
  area: 'Edmonton area, Alberta',
  areaNote: 'Contact us to confirm service at your address.',
  description:
    'Kube’s Yard Maintenance offers lawn mowing, spring cleanup, acreage maintenance, and snow removal for the Edmonton area. Contact us to confirm service at your address.',
} as const;

export const navigation = [
  { href: '/lawn-care', label: 'Lawn & yard care' },
  { href: '/snow-removal', label: 'Snow removal' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export type Season = {
  id: 'summer' | 'winter';
  label: string;
  title: string;
  description: string;
  href: '/lawn-care' | '/snow-removal';
  linkLabel: string;
  logo: string;
  offerings: readonly string[];
};

export const seasons: readonly [Season, Season] = [
  {
    id: 'summer',
    label: 'The growing season',
    title: 'Lawn & yard care.',
    description:
      'From the first spring cleanup to regular mowing, find the care that fits your yard.',
    href: '/lawn-care',
    linkLabel: 'Explore lawn & yard care',
    logo: '/brand/summer-logo.png',
    offerings: [
      'Lawn mowing & trimming',
      'Spring & yard cleanup',
      'Aeration',
      'Acreage maintenance',
    ],
  },
  {
    id: 'winter',
    label: 'The snowy season',
    title: 'Snow removal.',
    description:
      'Snow removal for your driveway, sidewalk, and main entrance steps. Ask about seasonal or call-out service.',
    href: '/snow-removal',
    linkLabel: 'Explore snow removal',
    logo: '/brand/winter-logo.png',
    offerings: [
      'Driveway snow removal',
      'Sidewalk clearing',
      'Main entrance steps',
      'Seasonal & call-out options',
    ],
  },
];

export const quoteAction = {
  href: '/contact',
  label: 'Request a Quote',
} as const;
