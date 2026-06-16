import { fireEvent, render } from '@testing-library/react';
import { useTranslations } from 'next-intl';

import { EventSummaryGenerator } from './event-summary-generator';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

describe('EventSummaryGenerator', () => {
  const mockT = jest.fn((key) => key);
  const mockSetValue = jest.fn();

  const mockEventTypes = [
    {
      id: '1',
      name: 'Interview',
      category: 'Interview',
      isSystemDefined: true,
      translationKey: 'interview',
    },
    {
      id: '2',
      name: 'Email',
      category: 'Communication',
      isSystemDefined: true,
      translationKey: 'email',
    },
  ];

  const mockSourceTypes = [
    {
      id: 's1',
      name: 'Email',
      isSystemDefined: true,
    },
  ];

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(mockT);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not render if cannot generate summary', () => {
    const { container } = render(
      <EventSummaryGenerator
        eventTypeId={null}
        jobRole={null}
        company={null}
        sourceTypeId={null}
        setValue={mockSetValue}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render button if enough info is provided', () => {
    const { getByRole } = render(
      <EventSummaryGenerator
        eventTypeId="1"
        eventTypes={mockEventTypes as any}
        jobRole={{ title: 'Engineer' } as any}
        company={{ name: 'Acme' } as any}
        sourceTypeId="s1"
        sourceTypes={mockSourceTypes as any}
        setValue={mockSetValue}
      />,
    );
    expect(getByRole('button')).toBeTruthy();
  });

  it('should calculate and set summary when button is clicked', () => {
    const { getByRole } = render(
      <EventSummaryGenerator
        eventTypeId="1"
        eventTypes={mockEventTypes as any}
        jobRole={{ title: 'Engineer' } as any}
        company={{ name: 'Acme' } as any}
        sourceTypeId="s1"
        sourceTypes={mockSourceTypes as any}
        setValue={mockSetValue}
      />,
    );

    fireEvent.click(getByRole('button'));

    expect(mockSetValue).toHaveBeenCalledWith(
      'summary',
      expect.stringContaining('interview'),
      expect.anything(),
    );
    expect(mockSetValue).toHaveBeenCalledWith(
      'summary',
      expect.stringContaining('for Engineer'),
      expect.anything(),
    );
    expect(mockSetValue).toHaveBeenCalledWith(
      'summary',
      expect.stringContaining('at Acme'),
      expect.anything(),
    );
    expect(mockSetValue).toHaveBeenCalledWith(
      'summary',
      expect.stringContaining('via SourceType.Email'),
      expect.anything(),
    );
  });

  it('should handle communication category correctly for Inbound direction', () => {
    const { getByRole } = render(
      <EventSummaryGenerator
        eventTypeId="2"
        eventTypes={mockEventTypes as any}
        contact={{ firstName: 'John', lastName: 'Doe' } as any}
        sourceTypeId="s1"
        sourceTypes={mockSourceTypes as any}
        currentDirection="Inbound"
        jobRole={null}
        company={null}
        setValue={mockSetValue}
      />,
    );

    fireEvent.click(getByRole('button'));
    expect(mockSetValue).toHaveBeenCalledWith(
      'summary',
      expect.stringContaining('from John Doe'),
      expect.anything(),
    );
  });

  it('should handle communication category correctly for Outbound direction', () => {
    const { getByRole } = render(
      <EventSummaryGenerator
        eventTypeId="2"
        eventTypes={mockEventTypes as any}
        contact={{ firstName: 'John', lastName: 'Doe' } as any}
        sourceTypeId="s1"
        sourceTypes={mockSourceTypes as any}
        currentDirection="Outbound"
        jobRole={null}
        company={null}
        setValue={mockSetValue}
      />,
    );

    fireEvent.click(getByRole('button'));
    expect(mockSetValue).toHaveBeenCalledWith(
      'summary',
      expect.stringContaining('to John Doe'),
      expect.anything(),
    );
  });

  it('should autogenerate summary if autoGenerate is true', () => {
    render(
      <EventSummaryGenerator
        eventTypeId="1"
        eventTypes={mockEventTypes as any}
        jobRole={{ title: 'Engineer' } as any}
        company={{ name: 'Acme' } as any}
        sourceTypeId="s1"
        sourceTypes={mockSourceTypes as any}
        setValue={mockSetValue}
        autoGenerate={true}
      />,
    );

    expect(mockSetValue).toHaveBeenCalled();
  });
});
