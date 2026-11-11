import { seasons } from '../content/business';
import { pageMeta } from '../content/pages';
import { ServiceOverview } from '../components/ui/service-overview';
import { ContactCta } from '../components/layout/contact-cta';

export const meta = () =>
  pageMeta(
    'Snow removal',
    'Snow removal for driveways, sidewalks, and main entrance steps in the Edmonton area. Ask Kube’s about seasonal and call-out options.',
  );
export default function SnowRemoval() {
  return (
    <>
      <ServiceOverview season={seasons[1]} />
      <ContactCta />
    </>
  );
}
