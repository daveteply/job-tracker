'use client';

import { Suspense } from 'react';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { SignInView } from '@job-tracker/ui-components';

import { Link } from '../../../../i18n/routing';

function SignInContent() {
  const t = useTranslations('SignInPage');
  const commonT = useTranslations('Common');
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');

  const providers = [
    {
      id: 'google',
      name: t('signInWithGoogle'),
      iconSrc: '/auth/google.svg',
      onSignIn: () => signIn('google', { callbackUrl }),
    },
    /*
    {
      id: 'facebook',
      name: t('signInWithFacebook'),
      iconSrc: '/auth/facebook.svg',
      className: 'border-transparent bg-facebook text-white hover:bg-facebook-hover',
      onSignIn: () => signIn('facebook', { callbackUrl }),
    },
    */
  ];

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-10">
        <Link
          href="/home"
          className="text-base-content/60 hover:text-primary flex items-center gap-2 text-sm transition-colors"
        >
          <span>&larr;</span> {t('backToHome')}
        </Link>
      </div>
      <SignInView
        title={t('title')}
        description={t('signInDescription')}
        appName={commonT('title')}
        appIconSrc="/apple-touch-icon.png"
        error={error}
        errorMessages={{
          oauthAccountNotLinked: t('oauthAccountNotLinked'),
          signInError: t('signInError'),
        }}
        providers={providers}
        secureAuthLabel={t('secureAuthentication')}
        footerContent={t.rich('termsAndPrivacy', {
          terms: (chunks) => (
            <Link href="/terms" className="text-primary hover:underline">
              {chunks}
            </Link>
          ),
          privacy: (chunks) => (
            <Link href="/privacy" className="text-primary hover:underline">
              {chunks}
            </Link>
          ),
        })}
      />
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
