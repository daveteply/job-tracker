import { useFormContext } from 'react-hook-form';

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

  it('clears role when company changes to non-matching one', async () => {
    const mockSetValue = jest.fn();
    const role = { id: 'role-1', companyId: 'comp-1', title: 'Engineer' };
    const initialCompany = { id: 'comp-1' };
    const newCompany = { id: 'comp-2' };
    const mockSearchRole = jest.fn().mockResolvedValue([]);

    const { rerender } = render(
      <TestComponent
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock control object
        control={{} as any}
        onSearchCompany={mockOnSearch}
        onSearchContact={mockOnSearch}
        onSearchRole={mockSearchRole}
        customSetValue={mockSetValue}
        watchValue={{ role, contact: null, company: initialCompany }}
      />,
    );

    rerender(
      <TestComponent
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock control object
        control={{} as any}
        onSearchCompany={mockOnSearch}
        onSearchContact={mockOnSearch}
        onSearchRole={mockSearchRole}
        customSetValue={mockSetValue}
        watchValue={{ role, contact: null, company: newCompany }}
      />,
    );

    await Promise.resolve();
    expect(mockSetValue).toHaveBeenCalledWith('role', null, expect.any(Object));
  });

  it('auto-fills role when company changes and company has exactly 1 role', async () => {
    const mockSetValue = jest.fn();
    const singleRole = { id: 'role-99', companyId: 'comp-2', title: 'Single Role' };
    const mockSearchRole = jest.fn().mockResolvedValue([singleRole]);

    const { rerender } = render(
      <TestComponent
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock control object
        control={{} as any}
        onSearchCompany={mockOnSearch}
        onSearchContact={mockOnSearch}
        onSearchRole={mockSearchRole}
        customSetValue={mockSetValue}
        watchValue={{ role: null, contact: null, company: null }}
      />,
    );

    rerender(
      <TestComponent
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock control object
        control={{} as any}
        onSearchCompany={mockOnSearch}
        onSearchContact={mockOnSearch}
        onSearchRole={mockSearchRole}
        customSetValue={mockSetValue}
        watchValue={{ role: null, contact: null, company: { id: 'comp-2' } }}
      />,
    );

    await Promise.resolve();
    expect(mockSetValue).toHaveBeenCalledWith(
      'role',
      expect.objectContaining({ id: 'role-99', title: 'Single Role' }),
      expect.any(Object),
    );
  });
});
