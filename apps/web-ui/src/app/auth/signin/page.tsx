'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');

  return (
    <div className="bg-base-200 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-base-100 border-base-300 w-full max-w-md space-y-8 rounded-xl border p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-base-content mt-6 text-3xl font-extrabold">Welcome Back</h2>
          <p className="text-base-content/60 mt-2 text-sm">
            Sign in to your account to continue tracking your jobs.
          </p>
        </div>

        {error && (
          <div
            className="bg-error/10 border-error text-error relative rounded border px-4 py-3 text-sm"
            role="alert"
          >
            <span className="block sm:inline">
              {error === 'OAuthAccountNotLinked'
                ? 'To confirm your identity, sign in with the same account you used originally.'
                : 'An error occurred during sign in. Please try again.'}
            </span>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="group relative flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            <div className="absolute left-4 flex items-center">
              <img src="/auth/google.svg" alt="Google Logo" className="h-5 w-5" />
            </div>
            Sign in with Google
          </button>

          <button
            onClick={() => signIn('facebook', { callbackUrl })}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#1877F2] px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#166fe5] focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2 focus:outline-none"
          >
            <div className="absolute left-4 flex items-center">
              <img src="/auth/facebook.svg" alt="Facebook Logo" className="h-5 w-5" />
            </div>
            Sign in with Facebook
          </button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="border-base-300 w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-base-100 text-base-content/60 px-2">Secure Authentication</span>
            </div>
          </div>
        </div>

        <div className="text-base-content/60 mt-6 text-center text-xs">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
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
