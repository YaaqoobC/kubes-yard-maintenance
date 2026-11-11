import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

export type ServiceDirectoryItem = { id: string; title: string };

export function ServiceDirectory({
  items,
  label,
}: {
  items: readonly ServiceDirectoryItem[];
  label: string;
}) {
  const [active, setActive] = useState('');
  const navigate = useNavigate();
  const { hash, key } = useLocation();
  const directory = useRef<HTMLElement>(null);

  useEffect(() => {
    const navigation = directory.current;
    const layout = navigation?.parentElement;
    if (!navigation || !layout) return;
    const sections = items.flatMap((item) => {
      const section = document.getElementById(item.id);
      return section ? [section] : [];
    });
    let observer: IntersectionObserver | undefined;
    const rebuild = () => {
      observer?.disconnect();
      const compact = matchMedia('(max-width: 999px)').matches;
      const height = compact ? navigation.getBoundingClientRect().height : 0;
      // Changes scroll margins only, never document flow or sticky positioning.
      layout.style.setProperty('--service-nav-height', `${height}px`);
      if (!('IntersectionObserver' in window)) return;
      const top = Math.min(
        innerHeight - 2,
        parseFloat(
          getComputedStyle(document.documentElement).scrollPaddingTop,
        ) +
          height +
          4,
      );
      observer = new IntersectionObserver(
        () => {
          const section = sections.find((element) => {
            const box = element.getBoundingClientRect();
            return box.top <= top && box.bottom > top;
          });
          const next = section?.id ?? '';
          setActive((current) => (current === next ? current : next));
        },
        {
          rootMargin: `-${top}px 0px -${Math.max(0, innerHeight - top - 1)}px 0px`,
          threshold: 0,
        },
      );
      sections.forEach((section) => observer?.observe(section));
    };
    const sizes = new ResizeObserver(rebuild);
    sizes.observe(navigation);
    const header = document.querySelector('.site-header');
    if (header) sizes.observe(header);
    window.addEventListener('resize', rebuild);
    rebuild();
    return () => {
      observer?.disconnect();
      sizes.disconnect();
      window.removeEventListener('resize', rebuild);
      layout.style.removeProperty('--service-nav-height');
    };
  }, [items]);

  useEffect(() => {
    const id = hash.slice(1);
    if (!items.some((item) => item.id === id)) return;
    // Run after Router scroll restoration and native fragment targeting.
    const frame = requestAnimationFrame(() =>
      document
        .getElementById(id)
        ?.querySelector('h2')
        ?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, [hash, key, items]);

  return (
    <nav className="service-directory" ref={directory} aria-label={label}>
      <div className="service-directory-links">
        <p className="eyebrow">Service directory</p>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <Link
                to={`#${item.id}`}
                preventScrollReset
                aria-current={active === item.id ? 'location' : undefined}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <label className="service-directory-picker">
        <span className="small-label">Jump to service</span>
        <select
          value={active}
          onChange={(event) => {
            const id = event.target.value;
            if (!items.some((item) => item.id === id)) return;
            setActive(id);
            navigate({ hash: `#${id}` }, { preventScrollReset: true });
          }}
        >
          <option value="" disabled>
            Choose a service
          </option>
          {items.map((item) => (
            <option value={item.id} key={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </label>
    </nav>
  );
}
