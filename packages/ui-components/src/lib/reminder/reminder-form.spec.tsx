import { fireEvent, render, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useToast } from '../common/feedback/toast-context';

import { ReminderForm } from './reminder-form';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock toast context
jest.mock('../common/feedback/toast-context', () => ({
  useToast: jest.fn(),
}));

// Mock ErrorMsg
jest.mock('../common/forms/error-msg', () => ({
  ErrorMsg: () => <div data-testid="error-msg" />,
}));

// Mock FloatingButtonContainer
jest.mock('../common/layout/floating-button-container', () => ({
  FloatingButtonContainer: ({ children }: any) => <div>{children}</div>,
}));

describe('ReminderForm', () => {
  const mockT = jest.fn((key) => key);
  const mockPush = jest.fn();
  const mockShowToast = jest.fn();

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(mockT);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useToast as jest.Mock).mockReturnValue({ showToast: mockShowToast });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockOnSubmitAction = jest.fn();

  it('renders successfully for creation', () => {
    const { getByText } = render(
      <ReminderForm
        onSubmitAction={mockOnSubmitAction}
        postActionRoute="/target"
      />
    );

    expect(getByText('create')).toBeTruthy();
    expect(getByText('cancel')).toBeTruthy();
  });

  it('renders successfully for edit with initial data', () => {
    const initialData = {
      id: '1',
      eventId: 'evt-1',
      remindAt: new Date('2026-05-14'),
    };

    const { getByText } = render(
      <ReminderForm
        onSubmitAction={mockOnSubmitAction}
        initialData={initialData as any}
        isEdit={true}
        postActionRoute="/target"
      />
    );

    expect(getByText('update')).toBeTruthy();
  });

  it('handles successful submission', async () => {
    mockOnSubmitAction.mockResolvedValue({ success: true });
    
    const initialData = {
      eventId: 'evt-1',
      remindAt: new Date('2026-05-15'),
    };

    const { getByText } = render(
      <ReminderForm
        onSubmitAction={mockOnSubmitAction}
        initialData={initialData as any}
        postActionRoute="/target"
      />
    );

    fireEvent.submit(getByText('create').closest('form')!);

    await waitFor(() => {
      expect(mockOnSubmitAction).toHaveBeenCalled();
      expect(mockShowToast).toHaveBeenCalledWith(expect.stringContaining('successfully'), 'success');
      expect(mockPush).toHaveBeenCalledWith('/target');
    });
  });

  it('handles failed submission', async () => {
    mockOnSubmitAction.mockResolvedValue({ success: false, message: 'Error occurred' });
    
    const initialData = {
      eventId: 'evt-1',
      remindAt: new Date('2026-05-15'),
    };

    const { getByText } = render(
      <ReminderForm
        onSubmitAction={mockOnSubmitAction}
        initialData={initialData as any}
        postActionRoute="/target"
      />
    );

    fireEvent.submit(getByText('create').closest('form')!);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Error occurred', 'error');
    });
  });
});
