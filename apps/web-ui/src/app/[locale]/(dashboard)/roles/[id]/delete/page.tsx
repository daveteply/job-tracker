'use client';

import { use } from 'react';
import { useCanDeleteRole, useRoleActions, useRoleWithCompany } from '@job-tracker/hooks';
import { RoleInfoCard, EntityDelete, PageLoading } from '@job-tracker/ui-components';
import { Link } from '../../../../../../i18n/routing';
import { useTranslations } from 'next-intl';

export default function DeleteRolePage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('Roles');
  const tCommon = useTranslations('Common');
  const { id } = use(params);
  const { role, loading } = useRoleWithCompany(id);

  const { removeRole } = useRoleActions();
  const { canDelete, blockers, loading: deleteCheckLoading } = useCanDeleteRole(id);

  if (loading || deleteCheckLoading) return <PageLoading entityName={t('roleEntityName')} />;
  if (!role) return null;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="pr-1 text-xl">{t('deleteRoleTitle')}</h1>

      <>
        <RoleInfoCard role={role} showControls={false} />
        {canDelete ? (
          <EntityDelete
            id={id}
            onDeleteAction={removeRole}
            entityName={t('roleEntityName')}
            postActionRoute="/roles"
            translations={{
              reminder: tCommon('deleteReminder'),
              confirm: tCommon('deleteAction', { name: t('roleEntityName') }),
              cancel: tCommon('cancel'),
              success: tCommon('deleteSuccess', { name: t('roleEntityName') }),
              error: tCommon('deleteError', { name: t('roleEntityName') }),
            }}
          />
        ) : (
          <>
            <p>
              {t('deleteBlocker', {
                events: blockers.events,
              })}
            </p>
            <div className="flex">
              <Link className="btn btn-info mr-3" href="/roles">
                {t('backToRoles')}
              </Link>
              <Link className="btn btn-info" href="/activity">
                {t('backToEvents')}
              </Link>
            </div>
          </>
        )}
      </>
    </div>
  );
}
