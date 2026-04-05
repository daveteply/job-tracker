'use client';

import { use } from 'react';
import { useCanDeleteRole, useRoleActions, useRoleWithCompany } from '@job-tracker/hooks';
import { RoleInfoCard, EntityDelete, PageLoading } from '@job-tracker/ui-components';
import Link from 'next/link';

export default function DeleteRolePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { role, loading } = useRoleWithCompany(id);

  const { removeRole } = useRoleActions();
  const { canDelete, blockers, loading: deleteCheckLoading } = useCanDeleteRole(id);

  if (loading || deleteCheckLoading) return <PageLoading entityName="role" />;
  if (!role) return null;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl pr-1">Role - Delete</h1>

      <>
        <RoleInfoCard role={role} showControls={false} />
        {canDelete ? (
          <EntityDelete
            id={id}
            onDeleteAction={removeRole}
            entityName="Role"
            postActionRoute="/roles"
          />
        ) : (
          <>
            <p>{`This Role is associated with
                 ${blockers.events} Event(s), 
                 ${blockers.roles} Role(s) or 
                 ${blockers.roles} Role(s) and cannot be deleted`}</p>
            <div className="flex">
              <Link className="btn btn-info mr-3" href="/roles">
                Back to Roles
              </Link>
              <Link className="btn btn-info" href="/activity">
                Back to Events
              </Link>
            </div>
          </>
        )}
      </>
    </div>
  );
}
