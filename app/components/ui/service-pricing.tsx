import { formatPrice, type PricingSection } from '../../content/services';

export function ServicePricing({ section }: { section: PricingSection }) {
  return (
    <section
      className="service-section"
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
    >
      <div className="service-section-intro">
        <h2 id={`${section.id}-heading`}>{section.title}</h2>
        <p>{section.description}</p>
      </div>
      <div className="pricing-list">
        {section.tiers.map((tier) => (
          <article className="pricing-tier" key={tier.title}>
            <div className="pricing-tier-heading">
              <h3>{tier.title}</h3>
              <p className="price">
                {tier.price ? formatPrice(tier.price) : tier.quote}
              </p>
            </div>
            {tier.inclusions && (
              <ul className="service-inclusions">
                {tier.inclusions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
        {section.notes?.map((note) => (
          <p className="pricing-note" key={note}>
            {note}
          </p>
        ))}
      </div>
    </section>
  );
}
