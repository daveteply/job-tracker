'use client';

import { RoleDTO } from '@job-tracker/validation';
import RoleInfoCard from './role-info-card';

export interface RoleListProps {
  roles: RoleDTO[];
}

export function RoleList({ roles }: RoleListProps) {
  return (
    <div className="flex flex-col gap-3">
      {roles && roles.length ? (
        <>
          {roles.map((Role: RoleDTO) => (
            <RoleInfoCard key={Role.id} role={Role} />
          ))}
        </>
      ) : (
        <p className="text-sm opacity-50 italic px-1">No Roles found</p>
      )}
    </div>
  );
}

export default RoleList;
