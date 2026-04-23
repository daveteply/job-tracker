'use client';

import { PlusCircleIcon } from '@heroicons/react/16/solid';
import { useRolesWithCompany } from '@job-tracker/hooks';
import { RoleList, PageLoading } from '@job-tracker/ui-components';
import { Link } from '../../../../i18n/routing';
import { useTranslations } from 'next-intl';

export default function RoleListPage() {
  const t = useTranslations('Roles');
  const { roles, loading } = useRolesWithCompany();

  // This is the job pipeline view.

  if (loading) return <PageLoading entityName={t('rolesEntityName')} />;

  return (
    <>
      <div className="mb-3 flex justify-between">
        <h1 className="pr-1 text-xl">{t('listTitle')}</h1>
        <Link className="btn btn-sm text-primary" href="roles/new" title={t('addRole')}>
          <PlusCircleIcon className="size-5" />
          {t('addRole')}
        </Link>
      </div>

      <RoleList roles={roles} />
    </>
  );
}
