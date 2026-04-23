'use client';

import { use } from 'react';
import { useCanDeleteCompany, useCompany, useCompanyActions } from '@job-tracker/hooks';
import { CompanyInfoCard, EntityDelete, PageLoading } from '@job-tracker/ui-components';
import Link from 'next/link';

export default function DeleteCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { company, loading } = useCompany(id);
  const { removeCompany } = useCompanyActions();
  const { canDelete, blockers, loading: deleteCheckLoading } = useCanDeleteCompany(id);

  if (loading || deleteCheckLoading) return <PageLoading entityName="company" />;
  if (!company) return null;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="pr-1 text-xl">Company - Delete</h1>

      <>
        <CompanyInfoCard company={company} showControls={false} />
        {canDelete ? (
          <EntityDelete
            id={id}
            onDeleteAction={removeCompany}
            entityName="Company"
            postActionRoute="/companies"
          />
        ) : (
          <>
            <p>{`This Company is associated with
                 ${blockers.events} Event(s), 
                 ${blockers.contacts} Contact(s) or 
                 ${blockers.roles} Role(s) and cannot be deleted`}</p>
            <div className="flex">
              <Link className="btn btn-info mr-3" href="/companies">
                Back to Companies
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
