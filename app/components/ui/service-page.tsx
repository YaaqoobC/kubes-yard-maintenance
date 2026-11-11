import { useMemo } from 'react';
import {
  serviceQuestions,
  type ServicePage as ServicePageContent,
} from '../../content/services';
import { SeasonalHero } from './seasonal-hero';
import { ServicePricing } from './service-pricing';
import { ServiceDirectory } from './service-directory';
import { ContactCta } from '../layout/contact-cta';

export function ServicePage({ service }: { service: ServicePageContent }) {
  const items = useMemo(
    () => [
      ...service.sections.map(({ id, title }) => ({ id, title })),
      serviceQuestions,
    ],
    [service.sections],
  );
  return (
    <>
      <SeasonalHero service={service} />
      <div className="container service-layout">
        <ServiceDirectory
          items={items}
          label={`${service.title.replace(/\.$/, '')} service directory`}
        />
        <div className="service-content">
          {service.sections.map((section) => (
            <ServicePricing section={section} key={section.id} />
          ))}
          <section
            className="service-section"
            id={serviceQuestions.id}
            aria-labelledby="faq-heading"
          >
            <div className="service-section-intro">
              <h2 id="faq-heading" tabIndex={-1}>
                Before we get started
              </h2>
              <p>
                Confirm service at your address, availability, and the final
                quote directly with Kube’s.
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
      </div>
      <ContactCta />
    </>
  );
}
