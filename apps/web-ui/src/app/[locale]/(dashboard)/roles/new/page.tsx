'use client';

import { useCompanySearch, useRoleActions } from '@job-tracker/hooks';
import { RoleForm } from '@job-tracker/ui-components';

export default function CreateRolePage() {
  const { upsertRole } = useRoleActions();
  const { searchCompanies } = useCompanySearch();

  return (
    <>
      <h1 className="mb-5 text-xl">Roles - new Role</h1>

      <RoleForm
        onSubmitAction={upsertRole}
        postActionRoute={'/roles'}
        onSearchCompany={searchCompanies}
      />
    </>
  );
}
