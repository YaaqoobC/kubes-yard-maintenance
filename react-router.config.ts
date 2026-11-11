import type { Config } from '@react-router/dev/config';
import site from './app/content/site.json' with { type: 'json' };

export default {
  ssr: false,
  prerender: [...site.publicPaths, '/404'],
} satisfies Config;
