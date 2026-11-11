import { ActionLink } from '../ui/action-link';

export function Introduction() {
  return (
    <section className="introduction" aria-labelledby="intro-heading">
      <div className="container introduction-inner">
        <p className="eyebrow">A local name for your outdoor space</p>
        <div>
          <h2 id="intro-heading">
            Your yard is part of home.
            <br />
            <span>Let’s take care of it.</span>
          </h2>
          <div className="intro-detail">
            <p>
              Call or email Kube’s directly with your address and the work you
              need. We’ll discuss service availability, what’s included, and
              current pricing before you arrange service.
            </p>
            <ActionLink href="/about" variant="text">
              A little about Kube’s
            </ActionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
