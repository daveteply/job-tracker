'use client';

import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

import { CompanyDTO, EventDTO, RoleDTO } from '@job-tracker/validation';

import BaseInfoCard from '../common/base-info-card';
import ExternalLink from '../common/external-link';

export interface RoleCardProps {
  role: RoleDTO & { company?: CompanyDTO | null };
  events?: EventDTO[];
  showFull?: boolean;
  showControls?: boolean;
  showChevron?: boolean;
  showEvents?: boolean;
}

export function RoleInfoCard({
  role,
  events,
  showFull = true,
  showControls = true,
  showChevron = true,
  showEvents = true,
}: RoleCardProps) {
  const eventCount = events?.length ?? 0;

  const controls = showControls && showFull && (
    <div className="flex gap-1">
      <Link href={`/roles/${role.id}/edit`}>
        <PencilIcon className="size-5" />
      </Link>
      <Link href={`/roles/${role.id}/delete`} className="text-error">
        <TrashIcon className="size-5" />
      </Link>
    </div>
  );

  const header = (
    <div className="flex items-center gap-2">
      {!showFull && <ExternalLink url={role.jobPostingUrl} />}
      {eventCount > 0 && (!showFull || !showEvents) && (
        <span className="badge badge-ghost badge-sm">{eventCount} events</span>
      )}
    </div>
  );

  return (
    <BaseInfoCard
      title={role.title}
      header={header}
      controls={controls}
      detailsUrl={`/roles/${role.id}`}
      showChevron={showChevron}
      showFull={showFull}
    >
      <div className="flex flex-col gap-3">
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

        {showEvents && events && events.length > 0 && (
          <div>
            <h3 className="mb-1 font-semibold text-sm">Recent Events</h3>
            <ul className="list-inside list-disc text-sm">
              {events.slice(0, 5).map((event) => (
                <li key={event.id}>
                  <Link href={`/events/${event.id}`} className="link link-primary">
                    {event.occurredAt.toLocaleDateString()}
                  </Link>
                  {event.summary && <span className="ml-2 opacity-70">- {event.summary}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </BaseInfoCard>
  );
}

export default RoleInfoCard;
