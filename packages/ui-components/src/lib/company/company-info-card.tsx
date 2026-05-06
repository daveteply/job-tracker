'use client';

import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

import { INACTIVE_STATUSES } from '@job-tracker/domain';
import { useUserSettings } from '@job-tracker/hooks';
import { CompanyDTO, ContactDTO, RoleDTO } from '@job-tracker/validation';

import BaseInfoCard from '../common/base-info-card';
import ExternalLink from '../common/external-link';

export interface CompanyCardProps {
  company: CompanyDTO;
  roles?: RoleDTO[];
  contacts?: ContactDTO[];
  showFull?: boolean;
  showControls?: boolean;
  showChevron?: boolean;
  showRoles?: boolean;
  showContacts?: boolean;
}

export function CompanyInfoCard({
  company,
  roles,
  contacts,
  showFull = true,
  showControls = true,
  showChevron = true,
  showRoles = true,
  showContacts = true,
}: CompanyCardProps) {
  const { settings } = useUserSettings();
  const showInactive = settings?.showInactiveRoles ?? false;

  const allRoles = roles ?? [];
  const activeRoles = allRoles.filter((role) => !INACTIVE_STATUSES.includes(role.status));
  const inactiveRoles = allRoles.filter((role) => INACTIVE_STATUSES.includes(role.status));

  const activeCount = activeRoles.length;
  const inactiveCount = inactiveRoles.length;
  const contactCount = contacts?.length ?? 0;

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
      {activeCount > 0 && (!showFull || !showRoles) && (
        <span className="badge badge-ghost badge-sm">{activeCount} roles</span>
      )}
      {showInactive && inactiveCount > 0 && (!showFull || !showRoles) && (
        <span className="badge badge-ghost badge-sm opacity-60">{inactiveCount} inactive</span>
      )}
      {contactCount > 0 && (!showFull || !showContacts) && (
        <span className="badge badge-ghost badge-sm">{contactCount} contacts</span>
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

        {showRoles && allRoles.length > 0 && (
          <div>
            <h3 className="mb-1 text-sm font-semibold">Roles</h3>
            <ul className="list-inside list-disc text-sm">
              {(showInactive ? allRoles : activeRoles).map((role) => {
                const isInactive = INACTIVE_STATUSES.includes(role.status);
                return (
                  <li key={role.id} className={isInactive ? 'opacity-50' : ''}>
                    <Link href={`/roles/${role.id}`} className="link link-primary">
                      {role.title}
                    </Link>
                    <span className="ml-2 text-xs opacity-70">({role.status})</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {showContacts && contacts && contacts.length > 0 && (
          <div>
            <h3 className="mb-1 text-sm font-semibold">Contacts</h3>
            <ul className="list-inside list-disc text-sm">
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <Link href={`/contacts/${contact.id}`} className="link link-primary">
                    {contact.firstName} {contact.lastName}
                  </Link>
                  {contact.title && (
                    <span className="ml-2 text-xs opacity-70">({contact.title})</span>
                  )}
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
