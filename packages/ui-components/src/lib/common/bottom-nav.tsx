'use client';

import {
  BuildingOfficeIcon,
  ChartBarIcon,
  HomeIcon,
  QueueListIcon,
} from '@heroicons/react/16/solid';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const navItems = [
    { name: 'Home', href: '/home', icon: HomeIcon },
    { name: 'Pipeline', href: '/pipeline', icon: QueueListIcon },
    { name: 'Activity', href: '/activity', icon: ChartBarIcon },
    { name: 'Companies', href: '/companies', icon: BuildingOfficeIcon },
  ];

  const pathname = usePathname();

  return (
    <nav className="dock dock-md border-t border-base-200 bg-accent-content">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={isActive ? 'dock-active text-primary' : ''}
          >
            <Icon className="size-6" />
            <span className="dock-label text-xs">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
