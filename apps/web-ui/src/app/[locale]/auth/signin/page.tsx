'use client';

import { Suspense } from 'react';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';

function SignInContent() {
  const t = useTranslations('SignInPage');
  const commonT = useTranslations('Common');
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');

  return (
    <div className="bg-base-200 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-base-100 border-base-300 w-full max-w-md space-y-8 rounded-xl border p-8 shadow-lg">
        <div className="text-center">
          <div className="flex flex-col items-center gap-2">
            <img src="/apple-touch-icon.png" alt="App Icon" className="h-12 w-12 rounded-xl shadow-sm" />
            <h1 className="text-primary text-xl font-bold tracking-tight">
              {commonT('title')}
            </h1>
          </div>
          <h2 className="text-base-content mt-6 text-3xl font-extrabold">{t('title')}</h2>
          <p className="text-base-content/60 mt-2 text-sm">{t('signInDescription')}</p>
        </div>

        {error && (
          <div
            className="bg-error/10 border-error text-error relative rounded border px-4 py-3 text-sm"
            role="alert"
          >
            <span className="block sm:inline">
              {error === 'OAuthAccountNotLinked' ? t('oauthAccountNotLinked') : t('signInError')}
            </span>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="group relative flex w-full justify-center rounded-md border border-base-300 bg-base-100 px-4 py-3 text-sm font-medium text-base-content shadow-sm transition-colors hover:bg-base-200 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
          >
            <div className="absolute left-4 flex items-center">
              <img src="/auth/google.svg" alt="Google Logo" className="h-5 w-5" />
            </div>
            {t('signInWithGoogle')}
          </button>

          <button
            onClick={() => signIn('facebook', { callbackUrl })}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-facebook px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-facebook-hover focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
          >
            <div className="absolute left-4 flex items-center">
              <img src="/auth/facebook.svg" alt="Facebook Logo" className="h-5 w-5" />
            </div>
            {t('signInWithFacebook')}
          </button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="border-base-300 w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-base-100 text-base-content/60 px-2">
                {t('secureAuthentication')}
              </span>
            </div>
          </div>
        </div>

        <div className="text-base-content/60 mt-6 text-center text-xs">{t('termsAndPrivacy')}</div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
