'use client';

import { use } from 'react';
import { useCompany } from '@job-tracker/hooks';
import { CompanyInfoCard, PageLoading } from '@job-tracker/ui-components';
import Link from 'next/link';
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { company, loading } = useCompany(id);

  if (loading) return <PageLoading entityName="company" />;
  if (!company) return <div>Company not found</div>;

  // TODO: Tabs inside company:
  //  Overview | Contacts | Roles | Activity

  return (
    <>
      <div className="flex mb-3">
        <h1 className="text-xl pr-2">Company Details</h1>
        <Link
          className="btn btn-circle btn-sm text-primary"
          href={`${id}/edit`}
          title="Edit Company"
        >
          <PencilIcon className="size-5" />
        </Link>
        <Link
          className="btn btn-circle btn-sm text-error"
          href={`${id}/delete`}
          title="Delete Company"
        >
          <TrashIcon className="size-5" />
        </Link>
      </div>

      <CompanyInfoCard company={company} showControls={false} />

      <div className="mt-5">
        <Link className="btn mr-3" href="./">
          Back to Companies
        </Link>
        <Link className="btn" href="../">
          Back to Events
        </Link>
      </div>
    </>
  );
}
