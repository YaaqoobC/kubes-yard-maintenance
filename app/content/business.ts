export const business = {
  name: 'Kube’s Yard Maintenance',
  phone: '780-919-8240',
  phoneHref: 'tel:+17809198240',
  email: 'kubesym@gmail.com',
  emailHref: 'mailto:kubesym@gmail.com',
  area: 'Edmonton area, Alberta',
  areaNote: 'Contact us to confirm service at your address.',
  description:
    'Lawn and yard care in the growing season. Snow removal when winter arrives. Yard maintenance for the Edmonton area, with a direct line to Kube’s.',
} as const;

export const navigation = [
  { href: '/lawn-care', label: 'Lawn & yard care' },
  { href: '/snow-removal', label: 'Snow removal' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export type Service = {
  id: string;
  title: string;
  description: string;
  detail: string;
};

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
    title: 'A little more green.\nA little less to do.',
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
    title: 'Winter happens.\nMake room for life.',
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

export const selectedServices: readonly Service[] = [
  {
    id: '01',
    title: 'Your regular lawn routine',
    description:
      'One-time cuts, weekly mowing, or bi-weekly visits. Cut and trim services for front and back yards.',
    detail: 'Residential mowing',
  },
  {
    id: '02',
    title: 'A fresh start for your yard',
    description:
      'Spring cleanup with a first mow and trim, power raking, rock bed blowout, and debris bagging.',
    detail: 'Spring cleanup',
  },
  {
    id: '03',
    title: 'Care for the bigger picture',
    description:
      'Mowing and trimming for acreages, plus aeration and yard cleanup. Get in touch to discuss your property.',
    detail: 'Acreage & additional services',
  },
];

// Source amounts are retained for owner review; public pages invite a current quote.
export type ProvisionalRate = {
  service: string;
  advertisedRate: string;
  conditions: string;
  source: string;
  status: 'unconfirmed';
};

export const provisionalRates: readonly ProvisionalRate[] = [
  {
    service: 'One-time cut',
    advertisedRate: '$60',
    conditions: 'No size stated for one-time cut.',
    source: 'summer_1.PNG',
    status: 'unconfirmed',
  },
  {
    service: 'Weekly residential mowing',
    advertisedRate: '$175/month',
    conditions: 'Up to 3,000 sq ft; front/back; cut and trim; no bagging.',
    source: 'summer_1.PNG',
    status: 'unconfirmed',
  },
  {
    service: 'Bi-weekly residential mowing',
    advertisedRate: '$100/month',
    conditions: 'Up to 3,000 sq ft; front/back; cut and trim; no bagging.',
    source: 'summer_1.PNG',
    status: 'unconfirmed',
  },
  {
    service: 'Residential spring cleanup',
    advertisedRate: '$150',
    conditions:
      'Up to 3,000 sq ft; first mow/trim, power raking, rock bed blowout, debris bagging.',
    source: 'summer_1.PNG',
    status: 'unconfirmed',
  },
  {
    service: 'Commercial/acreage spring cleanup',
    advertisedRate: '$250',
    conditions:
      'Up to 6,000 sq ft; same inclusions. Larger properties require custom quote.',
    source: 'summer_1.PNG',
    status: 'unconfirmed',
  },
  {
    service: 'Aeration',
    advertisedRate: '$75 / $100 / $125',
    conditions:
      'Up to 3,000 / 3,000–6,000 / 6,000–9,000 sq ft. Over 9,000: custom quote. Boundary overlap requires confirmation.',
    source: 'summer_1.PNG',
    status: 'unconfirmed',
  },
  {
    service: 'Leaf cleanup',
    advertisedRate: '$50/hour',
    conditions:
      'Other items require quote; material bagged and left on driveway unless discussed.',
    source: 'summer_1.PNG',
    status: 'unconfirmed',
  },
  {
    service: 'Rock bed blowout',
    advertisedRate: '$50/hour',
    conditions: 'Confirm current rate.',
    source: 'summer_1.PNG',
    status: 'unconfirmed',
  },
  {
    service: 'Acreage mowing',
    advertisedRate: '$60/hour',
    conditions:
      'Weekly cut and trim; approx. 1–2 hours/acre; extra charge for double cuts.',
    source: 'summer_2.PNG',
    status: 'unconfirmed',
  },
  {
    service: 'Bagging',
    advertisedRate: '$15/bag; $20/bag with haul away',
    conditions: 'Confirm availability and conditions.',
    source: 'summer_2.PNG',
    status: 'unconfirmed',
  },
  {
    service: 'Monthly snow removal',
    advertisedRate: '$150/month',
    conditions:
      'Front driveway, sidewalk, main entrance steps; corner house +$30; ice melt +$65 (billing basis unspecified).',
    source: 'winter_2.PNG',
    status: 'unconfirmed',
  },
  {
    service: 'Snow call-out',
    advertisedRate: '$50/hour',
    conditions: 'No contract; driveway, sidewalk, main entrance steps.',
    source: 'winter_2.PNG',
    status: 'unconfirmed',
  },
];
