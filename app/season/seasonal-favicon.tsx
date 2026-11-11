import assets from '../content/favicons.json';
import { pageContextForPath, seasonForPage, type PageContext } from './season';
import { useFeaturedSeason } from './featured-season';

// Runs after the single icon declaration, before hydration; use the same pure rules.
const faviconScript = `(() => {
  const page = (${pageContextForPath.toString()})(location.pathname);
  const season = (${seasonForPage.toString()})(page, document.documentElement.dataset.featuredSeason || 'summer');
  document.getElementById('site-favicon').href = ${JSON.stringify(assets)}[season]['64'];
})();`;

export function SeasonalFavicon({ page }: { page: PageContext }) {
  const featured = useFeaturedSeason(true);
  const season = seasonForPage(page, featured ?? 'summer');
  return (
    <>
      <link
        id="site-favicon"
        rel="icon"
        type="image/png"
        sizes="64x64"
        href={assets[season]['64']}
        onError={(event) => {
          if (event.currentTarget.getAttribute('href') !== '/favicon.ico') {
            event.currentTarget.href = '/favicon.ico';
            event.currentTarget.type = 'image/x-icon';
            event.currentTarget.removeAttribute('sizes');
          }
        }}
        suppressHydrationWarning
      />
      <script dangerouslySetInnerHTML={{ __html: faviconScript }} />
    </>
  );
}
