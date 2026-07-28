'use client';

import { Control, FieldValues, Path, useFormContext } from 'react-hook-form';

import { useTranslations } from 'next-intl';

import { EntitySelection } from '@job-tracker/app-logic';
import { CompanyDTO, ContactDTO, RoleDTO } from '@job-tracker/validation';

import CompanyCombobox from '../../company/company-combobox';
import ContactCombobox from '../../contact/contact-combobox';
import RoleCombobox from '../../role/role-combobox';
import { useEventContextSync } from '../use-event-context-sync';

export interface EventStepContextProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  onSearchCompany: (query: string) => Promise<CompanyDTO[]>;
  onSearchContact: (query: string) => Promise<ContactDTO[]>;
  onSearchRole: (query: string, companyId?: string | null) => Promise<RoleDTO[]>;
  companyPlaceholder?: string;
  contactPlaceholder?: string;
  rolePlaceholder?: string;
  createCompanyLabel?: (input: string) => string;
  createContactLabel?: (input: string) => string;
  createRoleLabel?: (input: string) => string;
  validateContact?: (input: string) => string | null;
}

export function EventStepContext<T extends FieldValues = FieldValues>({
  control,
  onSearchCompany,
  onSearchContact,
  onSearchRole,
  companyPlaceholder,
  contactPlaceholder,
  rolePlaceholder,
  createCompanyLabel,
  createContactLabel,
  createRoleLabel,
  validateContact,
}: EventStepContextProps<T>) {
  const t = useTranslations('Events');
  const { watch } = useFormContext<T>();

  const company = watch('company' as Path<T>);

  useEventContextSync<T>({ onSearchRole });

  return (
    <div className="space-y-6">
      <h2 className="text-base-content text-lg font-semibold">{t('contextTitle')}</h2>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-base-content font-medium">
            {t('formCompanyOptional')}
          </span>
        </label>
        <CompanyCombobox
          control={control}
          name={'company' as Path<T>}
          onSearch={onSearchCompany}
          placeholder={companyPlaceholder}
          createNewLabel={createCompanyLabel}
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-base-content font-medium">
            {t('formContactOptional')}
          </span>
        </label>
        <ContactCombobox
          control={control}
          name={'contact' as Path<T>}
          onSearch={onSearchContact}
          placeholder={contactPlaceholder}
          createNewLabel={createContactLabel}
          validateNewEntity={validateContact}
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-base-content font-medium">{t('formRoleOptional')}</span>
        </label>
        <RoleCombobox
          control={control}
          name={'role' as Path<T>}
          onSearch={(query) => onSearchRole(query, (company as EntitySelection | null)?.id)}
          placeholder={rolePlaceholder}
          createNewLabel={createRoleLabel}
        />
      </div>
    </div>
  );
}

export default EventStepContext;
