'use client';

import { use } from 'react';

import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';
import { useTranslations } from 'next-intl';

import { useRoleWithCompany } from '@job-tracker/hooks';
import { PageLoading, RoleInfoCard } from '@job-tracker/ui-components';

import { Link } from '../../../../../i18n/routing';

export default function RoleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('Roles');
  const { id } = use(params);
  const { role, loading } = useRoleWithCompany(id);

  if (loading) return <PageLoading entityName={t('roleEntityName')} />;
  if (!role) return <div>{t('roleNotFound')}</div>;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center">
        <h1 className="px-1 text-2xl font-bold">{t('roleDetails')}</h1>
        <Link
          className="btn btn-circle btn-sm text-primary ml-1"
          href={`${id}/edit`}
          title={t('editRole')}
        >
          <PencilIcon className="size-5" />
        </Link>
        <Link
          className="btn btn-circle btn-sm text-error ml-1"
          href={`${id}/delete`}
          title={t('deleteRole')}
        >
          <TrashIcon className="size-5" />
        </Link>
      </div>

      <RoleInfoCard role={role} events={role.events} showControls={false} showChevron={false} />

      <div className="mt-5">
        <Link className="btn" href="/roles">
          {t('backToRoles')}
        </Link>
      </div>
    </div>
  );
}
