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
        <p className="px-1 text-sm italic opacity-50">No Roles found</p>
      )}
    </div>
  );
}

export default RoleList;
