import { render } from '@testing-library/react';
import { useTranslations } from 'next-intl';

import { ReminderList } from './reminder-list';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

// Mock ReminderInfoCard
jest.mock('./reminder-info-card', () => {
  return ({ reminder }: any) => <div data-testid="reminder-card">{reminder.id}</div>;
});

describe('ReminderList', () => {
  const mockT = jest.fn((key) => `translated:${key}`);

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(mockT);
  });

  it('renders a list of reminders', () => {
    const mockReminders = [{ id: 'rem-1' }, { id: 'rem-2' }] as any;

    const { getAllByTestId } = render(<ReminderList reminders={mockReminders} />);
    const cards = getAllByTestId('reminder-card');
    expect(cards).toHaveLength(2);
    expect(cards[0].textContent).toBe('rem-1');
    expect(cards[1].textContent).toBe('rem-2');
  });

  it('renders empty message when no reminders', () => {
    const { getByText } = render(<ReminderList reminders={[]} />);
    expect(getByText('translated:noRemindersFound')).toBeTruthy();
  });

  it('renders custom empty message', () => {
    const { getByText } = render(
      <ReminderList reminders={[]} noRemindersMessage="Custom Empty Message" />,
    );
    expect(getByText('Custom Empty Message')).toBeTruthy();
  });
});
