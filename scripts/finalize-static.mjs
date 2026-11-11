import { copyFile, readFile, writeFile } from 'node:fs/promises';

const site = JSON.parse(
  await readFile(new URL('../app/content/site.json', import.meta.url), 'utf8'),
);
const directory = new URL('../build/client/', import.meta.url);
const urls = site.publicPaths
  .map((path) => `  <url><loc>${new URL(path, site.origin).href}</loc></url>`)
  .join('\n');

await Promise.all([
  copyFile(
    new URL('404/index.html', directory),
    new URL('404.html', directory),
  ),
  writeFile(
    new URL('sitemap.xml', directory),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  ),
  writeFile(
    new URL('robots.txt', directory),
    `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`,
  ),
]);
