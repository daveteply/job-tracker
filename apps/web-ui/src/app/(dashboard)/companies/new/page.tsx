'use client';

import { useCompanyActions } from '@job-tracker/hooks';
import { CompanyForm } from '@job-tracker/ui-components';

export default function CreateCompanyPage() {
  const { upsertCompany } = useCompanyActions();

  return (
    <>
      <h1 className="text-xl mb-5">Companies - new Company</h1>
      <p className="mb-5 italic"></p>

      <CompanyForm onSubmitAction={upsertCompany} postActionRoute={'/companies'} />
    </>
  );
}
