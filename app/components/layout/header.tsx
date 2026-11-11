import { useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { pageContextForPath } from '../../season/season';
import { ActionLink } from '../ui/action-link';
import { navigation, quoteAction } from '../../content/business';
import { ThemeControl } from '../../theme/theme-control';
import { Brand } from './brand';

export function Header() {
  const { key, pathname } = useLocation();
  const page = pageContextForPath(pathname);
  const brandSeason =
    page === 'winter' ? 'winter' : page === 'home' ? 'featured' : 'summer';
  const [menu, setMenu] = useState({ locationKey: key, open: false });
  const menuButton = useRef<HTMLButtonElement>(null);
  // Reset before rendering a new history entry, including brand links and Back.
  if (menu.locationKey !== key) setMenu({ locationKey: key, open: false });
  const open = menu.locationKey === key && menu.open;
  const setOpen = (value: boolean) =>
    setMenu({ locationKey: key, open: value });

  return (
    <header
      className="site-header"
      onBlur={(event) => {
        if (
          event.relatedTarget instanceof Node &&
          !event.currentTarget.contains(event.relatedTarget)
        )
          setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          setOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
      <div className="container header-inner">
        <Brand season={brandSeason} />
        <button
          className="menu-toggle"
          ref={menuButton}
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen(!open)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className="hamburger" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
        <nav
          id="primary-navigation"
          aria-label="Main navigation"
          className={`main-nav ${open ? 'is-open' : ''}`}
        >
          <div className="nav-links">
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="header-tools">
            <ThemeControl />
            <ActionLink href={quoteAction.href} onClick={() => setOpen(false)}>
              {quoteAction.label}
            </ActionLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
