'use client';

import { Suspense, useState } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  ArrowRightOnRectangleIcon,
  EnvelopeIcon,
  KeyIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import * as z from 'zod';

import { useToast } from '@job-tracker/ui-components';

import { Link } from '../../../i18n/routing';

const applySchema = (t: any) =>
  z.object({
    email: z.email(t('invalidEmail')),
    name: z.string().optional(),
    reason: z.string().optional(),
  });

type ApplyFormValues = z.infer<ReturnType<typeof applySchema>>;

function BetaContent() {
  const t = useTranslations('BetaPage');
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_BETA_GATE !== 'true') {
      router.replace(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
  }, [router, callbackUrl]);

  const [isApplying, setIsApplying] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [validateEmail, setValidateEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplyFormValues>({
    resolver: zodResolver(applySchema(t)),
  });

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/';
  const BETA_BASE_URL = `${BACKEND_URL.replace(/\/$/, '')}/beta`;

  const onApply = async (data: ApplyFormValues) => {
    setIsApplying(true);
    try {
      const response = await fetch(`${BETA_BASE_URL}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error();

      showToast(t('applicationSuccess'), 'success');
      reset();
    } catch (error) {
      showToast(t('applicationError'), 'error');
    } finally {
      setIsApplying(false);
    }
  };

  const onValidate = async () => {
    if (!inviteCode || !validateEmail) return;
    setIsValidating(true);

    try {
      const response = await fetch(`${BETA_BASE_URL}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: inviteCode.toUpperCase(), email: validateEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      // Mark this device as approved to skip the gate in the future
      localStorage.setItem('job-tracker-beta-approved', 'true');

      showToast(t('validationSuccess'), 'success');
      setTimeout(() => {
        router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }, 1500);
    } catch (error: any) {
      // Safely attempt to translate the error code, fallback to validationError
      let message = t('validationError');
      const errorCode = error.message;

      // Handle common network/fastify errors that might not be in our explicit list
      const normalizedCode = errorCode === 'Not Found' ? 'notFound' : errorCode;

      try {
        // Only try to translate if we think it might be a key
        message = t(normalizedCode);
      } catch (e) {
        // Fallback already set
      }

      showToast(message, 'error');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="bg-base-200 flex min-h-screen flex-col items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl shadow-md">
            <img
              src="/apple-touch-icon.png"
              alt="App Icon"
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="text-base-content text-4xl font-extrabold tracking-tight">{t('title')}</h1>
          <p className="text-base-content/70 mt-4 text-lg">{t('description')}</p>
        </div>

        <div className="space-y-4">
          {/* Apply for Invite Code */}
          <div className="collapse-arrow bg-base-100 border-base-300 collapse border shadow-sm">
            <input type="checkbox" />
            <div className="collapse-title flex items-center gap-3 text-xl font-medium">
              <EnvelopeIcon className="text-primary h-6 w-6" />
              {t('applyTitle')}
            </div>
            <div className="collapse-content">
              <p className="text-base-content/60 mb-4 text-sm">{t('applyDescription')}</p>
              <form onSubmit={handleSubmit(onApply)} className="space-y-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <EnvelopeIcon className="h-4 w-4" />
                      {t('emailLabel')}
                    </span>
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                  />
                  {errors.email && (
                    <span className="text-error mt-1 text-xs">{errors.email.message}</span>
                  )}
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      {t('nameLabel')}
                    </span>
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="Your Name"
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control w-full">
                  <textarea
                    {...register('reason')}
                    placeholder={t('reasonLabel')}
                    className="textarea textarea-bordered h-24 w-full"
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={isApplying}>
                  {isApplying && <span className="loading loading-spinner"></span>}
                  {t('submitApplication')}
                </button>
              </form>
            </div>
          </div>

          {/* Already have an invite code? */}
          <div className="collapse-arrow bg-base-100 border-base-300 collapse border shadow-sm">
            <input type="checkbox" />
            <div className="collapse-title flex items-center gap-3 text-xl font-medium">
              <KeyIcon className="text-secondary h-6 w-6" />
              {t('alreadyHaveCode')}
            </div>
            <div className="collapse-content">
              <div className="space-y-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <EnvelopeIcon className="h-4 w-4" />
                      {t('emailLabel')}
                    </span>
                  </label>
                  <input
                    type="email"
                    className="input input-bordered w-full"
                    value={validateEmail}
                    onChange={(e) => setValidateEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <KeyIcon className="h-4 w-4" />
                      {t('codeLabel')}
                    </span>
                  </label>
                  <div className="join flex w-full">
                    <input
                      type="text"
                      className="input input-bordered join-item grow"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      placeholder="BETA-XXXX"
                    />
                    <button
                      className="btn btn-secondary join-item"
                      onClick={onValidate}
                      disabled={isValidating || !inviteCode || !validateEmail}
                    >
                      {isValidating && <span className="loading loading-spinner"></span>}
                      {t('validateCode')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="divider opacity-50"></div>

          {/* Already in the Beta? */}
          <div className="collapse-arrow bg-base-100 border-base-300 collapse border shadow-sm">
            <input type="checkbox" />
            <div className="collapse-title flex items-center gap-3 text-xl font-medium">
              <ArrowRightOnRectangleIcon className="text-primary h-6 w-6" />
              {t('alreadyApproved')}
            </div>
            <div className="collapse-content">
              <div className="flex flex-col items-center gap-4 py-2">
                <p className="text-base-content/60 text-center text-sm">{t('signInToSync')}</p>
                <Link
                  href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                  className="btn btn-primary btn-wide group"
                  onClick={() => {
                    localStorage.setItem('job-tracker-beta-approved', 'true');
                  }}
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  {t('signInNow')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 text-center">
          <Link href="/home" className="btn btn-ghost btn-sm">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BetaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      }
    >
      <BetaContent />
    </Suspense>
  );
}
