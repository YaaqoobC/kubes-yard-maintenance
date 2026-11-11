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
            <p className="eyebrow">Two seasons. One familiar name.</p>
            <h2 id="seasons-heading">
              Whatever’s outside,
              <br />
              we’re on it.
            </h2>
          </div>
          <p>
            Different seasons bring different to-do lists.
            <br className="desktop-break" /> Find a little help with yours.
          </p>
        </div>
        <div className="season-grid">
          {seasons.map((season) => (
            <article
              className={`season-panel season-panel--${season.id}`}
              key={season.id}
            >
              <div className="season-panel-top">
                <span className="eyebrow">{season.label}</span>
                <span className="season-symbol" aria-hidden="true">
                  {season.id === 'summer' ? '☀' : '❄'}
                </span>
              </div>
              <h3>
                {season.title.split('\n').map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <p>{season.description}</p>
              <ul>
                {season.offerings.map((offering) => (
                  <li key={offering}>{offering}</li>
                ))}
              </ul>
              <ActionLink href={season.href} variant="text">
                {season.linkLabel}
              </ActionLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
