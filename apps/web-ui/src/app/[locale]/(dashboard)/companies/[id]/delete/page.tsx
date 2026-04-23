'use client';

import { use } from 'react';
import { useCanDeleteCompany, useCompany, useCompanyActions } from '@job-tracker/hooks';
import { CompanyInfoCard, EntityDelete, PageLoading } from '@job-tracker/ui-components';
import { Link } from '../../../../../../i18n/routing';
import { useTranslations } from 'next-intl';

export default function DeleteCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('Companies');
  const { id } = use(params);
  const { company, loading } = useCompany(id);
  const { removeCompany } = useCompanyActions();
  const { canDelete, blockers, loading: deleteCheckLoading } = useCanDeleteCompany(id);

  if (loading || deleteCheckLoading) return <PageLoading entityName={t('companyEntityName')} />;
  if (!company) return null;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="pr-1 text-xl">{t('deleteCompanyTitle')}</h1>

      <>
        <CompanyInfoCard company={company} showControls={false} />
        {canDelete ? (
          <EntityDelete
            id={id}
            onDeleteAction={removeCompany}
            entityName={t('companyEntityName')}
            postActionRoute="/companies"
          />
        ) : (
          <>
            <p>
              {t('deleteBlocker', {
                events: blockers.events,
                contacts: blockers.contacts,
                roles: blockers.roles,
              })}
            </p>
            <div className="flex">
              <Link className="btn btn-info mr-3" href="/companies">
                {t('backToCompanies')}
              </Link>
              <Link className="btn btn-info" href="/activity">
                {t('backToEvents')}
              </Link>
            </div>
          </>
        )}
      </>
    </div>
  );
}
