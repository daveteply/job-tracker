'use client';

import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

import { useUserSettings } from '@job-tracker/hooks';
import { RoleWithEventsDTO } from '@job-tracker/validation';

import RoleInfoCard from './role-info-card';

export interface RoleListProps {
  activeRoles: RoleWithEventsDTO[];
  inactiveRoles?: RoleWithEventsDTO[];
  showFull?: boolean;
  noRolesMessage?: string;
  showEvents?: boolean;
}

export function RoleList({
  activeRoles,
  inactiveRoles = [],
  showFull = true,
  noRolesMessage,
  showEvents = false,
}: RoleListProps) {
  const t = useTranslations('Roles');
  const { settings, updateSettings } = useUserSettings();
  const message = noRolesMessage || t('noRolesFound');

  const showInactive = settings?.showInactiveRoles ?? false;

  const toggleInactive = () => {
    updateSettings({ showInactiveRoles: !showInactive });
  };

  if (activeRoles.length === 0 && inactiveRoles.length === 0) {
    return <p className="px-1 text-sm italic opacity-50">{message}</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {activeRoles.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeRoles.map((role) => (
            <RoleInfoCard
              key={role.id}
              role={role}
              events={role.events}
              showFull={showFull}
              showEvents={showEvents}
            />
          ))}
        </div>
      ) : (
        inactiveRoles.length === 0 && <p className="px-1 text-sm italic opacity-50">{message}</p>
      )}

      {inactiveRoles.length > 0 && (
        <div className="border-base-content/10 flex flex-col gap-4 border-t pt-8">
          <button
            onClick={toggleInactive}
            className="flex w-fit items-center gap-2 px-1 text-sm font-semibold opacity-70 transition-opacity hover:opacity-100"
          >
            {showInactive ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
            {t('inactiveRoles')} ({inactiveRoles.length})
          </button>

          {showInactive && (
            <div className="grid grid-cols-1 gap-4 opacity-70 md:grid-cols-2 lg:grid-cols-3">
              {inactiveRoles.map((role) => (
                <RoleInfoCard
                  key={role.id}
                  role={role}
                  events={role.events}
                  showFull={showFull}
                  showEvents={showEvents}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RoleList;
