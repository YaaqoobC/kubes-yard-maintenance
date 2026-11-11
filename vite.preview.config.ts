import { defineConfig } from 'vite';
import { readFile } from 'node:fs/promises';
import site from './app/content/site.json' with { type: 'json' };

const publicPaths = site.publicPaths.map(
  (path) => path.replace(/\/$/, '') || '/',
);

// Exercise directory-index HTML directly, without Vite's SPA home fallback.
export default defineConfig({
  appType: 'mpa',
  build: { outDir: 'build/client' },
  preview: { host: '127.0.0.1' },
  plugins: [
    {
      name: 'preview-prerendered-directories',
      configurePreviewServer(server) {
        server.middlewares.use((request, _response, next) => {
          const url = new URL(request.url ?? '/', 'http://localhost');
          const path = url.pathname.replace(/\/$/, '') || '/';
          if (path !== '/' && [...publicPaths, '/404'].includes(path)) {
            request.url = `${url.pathname.replace(/\/$/, '')}/index.html${url.search}`;
          } else if (
            !publicPaths.includes(path) &&
            (request.headers.accept?.includes('text/html') ||
              !path.split('/').pop()?.includes('.'))
          ) {
            void readFile('build/client/404.html')
              .then((html) => {
                _response.writeHead(404, {
                  'Content-Type': 'text/html; charset=utf-8',
                });
                _response.end(html);
              })
              .catch(next);
            return;
          }
          next();
        });
      },
    },
  ],
});
