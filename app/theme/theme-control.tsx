import { useEffect, useRef, useState } from 'react';
import { isThemePreference, themeKey, type ThemePreference } from './theme';

export function ThemeControl() {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const currentPreference = useRef<ThemePreference>('system');

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = (value: ThemePreference) => {
      const dark = value === 'dark' || (value === 'system' && media.matches);
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
      document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    };
    const read = () => {
      let value: ThemePreference = 'system';
      try {
        const stored = localStorage.getItem(themeKey);
        if (isThemePreference(stored)) value = stored;
      } catch {
        // Preserve this visit's choice when storage is blocked and the OS changes.
        value = currentPreference.current;
      }
      currentPreference.current = value;
      setPreference(value);
      apply(value);
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
      /* Preference still works for this visit. */
    }
    const dark =
      value === 'dark' ||
      (value === 'system' &&
        matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  }

  return (
    <label className="theme-control">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4v16" />
        <path d="M12 4a8 8 0 0 1 0 16" fill="currentColor" />
      </svg>
      <span className="sr-only">Color theme</span>
      <select
        value={preference}
        onChange={(event) => {
          const value = event.target.value;
          if (isThemePreference(value)) change(value);
        }}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}
