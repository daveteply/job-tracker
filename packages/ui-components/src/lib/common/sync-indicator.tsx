'use client';

import { useSyncStatus } from '@job-tracker/data-access';
import {
  CloudArrowUpIcon,
  CloudIcon,
  ExclamationCircleIcon,
  SignalSlashIcon,
} from '@heroicons/react/24/outline';

export const SyncIndicator = () => {
  const status = useSyncStatus();

  const getIcon = () => {
    switch (status) {
      case 'syncing':
        return <CloudArrowUpIcon className="h-5 w-5 animate-pulse text-blue-200" />;
      case 'synced':
        return <CloudIcon className="h-5 w-5 text-green-300" />;
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-400" />;
      case 'offline':
        return <SignalSlashIcon className="h-5 w-5 text-gray-400" />;
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
    <div className="flex items-center gap-2 rounded-md bg-white/10 px-2 py-1" title={getTooltip()}>
      {getIcon()}
      <span className="text-xs font-medium tracking-wider uppercase opacity-80">{status}</span>
    </div>
  );
};
