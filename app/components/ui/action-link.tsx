import { Link } from 'react-router';
import { Arrow } from './arrow';
import type { ReactNode } from 'react';

export function ActionLink({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'text' | 'light';
}) {
  const className = `action-link action-link--${variant}`;
  return href.startsWith('/') ? (
    <Link className={className} to={href}>
      {children}
      <Arrow />
    </Link>
  ) : (
    <a className={className} href={href}>
      {children}
      <Arrow />
    </a>
  );
}
