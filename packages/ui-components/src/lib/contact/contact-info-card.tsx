'use client';

import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

import { CompanyDTO, ContactDTO } from '@job-tracker/validation';

import BaseInfoCard from '../common/base-info-card';
import ExternalLink, { ExternalLinkType } from '../common/external-link';

export interface ContactCardProps {
  contact: ContactDTO & { company?: CompanyDTO | null };
  renderFull?: boolean;
  showControls?: boolean;
  showChevron?: boolean;
}

export function ContactInfoCard({
  contact,
  renderFull = true,
  showControls = true,
  showChevron = true,
}: ContactCardProps) {
  const controls = showControls && renderFull && (
    <div className="flex gap-1">
      <Link href={`/contacts/${contact.id}/edit`}>
        < PencilIcon className="size-5" />
      </Link>
      <Link href={`/contacts/${contact.id}/delete`} className="text-error">
        <TrashIcon className="size-5" />
      </Link>
    </div>
  );

  const header = (
    <div className="flex items-center gap-2">
      {contact.isPrimaryRecruiter && <span className="text-sm">(Primary Recruiter)</span>}
      {!renderFull && (
        <>
          <ExternalLink url={contact.email} linkType={ExternalLinkType.Email} />
          <ExternalLink url={contact.phoneNumber} linkType={ExternalLinkType.Phone} />
          <ExternalLink url={contact.linkedInUrl} />
        </>
      )}
    </div>
  );

  return (
    <BaseInfoCard
      title={`${contact.firstName} ${contact.lastName}`}
      header={header}
      controls={controls}
      detailsUrl={`/contacts/${contact.id}`}
      showChevron={showChevron}
      showFull={renderFull}
    >
      <h2>{contact.title}</h2>
      <ul>
        {contact.company?.name && <li className="truncate">{contact.company.name}</li>}
        <li>
          <ExternalLink url={contact.email} linkType={ExternalLinkType.Email} />
        </li>
        <li>
          <ExternalLink url={contact.phoneNumber} linkType={ExternalLinkType.Phone} />
        </li>
        <li>
          <ExternalLink url={contact.linkedInUrl} />
        </li>
        <li>{contact.notes}</li>
      </ul>
    </BaseInfoCard>
  );
}

export default ContactInfoCard;
