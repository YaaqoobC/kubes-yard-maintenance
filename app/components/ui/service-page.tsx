import type { ServicePage as ServicePageContent } from '../../content/services';
import { SeasonalHero } from './seasonal-hero';
import { ServicePricing } from './service-pricing';
import { ContactCta } from '../layout/contact-cta';

export function ServicePage({ service }: { service: ServicePageContent }) {
  return (
    <>
      <SeasonalHero service={service} />
      <div className="service-directory">
        <nav className="container service-jump-links" aria-label="On this page">
          {service.sections.map((section) => (
            <a href={`#${section.id}`} key={section.id}>
              {section.title}
            </a>
          ))}
          <a href="#service-faq">Questions & service details</a>
        </nav>
      </div>
      <div className="container service-content">
        {service.sections.map((section) => (
          <ServicePricing section={section} key={section.id} />
        ))}
        <section
          className="service-section"
          id="service-faq"
          aria-labelledby="faq-heading"
        >
          <div className="service-section-intro">
            <h2 id="faq-heading">Before we get started</h2>
            <p>
              Confirm service at your address, availability, and the final quote
              directly with Kube’s.
            </p>
          </div>
          <div className="faq-list">
            {service.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
      <ContactCta />
    </>
  );
}
