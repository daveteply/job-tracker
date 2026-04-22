'use client';

import { useCompanyActions } from '@job-tracker/hooks';
import { CompanyForm } from '@job-tracker/ui-components';

export default function CreateCompanyPage() {
  const { upsertCompany } = useCompanyActions();

  return (
    <>
      <h1 className="mb-5 text-xl">Companies - new Company</h1>

      <CompanyForm onSubmitAction={upsertCompany} postActionRoute={'/companies'} />
    </>
  );
}
