import { useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { business, navigation } from '../../content/business';
import { ThemeControl } from '../../theme/theme-control';
import { Brand } from './brand';

export function Header() {
  const { key } = useLocation();
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
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          setOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
      <div className="container header-inner">
        <Brand />
        <button
          className="menu-toggle"
          ref={menuButton}
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Close' : 'Menu'}
          <span aria-hidden="true">{open ? '−' : '+'}</span>
        </button>
        <nav
          id="primary-navigation"
          aria-label="Main navigation"
          className={`main-nav ${open ? 'is-open' : ''}`}
        >
          {navigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-tools">
          <ThemeControl />
          <a className="header-call" href={business.phoneHref}>
            Call us <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </header>
  );
}
