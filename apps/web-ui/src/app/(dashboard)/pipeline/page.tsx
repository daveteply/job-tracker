'use client';

import { useRolesWithCompany } from '@job-tracker/hooks';
import { Pipeline } from '@job-tracker/ui-components';

export default function PipelinePage() {
  const { roles, loading: loadingRoles } = useRolesWithCompany();

  return (
    <div className="flex h-full flex-col gap-6">
      <h1 className="px-1 text-2xl font-bold">Pipeline</h1>

      <Pipeline roles={roles} loading={loadingRoles} />
    </div>
  );
}
