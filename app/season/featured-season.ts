import { useSyncExternalStore } from 'react';
import type { SeasonId } from './season';

function subscribe(notify: () => void) {
  window.addEventListener('seasonchange', notify);
  return () => window.removeEventListener('seasonchange', notify);
}
function snapshot(): SeasonId {
  return document.documentElement.dataset.featuredSeason === 'winter'
    ? 'winter'
    : 'summer';
}
function headSnapshot() {
  return typeof document === 'undefined' ? 'summer' : snapshot();
}
export function useFeaturedSeason(hydrateFromDocument = false) {
  // Only head metadata opts in: the bootstrap already updated its server HTML.
  // Body controls keep their server snapshot so their hydration markup is stable.
  return useSyncExternalStore(
    subscribe,
    snapshot,
    hydrateFromDocument ? headSnapshot : () => null,
  );
}
