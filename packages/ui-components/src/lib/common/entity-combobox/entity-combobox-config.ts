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
  getDisplayValue: (company) => company.name,

  parseNewEntity: (input) => ({
    name: input,
    isNew: true,
    displayValue: input,
  }),

  createNewLabel: (input) => `Create new company: "${input}"`,
};

// Contact configuration
//   Parses "FirstName LastName" format
export const contactComboboxConfig: EntityComboboxConfig<ContactDTO, ContactFormValue> = {
  getDisplayValue: (contact) => `${contact.firstName} ${contact.lastName}`,

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

  validateNewEntity: (input) => {
    const trimmed = input.trim();
    if (!trimmed) {
      return null;
    }

    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) {
      return 'Please enter both first and last name (e.g., "John Doe")';
    }

    return null;
  },

  createNewLabel: (input) => {
    const trimmed = input.trim();
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      return `Create new contact: "${input}"`;
    }
    return 'Enter first and last name to create';
  },
};

// Role configuration
// Assumes Role has a similar structure with an id and title
export const roleComboboxConfig: EntityComboboxConfig<RoleDTO, RoleFormValue> = {
  getDisplayValue: (role) => role.title,

  parseNewEntity: (input) => ({
    title: input,
    isNew: true,
    displayValue: input,
  }),

  createNewLabel: (input) => `Create new role: "${input}"`,
};
