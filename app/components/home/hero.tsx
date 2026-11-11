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
          Lawn mowing, seasonal yard cleanup, and snow removal in the Edmonton
          area. Contact Kube’s to discuss your property and request a quote.
        </p>
        <div className="hero-actions">
          <ActionLink href="/contact">Request a quote</ActionLink>
          <ActionLink href="#seasons" variant="text">
            Find your service
          </ActionLink>
        </div>
        <div className="hero-footnote">
          <span>{business.areaNote}</span>
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
            width="263"
            height="246"
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
            <span className="small-label">The winter season</span>
            <strong>Explore snow removal</strong>
          </span>
          <Arrow diagonal />
        </Link>
      </div>
    </section>
  );
}
