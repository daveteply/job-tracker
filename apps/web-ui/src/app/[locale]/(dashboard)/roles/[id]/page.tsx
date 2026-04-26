'use client';

import { use } from 'react';

import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';
import { useTranslations } from 'next-intl';

import { useRoleWithCompany } from '@job-tracker/hooks';
import { PageLoading,RoleInfoCard } from '@job-tracker/ui-components';

import { Link } from '../../../../../i18n/routing';

export default function RoleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('Roles');
  const { id } = use(params);
  const { role, loading } = useRoleWithCompany(id);

  if (loading) return <PageLoading entityName={t('roleEntityName')} />;
  if (!role) return <div>{t('roleNotFound')}</div>;

  return (
    <>
      <div className="mb-3 flex">
        <h1 className="pr-2 text-xl">{t('roleDetails')}</h1>
        <Link
          className="btn btn-circle btn-sm text-primary"
          href={`${id}/edit`}
          title={t('editRole')}
        >
          <PencilIcon className="size-5" />
        </Link>
        <Link
          className="btn btn-circle btn-sm text-error"
          href={`${id}/delete`}
          title={t('deleteRole')}
        >
          <TrashIcon className="size-5" />
        </Link>
      </div>

      <RoleInfoCard role={role} showControls={false} showChevron={false} />

      <div className="mt-5">
        <Link className="btn" href="/roles">
          {t('backToRoles')}
        </Link>
      </div>
    </>
  );
}
