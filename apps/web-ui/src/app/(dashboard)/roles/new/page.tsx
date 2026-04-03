'use client';

import { useCompanySearch, useRoleActions } from '@job-tracker/hooks';
import { RoleForm } from '@job-tracker/ui-components';

export default function CreateRolePage() {
  const { upsertRole } = useRoleActions();
  const { searchCompanies } = useCompanySearch();

  return (
    <>
      <h1 className="text-xl mb-5">Roles - new Role</h1>
      <p className="mb-5 italic"></p>

      <RoleForm
        onSubmitAction={upsertRole}
        postActionRoute={'/roles'}
        onSearchCompany={searchCompanies}
      />
    </>
  );
}
