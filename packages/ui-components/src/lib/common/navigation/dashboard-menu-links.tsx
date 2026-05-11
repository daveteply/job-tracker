'use client';

import { BellIcon, BriefcaseIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export interface DashboardMenuLinksProps {
  showIcons?: boolean;
  onItemClick?: () => void;
}

export function DashboardMenuLinks({ showIcons = false, onItemClick }: DashboardMenuLinksProps) {
  const t = useTranslations('Navigation');

  const links = [
    { href: '/contacts', label: t('contacts'), icon: UserGroupIcon },
    { href: '/reminders', label: t('reminders'), icon: BellIcon },
    { href: '/roles', label: t('roles'), icon: BriefcaseIcon },
  ];

  return (
    <>
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} onClick={onItemClick}>
            {showIcons && <link.icon className="h-5 w-5" />}
            {link.label}
          </Link>
        </li>
      ))}
    </>
  );
}

export default DashboardMenuLinks;
