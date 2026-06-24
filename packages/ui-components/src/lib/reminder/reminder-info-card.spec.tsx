import { render } from '@testing-library/react';
import { useTranslations } from 'next-intl';

import { ReminderWithChildrenDTO } from '@job-tracker/validation';

import { ReminderInfoCard } from './reminder-info-card';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

// Mock @job-tracker/hooks
jest.mock('@job-tracker/hooks', () => ({
  useReminderActions: () => ({
    completeReminder: jest.fn(),
  }),
}));

// Mock BaseInfoCard
jest.mock('../common/data-display/base-info-card', () => {
  return ({ title, detailsUrl }: any) => (
    <div data-testid="base-info-card" data-url={detailsUrl}>
      {title}
    </div>
  );
});

// Mock FormattedDate
jest.mock('../common/data-display/formatted-date', () => {
  return ({ dateValue }: any) => <span data-testid="formatted-date">{dateValue.toString()}</span>;
});

describe('ReminderInfoCard', () => {
  const mockT = jest.fn((key, params) => {
    if (key === 'followUpWith') return `translated:followUpWith:${params.name}`;
    if (key === 'followUpAt') return `translated:followUpAt:${params.company}`;
    if (key === 'followUpOn') return `translated:followUpOn:${params.event}`;
    return `translated:${key}`;
  });

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(mockT);
  });

  const mockReminder: ReminderWithChildrenDTO = {
    id: 'rem-1',
    remindAt: new Date('2026-05-14'),
    createdAt: new Date(),
    updatedAt: new Date(),
    eventId: 'evt-1',
    event: {
      id: 'evt-1',
      summary: 'Interview Reminder',
      contact: {
        id: 'con-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      },
      company: {
        id: 'comp-1',
        name: 'Tech Corp',
      },
    } as any,
  } as any;

  it('renders successfully with full info', () => {
    const { getByText, getByTestId } = render(<ReminderInfoCard reminder={mockReminder} />);

    expect(getByText('translated:followUpWith:John Doe')).toBeTruthy();
    expect(getByText('Interview Reminder')).toBeTruthy();
    expect(getByTestId('formatted-date')).toBeTruthy();
    expect(getByTestId('base-info-card').getAttribute('data-url')).toBe('/reminders/rem-1');
  });

  it('renders with company fallback title when contact is missing', () => {
    const companyReminder = {
      ...mockReminder,
      event: {
        ...mockReminder.event,
        contact: null,
      },
    };
    const { getByText } = render(<ReminderInfoCard reminder={companyReminder as any} />);
    expect(getByText('translated:followUpAt:Tech Corp')).toBeTruthy();
  });

  it('renders with event type fallback title when contact and company are missing', () => {
    const eventTypeReminder = {
      ...mockReminder,
      event: {
        ...mockReminder.event,
        contact: null,
        company: null,
        eventType: {
          id: 'et-1',
          name: 'Screening Call',
          translationKey: 'screeningCall',
          isSystemDefined: true,
        },
      },
    };
    const { getByText } = render(<ReminderInfoCard reminder={eventTypeReminder as any} />);
    expect(getByText('translated:followUpOn:translated:screeningCall')).toBeTruthy();
  });
});
