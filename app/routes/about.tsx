import { business } from '../content/business';
import { pageMeta } from '../content/pages';
import { ContactCta } from '../components/layout/contact-cta';
import { ActionLink } from '../components/ui/action-link';

export const meta = () => pageMeta('About Kube’s', business.description);
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
          Our services include residential mowing, spring cleanup, aeration,
          acreage maintenance, and snow removal for driveways, sidewalks, and
          main entrance steps.
        </p>
        <p>
          {business.areaNote} We’ll discuss your property, the work you need,
          and current availability and pricing.
        </p>
        <ActionLink href="/contact">Get in touch</ActionLink>
      </section>
      <ContactCta />
    </>
  );
}
