'use client';

import { useCompanyActions } from '@job-tracker/hooks';
import { CompanyForm } from '@job-tracker/ui-components';
import { useTranslations } from 'next-intl';

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
