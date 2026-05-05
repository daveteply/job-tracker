'use client';

import { PlusCircleIcon } from '@heroicons/react/16/solid';
import { useTranslations } from 'next-intl';

import { useCompaniesWithChildren } from '@job-tracker/hooks';
import { CompanyList, PageLoading } from '@job-tracker/ui-components';

import { Link } from '../../../../i18n/routing';

export default function CompaniesListPage() {
  const t = useTranslations('Companies');
  const { companies, loading } = useCompaniesWithChildren();

  if (loading) return <PageLoading entityName={t('companiesEntityName')} />;

  return (
    <>
      <div className="mb-6 flex justify-between">
        <h1 className="px-1 text-2xl font-bold">{t('listTitle')}</h1>
        <Link className="btn btn-sm text-primary" href="companies/new" title={t('addCompany')}>
          <PlusCircleIcon className="size-5" />
          {t('addCompany')}
        </Link>
      </div>

      <CompanyList companies={companies} />
    </>
  );
}
