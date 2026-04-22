'use client';

import { use } from 'react';
import { useCompany, useCompanyActions } from '@job-tracker/hooks';
import { CompanyForm, PageLoading } from '@job-tracker/ui-components';
import { CompanyDocument } from '@job-tracker/data-access';

export default function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { company, loading } = useCompany(id);
  const { upsertCompany } = useCompanyActions();

  if (loading) return <PageLoading entityName="company" />;
  if (!company) return <div>Company not found</div>;

  const handleUpdate = async (data: CompanyDocument) => {
    return upsertCompany({ ...data, id });
  };

  return (
    <>
      <h1 className="mb-5 text-xl">Companies - Edit {company.name}</h1>
      <CompanyForm
        onSubmitAction={handleUpdate}
        initialData={company}
        isEdit={true}
        postActionRoute={'/companies'}
      />
    </>
  );
}
