import { Link } from 'react-router';
import type { SeasonId } from '../../season/season';
import { business } from '../../content/business';

export function Brand({
  season = 'summer',
}: {
  season?: SeasonId | 'featured';
}) {
  return (
    <Link className="brand" to="/" aria-label={`${business.name} — home`}>
      {season === 'featured' ? (
        <span className="brand-emblem">
          <img
            className="featured-variant"
            data-feature="summer"
            src="/brand/summer-logo.png"
            width="49"
            height="47"
            alt=""
          />
          <img
            className="featured-variant"
            data-feature="winter"
            src="/brand/winter-logo.png"
            width="49"
            height="52"
            alt=""
          />
        </span>
      ) : (
        <img
          src={`/brand/${season}-logo.png`}
          width="49"
          height={season === 'winter' ? 52 : 47}
          alt=""
        />
      )}
      <span>
        <strong>Kube’s</strong>
        <span>Yard Maintenance</span>
      </span>
    </Link>
  );
}
