import { seasons, quoteAction } from '../../content/business';
import type { ServicePage } from '../../content/services';
import { ActionLink } from './action-link';

export function SeasonalHero({ service }: { service: ServicePage }) {
  const season = seasons.find((item) => item.id === service.season)!;
  return (
    <section
      className="container page-intro seasonal-hero"
      aria-labelledby="service-heading"
    >
      <div>
        <p className="eyebrow">{service.eyebrow}</p>
        <h1 id="service-heading">{service.title}</h1>
        <p className="service-description">{service.description}</p>
        <ActionLink href={quoteAction.href}>{quoteAction.label}</ActionLink>
      </div>
      <div className={`overview-art overview-art--${season.id}`}>
        <img
          src={season.logo}
          width={season.id === 'summer' ? 263 : 322}
          height={season.id === 'summer' ? 246 : 344}
          alt={
            season.id === 'summer'
              ? 'Kube’s original lawn mower and tree emblem'
              : 'Kube’s original snow removal shield'
          }
        />
      </div>
    </section>
  );
}
