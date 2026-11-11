import type { MetaDescriptor } from 'react-router';
import { business } from './business';
import site from './site.json' with { type: 'json' };

export function pageMeta(
  title: string,
  description: string,
  path: string,
): MetaDescriptor[] {
  const canonicalPath = site.publicPaths.find(
    (publicPath) => publicPath.replace(/\/$/, '') === path.replace(/\/$/, ''),
  );
  if (!canonicalPath) throw new Error(`Missing public canonical path: ${path}`);
  const url = new URL(canonicalPath, site.origin).href;
  return [
    { title: `${title} | ${business.name}` },
    { name: 'description', content: description },
    { property: 'og:title', content: `${title} | ${business.name}` },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: url },
    { tagName: 'link', rel: 'canonical', href: url },
  ];
}
