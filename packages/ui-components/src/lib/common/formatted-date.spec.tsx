import { render } from '@testing-library/react';
import { FormattedDate } from './formatted-date';

describe('FormattedDate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should show "yesterday" for an event from the previous day, even if less than 12 hours ago', () => {
    // Current time: Mar 12, 10:00 AM local
    jest.setSystemTime(new Date(2026, 2, 12, 10, 0, 0));
    // Event time: Mar 11, 11:00 PM local (11 hours ago)
    const eventDate = new Date(2026, 2, 11, 23, 0, 0);

    const { getByText } = render(<FormattedDate dateValue={eventDate} useRelativeTime={true} />);

    expect(getByText('yesterday')).toBeTruthy();
  });

  it('should show "tomorrow" for an event in the next day, even if less than 12 hours away', () => {
    // Current time: Mar 12, 10:00 PM local
    jest.setSystemTime(new Date(2026, 2, 12, 22, 0, 0));
    // Event time: Mar 13, 01:00 AM local (3 hours away)
    const eventDate = new Date(2026, 2, 13, 1, 0, 0);

    const { getByText } = render(<FormattedDate dateValue={eventDate} useRelativeTime={true} />);

    expect(getByText('tomorrow')).toBeTruthy();
  });

  it('should show "today" for an event from earlier today', () => {
    // Current time: Mar 12, 10:00 PM local
    jest.setSystemTime(new Date(2026, 2, 12, 22, 0, 0));
    // Event time: Mar 12, 01:00 AM local
    const eventDate = new Date(2026, 2, 12, 1, 0, 0);

    const { getByText } = render(<FormattedDate dateValue={eventDate} useRelativeTime={true} />);

    expect(getByText('today')).toBeTruthy();
  });

  it('should show "2 days ago" for an event from two days ago', () => {
    // Current time: Mar 12, 10:00 AM local
    jest.setSystemTime(new Date(2026, 2, 12, 10, 0, 0));
    // Event time: Mar 10, 10:00 AM local
    const eventDate = new Date(2026, 2, 10, 10, 0, 0);

    const { getByText } = render(<FormattedDate dateValue={eventDate} useRelativeTime={true} />);

    expect(getByText('2 days ago')).toBeTruthy();
  });
});
