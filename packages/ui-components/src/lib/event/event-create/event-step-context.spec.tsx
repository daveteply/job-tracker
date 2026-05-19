import { FormProvider, useForm, useFormContext } from 'react-hook-form';

import { render } from '@testing-library/react';
import { useTranslations } from 'next-intl';

import { EventStepContext } from './event-step-context';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

// Mock Comboboxes
jest.mock('../../company/company-combobox', () => () => <div data-testid="company-combobox" />);
jest.mock('../../contact/contact-combobox', () => () => <div data-testid="contact-combobox" />);
jest.mock('../../role/role-combobox', () => () => <div data-testid="role-combobox" />);

// Mock react-hook-form's useFormContext
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: jest.fn(),
}));

const TestComponent = ({
  control,
  onSearchCompany,
  onSearchContact,
  onSearchRole,
  watchValue,
  customSetValue,
}: any) => {
  (useFormContext as jest.Mock).mockReturnValue({
    watch: ((name: any) => watchValue?.[name]) as any,
    setValue: customSetValue || jest.fn(),
  });

  return (
    <EventStepContext
      control={control}
      onSearchCompany={onSearchCompany}
      onSearchContact={onSearchContact}
      onSearchRole={onSearchRole}
    />
  );
};

describe('EventStepContext', () => {
  const mockT = jest.fn((key) => key);
  const mockOnSearch = jest.fn().mockResolvedValue([]);

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(mockT);
  });

  it('renders successfully', () => {
    const { getByText, getByTestId } = render(
      <TestComponent
        control={{} as any}
        onSearchCompany={mockOnSearch}
        onSearchContact={mockOnSearch}
        onSearchRole={mockOnSearch}
      />,
    );

    expect(getByText('contextTitle')).toBeTruthy();
    expect(getByTestId('company-combobox')).toBeTruthy();
    expect(getByTestId('contact-combobox')).toBeTruthy();
    expect(getByTestId('role-combobox')).toBeTruthy();
  });

  it('syncs company when role with company is selected', () => {
    const mockSetValue = jest.fn();
    const roleWithCompany = { id: 'role-1', company: { id: 'comp-1', name: 'Tech' } };

    const { rerender } = render(
      <TestComponent
        control={{} as any}
        onSearchCompany={mockOnSearch}
        onSearchContact={mockOnSearch}
        onSearchRole={mockOnSearch}
        customSetValue={mockSetValue}
        watchValue={{ role: null, contact: null, company: null }}
      />,
    );

    rerender(
      <TestComponent
        control={{} as any}
        onSearchCompany={mockOnSearch}
        onSearchContact={mockOnSearch}
        onSearchRole={mockOnSearch}
        customSetValue={mockSetValue}
        watchValue={{ role: roleWithCompany, contact: null, company: null }}
      />,
    );

    expect(mockSetValue).toHaveBeenCalledWith(
      'company',
      expect.objectContaining({ id: 'comp-1' }),
      expect.any(Object),
    );
  });

  it('clears role when company changes to non-matching one', () => {
    const mockSetValue = jest.fn();
    const role = { id: 'role-1', companyId: 'comp-1' };
    const initialCompany = { id: 'comp-1' };
    const newCompany = { id: 'comp-2' };

    const { rerender } = render(
      <TestComponent
        control={{} as any}
        onSearchCompany={mockOnSearch}
        onSearchContact={mockOnSearch}
        onSearchRole={mockOnSearch}
        customSetValue={mockSetValue}
        watchValue={{ role, contact: null, company: initialCompany }}
      />,
    );

    rerender(
      <TestComponent
        control={{} as any}
        onSearchCompany={mockOnSearch}
        onSearchContact={mockOnSearch}
        onSearchRole={mockOnSearch}
        customSetValue={mockSetValue}
        watchValue={{ role, contact: null, company: newCompany }}
      />,
    );

    expect(mockSetValue).toHaveBeenCalledWith('role', null, expect.any(Object));
  });
});
