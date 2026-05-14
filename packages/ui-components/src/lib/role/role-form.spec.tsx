import { fireEvent, render, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { RoleStatus } from '@job-tracker/domain';

import { useToast } from '../common/feedback/toast-context';

import { RoleForm } from './role-form';

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

jest.mock('../common/forms/enum-selector', () => ({
  __esModule: true,
  default: () => <div data-testid="enum-selector" />,
}));

jest.mock('../common/layout/floating-button-container', () => ({
  FloatingButtonContainer: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../company/company-combobox', () => {
  return () => <div data-testid="company-combobox" />;
});

describe('RoleForm', () => {
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
      <RoleForm
        onSubmitAction={mockOnSubmitAction}
        onSearchCompany={mockOnSearchCompany}
        postActionRoute="/roles"
        initialData={{ title: 'Engineer' } as any}
      />,
    );
    expect(getByDisplayValue('Engineer')).toBeTruthy();
    expect(getByTestId('company-combobox')).toBeTruthy();
    expect(getByTestId('enum-selector')).toBeTruthy();
    expect(getByText('create')).toBeTruthy();
  });

  it('should call onSubmitAction on form submission', async () => {
    const { getByText } = render(
      <RoleForm
        onSubmitAction={mockOnSubmitAction}
        onSearchCompany={mockOnSearchCompany}
        postActionRoute="/roles"
        initialData={{ title: 'Engineer', status: RoleStatus.Applied } as any}
      />,
    );

    fireEvent.submit(getByText('create').closest('form')!);

    await waitFor(() => {
      expect(mockOnSubmitAction).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Engineer',
          status: RoleStatus.Applied,
        }),
      );
      expect(mockShowToast).toHaveBeenCalledWith(expect.stringContaining('created'), 'success');
      expect(mockPush).toHaveBeenCalledWith('/roles');
    });
  });

  it('should render as edit form', () => {
    const { getByText } = render(
      <RoleForm
        onSubmitAction={mockOnSubmitAction}
        onSearchCompany={mockOnSearchCompany}
        postActionRoute="/roles"
        isEdit={true}
      />,
    );
    expect(getByText('update')).toBeTruthy();
  });
});
