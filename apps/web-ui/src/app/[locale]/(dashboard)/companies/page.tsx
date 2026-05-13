'use client';

import { PlusCircleIcon } from '@heroicons/react/16/solid';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

import { useCompaniesWithChildren, useGroupedCompanies } from '@job-tracker/hooks';
import { CompanyList, EmptyState, ListSkeleton, PageHeader } from '@job-tracker/ui-components';

import { Link } from '../../../../i18n/routing';

export default function CompaniesListPage() {
  const t = useTranslations('Companies');
  const { companies, loading } = useCompaniesWithChildren();
  const { active, inactive } = useGroupedCompanies(companies);

  if (loading) return <ListSkeleton />;

  return (
    <>
      <PageHeader title={t('listTitle')}>
        <Link className="btn btn-sm text-primary" href="companies/new" title={t('addCompany')}>
          <PlusCircleIcon className="size-5" />
          {t('addCompany')}
        </Link>
      </PageHeader>

      {active.length === 0 && inactive.length === 0 ? (
        <EmptyState
          icon={<BuildingOfficeIcon className="h-16 w-16" />}
          title={t('noCompaniesFound')}
          description={t('emptyStateDescription')}
          action={
            <Link href="companies/new" className="btn btn-primary gap-2">
              <PlusCircleIcon className="h-5 w-5" />
              {t('addCompany')}
            </Link>
          }
        />
      ) : (
        <CompanyList activeCompanies={active} inactiveCompanies={inactive} />
      )}
    </>
  );
}
