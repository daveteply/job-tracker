'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useFloatingUI } from './floating-ui-context';

export function FloatingActionButton() {
  const { isContainerActive } = useFloatingUI();
  const [isOpen, setIsOpen] = useState(false);

  // Function to close menu when a link is clicked
  const handleLinkClick = () => setIsOpen(false);

  if (isContainerActive) {
    return null;
  }

  return (
    <div className="fixed bottom-15 right-5 flex flex-col items-end gap-4 z-50">
      {/* Speed Dial Menu Items */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2">
          <Link href="/events/new" onClick={handleLinkClick} className="btn btn-primary">
            New Event
          </Link>
          {/* Add more links here */}
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-12 h-11 rounded-full shadow-xl transition-all duration-300 ${
          isOpen ? 'bg-gray-800 rotate-45' : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
        aria-label="Toggle menu"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[-1] bg-transparent" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
