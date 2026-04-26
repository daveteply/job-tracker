'use client';

import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

import { CompanyDTO, RoleDTO } from '@job-tracker/validation';

import BaseInfoCard from '../common/base-info-card';
import ExternalLink from '../common/external-link';

export interface RoleCardProps {
  role: RoleDTO & { company?: CompanyDTO | null };
  renderFull?: boolean;
  showControls?: boolean;
  showChevron?: boolean;
}

export function RoleInfoCard({
  role,
  renderFull = true,
  showControls = true,
  showChevron = true,
}: RoleCardProps) {
  const controls = showControls && renderFull && (
    <div className="flex gap-1">
      <Link href={`/roles/${role.id}/edit`}>
        <PencilIcon className="size-5" />
      </Link>
      <Link href={`/roles/${role.id}/delete`} className="text-error">
        <TrashIcon className="size-5" />
      </Link>
    </div>
  );

  return (
    <BaseInfoCard
      title={role.title}
      header={!renderFull && <ExternalLink url={role.jobPostingUrl} />}
      controls={controls}
      detailsUrl={`/roles/${role.id}`}
      showChevron={showChevron}
      showFull={renderFull}
    >
      <ul>
        <li>{role.company?.name}</li>
        <li>{role.level}</li>
        <li>
          <ExternalLink url={role.jobPostingUrl} />
        </li>
        <li>{role.location}</li>
        <li>{role.salaryRange}</li>
        <li>{role.status}</li>
      </ul>
    </BaseInfoCard>
  );
}

export default RoleInfoCard;
