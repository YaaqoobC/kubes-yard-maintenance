import type { ReactNode } from 'react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from 'react-router';
import '@fontsource-variable/manrope';
import '@fontsource-variable/dm-sans';
import './styles/app.css';
import { Header } from './components/layout/header';
import { Footer } from './components/layout/footer';
import { themeScript } from './theme/theme';
import { ActionLink } from './components/ui/action-link';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-CA" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Meta />
        <Links />
        <link rel="icon" href="/brand/summer-logo.png" type="image/png" />
      </head>
      <body id="top">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
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
  return (
    <section className="container page-intro">
      <p className="eyebrow">
        {notFound ? 'Page not found' : 'Something went wrong'}
      </p>
      <h1>{notFound ? 'A little off the path.' : 'Let’s try that again.'}</h1>
      <p>
        {notFound
          ? 'This page isn’t here. Find your way back to our yard care and snow removal services.'
          : 'Please reload the page or return home.'}
      </p>
      <ActionLink href="/">Back to home</ActionLink>
    </section>
  );
}
