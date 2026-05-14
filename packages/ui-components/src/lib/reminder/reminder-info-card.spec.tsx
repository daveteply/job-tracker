import { render } from '@testing-library/react';
import { useTranslations } from 'next-intl';

import { ReminderWithChildrenDTO } from '@job-tracker/validation';

import { ReminderInfoCard } from './reminder-info-card';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
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
  const mockT = jest.fn((key) => `translated:${key}`);

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

    expect(getByText('Interview Reminder')).toBeTruthy();
    expect(getByText('John Doe @ Tech Corp')).toBeTruthy();
    expect(getByTestId('formatted-date')).toBeTruthy();
    expect(getByTestId('base-info-card').getAttribute('data-url')).toBe('/reminders/rem-1');
  });

  it('renders with fallback title when summary is missing', () => {
    const minimalReminder = {
      ...mockReminder,
      event: {
        ...mockReminder.event,
        summary: '',
      },
    };
    const { getByText } = render(<ReminderInfoCard reminder={minimalReminder as any} />);
    expect(getByText('Follow up')).toBeTruthy();
  });

  it('renders without contact or company info', () => {
    const reminderWithoutContext = {
      ...mockReminder,
      event: {
        id: 'evt-1',
        summary: 'Just a reminder',
      },
    };
    const { getByText, queryByText } = render(
      <ReminderInfoCard reminder={reminderWithoutContext as any} />,
    );

    expect(getByText('Just a reminder')).toBeTruthy();
    expect(queryByText(/John Doe/)).toBeNull();
    expect(queryByText(/Tech Corp/)).toBeNull();
  });
});
