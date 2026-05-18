'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

import { useRolesWithCompany } from '@job-tracker/hooks';
import {
  EmptyState,
  PageHeader,
  Pipeline,
  PipelineSkeleton,
} from '@job-tracker/ui-components';

import { Link } from '../../../../i18n/routing';

export default function PipelinePage() {
  const t = useTranslations('Pipeline');
  const { roles, loading: loadingRoles } = useRolesWithCompany();

  if (loadingRoles) return <PipelineSkeleton />;

  const isEmpty = !loadingRoles && roles.length === 0;

  return (
    <div className="flex h-full flex-col">
      <PageHeader title={t('listTitle')}>
        <Link href="/roles/new" className="btn btn-primary btn-sm">
          <PlusIcon className="h-4 w-4" />
          <span className="hidden sm:inline">New Lead</span>
        </Link>
      </PageHeader>

      {isEmpty ? (
        <EmptyState
          title={t('emptyTitle')}
          description={t('emptyDescription')}
          action={
            <Link href="/roles/new" className="btn btn-primary">
              <PlusIcon className="h-5 w-5" />
              Add First Lead
            </Link>
          }
        />
      ) : (
        <Pipeline roles={roles} loading={loadingRoles} />
      )}
    </div>
  );
}
