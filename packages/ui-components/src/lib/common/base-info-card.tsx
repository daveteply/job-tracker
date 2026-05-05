'use client';

import { ReactNode } from 'react';

import { ChevronRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export interface BaseInfoCardProps {
  title: ReactNode;
  header?: ReactNode;
  controls?: ReactNode;
  children?: ReactNode;
  detailsUrl?: string;
  showChevron?: boolean;
  className?: string;
  showFull?: boolean;
}

export function BaseInfoCard({
  title,
  header,
  controls,
  children,
  detailsUrl,
  showChevron = true,
  className = '',
  showFull = true,
}: BaseInfoCardProps) {
  const cardClasses = className.includes('card')
    ? className
    : `card bg-base-300 card-sm shadow-sm ${className}`;

  return (
    <div className={cardClasses}>
      <div className="card-body">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {typeof title === 'string' ? <h2 className="card-title truncate">{title}</h2> : title}
            {header}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {controls}
            {detailsUrl && showChevron && (
              <Link
                href={detailsUrl}
                className="btn btn-ghost btn-xs btn-circle"
                aria-label="View Details"
              >
                <ChevronRightIcon className="size-5" />
              </Link>
            )}
          </div>
        </div>
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            showFull ? 'grid-rows-[1fr] mt-2 opacity-100' : 'grid-rows-[0fr] mt-0 opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BaseInfoCard;
