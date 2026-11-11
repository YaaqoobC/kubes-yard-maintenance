import { Hero } from '../components/home/hero';
import { SeasonsSection } from '../components/home/seasons-section';
import { SelectedServices } from '../components/home/selected-services';
import { Introduction } from '../components/home/introduction';
import { ContactCta } from '../components/layout/contact-cta';
import { business } from '../content/business';
import { pageMeta } from '../content/pages';

export const meta = () =>
  pageMeta(
    'Lawn care & snow removal in the Edmonton area',
    business.description,
    '/',
  );

export default function Home() {
  return (
    <>
      <Hero />
      <SeasonsSection />
      <SelectedServices />
      <Introduction />
      <ContactCta />
    </>
  );
}
