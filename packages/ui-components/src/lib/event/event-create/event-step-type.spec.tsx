import { render } from '@testing-library/react';

import { EventCategoryType } from '@job-tracker/domain';
import { EventTypeDTO } from '@job-tracker/validation';

import { EventStepType } from './event-step-type';

jest.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => {
    if (namespace === 'Enums') {
      if (key === 'all') return 'all';
      if (key === 'recent') return 'recent';
      return key;
    }
    return key;
  },
}));

// Mock PageLoading as it's not relevant for these tests
jest.mock('../../common/page-loading', () => ({
  __esModule: true,
  default: () => <div data-testid="page-loading" />,
}));

describe('EventStepType', () => {
  const eventTypes: EventTypeDTO[] = [
    {
      id: '1',
      name: 'Type 1',
      category: EventCategoryType.Application,
      isSystemDefined: false,
      isCommon: false,
    },
    {
      id: '2',
      name: 'Type 2',
      category: EventCategoryType.Interview,
      isSystemDefined: false,
      isCommon: true,
    },
    {
      id: '3',
      name: 'Type 3',
      category: EventCategoryType.Application,
      isSystemDefined: false,
      isCommon: false,
    },
  ];

  it('should move Recents to the end and All to the start', () => {
    const { getAllByRole } = render(
      <EventStepType
        eventTypes={eventTypes}
        recentEventTypeIds={['1']}
        loading={false}
        onSelect={jest.fn()}
      />,
    );

    const buttons = getAllByRole('button').filter((b) => b.className.includes('badge'));
    // CategoryKeys should be: All, Application, Interview, Recent
    expect(buttons[0].textContent).toBe('all');
    expect(buttons[buttons.length - 1].textContent).toBe('recent');
  });

  it('should default to the category of the selected event type', () => {
    const { getByText } = render(
      <EventStepType
        eventTypes={eventTypes}
        recentEventTypeIds={['1']}
        selectedTypeId="2"
        loading={false}
        onSelect={jest.fn()}
      />,
    );

    // Category Interview should be active (badge-primary)
    const categoryButton = getByText(`EventCategoryType.${EventCategoryType.Interview}`);
    expect(categoryButton.className).toContain('badge-primary');
  });

  it('should default to All if no selectedTypeId and no recents', () => {
    const { getByText } = render(
      <EventStepType
        eventTypes={eventTypes}
        recentEventTypeIds={[]}
        loading={false}
        onSelect={jest.fn()}
      />,
    );

    const allButton = getByText('all');
    expect(allButton.className).toContain('badge-primary');
  });

  it('should show all categories even if they have only one item', () => {
    const { queryByText } = render(
      <EventStepType
        eventTypes={eventTypes}
        recentEventTypeIds={[]}
        loading={false}
        onSelect={jest.fn()}
      />,
    );

    // Interview only has one item but should be shown as a category
    expect(queryByText(`EventCategoryType.${EventCategoryType.Interview}`)).toBeTruthy();
  });
});
