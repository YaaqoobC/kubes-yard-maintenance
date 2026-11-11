import { seasons } from '../content/business';
import { pageMeta } from '../content/pages';
import { ServiceOverview } from '../components/ui/service-overview';
import { ContactCta } from '../components/layout/contact-cta';

export const meta = () =>
  pageMeta(
    'Lawn & yard care',
    'Explore lawn mowing, spring cleanup, aeration, and acreage maintenance in the Edmonton area. Contact Kube’s for current pricing.',
  );
export default function LawnCare() {
  return (
    <>
      <ServiceOverview season={seasons[0]} />
      <ContactCta />
    </>
  );
}
