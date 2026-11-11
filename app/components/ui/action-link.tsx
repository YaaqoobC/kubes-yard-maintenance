import { Link } from 'react-router';
import { Arrow } from './arrow';
import type { MouseEventHandler, ReactNode } from 'react';

export function ActionLink({
  href,
  children,
  variant = 'primary',
  withArrow = variant === 'text',
  onClick,
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'text' | 'light';
  withArrow?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  const className = `action-link action-link--${variant}`;
  return href.startsWith('/') ? (
    <Link className={className} to={href} onClick={onClick}>
      {children}
      {withArrow && <Arrow />}
    </Link>
  ) : (
    <a className={className} href={href} onClick={onClick}>
      {children}
      {withArrow && <Arrow />}
    </a>
  );
}
