'use client';

import { useCompanySearch, useContactActions } from '@job-tracker/hooks';
import { ContactForm } from '@job-tracker/ui-components';

export default function CreateContactPage() {
  const { upsertContact } = useContactActions();
  const { searchCompanies } = useCompanySearch();

  return (
    <>
      <h1 className="mb-5 text-xl">Companies - new Contact</h1>

      <ContactForm
        onSubmitAction={upsertContact}
        onSearchCompany={searchCompanies}
        postActionRoute={'/contacts'}
      />
    </>
  );
}
