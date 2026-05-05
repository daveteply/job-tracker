'use client';

import { useMemo, useState } from 'react';

import * as HeroIcons from '@heroicons/react/24/outline';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useAvailableActions } from '@job-tracker/hooks';

import { useFloatingUI } from './floating-ui-context';

export function FloatingActionButton() {
  const t = useTranslations('Navigation');
  const actions = useAvailableActions();
  const { isContainerActive } = useFloatingUI();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();

  // Determine context based on current route
  const contextParams = useMemo(() => {
    const queryParams = new URLSearchParams();
    const id = params?.id as string;

    if (id) {
      if (pathname.includes('/roles/')) {
        queryParams.set('roleId', id);
      } else if (pathname.includes('/contacts/')) {
        queryParams.set('contactId', id);
      } else if (pathname.includes('/companies/')) {
        queryParams.set('companyId', id);
      }
    }

    return queryParams.toString();
  }, [pathname, params]);

  const getEventUrl = (actionId?: string) => {
    const baseUrl = '/events/new';
    const queryParams = new URLSearchParams(contextParams);
    if (actionId) {
      queryParams.set('action', actionId);
    }

    const queryString = queryParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  // Function to close menu when a link is clicked
  const handleLinkClick = () => setIsOpen(false);

  if (isContainerActive) {
    return null;
  }

  return (
    <div className="fixed right-5 bottom-15 z-50 flex flex-col items-end gap-3 xl:right-[calc(50%-640px+24px)]">
      {/* Speed Dial Menu Items */}
      {isOpen && (
        <div className="animate-in fade-in slide-in-from-bottom-4 mb-2 flex flex-col items-end gap-3 duration-200">
          <div className="flex items-center gap-3">
            <span className="bg-base-100 text-base-content rounded-md px-2 py-1 text-sm font-medium shadow-sm">
              {t('newEvent')}
            </span>
            <Link
              href={getEventUrl()}
              onClick={handleLinkClick}
              className="btn btn-primary btn-circle shadow-lg"
              aria-label={t('newEvent')}
            >
              <PlusIcon className="h-6 w-6" />
            </Link>
          </div>

          {actions.map((action) => {
            const Icon = HeroIcons[action.iconName as keyof typeof HeroIcons];
            return (
              <div key={action.id} className="flex items-center gap-3">
                <span className="bg-base-100 text-base-content rounded-md px-2 py-1 text-sm font-medium shadow-sm">
                  {t(action.nameKey)}
                </span>
                <Link
                  href={getEventUrl(action.id)}
                  onClick={handleLinkClick}
                  className="btn btn-secondary btn-circle shadow-lg"
                  aria-label={t(action.nameKey)}
                >
                  {Icon && <Icon className="h-6 w-6" />}
                </Link>
              </div>
            );
          })}
        </div>
      )}


      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`btn btn-circle btn-lg shadow-2xl transition-all duration-300 ${
          isOpen ? 'btn-neutral rotate-90' : 'btn-primary'
        }`}
        aria-label={t('toggleMenu')}
      >
        {isOpen ? <XMarkIcon className="h-8 w-8" /> : <PlusIcon className="h-8 w-8" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[-1] bg-black/20 backdrop-blur-[2px] transition-all"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
