import { render } from '@testing-library/react';
import { useTranslations } from 'next-intl';

import { DirectionType } from '@job-tracker/domain';

import { EventInfoCard } from './event-info-card';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

// Mock child components
jest.mock('../common/data-display/base-info-card', () => {
  return ({ title, children, controls }: any) => (
    <div data-testid="base-info-card">
      <div data-testid="card-title">{title}</div>
      <div data-testid="card-controls">{controls}</div>
      {children}
    </div>
  );
});

jest.mock('../common/data-display/external-link', () => ({
  __esModule: true,
  default: ({ url }: any) => (url ? <div data-testid="external-link">{url}</div> : null),
}));

jest.mock('../common/data-display/formatted-date', () => ({
  __esModule: true,
  default: ({ dateValue }: any) => <div data-testid="formatted-date">{dateValue.toString()}</div>,
}));

jest.mock('./event-action-menu', () => ({
  __esModule: true,
  default: ({ id }: any) => <div data-testid="event-action-menu">{id}</div>,
}));

describe('EventInfoCard', () => {
  const mockT = jest.fn((key) => key);

  const mockEvent = {
    id: 'evt-1',
    occurredAt: new Date('2023-01-01'),
    direction: DirectionType.Inbound,
    eventType: {
      name: 'Interview',
      category: 'Interview',
      isSystemDefined: true,
      translationKey: 'interview',
    },
    company: { name: 'Acme Corp' },
    role: { title: 'Engineer' },
    contact: { firstName: 'John', lastName: 'Doe' },
    summary: 'Initial interview',
    details: 'Via Zoom',
    reminders: [{ id: 'rem-1', remindAt: new Date('2023-01-02'), completedAt: null }],
  };

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(mockT);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render event information successfully', () => {
    const { getByText, getByTestId } = render(<EventInfoCard event={mockEvent as any} />);

    expect(getByText('interview')).toBeTruthy();
    expect(getByText('DirectionType.Inbound')).toBeTruthy();
    expect(getByText('Acme Corp')).toBeTruthy();
    expect(getByText('Engineer')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Initial interview')).toBeTruthy();
    expect(getByText('Via Zoom')).toBeTruthy();
    expect(getByTestId('event-action-menu')).toBeTruthy();
  });

  it('should render reminders when showReminders is true', () => {
    const { getByText } = render(<EventInfoCard event={mockEvent as any} showReminders={true} />);
    expect(getByText('Reminders')).toBeTruthy();
  });

  it('should hide reminders when showReminders is false', () => {
    const { queryByText } = render(
      <EventInfoCard event={mockEvent as any} showReminders={false} />,
    );
    expect(queryByText('Reminders')).toBeNull();
  });

  it('should render outbound direction correctly', () => {
    const outboundEvent = { ...mockEvent, direction: DirectionType.Outbound };
    const { getByText } = render(<EventInfoCard event={outboundEvent as any} />);
    expect(getByText('DirectionType.Outbound')).toBeTruthy();
  });
});
