import type { SeasonId } from '../season/season';

export type Price = {
  amount: number;
  unit?: 'month' | 'hour' | 'bag';
  extra?: boolean;
};
export type PricingTier = {
  title: string;
  price?: Price;
  quote?: string;
  inclusions?: readonly string[];
};
export type PricingSection = {
  id: string;
  title: string;
  description: string;
  tiers: readonly PricingTier[];
  notes?: readonly string[];
};
export type ServicePage = {
  season: SeasonId;
  eyebrow: string;
  title: string;
  description: string;
  sections: readonly PricingSection[];
  faqs: readonly { question: string; answer: string }[];
};
export function formatPrice(price: Price) {
  return `${price.extra ? '+' : ''}$${price.amount}${price.unit ? `/${price.unit}` : ''}`;
}

const residential = [
  'Up to 3,000 sq ft',
  'Cut and trim · front and back yard',
  'No bagging',
] as const;
const spring = [
  'First mow and trim',
  'Power raking',
  'Rock bed blowout',
  'Debris bagging',
] as const;
const snowAreas = [
  'Front driveway',
  'Sidewalk',
  'Main entrance steps',
] as const;

// Approved for public use in the owner's Milestone 2 brief. No response guarantee implied.
export const lawnCare: ServicePage = {
  season: 'summer',
  eyebrow: 'Summer · Edmonton area, Alberta',
  title: 'Lawn & yard care.',
  description:
    'From a single cut to a regular mowing plan. Explore residential lawn care, spring cleanup, and maintenance for larger properties.',
  sections: [
    {
      id: 'mowing',
      title: 'Residential mowing',
      description:
        'A one-time cut or a regular routine for your front and back yard.',
      tiers: [
        { title: 'One-time cut', price: { amount: 60 } },
        {
          title: 'Weekly mowing',
          price: { amount: 175, unit: 'month' },
          inclusions: [...residential, 'Weekly visits'],
        },
        {
          title: 'Bi-weekly mowing',
          price: { amount: 100, unit: 'month' },
          inclusions: [...residential, 'Bi-weekly visits'],
        },
      ],
    },
    {
      id: 'spring-cleanup',
      title: 'Spring cleanup',
      description:
        'A first mow and trim, with the seasonal cleanup work included.',
      tiers: [
        { title: 'Residential · up to 3,000 sq ft', price: { amount: 150 } },
        {
          title: 'Commercial / acreage · up to 6,000 sq ft',
          price: { amount: 250 },
        },
        { title: 'Over 6,000 sq ft', quote: 'Custom quote' },
      ],
      notes: [
        'Both packages include: ' + spring.join(', ').toLowerCase() + '.',
      ],
    },
    {
      id: 'acreage',
      title: 'Acreage maintenance',
      description:
        'Cutting and trimming for larger spaces, priced by the hour.',
      tiers: [
        {
          title: 'Acreage mowing & trimming',
          price: { amount: 60, unit: 'hour' },
        },
        { title: 'Bagging', price: { amount: 15, unit: 'bag' } },
        { title: 'Bagging with haul-away', price: { amount: 20, unit: 'bag' } },
      ],
      notes: [
        'Allow approximately 1–2 hours per acre. Actual time depends on the property.',
        'Double cuts may involve an additional charge. Discuss this when requesting your quote.',
      ],
    },
    {
      id: 'aeration',
      title: 'Aeration',
      description:
        'Choose the tier for your lawn area. Larger properties receive a custom quote.',
      tiers: [
        { title: 'Up to 3,000 sq ft', price: { amount: 75 } },
        { title: 'Over 3,000 to 6,000 sq ft', price: { amount: 100 } },
        { title: 'Over 6,000 to 9,000 sq ft', price: { amount: 125 } },
        { title: 'Over 9,000 sq ft', quote: 'Custom quote' },
      ],
    },
    {
      id: 'additional-services',
      title: 'Additional yard services',
      description:
        'Leaf cleanup and rock bed blowout can be discussed alongside your lawn care.',
      tiers: [
        { title: 'Yard cleanup · leaves', price: { amount: 50, unit: 'hour' } },
        { title: 'Other cleanup items', quote: 'Request a quote' },
        { title: 'Rock bed blowout', price: { amount: 50, unit: 'hour' } },
      ],
      notes: [
        'Bagged cleanup material is left on the driveway unless otherwise discussed.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Is bagging included with regular mowing?',
      answer:
        'Weekly and bi-weekly residential mowing include cutting and trimming, without bagging. Discuss any additional cleanup needs when requesting a quote.',
    },
    {
      question: 'What if my property is larger than the listed size?',
      answer:
        'Send your address and approximate lawn area. Spring cleanup over 6,000 sq ft and aeration over 9,000 sq ft require a custom quote. Contact us about mowing for larger properties.',
    },
  ],
};
export const snowRemoval: ServicePage = {
  season: 'winter',
  eyebrow: 'Winter · Edmonton area, Alberta',
  title: 'Snow removal.',
  description:
    'Monthly snow removal or a one-time call-out for your driveway, sidewalk, and main entrance steps.',
  sections: [
    {
      id: 'snow-plans',
      title: 'Snow removal options',
      description: 'Choose ongoing monthly service or discuss a single visit.',
      tiers: [
        {
          title: 'Monthly snow removal',
          price: { amount: 150, unit: 'month' },
          inclusions: snowAreas,
        },
        {
          title: 'One-time snow removal',
          price: { amount: 50, unit: 'hour' },
          inclusions: ['Driveway', 'Sidewalk', 'Main entrance steps'],
        },
      ],
    },
    {
      id: 'snow-add-ons',
      title: 'Additional charges',
      description:
        'Discuss the additions that apply to your property before arranging service.',
      tiers: [
        { title: 'Corner houses', price: { amount: 30, extra: true } },
        { title: 'Ice melt', price: { amount: 65, extra: true } },
      ],
      notes: [
        'Confirm how often add-on charges apply when requesting your quote.',
      ],
    },
  ],
  faqs: [
    {
      question: 'When will my property be cleared?',
      answer:
        'Contact Kube’s to discuss scheduling, snowfall conditions, and return visits before arranging service. Confirm the response terms for your property directly.',
    },
    {
      question: 'What should I include in my quote request?',
      answer:
        'Send your address, driveway size, whether you have a corner property, and any ice melt needs. Tell us whether you want monthly service or a one-time visit.',
    },
  ],
};
