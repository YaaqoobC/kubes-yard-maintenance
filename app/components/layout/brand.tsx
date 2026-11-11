import { Link } from 'react-router';
import { business } from '../../content/business';

export function Brand() {
  return (
    <Link className="brand" to="/" aria-label={`${business.name} — home`}>
      <img src="/brand/summer-logo.png" width="49" height="47" alt="" />
      <span>
        <strong>Kube’s</strong>
        <span>Yard Maintenance</span>
      </span>
    </Link>
  );
}
