'use client';

import React from 'react';

export interface SignInViewProps {
  title: string;
  description: string;
  appName: string;
  appIconSrc: string;
  error?: string | null;
  errorMessages?: {
    oauthAccountNotLinked: string;
    signInError: string;
  };
  providers: {
    id: string;
    name: string;
    iconSrc: string;
    className?: string;
    onSignIn: () => void;
  }[];
  footerContent?: React.ReactNode;
  secureAuthLabel?: string;
}

export function SignInView({
  title,
  description,
  appName,
  appIconSrc,
  error,
  errorMessages,
  providers,
  footerContent,
  secureAuthLabel,
}: SignInViewProps) {
  return (
    <div className="bg-base-200 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-base-100 border-base-300 w-full max-w-md space-y-8 rounded-xl border p-8 shadow-lg">
        <div className="text-center">
          <div className="flex flex-col items-center gap-2">
            <img
              src={appIconSrc}
              alt={`${appName} Icon`}
              className="h-12 w-12 rounded-xl shadow-sm"
            />
            <h1 className="text-primary text-xl font-bold tracking-tight">{appName}</h1>
          </div>
          <h2 className="text-base-content mt-6 text-3xl font-extrabold">{title}</h2>
          <p className="text-base-content/60 mt-2 text-sm">{description}</p>
        </div>

        {error && errorMessages && (
          <div
            className="bg-error/10 border-error text-error relative rounded border px-4 py-3 text-sm"
            role="alert"
          >
            <span className="block sm:inline">
              {error === 'OAuthAccountNotLinked'
                ? errorMessages.oauthAccountNotLinked
                : errorMessages.signInError}
            </span>
          </div>
        )}

        <div className="mt-8 space-y-4">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={provider.onSignIn}
              className={`group focus:ring-primary relative flex w-full justify-center rounded-md border px-4 py-3 text-sm font-medium shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                provider.className ||
                'border-base-300 bg-base-100 text-base-content hover:bg-base-200'
              }`}
            >
              <div className="absolute left-4 flex items-center">
                <img src={provider.iconSrc} alt={`${provider.name} Logo`} className="h-5 w-5" />
              </div>
              {provider.name}
            </button>
          ))}
        </div>

        {secureAuthLabel && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="border-base-300 w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-base-100 text-base-content/60 px-2">{secureAuthLabel}</span>
              </div>
            </div>
          </div>
        )}

        {footerContent && (
          <div className="text-base-content/60 mt-6 text-center text-xs">{footerContent}</div>
        )}
      </div>
    </div>
  );
}
