'use client';

import { useEffect, useRef } from 'react';
import { Control, FieldValues, Path, useFormContext } from 'react-hook-form';

import { useTranslations } from 'next-intl';

import { EntitySelection } from '@job-tracker/app-logic';
import { CompanyDTO, ContactDTO, RoleDTO } from '@job-tracker/validation';

import CompanyCombobox from '../../company/company-combobox';
import ContactCombobox from '../../contact/contact-combobox';
import RoleCombobox from '../../role/role-combobox';

export interface EventStepContextProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  onSearchCompany: (query: string) => Promise<CompanyDTO[]>;
  onSearchContact: (query: string) => Promise<ContactDTO[]>;
  onSearchRole: (query: string) => Promise<RoleDTO[]>;
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
  const { setValue, watch } = useFormContext<T>();

  const contact = watch('contact' as Path<T>) as (ContactDTO & { company?: CompanyDTO }) | null;
  const role = watch('role' as Path<T>) as (RoleDTO & { company?: CompanyDTO }) | null;
  const company = watch('company' as Path<T>);

  const prevContactRef = useRef(contact);
  const prevRoleRef = useRef(role);

  useEffect(() => {
    // If role changed and has an associated company, it takes precedence
    if (role?.id !== prevRoleRef.current?.id) {
      if (role?.company) {
        const selection: EntitySelection = {
          ...role.company,
          isNew: false,
          shouldRemove: false,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setValue('company' as Path<T>, selection as any, { shouldValidate: true });
      }
    }
    // If contact changed and has an associated company, only fill if company is currently empty
    else if (contact?.id !== prevContactRef.current?.id) {
      if (contact?.company && !company) {
        const selection: EntitySelection = {
          ...contact.company,
          isNew: false,
          shouldRemove: false,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setValue('company' as Path<T>, selection as any, { shouldValidate: true });
      }
    }

    prevContactRef.current = contact;
    prevRoleRef.current = role;
  }, [contact, role, company, setValue]);

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
          onSearch={onSearchRole}
          placeholder={rolePlaceholder}
          createNewLabel={createRoleLabel}
        />
      </div>
    </div>
  );
}

export default EventStepContext;
