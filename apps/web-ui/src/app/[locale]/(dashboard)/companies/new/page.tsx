'use client';

import { useTranslations } from 'next-intl';

import { useCompanyActions } from '@job-tracker/hooks';
import { CompanyForm } from '@job-tracker/ui-components';

export default function CreateCompanyPage() {
  const t = useTranslations('Companies');
  const { upsertCompany } = useCompanyActions();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="px-1 text-2xl font-bold">{t('newCompanyTitle')}</h1>
      </div>

      <CompanyForm onSubmitAction={upsertCompany} postActionRoute={'/companies'} />
    </div>
  );
}
