'use client';

import ExternalLink from '../common/external-link';
import Link from 'next/link';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { CompanyDTO, RoleDTO } from '@job-tracker/validation';

export interface RoleCardProps {
  role: RoleDTO & { company?: CompanyDTO | null };
  renderFull?: boolean;
  showControls?: boolean;
}

export function RoleInfoCard({ role, renderFull = true, showControls = true }: RoleCardProps) {
  return (
    <div className="card bg-base-300 card-sm shadow-sm">
      <div className="card-body">
        {renderFull ? (
          <>
            <div className="flex justify-between">
              <h2 className="card-title">{role.title}</h2>
              {showControls && (
                <div className="flex gap-1">
                  <Link href={`/roles/${role.id}/edit`}>
                    <PencilIcon className="size-5" />
                  </Link>
                  <Link href={`/roles/${role.id}/delete`} className="text-error">
                    <TrashIcon className="size-5" />
                  </Link>
                </div>
              )}
            </div>
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
          </>
        ) : (
          <div className="flex">
            <h2 className="card-title pr-1">{role.title}</h2>
            <ExternalLink url={role.jobPostingUrl} />
          </div>
        )}
      </div>
    </div>
  );
}

export default RoleInfoCard;
