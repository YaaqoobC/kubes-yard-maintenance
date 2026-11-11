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
