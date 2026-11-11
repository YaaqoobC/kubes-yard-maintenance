import { seasons, business, quoteAction } from '../../content/business';
import { SeasonSwitcher } from '../../season/season-switcher';
import { ActionLink } from '../ui/action-link';

export function Hero() {
  return (
    <section className="hero container" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="status-dot" /> Edmonton area · Yard care & snow
          removal
        </p>
        <h1 id="hero-heading">
          Good yards.
          <br />
          Clear paths.
          <br />
          <span>Every season.</span>
        </h1>
        <p className="hero-description">
          Lawn mowing, seasonal yard cleanup, and snow removal in the Edmonton
          area. Find your service, then contact Kube’s for a quote.
        </p>
        <div className="hero-actions">
          {seasons.map((season) => (
            <span
              className="featured-variant"
              data-feature={season.id}
              key={season.id}
            >
              <ActionLink href={season.href}>
                {season.id === 'winter'
                  ? 'Explore snow removal'
                  : 'Explore lawn & yard care'}
              </ActionLink>
            </span>
          ))}
          <ActionLink href={quoteAction.href} variant="text" withArrow={false}>
            {quoteAction.label}
          </ActionLink>
        </div>
        <div className="hero-footnote">
          <span>{business.areaNote}</span>
          <span aria-hidden="true">↓</span>
        </div>
      </div>
      <div className="hero-art">
        <div className="brand-plate seasonal-plate">
          <div className="plate-top">
            <span>Kube’s Yard Maintenance</span>
            <span>Edmonton, AB</span>
          </div>
          <div className="hero-logo-frame">
            {seasons.map((season) => (
              <img
                className="hero-logo featured-variant"
                data-feature={season.id}
                key={season.id}
                src={season.logo}
                alt={
                  season.id === 'winter'
                    ? 'Kube’s original snow removal shield'
                    : 'Kube’s original lawn mower and tree emblem'
                }
                width={season.id === 'summer' ? 263 : 322}
                height={season.id === 'summer' ? 246 : 344}
                fetchPriority="high"
              />
            ))}
          </div>
          <div className="plate-bottom">
            <span className="featured-variant" data-feature="summer">
              Room to grow.
            </span>
            <span className="featured-variant" data-feature="winter">
              A clearer winter.
            </span>
            <span className="small-label">Care for every season</span>
          </div>
        </div>
        <SeasonSwitcher />
      </div>
    </section>
  );
}
