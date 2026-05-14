import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

export default createMiddleware({
  ...routing,
  localeDetection: true,
  localeCookie: true,
});

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_static (inside /public)
  // - /ingest (PostHog proxy)
  // - all root files inside /public (e.g. /favicon.ico)
  matcher: ['/((?!api|_next|ingest|_static|_vercel|.*\\..*).*)'],
};
