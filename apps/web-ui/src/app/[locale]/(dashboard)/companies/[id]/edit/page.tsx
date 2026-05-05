'use client';

import { use } from 'react';

import { useTranslations } from 'next-intl';

import { CompanyDocument } from '@job-tracker/data-access';
import { useCompany, useCompanyActions } from '@job-tracker/hooks';
import { CompanyForm, PageLoading } from '@job-tracker/ui-components';

export default function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('Companies');
  const { id } = use(params);
  const { company, loading } = useCompany(id);
  const { upsertCompany } = useCompanyActions();

  if (loading) return <PageLoading entityName={t('companyEntityName')} />;
  if (!company) return <div>{t('companyNotFound')}</div>;

  const handleUpdate = async (data: CompanyDocument) => {
    return upsertCompany({ ...data, id });
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="px-1 text-2xl font-bold">{t('editCompanyTitle', { name: company.name })}</h1>
      </div>
      <CompanyForm
        onSubmitAction={handleUpdate}
        initialData={company}
        isEdit={true}
        postActionRoute={'/companies'}
      />
    </>
  );
}
