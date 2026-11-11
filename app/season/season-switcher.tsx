import { useFeaturedSeason } from './featured-season';
import type { SeasonId } from './season';

export function SeasonSwitcher() {
  const season = useFeaturedSeason();
  function select(value: SeasonId) {
    document.documentElement.dataset.featuredSeason = value;
    window.dispatchEvent(new Event('seasonchange'));
  }
  return (
    <div className="season-switcher" role="group" aria-label="Featured season">
      <span className="small-label">Explore this season</span>
      <div>
        <button
          type="button"
          data-option="summer"
          aria-pressed={season === 'summer'}
          onClick={() => select('summer')}
        >
          Summer
        </button>
        <button
          type="button"
          data-option="winter"
          aria-pressed={season === 'winter'}
          onClick={() => select('winter')}
        >
          Winter
        </button>
      </div>
    </div>
  );
}
