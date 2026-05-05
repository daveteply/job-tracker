'use client';

import { use } from 'react';

import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';
import { useTranslations } from 'next-intl';

import { useCompany, useContactsByCompany, useRolesByCompany } from '@job-tracker/hooks';
import { CompanyInfoCard, PageLoading } from '@job-tracker/ui-components';

import { Link } from '../../../../../i18n/routing';

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('Companies');
  const { id } = use(params);
  const { company, loading: companyLoading } = useCompany(id);
  const { roles, loading: rolesLoading } = useRolesByCompany(id);
  const { contacts, loading: contactsLoading } = useContactsByCompany(id);

  if (companyLoading || rolesLoading || contactsLoading)
    return <PageLoading entityName={t('companyEntityName')} />;
  if (!company) return <div>{t('companyNotFound')}</div>;

  return (
    <>
      <div className="mb-6 flex items-center">
        <h1 className="px-1 text-2xl font-bold">{t('companyDetails')}</h1>
        <Link
          className="btn btn-circle btn-sm text-primary ml-1"
          href={`${id}/edit`}
          title={t('editCompany')}
        >
          <PencilIcon className="size-5" />
        </Link>
        <Link
          className="btn btn-circle btn-sm text-error ml-1"
          href={`${id}/delete`}
          title={t('deleteCompany')}
        >
          <TrashIcon className="size-5" />
        </Link>
      </div>

      <CompanyInfoCard
        company={company}
        roles={roles}
        contacts={contacts}
        showControls={false}
        showChevron={false}
      />

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
