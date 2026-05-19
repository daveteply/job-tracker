import { render } from '@testing-library/react';
import { useTranslations } from 'next-intl';

import { EventList } from './event-list';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

// Mock EventInfoCard
jest.mock('./event-info-card', () => {
  return ({ event }: any) => <div data-testid="event-card">{event.id}</div>;
});

describe('EventList', () => {
  const mockT = jest.fn((key) => key);

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(mockT);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render event cards', () => {
    const mockEvents = [{ id: '1' }, { id: '2' }];
    const { getAllByTestId } = render(<EventList events={mockEvents as any} />);
    expect(getAllByTestId('event-card')).toHaveLength(2);
  });

  it('should render empty message when no events', () => {
    const { getByText } = render(<EventList events={[]} />);
    expect(getByText('noEventsFound')).toBeTruthy();
  });

  it('should render custom empty message', () => {
    const { getByText } = render(<EventList events={[]} noEventsMessage="No events yet" />);
    expect(getByText('No events yet')).toBeTruthy();
  });
});
