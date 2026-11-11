export type SeasonId = 'summer' | 'winter';

export const seasonConfig = {
  timeZone: 'America/Edmonton',
  winterMonths: [11, 12, 1, 2, 3],
} as const;

export function seasonForDate(
  date: Date,
  config: { timeZone: string; winterMonths: readonly number[] } = seasonConfig,
): SeasonId {
  const month = Number(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: config.timeZone,
      month: 'numeric',
    }).format(date),
  );
  return config.winterMonths.includes(month) ? 'winter' : 'summer';
}

// Same rule runs in the document head before paint; never bake build-time dates into HTML.
export const seasonScript = `document.documentElement.dataset.featuredSeason = (${seasonForDate.toString()})(new Date(), ${JSON.stringify(seasonConfig)});`;

export type PageContext = SeasonId | 'home' | 'shared';
export function pageContextForPath(pathname: string): PageContext {
  const path = pathname.replace(/\/$/, '') || '/';
  if (path === '/lawn-care') return 'summer';
  if (path === '/snow-removal') return 'winter';
  return path === '/' ? 'home' : 'shared';
}
export function seasonForPage(page: PageContext, featured: SeasonId): SeasonId {
  return page === 'summer' || page === 'winter' ? page : featured;
}
