'use client';

import { useSession } from 'next-auth/react';
import { usePostHog } from 'posthog-js/react';
import { useEffect, useRef } from 'react';

export function PostHogAuthHandler() {
  const { data: session, status } = useSession();
  const posthog = usePostHog();
  const identifiedRef = useRef(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email && posthog && !identifiedRef.current) {
      // 1. Identify the user
      posthog.identify(session.user.email, {
        email: session.user.email,
        name: session.user.name,
      });

      // 2. Track the login event
      posthog.capture('user_login_success', {
        method: 'next-auth', // You could expand this if you have multiple providers
      });

      identifiedRef.current = true;
    } else if (status === 'unauthenticated') {
      // Reset identification status when logged out
      if (identifiedRef.current) {
        posthog.reset();
        identifiedRef.current = false;
      }
    }
  }, [session, status, posthog]);

  return null;
}
