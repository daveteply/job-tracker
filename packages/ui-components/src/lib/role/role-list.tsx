'use client';

import { useTranslations } from 'next-intl';

import { RoleWithEventsDTO } from '@job-tracker/validation';

import RoleInfoCard from './role-info-card';

export interface RoleListProps {
  roles: RoleWithEventsDTO[];
  showFull?: boolean;
  noRolesMessage?: string;
  showEvents?: boolean;
}

export function RoleList({
  roles,
  showFull = true,
  noRolesMessage,
  showEvents = false,
}: RoleListProps) {
  const t = useTranslations('Roles');
  const message = noRolesMessage || t('noRolesFound');

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {roles && roles.length ? (
        <>
          {roles.map((role) => (
            <RoleInfoCard
              key={role.id}
              role={role}
              events={role.events}
              showFull={showFull}
              showEvents={showEvents}
            />
          ))}
        </>
      ) : (
        <p className="px-1 text-sm italic opacity-50">{message}</p>
      )}
    </div>
  );
}

export default RoleList;
