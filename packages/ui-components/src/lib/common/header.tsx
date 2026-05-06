'use client';

import { useEffect, useState } from 'react';

import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { AuthMenu } from './auth-menu';
import { SyncIndicator } from './sync-indicator';

export interface HeaderProps {
  title: string;
  iconSrc?: string;
  homeHref?: string;
}

export function Header({ title, iconSrc, homeHref = '/home' }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();
  const t = useTranslations('Navigation');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-blue-600 p-4 text-white transition-shadow duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-none'
      }`}
    >
      <div className="mx-auto flex max-w-screen-xl items-center justify-between">
        <Link href={homeHref} className="flex items-center gap-2">
          {iconSrc && <img src={iconSrc} alt="App Icon" className="h-8 w-8 rounded" />}
          <h1 className="text-2xl font-bold">{title}</h1>
        </Link>

        <div className="flex items-center gap-2">
          {/* Sync Indicator (Visible on all devices if logged in) */}
          {session && <SyncIndicator />}

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/settings" className="btn btn-ghost btn-sm text-white">
              <Cog8ToothIcon className="mr-1 h-5 w-5" />
              {t('settings')}
            </Link>
            <AuthMenu />
          </div>

          {/* Mobile Navigation (DaisyUI Dropdown) */}
          <div className="dropdown dropdown-end md:hidden">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-sm p-1 text-white"
              aria-label={t('toggleMenu')}
            >
              <Bars3Icon className="h-6 w-6" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box text-base-content z-[1] mt-3 w-56 p-2 shadow"
            >
              <li>
                <Link href="/settings">
                  <Cog8ToothIcon className="h-5 w-5" />
                  {t('settings')}
                </Link>
              </li>
              <div className="divider my-0 opacity-50"></div>
              {session ? (
                <>
                  <li className="menu-title px-4 py-2">
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-bold">{session.user?.name}</span>
                      <span className="text-xs font-normal opacity-60">{session.user?.email}</span>
                    </div>
                  </li>
                  <li>
                    <button onClick={() => signOut()} className="text-error">
                      <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                      {t('signOut')}
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/auth/signin">
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    {t('signIn')}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
