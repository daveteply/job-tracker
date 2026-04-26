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
      <h1 className="mb-5 text-xl">{t('newRoleTitle')}</h1>

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
