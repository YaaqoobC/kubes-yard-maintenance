import { business } from '../content/business';
import { pageMeta } from '../content/pages';
import { ContactCta } from '../components/layout/contact-cta';
import { ActionLink } from '../components/ui/action-link';

export const meta = () =>
  pageMeta(
    'About Kube’s',
    'Learn about Kube’s Yard Maintenance and its lawn care and snow removal services for the Edmonton area. Contact us to confirm service at your address.',
    '/about',
  );
export default function About() {
  return (
    <>
      <section className="container page-intro about-page">
        <p className="eyebrow">Kube’s Yard Maintenance</p>
        <h1>
          Care for the place
          <br />
          you call home.
        </h1>
        <p>{business.description}</p>
        <p>
          For lawn or snow service, call or email with your address and what you
          need. We’ll confirm availability, pricing, and the work included.
        </p>
        <ActionLink href="/contact">Get in touch</ActionLink>
      </section>
      <ContactCta />
    </>
  );
}
