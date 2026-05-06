'use client';

import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

import { useUserSettings } from '@job-tracker/hooks';
import { CompanyWithChildrenDTO } from '@job-tracker/validation';

import CompanyInfoCard from './company-info-card';

export interface CompanyListProps {
  activeCompanies: CompanyWithChildrenDTO[];
  inactiveCompanies?: CompanyWithChildrenDTO[];
  noCompaniesMessage?: string;
  showRoles?: boolean;
  showContacts?: boolean;
}

export function CompanyList({
  activeCompanies,
  inactiveCompanies = [],
  noCompaniesMessage,
  showRoles = false,
  showContacts = false,
}: CompanyListProps) {
  const t = useTranslations('Companies');
  const { settings, updateSettings } = useUserSettings();
  const message = noCompaniesMessage || t('noCompaniesFound');

  const showInactive = settings?.showInactiveRoles ?? false;

  const toggleInactive = () => {
    updateSettings({ showInactiveRoles: !showInactive });
  };

  if (activeCompanies.length === 0 && inactiveCompanies.length === 0) {
    return <p className="px-1 text-sm italic opacity-50">{message}</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {activeCompanies.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeCompanies.map((company) => (
            <CompanyInfoCard
              key={company.id}
              company={company}
              roles={company.roles}
              contacts={company.contacts}
              showRoles={showRoles}
              showContacts={showContacts}
            />
          ))}
        </div>
      ) : (
        inactiveCompanies.length === 0 && <p className="px-1 text-sm italic opacity-50">{message}</p>
      )}

      {inactiveCompanies.length > 0 && (
        <div className="border-base-content/10 flex flex-col gap-4 border-t pt-8">
          <button
            onClick={toggleInactive}
            className="flex w-fit items-center gap-2 px-1 text-sm font-semibold opacity-70 transition-opacity hover:opacity-100"
          >
            {showInactive ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
            {t('inactiveCompanies')} ({inactiveCompanies.length})
          </button>

          {showInactive && (
            <>
              <p className="px-1 text-xs opacity-50 -mt-2 mb-2">
                {t('inactiveCompaniesDescription')}
              </p>
              <div className="grid grid-cols-1 gap-4 opacity-70 md:grid-cols-2 lg:grid-cols-3">
                {inactiveCompanies.map((company) => (
                  <CompanyInfoCard
                    key={company.id}
                    company={company}
                    roles={company.roles}
                    contacts={company.contacts}
                    showRoles={showRoles}
                    showContacts={showContacts}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CompanyList;
