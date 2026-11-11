import { seasons } from '../../content/business';
import { ActionLink } from '../ui/action-link';

export function SeasonsSection() {
  return (
    <section
      className="seasons-section section-space"
      id="seasons"
      aria-labelledby="seasons-heading"
    >
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Available to explore year-round</p>
            <h2 id="seasons-heading">Find your service.</h2>
          </div>
          <p>
            Service details, clear pricing, and a direct way to request a quote.
          </p>
        </div>
        <div className="season-grid">
          {seasons.map((season) => (
            <article
              className={`season-panel season-panel--${season.id}`}
              key={season.id}
            >
              <p className="eyebrow">{season.label}</p>
              <h3>{season.title}</h3>
              <p>{season.description}</p>
              <ActionLink href={season.href} variant="text">
                {season.id === 'summer'
                  ? 'Lawn care details & pricing'
                  : 'Snow removal details & pricing'}
              </ActionLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
