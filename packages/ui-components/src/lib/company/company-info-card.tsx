'use client';

import Link from 'next/link';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import ExternalLink from '../common/external-link';
import { CompanyDTO } from '@job-tracker/validation';
import BaseInfoCard from '../common/base-info-card';

export interface CompanyCardProps {
  company: CompanyDTO;
  showFull?: boolean;
  showControls?: boolean;
  showChevron?: boolean;
}

export function CompanyInfoCard({
  company,
  showFull = true,
  showControls = true,
  showChevron = true,
}: CompanyCardProps) {
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

  return (
    <BaseInfoCard
      title={company.name}
      header={!showFull && <ExternalLink url={company.website || ''} />}
      controls={controls}
      detailsUrl={`/companies/${company.id}`}
      showChevron={showChevron}
      showFull={showFull}
    >
      <ul>
        {company.website && (
          <li>
            <ExternalLink url={company.website} />
          </li>
        )}
        <li>{company.industry}</li>
        <li>{company.sizeRange}</li>
        <li>{company.notes}</li>
      </ul>
    </BaseInfoCard>
  );
}

export default CompanyInfoCard;
