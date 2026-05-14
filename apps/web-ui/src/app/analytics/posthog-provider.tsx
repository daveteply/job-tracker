'use client';

import { Suspense, useEffect } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { usePostHog } from 'posthog-js/react';

if (typeof window !== 'undefined') {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

  if (key) {
    posthog.init(key, {
      api_host: '/ingest',
      ui_host: 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false, // Disable automatic pageview capture, as we use manual capture below
    });
  }
}

function PostHogPageView(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture('$pageview', {
        $current_url: url,
        environment: process.env.NODE_ENV,
        vercel_env: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
      });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}
