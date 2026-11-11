import { Link } from 'react-router';
import { business, navigation } from '../../content/business';
import { Brand } from './brand';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div>
            <Brand />
            <p>
              Lawn care. Snow removal.
              <br />A yard for every season.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            {navigation.map((item) => (
              <Link to={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="footer-contact">
            <span className="eyebrow">Get in touch</span>
            <a href={business.phoneHref}>{business.phone}</a>
            <a href={business.emailHref}>{business.email}</a>
            <p>
              {business.area}
              <br />
              {business.areaNote}
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {business.name}
          </span>
          <span>Rooted in the seasons.</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
