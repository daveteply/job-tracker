'use client';

import UserCircleIcon from '@heroicons/react/24/outline/UserCircleIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { useBetaApproved } from '@job-tracker/hooks';

import { DashboardMenuLinks } from '../navigation/dashboard-menu-links';

export function UserMenu() {
  const { data: session, status } = useSession();
  const isBetaApproved = useBetaApproved();
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  const getSignInUrl = () => {
    const isBetaEnabled = process.env.NEXT_PUBLIC_ENABLE_BETA_GATE === 'true';
    const baseUrl = isBetaEnabled && !isBetaApproved ? '/beta' : '/auth/signin';
    return `${baseUrl}?callbackUrl=${encodeURIComponent(pathname || '/')}`;
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2">
        <span className="loading loading-spinner loading-xs text-primary-content"></span>
        <span className="text-sm">...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar border-primary-content/20"
        >
          <div className="w-10 rounded-full">
            {session?.user?.image ? (
              <img
                alt={session.user.name ?? 'User'}
                src={session.user.image}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="bg-neutral text-neutral-content flex h-full w-full items-center justify-center font-bold">
                {session?.user?.name?.[0] ?? <UserCircleIcon className="h-8 w-8" />}
              </div>
            )}
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box text-base-content z-[1] mt-3 w-52 p-2 shadow"
        >
          {session ? (
            <li>
              <button onClick={() => signOut()} className="text-error font-semibold">
                {t('signOut')}
              </button>
            </li>
          ) : (
            <li>
              <Link href={getSignInUrl()} className="text-primary font-semibold">
                {t('signIn')}
              </Link>
            </li>
          )}
          <div className="divider my-0"></div>
          <li>
            <Link href="/settings">{t('settings')}</Link>
          </li>
          <div className="divider my-0"></div>
          <DashboardMenuLinks />
          <div className="divider my-0"></div>
          <li>
            <Link href="/">{t('about')}</Link>
          </li>
          <li>
            <Link href="/privacy">{t('privacy')}</Link>
          </li>
          <li>
            <Link href="/terms">{t('terms')}</Link>
          </li>
          {session && (
            <>
              <div className="divider my-0"></div>
              <li className="menu-title px-2 py-1">
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-base-content line-clamp-1 font-bold">
                    {session.user?.name}
                  </span>
                  <span className="text-base-content/60 line-clamp-1 text-[10px] font-normal">
                    {session.user?.email}
                  </span>
                </div>
              </li>
            </>
          )}
          <div className="divider my-0 opacity-50"></div>
          <li className="px-4 py-1.5 opacity-30 select-none">
            <div className="flex w-full items-center justify-between">
              <span className="text-[9px] font-bold tracking-wider uppercase">Version</span>
              <span className="font-mono text-[10px]">{process.env.NEXT_PUBLIC_APP_VERSION}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default UserMenu;
