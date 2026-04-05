'use client';

import { useRolesWithCompany } from '@job-tracker/hooks';
import { Pipeline } from '@job-tracker/ui-components';

// Purpose: Track job progress

export default function PipelinePage() {
  const { roles, loading: loadingRoles } = useRolesWithCompany();

  return (
    <div className="h-full flex flex-col gap-6">
      <h1 className="text-2xl font-bold px-1">Pipeline</h1>

      <Pipeline roles={roles} loading={loadingRoles} />
    </div>
  );
}
