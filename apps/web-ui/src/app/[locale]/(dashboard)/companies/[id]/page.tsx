'use client';

import { use } from 'react';
import { useCompany } from '@job-tracker/hooks';
import { CompanyInfoCard, PageLoading } from '@job-tracker/ui-components';
import { Link } from '../../../../../i18n/routing';
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';
import { useTranslations } from 'next-intl';

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('Companies');
  const { id } = use(params);
  const { company, loading } = useCompany(id);

  if (loading) return <PageLoading entityName={t('companyEntityName')} />;
  if (!company) return <div>{t('companyNotFound')}</div>;

  return (
    <>
      <div className="mb-3 flex">
        <h1 className="pr-2 text-xl">{t('companyDetails')}</h1>
        <Link
          className="btn btn-circle btn-sm text-primary"
          href={`${id}/edit`}
          title={t('editCompany')}
        >
          <PencilIcon className="size-5" />
        </Link>
        <Link
          className="btn btn-circle btn-sm text-error"
          href={`${id}/delete`}
          title={t('deleteCompany')}
        >
          <TrashIcon className="size-5" />
        </Link>
      </div>

      <CompanyInfoCard company={company} showControls={false} />

      <div className="mt-5">
        <Link className="btn mr-3" href="/companies">
          {t('backToCompanies')}
        </Link>
        <Link className="btn" href="/activity">
          {t('backToEvents')}
        </Link>
      </div>
    </>
  );
}
