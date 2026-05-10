'use client';

import { useEffect, useState } from 'react';

import {
  CloudArrowUpIcon,
  CloudIcon,
  ExclamationCircleIcon,
  SignalSlashIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { useSyncStatus } from '@job-tracker/data-access';

export const SyncIndicator = () => {
  const status = useSyncStatus();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isBetaApproved, setIsBetaApproved] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('job-tracker-beta-approved') === 'true') {
      setIsBetaApproved(true);
    }
  }, []);

  const getSignInUrl = () => {
    const isBetaEnabled = process.env.NEXT_PUBLIC_ENABLE_BETA_GATE === 'true';
    const baseUrl = isBetaEnabled && !isBetaApproved ? '/beta' : '/auth/signin';
    return `${baseUrl}?callbackUrl=${encodeURIComponent(pathname || '/')}`;
  };

  const getIcon = () => {
    switch (status) {
      case 'syncing':
        return <CloudArrowUpIcon className="text-info h-5 w-5 animate-pulse" />;
      case 'synced':
        return <CloudIcon className="text-success h-5 w-5" />;
      case 'error':
        return <ExclamationCircleIcon className="text-error h-5 w-5" />;
      case 'offline':
        return <SignalSlashIcon className="text-primary-content/40 h-5 w-5" />;
      default:
        return null;
    }
  };

  const getTooltip = () => {
    switch (status) {
      case 'syncing':
        return 'Syncing changes...';
      case 'synced':
        return 'All changes backed up';
      case 'error':
        return 'Sync error - Click to resolve';
      case 'offline':
        return session ? 'Disconnected' : 'Click to enable Cloud Sync';
      default:
        return '';
    }
  };

  const getActionUrl = () => {
    if (status === 'error') return `/beta?callbackUrl=${encodeURIComponent(pathname || '/')}`;
    if (status === 'offline' && !session) return getSignInUrl();
    return null;
  };

  const actionUrl = getActionUrl();

  const containerClasses = `bg-primary-content/10 flex items-center gap-2 rounded-md px-2 py-1 transition-all duration-200 ${
    actionUrl
      ? 'hover:bg-primary-content/20 cursor-pointer shadow-md hover:shadow-lg active:scale-95'
      : ''
  }`;

  const content = (
    <>
      {getIcon()}
      <span className="text-xs font-medium tracking-wider uppercase opacity-80">{status}</span>
    </>
  );

  if (actionUrl) {
    return (
      <Link href={actionUrl} className={containerClasses} title={getTooltip()}>
        {content}
      </Link>
    );
  }

  return (
    <div className={containerClasses} title={getTooltip()}>
      {content}
    </div>
  );
};
