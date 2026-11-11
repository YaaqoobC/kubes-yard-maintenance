import type { ReactNode } from 'react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useLocation,
} from 'react-router';
import '@fontsource-variable/manrope';
import '@fontsource-variable/dm-sans';
import './styles/app.css';
import { Header } from './components/layout/header';
import { Footer } from './components/layout/footer';
import { themeScript } from './theme/theme';
import { seasonScript, pageContextForPath } from './season/season';
import { ActionLink } from './components/ui/action-link';
import { RouteFocus } from './components/layout/route-focus';
import { NotFound } from './components/ui/not-found';
import { SeasonalFavicon } from './season/seasonal-favicon';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const page = pageContextForPath(pathname);
  return (
    <html lang="en-CA" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{ __html: themeScript + seasonScript }}
        />
        <Meta />
        <Links />
        <SeasonalFavicon page={page} />
      </head>
      <body id="top" data-page={page}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        <RouteFocus />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  if (notFound) return <NotFound />;
  return (
    <section className="container page-intro">
      <p className="eyebrow">Something went wrong</p>
      <h1>Let’s try that again.</h1>
      <p>Please reload the page or return home.</p>
      <ActionLink href="/">Back to home</ActionLink>
    </section>
  );
}
