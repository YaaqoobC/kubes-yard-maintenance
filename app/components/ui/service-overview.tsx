import type { Season } from '../../content/business';
import { ActionLink } from './action-link';

export function ServiceOverview({ season }: { season: Season }) {
  return (
    <section
      className={`container page-intro service-overview service-overview--${season.id}`}
    >
      <div>
        <p className="eyebrow">{season.label}</p>
        <h1>
          {season.id === 'summer' ? 'Lawn & yard care.' : 'Snow removal.'}
        </h1>
        <p>{season.description}</p>
        <ul className="overview-list">
          {season.offerings.map((offering) => (
            <li key={offering}>{offering}</li>
          ))}
        </ul>
        <p className="page-note">
          Contact us for current pricing, availability, and service at your
          address.
        </p>
        <ActionLink href="/contact">Request a quote</ActionLink>
      </div>
      <div className={`overview-art overview-art--${season.id}`}>
        <img
          src={season.logo}
          alt={`Kube’s ${season.id === 'summer' ? 'lawn care' : 'snow removal'} emblem`}
          width={season.id === 'summer' ? 263 : 322}
          height={season.id === 'summer' ? 246 : 344}
        />
      </div>
    </section>
  );
}
