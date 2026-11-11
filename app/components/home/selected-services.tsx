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
          Good things
          <br />
          start at ground level.
        </h2>
        <p>
          A small yard or room to roam. A seasonal reset or a regular routine.
          Let’s find what your space needs.
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
