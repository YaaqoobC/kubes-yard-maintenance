import { NotFound } from '../components/ui/not-found';
import { business } from '../content/business';

export const meta = () => [
  { title: `Page not found | ${business.name}` },
  {
    name: 'description',
    content:
      'Find lawn care, snow removal, and contact information for Kube’s Yard Maintenance.',
  },
  { name: 'robots', content: 'noindex, follow' },
];

export default NotFound;
