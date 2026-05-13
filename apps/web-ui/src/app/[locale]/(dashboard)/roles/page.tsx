'use client';

import { PlusCircleIcon } from '@heroicons/react/16/solid';
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

import { useGroupedRoles, useRolesWithEvents } from '@job-tracker/hooks';
import { EmptyState, ListSkeleton, PageHeader, RoleList } from '@job-tracker/ui-components';

import { Link } from '../../../../i18n/routing';

export default function RoleListPage() {
  const t = useTranslations('Roles');
  const { roles, loading } = useRolesWithEvents();
  const { active, inactive } = useGroupedRoles(roles);

  // This is the job pipeline view.

  if (loading) return <ListSkeleton />;

  return (
    <>
      <PageHeader title={t('listTitle')}>
        <Link className="btn btn-sm text-primary" href="roles/new" title={t('addRole')}>
          <PlusCircleIcon className="size-5" />
          {t('addRole')}
        </Link>
      </PageHeader>

      {active.length === 0 && inactive.length === 0 ? (
        <EmptyState
          icon={<BriefcaseIcon className="h-16 w-16" />}
          title={t('noRolesFound')}
          description={t('emptyStateDescription')}
          action={
            <Link href="roles/new" className="btn btn-primary gap-2">
              <PlusCircleIcon className="h-5 w-5" />
              {t('addRole')}
            </Link>
          }
        />
      ) : (
        <RoleList activeRoles={active} inactiveRoles={inactive} />
      )}
    </>
  );
}
