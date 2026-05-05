'use client';

import { useTranslations } from 'next-intl';

import { useRolesWithCompany } from '@job-tracker/hooks';
import { Pipeline } from '@job-tracker/ui-components';

export default function PipelinePage() {
  const t = useTranslations('Pipeline');
  const { roles, loading: loadingRoles } = useRolesWithCompany();

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6">
        <h1 className="px-1 text-2xl font-bold">{t('listTitle')}</h1>
      </div>

      <Pipeline roles={roles} loading={loadingRoles} />
    </div>
  );
}
