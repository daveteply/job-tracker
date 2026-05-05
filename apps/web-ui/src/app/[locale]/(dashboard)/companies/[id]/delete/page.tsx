'use client';

import { use } from 'react';

import { useTranslations } from 'next-intl';

import { useCanDeleteCompany, useCompany, useCompanyActions } from '@job-tracker/hooks';
import { CompanyInfoCard, EntityDelete, PageLoading } from '@job-tracker/ui-components';

import { Link } from '../../../../../../i18n/routing';

export default function DeleteCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('Companies');
  const tCommon = useTranslations('Common');
  const { id } = use(params);
  const { company, loading } = useCompany(id);

  const { removeCompany } = useCompanyActions();
  const { canDelete, blockers, loading: deleteCheckLoading } = useCanDeleteCompany(id);

  if (loading || deleteCheckLoading) return <PageLoading entityName={t('companyEntityName')} />;
  if (!company) return null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col">
      <div className="mb-6">
        <h1 className="px-1 text-2xl font-bold">{t('deleteCompanyTitle')}</h1>
      </div>

      <div className="flex flex-col gap-4">
        <CompanyInfoCard company={company} showControls={false} />
        {canDelete ? (
          <EntityDelete
            id={id}
            onDeleteAction={removeCompany}
            entityName={t('companyEntityName')}
            postActionRoute="/companies"
            translations={{
              reminder: tCommon('deleteReminder'),
              confirm: tCommon('deleteAction', { name: t('companyEntityName') }),
              cancel: tCommon('cancel'),
              success: tCommon('deleteSuccess', { name: t('companyEntityName') }),
              error: tCommon('deleteError', { name: t('companyEntityName') }),
            }}
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
      </div>
    </div>
  );
}
