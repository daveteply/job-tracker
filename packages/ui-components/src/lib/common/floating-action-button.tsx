'use client';

import { useState } from 'react';

import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { useFloatingUI } from './floating-ui-context';

export function FloatingActionButton() {
  const t = useTranslations('Navigation');
  const { isContainerActive } = useFloatingUI();
  const [isOpen, setIsOpen] = useState(false);

  // Function to close menu when a link is clicked
  const handleLinkClick = () => setIsOpen(false);

  if (isContainerActive) {
    return null;
  }

  return (
    <div className="fixed right-5 bottom-15 z-50 flex flex-col items-end gap-4">
      {/* Speed Dial Menu Items */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2">
          <Link href="/events/new" onClick={handleLinkClick} className="btn btn-primary">
            {t('newEvent')}
          </Link>
          {/* Add more links here */}
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-11 w-12 items-center justify-center rounded-full shadow-xl transition-all duration-300 ${
          isOpen ? 'rotate-45 bg-gray-800' : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
        aria-label={t('toggleMenu')}
      >
        <PlusIcon className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[-1] bg-transparent" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
