import { useEffect, useId, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import {
  applyThemePreference,
  isThemePreference,
  themeKey,
  type ThemePreference,
} from './theme';
import { ThemeIcon } from './theme-icon';

export function ThemeControl() {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const currentPreference = useRef<ThemePreference>('system');
  const [effective, setEffective] = useState<'light' | 'dark'>('light');
  const { key } = useLocation();
  const [menu, setMenu] = useState({ key, open: false });
  if (menu.key !== key) setMenu({ key, open: false });
  const open = menu.key === key && menu.open;
  const wrapper = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const options = useRef<HTMLDivElement>(null);
  const id = useId();
  const close = () => setMenu({ key, open: false });

  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !wrapper.current?.contains(event.target)
      )
        setMenu({ key, open: false });
    };
    const media = matchMedia('(max-width: 800px)');
    const resized = () => setMenu({ key, open: false });
    document.addEventListener('pointerdown', outside);
    media.addEventListener('change', resized);
    return () => {
      document.removeEventListener('pointerdown', outside);
      media.removeEventListener('change', resized);
    };
  }, [key]);

  useEffect(() => {
    if (open)
      options.current
        ?.querySelector<HTMLButtonElement>('[aria-checked="true"]')
        ?.focus();
  }, [open]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const read = () => {
      let value: ThemePreference = 'system';
      try {
        const stored = localStorage.getItem(themeKey);
        if (isThemePreference(stored)) value = stored;
      } catch {
        value = currentPreference.current;
      }
      currentPreference.current = value;
      setPreference(value);
      setEffective(applyThemePreference(value));
    };
    read();
    media.addEventListener('change', read);
    window.addEventListener('storage', read);
    return () => {
      media.removeEventListener('change', read);
      window.removeEventListener('storage', read);
    };
  }, []);

  function change(value: ThemePreference) {
    currentPreference.current = value;
    setPreference(value);
    try {
      localStorage.setItem(themeKey, value);
    } catch {
      /* Visit-local preference still works. */
    }
    setEffective(applyThemePreference(value));
    if (matchMedia('(min-width: 801px)').matches) {
      close();
      trigger.current?.focus();
    }
  }

  return (
    <div
      className="theme-control"
      ref={wrapper}
      onBlur={(event) => {
        if (
          event.relatedTarget instanceof Node &&
          !event.currentTarget.contains(event.relatedTarget)
        )
          close();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation();
          close();
          trigger.current?.focus();
        }
      }}
    >
      <button
        className="theme-trigger"
        type="button"
        ref={trigger}
        aria-label="Choose color theme"
        aria-describedby={`${id}-description`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={`${id}-options`}
        onClick={() => setMenu({ key, open: !open })}
        onKeyDown={(event) => {
          if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
            event.preventDefault();
            setMenu({ key, open: true });
          }
        }}
      >
        <ThemeIcon kind="light" className="theme-effective-light" />
        <ThemeIcon kind="dark" className="theme-effective-dark" />
      </button>
      <span id={`${id}-description`} className="sr-only">
        Current appearance: {effective}. Preference: {preference}.
      </span>
      <div
        className={`theme-options ${open ? 'is-open' : ''}`}
        id={`${id}-options`}
        ref={options}
        role="menu"
        aria-label="Color theme"
        onKeyDown={(event) => {
          const keys = [
            'ArrowDown',
            'ArrowUp',
            'ArrowLeft',
            'ArrowRight',
            'Home',
            'End',
          ];
          if (!keys.includes(event.key)) return;
          event.preventDefault();
          const items = Array.from(
            event.currentTarget.querySelectorAll<HTMLButtonElement>('button'),
          );
          const index = items.indexOf(
            document.activeElement as HTMLButtonElement,
          );
          const next =
            event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? items.length - 1
                : (index +
                    (['ArrowUp', 'ArrowLeft'].includes(event.key) ? -1 : 1) +
                    items.length) %
                  items.length;
          items[next]?.focus();
        }}
      >
        {(['light', 'dark', 'system'] as const).map((value) => (
          <button
            type="button"
            role="menuitemradio"
            aria-checked={preference === value}
            tabIndex={preference === value ? 0 : -1}
            key={value}
            onClick={() => change(value)}
          >
            <ThemeIcon kind={value} />
            <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
            <span className="theme-check" aria-hidden="true">
              {preference === value ? '✓' : ''}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
