'use client';

import {
  useCompany,
  useContactWithCompany,
  useEventWithChildren,
  useRoleWithCompany,
} from '@job-tracker/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function CompanyLabel({ id, fallback }: { id: string; fallback: React.ReactNode }) {
  const { company, loading } = useCompany(id);
  if (loading || !company) return fallback;
  return company.name;
}

function ContactLabel({ id, fallback }: { id: string; fallback: React.ReactNode }) {
  const { contact, loading } = useContactWithCompany(id);
  if (loading || !contact) return fallback;
  return (
    <>
      {contact.firstName} {contact.lastName}
    </>
  );
}

function RoleLabel({ id, fallback }: { id: string; fallback: React.ReactNode }) {
  const { role, loading } = useRoleWithCompany(id);
  if (loading || !role) return fallback;
  return role.title;
}

function EventLabel({ id, fallback }: { id: string; fallback: React.ReactNode }) {
  const { event, loading } = useEventWithChildren(id);
  if (loading || !event || !event.eventType) return fallback;
  return `${event.eventType.name} (${event.source}, ${event.occurredAt.toDateString()})`;
}

const ENTITY_LABEL_MAP: Record<
  string,
  React.ComponentType<{ id: string; fallback: React.ReactNode }>
> = {
  companies: CompanyLabel,
  contacts: ContactLabel,
  roles: RoleLabel,
  events: EventLabel,
};

function EntityLabel({
  id,
  type,
  fallback,
}: {
  id: string;
  type: string;
  fallback: React.ReactNode;
}) {
  const LabelComponent = ENTITY_LABEL_MAP[type];
  if (!LabelComponent) return fallback;
  return <LabelComponent id={id} fallback={fallback} />;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  const renderSegment = (segment: string, index: number) => {
    const decodedSeg = decodeURIComponent(segment);
    const isUUID = UUID_REGEX.test(decodedSeg);

    if (isUUID) {
      const prevSegment = index > 0 ? pathSegments[index - 1] : '';
      const fallback = (
        <span className="tooltip tooltip-bottom" data-tip={decodedSeg}>
          <span className="inline-block max-w-[8ch] truncate align-bottom">{decodedSeg}</span>
        </span>
      );

      return <EntityLabel id={decodedSeg} type={prevSegment} fallback={fallback} />;
    }

    return <span className="capitalize">{decodedSeg}</span>;
  };

  return (
    <div className="breadcrumbs text-sm">
      <ul>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <li key={index}>
              {isLast ? (
                <span className="text-base-content/60 cursor-default hover:no-underline">
                  {renderSegment(segment, index)}
                </span>
              ) : (
                <Link href={href}>{renderSegment(segment, index)}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Breadcrumbs;
