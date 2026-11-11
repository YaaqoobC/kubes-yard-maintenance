import { business } from '../../content/business';
import { ActionLink } from '../ui/action-link';

export function ContactCta() {
  return (
    <section className="contact-cta" aria-labelledby="contact-heading">
      <div className="container contact-inner">
        <div>
          <p className="eyebrow">Good care starts with a conversation</p>
          <h2 id="contact-heading">
            Let’s talk about
            <br />
            your outdoor space.
          </h2>
        </div>
        <div className="contact-actions">
          <ActionLink href={business.phoneHref} variant="light">
            Call {business.phone}
          </ActionLink>
          <a className="contact-email" href={business.emailHref}>
            {business.email}
          </a>
          <p>Tell us what you need. We’ll discuss the details.</p>
        </div>
      </div>
    </section>
  );
}
