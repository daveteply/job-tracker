'use client';

import { PlusCircleIcon } from '@heroicons/react/16/solid';
import { useRolesWithCompany } from '@job-tracker/hooks';
import { RoleList, PageLoading } from '@job-tracker/ui-components';
import Link from 'next/link';

export default function RoleListPage() {
  const { roles, loading } = useRolesWithCompany();

  // This is the job pipeline view.

  if (loading) return <PageLoading entityName="roles" />;

  return (
    <>
      <div className="flex mb-3 justify-between">
        <h1 className="text-xl pr-1">Roles</h1>
        <Link className="btn btn-sm text-primary" href="roles/new" title="Add Role">
          <PlusCircleIcon className="size-5" />
          Add Role
        </Link>
      </div>

      <RoleList roles={roles} />
    </>
  );
}
