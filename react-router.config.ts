import type { Config } from '@react-router/dev/config';

export default {
  ssr: false,
  prerender: ['/', '/lawn-care', '/snow-removal', '/about', '/contact'],
} satisfies Config;
