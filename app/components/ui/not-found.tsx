import { Link } from 'react-router';
import { ActionLink } from './action-link';

export function NotFound() {
  return (
    <section className="container page-intro">
      <p className="eyebrow">404 · Page not found</p>
      <h1>A little off the path.</h1>
      <p>
        This page isn’t here. Explore our lawn care and snow removal services,
        or contact Kube’s about your property.
      </p>
      <div className="not-found-links">
        <ActionLink href="/">Back to home</ActionLink>
        <Link to="/lawn-care">Lawn & yard care</Link>
        <Link to="/snow-removal">Snow removal</Link>
        <Link to="/contact">Contact Kube’s</Link>
      </div>
    </section>
  );
}
