'use client';

import { useEffect, useMemo, useState } from 'react';

import BriefcaseIcon from '@heroicons/react/24/outline/BriefcaseIcon';
import CalendarIcon from '@heroicons/react/24/outline/CalendarIcon';
import ChatBubbleLeftEllipsisIcon from '@heroicons/react/24/outline/ChatBubbleLeftEllipsisIcon';
import ClipboardDocumentCheckIcon from '@heroicons/react/24/outline/ClipboardDocumentCheckIcon';
import DocumentPlusIcon from '@heroicons/react/24/outline/DocumentPlusIcon';
import EnvelopeIcon from '@heroicons/react/24/outline/EnvelopeIcon';
import EyeSlashIcon from '@heroicons/react/24/outline/EyeSlashIcon';
import PaperAirplaneIcon from '@heroicons/react/24/outline/PaperAirplaneIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon';
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import {
  ACTION_CONSTRAINTS,
  INACTIVE_STATUSES,
  useAvailableActions,
  useRoleWithCompany,
  useUserSettings,
} from '@job-tracker/hooks';

import { useFloatingUI } from '../context/floating-ui-context';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BriefcaseIcon,
  CalendarIcon,
  ChatBubbleLeftEllipsisIcon,
  ClipboardDocumentCheckIcon,
  DocumentPlusIcon,
  EnvelopeIcon,
  EyeSlashIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  XCircleIcon,
};

export function FloatingActionButton() {
  const t = useTranslations('Navigation');
  const actions = useAvailableActions();
  const { isContainerActive } = useFloatingUI();
  const { settings, isLoading } = useUserSettings();
  const position = settings?.fabPosition || 'right';
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const pathname = usePathname();
  const params = useParams();

  const roleId = useMemo(() => {
    if (!pathname.includes('/roles/')) return '';
    return (params?.id as string) || '';
  }, [pathname, params]);

  const { role, loading: loadingRole } = useRoleWithCompany(roleId);

  const isRoleInactive = useMemo(() => {
    if (!roleId || loadingRole || !role) return false;
    return INACTIVE_STATUSES.includes(role.status);
  }, [roleId, loadingRole, role]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isOpen]);

  if (!isOpen && isAnimating) {
    setIsAnimating(false);
  }

  const labelKey = useMemo(() => {
    const id = params?.id;
    if (!id) return null;

    if (pathname.includes('/companies/')) return 'addActivityCompany';
    if (pathname.includes('/roles/')) return 'addActivityRole';
    if (pathname.includes('/contacts/')) return 'addActivityContact';

    return null;
  }, [pathname, params]);

  useEffect(() => {
    if (labelKey && !isOpen) {
      const timer = setTimeout(() => setShowLabel(true), 1000);
      return () => {
        clearTimeout(timer);
        setShowLabel(false);
      };
    }
    return undefined;
  }, [labelKey, isOpen]);

  const filteredActions = useMemo(() => {
    const segments = pathname.split('/');
    const route = segments.find((s) => Object.keys(ACTION_CONSTRAINTS).includes(s));

    if (!route || !ACTION_CONSTRAINTS[route]) {
      const allowedIds = ACTION_CONSTRAINTS['general'] || [];
      return actions.filter((action) => allowedIds.includes(action.id));
    }

    const allowedIds = ACTION_CONSTRAINTS[route];
    return actions.filter((action) => allowedIds.includes(action.id));
  }, [pathname, actions]);

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

  if (isContainerActive || isLoading || isRoleInactive) {
    return null;
  }

  return (
    <div
      className={`fab-container fixed bottom-15 z-50 flex flex-col gap-3 ${
        position === 'left'
          ? 'left-5 items-start xl:left-[calc(50%-640px+24px)]'
          : 'right-5 items-end xl:right-[calc(50%-640px+24px)]'
      }`}
    >
      {/* Speed Dial Menu Items */}
      {isOpen && (
        <div className={`mb-2 flex flex-col gap-3 ${position === 'left' ? 'items-start' : 'items-end'}`}>
          <div
            className={`flex items-center gap-3 transition-all duration-300 ease-out ${
              position === 'left' ? 'flex-row-reverse' : ''
            } ${
              isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: `${filteredActions.length * 40}ms` }}
          >
            <span className="bg-base-100 text-base-content rounded-md px-2 py-1 text-sm font-medium shadow-sm">
              {t('moreActions')}
            </span>
            <Link
              href={getEventUrl()}
              onClick={handleLinkClick}
              className="btn btn-primary btn-circle shadow-lg"
              aria-label={t('moreActions')}
            >
              <PlusIcon className="h-6 w-6" />
            </Link>
          </div>

          {filteredActions.map((action, index) => {
            const Icon = iconMap[action.iconName];
            return (
              <div
                key={action.id}
                className={`flex items-center gap-3 transition-all duration-300 ease-out ${
                  position === 'left' ? 'flex-row-reverse' : ''
                } ${
                  isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: `${(filteredActions.length - 1 - index) * 40}ms` }}
              >
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
      <div className={`relative flex items-center ${position === 'left' ? 'justify-start' : 'justify-end'}`}>
        {labelKey && (
          <div
            className={`pointer-events-none absolute z-[-1] whitespace-nowrap transition-all duration-700 ease-out ${
              position === 'left' ? 'left-2' : 'right-2'
            } ${
              showLabel
                ? position === 'left'
                  ? 'translate-x-16 opacity-100'
                  : '-translate-x-16 opacity-100'
                : 'translate-x-0 opacity-0'
            }`}
          >
            <span className="bg-info text-info-content rounded-full px-4 py-2 text-sm font-semibold shadow-lg">
              {t(labelKey)}
            </span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`btn btn-circle btn-lg shadow-2xl transition-all duration-300 ${
            isOpen ? 'btn-neutral rotate-90' : 'btn-primary'
          }`}
          aria-label={t('toggleMenu')}
        >
          {isOpen ? <XMarkIcon className="h-8 w-8" /> : <PlusIcon className="h-8 w-8" />}
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[-1] bg-black/20 backdrop-blur-[2px] transition-all"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsOpen(false);
            }
          }}
          role="button"
          tabIndex={-1}
          aria-label="Close menu"
        />
      )}
    </div>
  );
}
