'use client';

import { use } from 'react';
import { useCompanySearch, useRoleActions, useRoleWithCompany } from '@job-tracker/hooks';
import { RoleForm, PageLoading } from '@job-tracker/ui-components';
import { RoleDTO } from '@job-tracker/validation';
import { useTranslations } from 'next-intl';

type RoleEditFormData = RoleDTO & {
  company?: {
    id?: string;
    name?: string;
    isNew?: boolean;
    shouldRemove?: boolean;
    displayValue?: string;
  } | null;
};

export default function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('Roles');
  const { id } = use(params);
  const { role, loading } = useRoleWithCompany(id);
  const { upsertRole } = useRoleActions();
  const { searchCompanies } = useCompanySearch();

  if (loading) return <PageLoading entityName={t('roleEntityName')} />;
  if (!role) return <div>{t('roleNotFound')}</div>;

  const handleUpdate = async (data: RoleEditFormData) => {
    return upsertRole({ ...data, id });
  };

  const initialData: RoleEditFormData = {
    ...role,
    company: role.company
      ? {
          id: role.company.id,
          name: role.company.name,
          isNew: false,
        }
      : null,
  };

  return (
    <>
      <h1 className="mb-5 text-xl">{t('editRoleTitle', { title: role.title })}</h1>
      {
        <RoleForm
          onSubmitAction={handleUpdate}
          initialData={initialData}
          isEdit={true}
          postActionRoute={'/roles'}
          onSearchCompany={searchCompanies}
          companyPlaceholder={t('formPlaceholder')}
          createCompanyLabel={(name) => t('formCreateCompany', { name })}
        />
      }
    </>
  );
}
