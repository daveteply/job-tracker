'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { DashboardMenuLinks } from '../navigation/dashboard-menu-links';

export function UserMenu() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const t = useTranslations('Navigation');

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
                {session?.user?.name?.[0] ?? '?'}
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
              <Link
                href={`/auth/signin?callbackUrl=${encodeURIComponent(pathname || '/')}`}
                className="text-primary font-semibold"
              >
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
          {session && (
            <>
              <div className="divider my-0"></div>
              <li className="menu-title px-2 py-1">
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-base-content font-bold line-clamp-1">
                    {session.user?.name}
                  </span>
                  <span className="text-base-content/60 text-[10px] font-normal line-clamp-1">
                    {session.user?.email}
                  </span>
                </div>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default UserMenu;
