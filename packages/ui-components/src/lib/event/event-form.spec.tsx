import { fireEvent, render, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { DirectionType, SourceType } from '@job-tracker/domain';

import { useToast } from '../common/feedback/toast-context';

import { EventForm } from './event-form';

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
  EnumSelector: () => <div data-testid="enum-selector" />,
}));

jest.mock('../common/layout/floating-button-container', () => ({
  FloatingButtonContainer: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../company/company-combobox', () => {
  return () => <div data-testid="company-combobox" />;
});

jest.mock('../contact/contact-combobox', () => {
  return () => <div data-testid="contact-combobox" />;
});

jest.mock('../role/role-combobox', () => {
  return () => <div data-testid="role-combobox" />;
});

jest.mock('../event-type/event-type-select', () => {
  return () => <div data-testid="event-type-select" />;
});

jest.mock('./event-summary-generator', () => {
  return () => <div data-testid="event-summary-generator" />;
});

describe('EventForm', () => {
  const mockT = jest.fn((key) => key);
  const mockPush = jest.fn();
  const mockShowToast = jest.fn();
  const mockOnSubmitAction = jest.fn();
  const mockOnSearchCompany = jest.fn();
  const mockOnSearchContact = jest.fn();
  const mockOnSearchRole = jest.fn();

  const mockEventTypes = [
    {
      id: '1',
      name: 'Application',
      category: 'Application',
      isSystemDefined: true,
      translationKey: 'application',
    },
  ];

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
    const { getByText, getByTestId } = render(
      <EventForm
        onSubmitAction={mockOnSubmitAction}
        onSearchCompany={mockOnSearchCompany}
        onSearchContact={mockOnSearchContact}
        onSearchRole={mockOnSearchRole}
        eventTypes={mockEventTypes as any}
        postActionRoute="/events"
        initialData={{ summary: 'Test Summary' } as any}
      />,
    );

    expect(getByTestId('event-type-select')).toBeTruthy();
    expect(getByTestId('company-combobox')).toBeTruthy();
    expect(getByTestId('contact-combobox')).toBeTruthy();
    expect(getByTestId('role-combobox')).toBeTruthy();
    expect(getByTestId('event-summary-generator')).toBeTruthy();
    expect(getByText('create')).toBeTruthy();
  });

  it('should call onSubmitAction on form submission', async () => {
    const { getByText } = render(
      <EventForm
        onSubmitAction={mockOnSubmitAction}
        onSearchCompany={mockOnSearchCompany}
        onSearchContact={mockOnSearchContact}
        onSearchRole={mockOnSearchRole}
        eventTypes={mockEventTypes as any}
        postActionRoute="/events"
        initialData={
          {
            summary: 'Test Summary',
            eventTypeId: '1',
            source: SourceType.Email,
            direction: DirectionType.Inbound,
          } as any
        }
      />,
    );

    fireEvent.submit(getByText('create').closest('form')!);

    await waitFor(() => {
      expect(mockOnSubmitAction).toHaveBeenCalledWith(
        expect.objectContaining({
          summary: 'Test Summary',
          eventTypeId: '1',
          source: SourceType.Email,
          direction: DirectionType.Inbound,
        }),
      );
      expect(mockShowToast).toHaveBeenCalledWith(expect.stringContaining('created'), 'success');
      expect(mockPush).toHaveBeenCalledWith('/events');
    });
  });

  it('should render as edit form', () => {
    const { getByText } = render(
      <EventForm
        onSubmitAction={mockOnSubmitAction}
        onSearchCompany={mockOnSearchCompany}
        onSearchContact={mockOnSearchContact}
        onSearchRole={mockOnSearchRole}
        eventTypes={mockEventTypes as any}
        postActionRoute="/events"
        isEdit={true}
      />,
    );
    expect(getByText('update')).toBeTruthy();
  });
});
