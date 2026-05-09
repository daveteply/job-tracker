# i18n and Locale Analysis

## Current Responsibilities

- **root package.json**: Defines dependencies including `next` (v16.2.4), `next-intl` (v4.9.1), `rxdb`, and `dexie`. Uses Nx for monorepo management.
- **apps/web-ui/src/app/[locale]/layout.tsx**: Root layout for localized routes. Uses `next-intl`'s `NextIntlClientProvider` and `setRequestLocale` for static rendering. Validates `locale` against supported ones.
- **apps/web-ui/src/proxy.ts**: Contains the `next-intl` middleware configuration. Note: Named `proxy.ts` instead of the standard `middleware.ts`.
- **packages/domain/src/lib/user-settings**: Defines `UserSettingsEntity` and `UserSettingsSchema`. Currently lacks a `locale` or `language` field.
- **i18n utilities**: `routing.ts` defines supported locales (`en-US`, `es-US`) and default (`en-US`). `request.ts` handles message loading.
- **rxDB/Dexie hydration**: Managed via `DatabaseProvider` and `DatabaseGate` in `@job-tracker/data-access`. Hydrates based on session user ID or guest ID.
- **Settings page**: `apps/web-ui/src/app/[locale]/(dashboard)/settings/page.tsx` is currently a client component trying to use server-side `next-intl` functions, which is incorrect.

## 1. Current Locale Flow

1. Middleware (`proxy.ts`) detects locale from URL or headers.
2. Route `/[locale]` is matched.
3. `RootLayout` validates locale and sets it for the request.
4. `NextIntlClientProvider` passes messages to the client.
5. Components use `useLocale` or `useTranslations`.

## 2. Locale Selection

- Currently only via URL segment.
- No UI exists to change the locale yet.
- Middleware handles default redirection.

## 3. Locale Truth

- **URL**: Active truth for the current view.
- **Browser Language**: Initial hint for middleware.
- **Persisted User Settings**: Missing from RxDB. Should be the long-term truth for logged-in users.
- **Runtime App State**: Managed by `next-intl`.

## 4. Hydration and Redirect Risks

- **Hydration Mismatch**: `SettingsPage` is incorrectly marked `'use client'` while being `async` and using server-side `next-intl` utils.
- **Redirection**: If we implement redirection based on RxDB settings, we must do it carefully to avoid loops with the middleware.
- **Offline-first**: Locale must be available even when offline (RxDB is good for this).

## 5. Migration from middleware.ts to proxy.ts

- `apps/web-ui/src/proxy.ts` already exists.
- In Next.js, the special filename is `middleware.ts`. If `proxy.ts` is used, it must be either renamed to `middleware.ts` at the root of the app or specifically handled (Next.js 16 might have changed this, but it's more likely the user wants to ensure it _is_ `proxy.ts` if that's the new project standard).
- **Update**: I should check if there's any config that points to `proxy.ts`.

## 6. Ambiguities / Clarifications

- Why `proxy.ts` instead of `middleware.ts`? Is this a project-specific convention or a Next.js 16 experimental feature?
- Should the locale be synced to the backend via `UserSettings`?
- Is there a preference for how to handle guest vs. logged-in locale synchronization?

## 7. Phased Implementation Plan

1. **Fix Current Errors**: Convert `SettingsPage` to a proper Server Component (remove `'use client'`) or fix its client-side translation usage.
2. **Domain Update**: Add `locale: string` to `UserSettingsEntity` and `UserSettingsSchema`.
3. **UI Implementation**: Add a Language Switcher to the `SettingsPage`.
4. **Logic Integration**:
   - Update `SettingsPage` to save locale to RxDB.
   - Implement a mechanism (possibly in a client-side layout or provider) to redirect if the URL locale doesn't match the RxDB locale.
5. **Middleware Alignment**: Ensure `proxy.ts` is correctly performing its role or rename it if necessary for Next.js 16 compatibility.
