'use client';

import { useTranslations } from 'next-intl';

import { useCompanySearch, useContactActions } from '@job-tracker/hooks';
import { ContactForm } from '@job-tracker/ui-components';

export default function CreateContactPage() {
  const t = useTranslations('Contacts');
  const { upsertContact } = useContactActions();
  const { searchCompanies } = useCompanySearch();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="px-1 text-2xl font-bold">{t('newContactTitle')}</h1>
      </div>

      <ContactForm
        onSubmitAction={upsertContact}
        onSearchCompany={searchCompanies}
        postActionRoute={'/contacts'}
        companyPlaceholder={t('formPlaceholder')}
        createCompanyLabel={(name) => t('formCreateCompany', { name })}
      />
    </div>
  );
}
