'use client';

import ExternalLink, { ExternalLinkType } from '../common/external-link';
import Link from 'next/link';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { CompanyDTO, ContactDTO } from '@job-tracker/validation';

export interface ContactCardProps {
  contact: ContactDTO & { company?: CompanyDTO | null };
  renderFull?: boolean;
  showControls?: boolean;
}

export function ContactInfoCard({
  contact,
  renderFull = true,
  showControls = true,
}: ContactCardProps) {
  return (
    <div className="card bg-base-300 card-sm shadow-sm">
      <div className="card-body">
        {renderFull ? (
          <>
            <div className="flex justify-between">
              <div className="flex justify-center items-center">
                <h2 className="card-title mr-2">
                  {contact.firstName} {contact.lastName}
                </h2>
                {contact.isPrimaryRecruiter && <span className="text-sm">(Primary Recruiter)</span>}
              </div>
              {showControls && (
                <div className="flex gap-1">
                  <Link href={`/contacts/${contact.id}/edit`}>
                    <PencilIcon className="size-5" />
                  </Link>
                  <Link href={`/contacts/${contact.id}/delete`} className="text-error">
                    <TrashIcon className="size-5" />
                  </Link>
                </div>
              )}
            </div>
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
              <li>{contact.isPrimaryRecruiter}</li>
              <li>{contact.notes}</li>
            </ul>
          </>
        ) : (
          <div className="flex">
            <h2 className="card-title  pr-1">
              {contact.firstName} {contact.lastName}
            </h2>
            <ExternalLink url={contact.email} linkType={ExternalLinkType.Email} />
            <ExternalLink url={contact.phoneNumber} linkType={ExternalLinkType.Phone} />
            <ExternalLink url={contact.linkedInUrl} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactInfoCard;
