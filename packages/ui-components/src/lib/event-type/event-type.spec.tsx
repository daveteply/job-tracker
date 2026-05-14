import { fireEvent, render } from '@testing-library/react';
import { useTranslations } from 'next-intl';

import { EventTypeInfoCard } from './event-type-info-card';
import { EventTypeSelect } from './event-type-select';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

// Mock BaseInfoCard
jest.mock('../common/data-display/base-info-card', () => {
  return ({ title, children }: any) => (
    <div data-testid="base-info-card">
      <div data-testid="card-title">{title}</div>
      {children}
    </div>
  );
});

describe('EventType components', () => {
  const mockT = jest.fn((key) => `translated:${key}`);

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(mockT);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('EventTypeInfoCard', () => {
    it('should render successfully', () => {
      const mockEventType = {
        id: '1',
        name: 'Interview',
        category: 'Interview',
        isSystemDefined: true,
      };
      const { getByTestId, getByText, getAllByText } = render(
        <EventTypeInfoCard eventType={mockEventType as any} />,
      );

      expect(getByTestId('card-title').textContent).toBe('Interview');
      expect(getAllByText('Interview')).toHaveLength(2); // title and category
      expect(getByText('System')).toBeTruthy();
    });
  });

  describe('EventTypeSelect', () => {
    const mockOptions = [
      { id: '1', name: 'Custom Event', isSystemDefined: false },
      { id: '2', name: 'System Event', isSystemDefined: true, translationKey: 'sys_event' },
    ];

    it('should render options and handle change', () => {
      const mockOnChange = jest.fn();
      const { getByRole, getAllByRole } = render(
        <EventTypeSelect options={mockOptions as any} onChange={mockOnChange} />,
      );

      const select = getByRole('combobox');
      expect(select).toBeTruthy();

      const options = getAllByRole('option');
      expect(options).toHaveLength(3); // placeholder + 2 options
      expect(options[1].textContent).toBe('Custom Event');
      expect(options[2].textContent).toBe('translated:sys_event');

      fireEvent.change(select, { target: { value: '1' } });
      expect(mockOnChange).toHaveBeenCalledWith('1');
    });

    it('should show loading state', () => {
      const { container } = render(
        <EventTypeSelect options={[]} onChange={jest.fn()} isLoading={true} />,
      );
      expect(container.querySelector('.loading')).toBeTruthy();
    });

    it('should show error message', () => {
      const { getByText } = render(
        <EventTypeSelect options={[]} onChange={jest.fn()} error="Required field" />,
      );
      expect(getByText('Required field')).toBeTruthy();
    });
  });
});
