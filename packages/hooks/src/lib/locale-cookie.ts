'use client';

/**
 * Sets the NEXT_LOCALE cookie for next-intl middleware.
 * @param locale The locale to set (e.g., 'en-US', 'es-US')
 */
export function setLocaleCookie(locale: string) {
  // Set cookie with 1 year expiration
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Gets the current NEXT_LOCALE cookie value.
 */
export function getLocaleCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; NEXT_LOCALE=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return undefined;
}
