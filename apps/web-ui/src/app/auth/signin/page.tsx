'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-base-100 p-8 rounded-xl shadow-lg border border-base-300">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-base-content">Welcome Back</h2>
          <p className="mt-2 text-sm text-base-content/60">
            Sign in to your account to continue tracking your jobs.
          </p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error text-error px-4 py-3 rounded relative text-sm" role="alert">
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
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <div className="absolute left-4 flex items-center">
              <img src="/auth/google.svg" alt="Google Logo" className="h-5 w-5" />
            </div>
            Sign in with Google
          </button>

          <button
            onClick={() => signIn('facebook', { callbackUrl })}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1877F2] hover:bg-[#166fe5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1877F2] transition-colors"
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
              <div className="w-full border-t border-base-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-base-100 text-base-content/60">Secure Authentication</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-base-content/60">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
