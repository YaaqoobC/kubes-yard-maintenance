import { business } from '../content/business';
import { pageMeta } from '../content/pages';
import { Arrow } from '../components/ui/arrow';

export const meta = () =>
  pageMeta(
    'Contact',
    `Call ${business.phone} or email ${business.email} to discuss lawn care or snow removal in the Edmonton area.`,
    '/contact',
  );
export default function Contact() {
  return (
    <section className="container page-intro contact-page">
      <p className="eyebrow">Let’s talk about your property</p>
      <h1>
        A good place
        <br />
        to start.
      </h1>
      <p>
        Tell us where you’re located and what you need a hand with. We’ll
        discuss service options, availability, and current pricing.
      </p>
      <div className="contact-methods">
        <a href={business.phoneHref}>
          <span className="eyebrow">Call Kube’s</span>
          <strong>{business.phone}</strong>
          <Arrow diagonal />
        </a>
        <a href={business.emailHref}>
          <span className="eyebrow">Send an email</span>
          <strong>{business.email}</strong>
          <Arrow diagonal />
        </a>
      </div>
      <p className="page-note">
        {business.area}. {business.areaNote}
      </p>
    </section>
  );
}
