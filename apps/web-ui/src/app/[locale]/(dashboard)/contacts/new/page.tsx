'use client';

import { useCompanySearch, useContactActions } from '@job-tracker/hooks';
import { ContactForm } from '@job-tracker/ui-components';
import { useTranslations } from 'next-intl';

export default function CreateContactPage() {
  const t = useTranslations('Contacts');
  const { upsertContact } = useContactActions();
  const { searchCompanies } = useCompanySearch();

  return (
    <>
      <h1 className="mb-5 text-xl">{t('newContactTitle')}</h1>

      <ContactForm
        onSubmitAction={upsertContact}
        onSearchCompany={searchCompanies}
        postActionRoute={'/contacts'}
        companyPlaceholder={t('formPlaceholder')}
      />
    </>
  );
}
