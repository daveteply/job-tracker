'use client';

import { ContactDTO } from '@job-tracker/validation';
import { Control, FieldValues, Path } from 'react-hook-form';
import EntityCombobox from '../common/entity-combobox/entity-combobox';
import { contactComboboxConfig } from '../common/entity-combobox/entity-combobox-config';

interface ContactComboboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  onSearch: (query: string) => Promise<ContactDTO[]>;
  required?: boolean;
}

export function ContactCombobox<T extends FieldValues>({
  control,
  name,
  onSearch,
  required = false,
}: ContactComboboxProps<T>) {
  return (
    <EntityCombobox
      control={control}
      name={name}
      onSearch={onSearch}
      config={contactComboboxConfig}
      required={required}
    />
  );
}

export default ContactCombobox;
