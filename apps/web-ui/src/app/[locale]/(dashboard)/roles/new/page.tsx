'use client';

import { useTranslations } from 'next-intl';

import { useCompanySearch, useRoleActions } from '@job-tracker/hooks';
import { RoleForm } from '@job-tracker/ui-components';

export default function CreateRolePage() {
  const t = useTranslations('Roles');
  const { upsertRole } = useRoleActions();
  const { searchCompanies } = useCompanySearch();

  return (
    <>
      <div className="mb-6">
        <h1 className="px-1 text-2xl font-bold">{t('newRoleTitle')}</h1>
      </div>

      <RoleForm
        onSubmitAction={upsertRole}
        postActionRoute={'/roles'}
        onSearchCompany={searchCompanies}
        companyPlaceholder={t('formPlaceholder')}
        createCompanyLabel={(name) => t('formCreateCompany', { name })}
      />
    </>
  );
}
