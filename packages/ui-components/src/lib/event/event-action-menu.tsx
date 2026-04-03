'use client';

import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface EventActionMenuProps {
  id: string;
}

export function EventActionMenu({ id }: EventActionMenuProps) {
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
        <span className="w-10 h-10 flex items-center justify-center active:bg-base-200 rounded-full transition">
          <EllipsisVerticalIcon className="size-5" />
        </span>
      </summary>

      <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-40 p-2 shadow-lg border border-base-200">
        <li>
          <Link
            href={`/events/${id}/edit`}
            className="flex items-center gap-2 hover:bg-base-200"
            onClick={() => setIsOpen(false)} // Close menu after clicking action
          >
            <PencilIcon className="size-5" />
            Edit
          </Link>
        </li>
        <li>
          <Link
            href={`/events/${id}/delete`}
            className="flex items-center gap-2 text-error hover:bg-error/10"
            onClick={() => setIsOpen(false)} // Close menu after clicking link
          >
            <TrashIcon className="size-5" />
            Delete
          </Link>
        </li>
      </ul>
    </details>
  );
}

export default EventActionMenu;
