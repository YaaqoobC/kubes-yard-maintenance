import { lawnCare } from '../content/services';
import { pageMeta } from '../content/pages';
import { ServicePage } from '../components/ui/service-page';

export const meta = () =>
  pageMeta(
    'Lawn & yard care',
    'Residential mowing, spring cleanup, acreage mowing, and aeration in the Edmonton area. Explore prices and service inclusions from Kube’s.',
    '/lawn-care',
  );
export default function Page() {
  return <ServicePage service={lawnCare} />;
}
