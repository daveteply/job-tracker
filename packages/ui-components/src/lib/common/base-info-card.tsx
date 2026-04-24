'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

export interface BaseInfoCardProps {
  title: ReactNode;
  header?: ReactNode;
  controls?: ReactNode;
  children?: ReactNode;
  detailsUrl?: string;
  className?: string;
  showFull?: boolean;
}

export function BaseInfoCard({
  title,
  header,
  controls,
  children,
  detailsUrl,
  className = '',
  showFull = true,
}: BaseInfoCardProps) {
  const cardClasses = className.includes('card') ? className : `card bg-base-300 card-sm shadow-sm ${className}`;

  return (
    <div className={cardClasses}>
      <div className="card-body">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-1 items-center gap-2 min-w-0">
            {typeof title === 'string' ? (
              <h2 className="card-title truncate">{title}</h2>
            ) : (
              title
            )}
            {header}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {controls}
            {detailsUrl && (
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
        {showFull && children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}

export default BaseInfoCard;
