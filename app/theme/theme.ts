export const themeKey = 'kubes-theme';
export type ThemePreference = 'light' | 'dark' | 'system';

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

// Runs before styles paint. Storage may be unavailable in private/embedded browsers.
export const themeScript = `(() => {
  let preference = 'system';
  try {
    const stored = localStorage.getItem('${themeKey}');
    if (['light', 'dark', 'system'].includes(stored)) preference = stored;
  } catch {}
  const dark = preference === 'dark' || (preference === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
})();`;
