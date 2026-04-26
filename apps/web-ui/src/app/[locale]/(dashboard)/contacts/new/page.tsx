'use client';

import { useTranslations } from 'next-intl';

import { useCompanySearch, useContactActions } from '@job-tracker/hooks';
import { ContactForm } from '@job-tracker/ui-components';

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
        createCompanyLabel={(name) => t('formCreateCompany', { name })}
      />
    </>
  );
}
