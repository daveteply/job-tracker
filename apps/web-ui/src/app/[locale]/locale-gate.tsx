'use client';

import { useEffect, useRef } from 'react';

import { useParams } from 'next/navigation';

import { useUserSettings } from '@job-tracker/hooks';

import { usePathname, useRouter } from '../../i18n/routing';

/**
 * LocaleGate ensures that the application locale matches the user's persisted preference
 * during the initial navigation.
 */
export function LocaleGate({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { settings, isLoading } = useUserSettings();
  const hasAttemptedSync = useRef(false);

  const currentLocale = params['locale'] as string;

  useEffect(() => {
    // Only attempt to "influence initial navigation" once per session
    // and only after settings have loaded.
    if (!isLoading && settings?.locale && !hasAttemptedSync.current) {
      hasAttemptedSync.current = true;

      // If the URL locale differs from the persisted locale,
      // and we are landing on the app, we perform the initial redirect.
      if (settings.locale !== currentLocale) {
        // We use replace to avoid polluting the history stack during bootstrap
        // pathname from i18n/routing is already unlocalized
        router.replace(pathname, { locale: settings.locale });
      }
    }
  }, [isLoading, settings?.locale, currentLocale, router, pathname]);

  return <>{children}</>;
}
