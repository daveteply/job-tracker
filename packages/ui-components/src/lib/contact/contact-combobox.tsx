'use client';

import { Control, FieldValues, Path } from 'react-hook-form';

import { ContactDTO } from '@job-tracker/validation';

import EntityCombobox from '../common/entity-combobox/entity-combobox';
import { contactComboboxConfig } from '../common/entity-combobox/entity-combobox-config';

interface ContactComboboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  onSearch: (query: string) => Promise<ContactDTO[]>;
  required?: boolean;
  placeholder?: string;
  createNewLabel?: (input: string) => string;
  validateNewEntity?: (input: string) => string | null;
}

export function ContactCombobox<T extends FieldValues>({
  control,
  name,
  onSearch,
  required = false,
  placeholder,
  createNewLabel,
  validateNewEntity,
}: ContactComboboxProps<T>) {
  return (
    <EntityCombobox
      control={control}
      name={name}
      onSearch={onSearch}
      config={contactComboboxConfig}
      required={required}
      placeholder={placeholder}
      createNewLabel={createNewLabel}
      validateNewEntity={validateNewEntity}
    />
  );
}

export default ContactCombobox;
