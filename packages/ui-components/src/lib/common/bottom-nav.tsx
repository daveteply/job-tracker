'use client';

import {
  BuildingOfficeIcon,
  ChartBarIcon,
  HomeIcon,
  QueueListIcon,
} from '@heroicons/react/16/solid';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function BottomNav() {
  const t = useTranslations('Navigation');
  const navItems = [
    { name: t('home'), href: '/home', icon: HomeIcon },
    { name: t('pipeline'), href: '/pipeline', icon: QueueListIcon },
    { name: t('activity'), href: '/activity', icon: ChartBarIcon },
    { name: t('companies'), href: '/companies', icon: BuildingOfficeIcon },
  ];

  const pathname = usePathname();

  return (
    <nav className="dock dock-md border-base-200 bg-accent-content border-t md:right-auto md:left-1/2 md:w-full md:max-w-screen-xl md:-translate-x-1/2 md:rounded-t-xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.endsWith(item.href) || pathname.includes(item.href + '/');

        return (
          <Link
            key={item.name}
            href={item.href}
            className={isActive ? 'bg-primary text-primary-content' : ''}
          >
            <Icon className="size-6" />
            <span className="dock-label text-xs">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
