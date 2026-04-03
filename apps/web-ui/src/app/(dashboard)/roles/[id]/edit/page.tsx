'use client';

import { use } from 'react';
import { useCompanySearch, useRoleActions, useRoleWithCompany } from '@job-tracker/hooks';
import { RoleForm, PageLoading } from '@job-tracker/ui-components';
import { RoleDTO } from '@job-tracker/validation';

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
  const { id } = use(params);
  const { role, loading } = useRoleWithCompany(id);
  const { upsertRole } = useRoleActions();
  const { searchCompanies } = useCompanySearch();

  if (loading) return <PageLoading entityName="role" />;
  if (!role) return <div>Role not found</div>;

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
      <h1 className="text-xl mb-5">Roles - Edit {role.title}</h1>
      {
        <RoleForm
          onSubmitAction={handleUpdate}
          initialData={initialData}
          isEdit={true}
          postActionRoute={'/roles'}
          onSearchCompany={searchCompanies}
        />
      }
    </>
  );
}
