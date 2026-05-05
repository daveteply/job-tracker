'use client';

import { use } from 'react';

import { useTranslations } from 'next-intl';

import { EntitySelection } from '@job-tracker/app-logic';
import { useCompanySearch, useRoleActions, useRoleWithCompany } from '@job-tracker/hooks';
import { PageLoading, RoleForm } from '@job-tracker/ui-components';
import { RoleDTO } from '@job-tracker/validation';

type RoleEditFormData = RoleDTO & {
  company?: EntitySelection | null;
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
          shouldRemove: false,
        }
      : null,
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="px-1 text-2xl font-bold">{t('editRoleTitle', { title: role.title })}</h1>
      </div>
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
