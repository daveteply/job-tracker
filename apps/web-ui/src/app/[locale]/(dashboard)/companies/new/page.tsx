'use client';

import { useTranslations } from 'next-intl';

import { useCompanyActions } from '@job-tracker/hooks';
import { CompanyForm } from '@job-tracker/ui-components';

export default function CreateCompanyPage() {
  const t = useTranslations('Companies');
  const { upsertCompany } = useCompanyActions();

  return (
    <>
      <h1 className="mb-5 text-xl">{t('newCompanyTitle')}</h1>

      <CompanyForm onSubmitAction={upsertCompany} postActionRoute={'/companies'} />
    </>
  );
}
