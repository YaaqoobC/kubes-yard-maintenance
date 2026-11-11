import type { MetaDescriptor } from 'react-router';
import { business } from './business';

export function pageMeta(title: string, description: string): MetaDescriptor[] {
  return [
    { title: `${title} | ${business.name}` },
    { name: 'description', content: description },
    { property: 'og:title', content: `${title} | ${business.name}` },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
  ];
}
