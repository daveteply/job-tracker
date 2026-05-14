import { fireEvent, render, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useToast } from '../common/feedback/toast-context';

import { ContactForm } from './contact-form';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

// Mock ../common/feedback/toast-context
jest.mock('../common/feedback/toast-context', () => ({
  useToast: jest.fn(),
}));

// Mock child components
jest.mock('../common/forms/error-msg', () => ({
  ErrorMsg: () => null,
}));

jest.mock('../common/layout/floating-button-container', () => ({
  FloatingButtonContainer: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../company/company-combobox', () => {
  return () => <div data-testid="company-combobox" />;
});

describe('ContactForm', () => {
  const mockT = jest.fn((key) => key);
  const mockPush = jest.fn();
  const mockShowToast = jest.fn();
  const mockOnSubmitAction = jest.fn();
  const mockOnSearchCompany = jest.fn();

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(mockT);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useToast as jest.Mock).mockReturnValue({ showToast: mockShowToast });
    mockOnSubmitAction.mockResolvedValue({ success: true, message: 'Success' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { getByText, getByDisplayValue, getByTestId } = render(
      <ContactForm
        onSubmitAction={mockOnSubmitAction}
        onSearchCompany={mockOnSearchCompany}
        postActionRoute="/contacts"
        initialData={{ firstName: 'John', lastName: 'Doe' } as any}
      />,
    );
    expect(getByDisplayValue('John')).toBeTruthy();
    expect(getByDisplayValue('Doe')).toBeTruthy();
    expect(getByTestId('company-combobox')).toBeTruthy();
    expect(getByText('create')).toBeTruthy();
  });

  it('should call onSubmitAction on form submission', async () => {
    const { getByText } = render(
      <ContactForm
        onSubmitAction={mockOnSubmitAction}
        onSearchCompany={mockOnSearchCompany}
        postActionRoute="/contacts"
        initialData={{ firstName: 'John', lastName: 'Doe' } as any}
      />,
    );

    fireEvent.submit(getByText('create').closest('form')!);

    await waitFor(() => {
      expect(mockOnSubmitAction).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
        }),
      );
      expect(mockShowToast).toHaveBeenCalledWith(expect.stringContaining('created'), 'success');
      expect(mockPush).toHaveBeenCalledWith('/contacts');
    });
  });

  it('should show error toast on submission failure', async () => {
    mockOnSubmitAction.mockResolvedValue({ success: false, message: 'Failed to save' });

    const { getByText } = render(
      <ContactForm
        onSubmitAction={mockOnSubmitAction}
        onSearchCompany={mockOnSearchCompany}
        postActionRoute="/contacts"
        initialData={{ firstName: 'John', lastName: 'Doe' } as any}
      />,
    );

    fireEvent.submit(getByText('create').closest('form')!);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Failed to save', 'error');
    });
  });

  it('should render as edit form', () => {
    const { getByText } = render(
      <ContactForm
        onSubmitAction={mockOnSubmitAction}
        onSearchCompany={mockOnSearchCompany}
        postActionRoute="/contacts"
        isEdit={true}
      />,
    );
    expect(getByText('update')).toBeTruthy();
  });
});
