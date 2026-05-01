'use client';

import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

import { CompanyDTO, RoleDTO } from '@job-tracker/validation';

import BaseInfoCard from '../common/base-info-card';
import ExternalLink from '../common/external-link';

export interface CompanyCardProps {
  company: CompanyDTO;
  roles?: RoleDTO[];
  showFull?: boolean;
  showControls?: boolean;
  showChevron?: boolean;
  showRoles?: boolean;
}

export function CompanyInfoCard({
  company,
  roles,
  showFull = true,
  showControls = true,
  showChevron = true,
  showRoles = true,
}: CompanyCardProps) {
  const roleCount = roles?.length ?? 0;

  const controls = showControls && showFull && (
    <div className="flex gap-1">
      <Link href={`/companies/${company.id}/edit`}>
        <PencilIcon className="size-5" />
      </Link>
      <Link href={`/companies/${company.id}/delete`} className="text-error">
        <TrashIcon className="size-5" />
      </Link>
    </div>
  );

  const header = (
    <div className="flex items-center gap-2">
      {!showFull && <ExternalLink url={company.website || ''} />}
      {roleCount > 0 && (!showFull || !showRoles) && (
        <span className="badge badge-ghost badge-sm">{roleCount} roles</span>
      )}
    </div>
  );

  return (
    <BaseInfoCard
      title={company.name}
      header={header}
      controls={controls}
      detailsUrl={`/companies/${company.id}`}
      showChevron={showChevron}
      showFull={showFull}
    >
      <div className="flex flex-col gap-3">
        <ul>
          {company.website && (
            <li>
              <ExternalLink url={company.website} />
            </li>
          )}
          {company.industry && <li>{company.industry}</li>}
          {company.sizeRange && <li>{company.sizeRange}</li>}
          {company.notes && <li className="whitespace-pre-wrap">{company.notes}</li>}
        </ul>

        {showRoles && roles && roles.length > 0 && (
          <div>
            <h3 className="mb-1 font-semibold">Roles</h3>
            <ul className="list-inside list-disc">
              {roles.map((role) => (
                <li key={role.id}>
                  <Link href={`/roles/${role.id}`} className="link link-primary">
                    {role.title}
                  </Link>
                  <span className="ml-2 text-xs opacity-70">({role.status})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </BaseInfoCard>
  );
}

export default CompanyInfoCard;
