import { fireEvent, render, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useToast } from '../common/feedback/toast-context';

import { CompanyForm } from './company-form';

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

describe('CompanyForm', () => {
  const mockT = jest.fn((key) => key);
  const mockPush = jest.fn();
  const mockShowToast = jest.fn();
  const mockOnSubmitAction = jest.fn();

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
    const { getByText, getByDisplayValue } = render(
      <CompanyForm
        onSubmitAction={mockOnSubmitAction}
        postActionRoute="/companies"
        initialData={{ name: 'Acme' } as any}
      />,
    );
    expect(getByDisplayValue('Acme')).toBeTruthy();
    expect(getByText('create')).toBeTruthy();
  });

  it('should call onSubmitAction on form submission', async () => {
    const { getByText, getByDisplayValue } = render(
      <CompanyForm
        onSubmitAction={mockOnSubmitAction}
        postActionRoute="/companies"
        initialData={{ name: 'Acme' } as any}
      />,
    );

    fireEvent.submit(getByText('create').closest('form')!);

    await waitFor(() => {
      expect(mockOnSubmitAction).toHaveBeenCalledWith({ name: 'Acme' });
      expect(mockShowToast).toHaveBeenCalledWith(expect.stringContaining('created'), 'success');
      expect(mockPush).toHaveBeenCalledWith('/companies');
    });
  });

  it('should show error toast on submission failure', async () => {
    mockOnSubmitAction.mockResolvedValue({ success: false, message: 'Failed to save' });

    const { getByText } = render(
      <CompanyForm
        onSubmitAction={mockOnSubmitAction}
        postActionRoute="/companies"
        initialData={{ name: 'Acme' } as any}
      />,
    );

    fireEvent.submit(getByText('create').closest('form')!);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Failed to save', 'error');
    });
  });

  it('should render as edit form', () => {
    const { getByText } = render(
      <CompanyForm
        onSubmitAction={mockOnSubmitAction}
        postActionRoute="/companies"
        isEdit={true}
      />,
    );
    expect(getByText('update')).toBeTruthy();
  });
});
