'use client';

import { useTranslations } from 'next-intl';

import { RoleDTO } from '@job-tracker/validation';

import RoleInfoCard from './role-info-card';

export interface RoleListProps {
  roles: RoleDTO[];
  renderFull?: boolean;
  noRolesMessage?: string;
}

export function RoleList({ roles, renderFull = true, noRolesMessage }: RoleListProps) {
  const t = useTranslations('Roles');
  const message = noRolesMessage || t('noRolesFound');

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {roles && roles.length ? (
        <>
          {roles.map((role: RoleDTO) => (
            <RoleInfoCard key={role.id} role={role} renderFull={renderFull} />
          ))}
        </>
      ) : (
        <p className="px-1 text-sm italic opacity-50">{message}</p>
      )}
    </div>
  );
}

export default RoleList;
