import { Link } from 'react-router';
import { business } from '../../content/business';
import { ActionLink } from '../ui/action-link';
import { Arrow } from '../ui/arrow';

export function Hero() {
  return (
    <section className="hero container" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="status-dot" /> Edmonton area · Yard care & snow
          removal
        </p>
        <h1 id="hero-heading">
          Good yards.
          <br />
          Clear paths.
          <br />
          <span>Every season.</span>
        </h1>
        <p className="hero-description">
          A fresh-cut lawn. A cleared driveway. A little more time for
          everything else. Meet Kube’s Yard Maintenance.
        </p>
        <div className="hero-actions">
          <ActionLink href={business.phoneHref}>
            Let’s talk yard care
          </ActionLink>
          <ActionLink href="#seasons" variant="text">
            Find your service
          </ActionLink>
        </div>
        <div className="hero-footnote">
          <span>Local care. Through the seasons.</span>
          <span aria-hidden="true">↓</span>
        </div>
      </div>
      <div className="hero-art">
        <div className="brand-plate">
          <div className="plate-top">
            <span>Kube’s Yard Maintenance</span>
            <span>Edmonton, AB</span>
          </div>
          <img
            className="hero-logo"
            src="/brand/summer-logo.png"
            alt="Kube’s original lawn mower and tree emblem"
            width="255"
            height="245"
            fetchPriority="high"
          />
          <div className="plate-bottom">
            <span>Room to grow.</span>
            <span className="small-label">Lawn & yard care</span>
          </div>
          <div className="lawn-lines" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <Link className="winter-strip" to="/snow-removal">
          <img src="/brand/winter-logo.png" width="64" height="68" alt="" />
          <span>
            <span className="small-label">And when the snow comes</span>
            <strong>We’re here for winter, too.</strong>
          </span>
          <Arrow diagonal />
        </Link>
      </div>
    </section>
  );
}
