'use client';

import {
  CloudArrowUpIcon,
  CloudIcon,
  ExclamationCircleIcon,
  SignalSlashIcon,
} from '@heroicons/react/24/outline';

import { useSyncStatus } from '@job-tracker/data-access';

export const SyncIndicator = () => {
  const status = useSyncStatus();

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
        return 'Sync error';
      case 'offline':
        return 'Offline';
      default:
        return '';
    }
  };

  return (
    <div
      className="bg-primary-content/10 flex items-center gap-2 rounded-md px-2 py-1"
      title={getTooltip()}
    >
      {getIcon()}
      <span className="text-xs font-medium tracking-wider uppercase opacity-80">{status}</span>
    </div>
  );
};
