import { snowRemoval } from '../content/services';
import { pageMeta } from '../content/pages';
import { ServicePage } from '../components/ui/service-page';

export const meta = () =>
  pageMeta(
    'Snow removal',
    'Monthly snow removal and one-time call-outs in the Edmonton area. Explore pricing for driveway, sidewalk, and main entrance step clearing.',
    '/snow-removal',
  );
export default function Page() {
  return <ServicePage service={snowRemoval} />;
}
