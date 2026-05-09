import { CompanyDTO, ContactDTO, RoleDTO } from '@job-tracker/validation';

import { EntityComboboxConfig } from './entity-combobox';

// Form value shapes for new entities
export interface CompanyFormValue {
  id?: number;
  name: string;
  isNew: boolean;
  shouldRemove?: boolean;
  displayValue?: string;
}

export interface ContactFormValue {
  id?: number;
  firstName: string;
  lastName: string;
  isNew: boolean;
  shouldRemove?: boolean;
  displayValue?: string;
}

export interface RoleFormValue {
  id?: number;
  title: string;
  isNew: boolean;
  shouldRemove?: boolean;
  displayValue?: string;
}

// Company configuration
export const companyComboboxConfig: EntityComboboxConfig<CompanyDTO, CompanyFormValue> = {
  getDisplayValue: (company) => {
    const companyWithDisplay = company as CompanyDTO & { displayValue?: string };
    return company.name || companyWithDisplay.displayValue || '';
  },

  parseNewEntity: (input) => ({
    name: input,
    isNew: true,
    displayValue: input,
  }),
};

// Contact configuration
//   Parses "FirstName LastName" format
export const contactComboboxConfig: EntityComboboxConfig<ContactDTO, ContactFormValue> = {
  getDisplayValue: (contact) => {
    // Cast to allow accessing form-specific displayValue if it exists
    const contactWithDisplay = contact as ContactDTO & { displayValue?: string };
    if (!contact.firstName && !contact.lastName) {
      return contactWithDisplay.displayValue || '';
    }
    return `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
  },

  parseNewEntity: (input) => {
    const trimmed = input.trim();
    const parts = trimmed.split(/\s+/);

    if (parts.length < 2) {
      return {
        firstName: trimmed,
        lastName: '',
        isNew: true,
        displayValue: input,
      };
    }

    // Take first word as firstName, rest as lastName
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');

    return {
      firstName,
      lastName,
      isNew: true,
      displayValue: input,
    };
  },
};

// Role configuration
// Assumes Role has a similar structure with an id and title
export const roleComboboxConfig: EntityComboboxConfig<RoleDTO, RoleFormValue> = {
  getDisplayValue: (role) => {
    const roleWithDisplay = role as RoleDTO & { displayValue?: string };
    return role.title || roleWithDisplay.displayValue || '';
  },

  parseNewEntity: (input) => ({
    title: input,
    isNew: true,
    displayValue: input,
  }),
};
