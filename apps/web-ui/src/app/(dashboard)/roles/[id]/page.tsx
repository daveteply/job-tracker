'use client';

import { use } from 'react';
import { useRoleWithCompany } from '@job-tracker/hooks';
import { RoleInfoCard, PageLoading } from '@job-tracker/ui-components';
import Link from 'next/link';
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';

// buttons [View Job Posting], [Log Event]

export default function RoleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { role, loading } = useRoleWithCompany(id);

  if (loading) return <PageLoading entityName="role" />;
  if (!role) return <div>Role not found</div>;

  return (
    <>
      <div className="flex mb-3">
        <h1 className="text-xl pr-2">Role Details</h1>
        <Link className="btn btn-circle btn-sm text-primary" href={`${id}/edit`} title="Edit Role">
          <PencilIcon className="size-5" />
        </Link>
        <Link
          className="btn btn-circle btn-sm text-error"
          href={`${id}/delete`}
          title="Delete Role"
        >
          <TrashIcon className="size-5" />
        </Link>
      </div>

      <RoleInfoCard role={role} showControls={false} />

      <div className="mt-5">
        <Link className="btn" href="/roles">
          Back to Roles
        </Link>
      </div>
    </>
  );
}
