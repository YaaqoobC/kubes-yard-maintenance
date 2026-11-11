import { selectedServices } from '../../content/business';
import { ActionLink } from '../ui/action-link';

export function SelectedServices() {
  return (
    <section
      className="selected-services container section-space"
      aria-labelledby="services-heading"
    >
      <div className="services-intro">
        <p className="eyebrow">A closer look</p>
        <h2 id="services-heading">
          Mowing, cleanup,
          <br />
          and acreage care.
        </h2>
        <p>
          Choose a one-time cut, weekly or bi-weekly mowing, or a seasonal
          cleanup. Ask about options for your lawn or acreage.
        </p>
        <ActionLink href="/lawn-care" variant="text">
          More about our yard services
        </ActionLink>
      </div>
      <div className="service-list">
        {selectedServices.map((service) => (
          <article className="service-row" key={service.id}>
            <span className="service-number" aria-hidden="true">
              {service.id}
            </span>
            <div>
              <p className="small-label">{service.detail}</p>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          </article>
        ))}
        <p className="pricing-note">
          Every property is different. Contact us for current pricing and to
          confirm what’s included.
        </p>
      </div>
    </section>
  );
}
