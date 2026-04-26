'use client';

import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

interface EventActionMenuProps {
  id: string;
}

export function EventActionMenu({ id }: EventActionMenuProps) {
  const tNav = useTranslations('Navigation');
  const tReminders = useTranslations('Reminders');
  const containerRef = useRef<HTMLDetailsElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <details
      ref={containerRef}
      className="dropdown dropdown-end"
      open={isOpen}
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary
        className="btn btn-ghost btn-circle list-none"
        onClick={(e) => {
          if (isOpen) {
            e.preventDefault();
            setIsOpen(false);
          }
        }}
      >
        <span className="active:bg-base-200 flex h-10 w-10 items-center justify-center rounded-full transition">
          <EllipsisVerticalIcon className="size-5" />
        </span>
      </summary>

      <ul className="menu dropdown-content bg-base-100 rounded-box border-base-200 z-1 w-48 border p-2 shadow-lg">
        <li>
          <Link
            href={`/reminders/new?eventId=${id}`}
            className="hover:bg-base-200 flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <BellIcon className="size-5" />
            {tReminders('addReminder')}
          </Link>
        </li>
        <li>
          <Link
            href={`/events/${id}/edit`}
            className="hover:bg-base-200 flex items-center gap-2"
            onClick={() => setIsOpen(false)} // Close menu after clicking action
          >
            <PencilIcon className="size-5" />
            {tNav('edit')}
          </Link>
        </li>
        <li>
          <Link
            href={`/events/${id}/delete`}
            className="text-error hover:bg-error/10 flex items-center gap-2"
            onClick={() => setIsOpen(false)} // Close menu after clicking link
          >
            <TrashIcon className="size-5" />
            {tNav('delete')}
          </Link>
        </li>
      </ul>
    </details>
  );
}

export default EventActionMenu;
