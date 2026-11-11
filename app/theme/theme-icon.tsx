import type { ThemePreference } from './theme';

export function ThemeIcon({
  kind,
  className,
}: {
  kind: ThemePreference;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === 'light' ? (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
        </>
      ) : kind === 'dark' ? (
        <path d="M20.5 13.2A8.5 8.5 0 0 1 10.8 3.5a8.5 8.5 0 1 0 9.7 9.7Z" />
      ) : (
        <>
          <rect x="3" y="4" width="18" height="13" rx="1.5" />
          <path d="M8 21h8m-4-4v4" />
        </>
      )}
    </svg>
  );
}
