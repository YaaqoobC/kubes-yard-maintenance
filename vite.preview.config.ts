import { defineConfig } from 'vite';

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
          if (
            /^\/(lawn-care|snow-removal|about|contact)\/?$/.test(url.pathname)
          ) {
            request.url = `${url.pathname.replace(/\/$/, '')}/index.html${url.search}`;
          }
          next();
        });
      },
    },
  ],
});
