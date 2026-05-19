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
        role={null}
        company={null}
        currentSource=""
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
        role={{ title: 'Engineer' } as any}
        company={{ name: 'Acme' } as any}
        currentSource="Email"
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
        role={{ title: 'Engineer' } as any}
        company={{ name: 'Acme' } as any}
        currentSource="Email"
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
        currentSource="Email"
        currentDirection="Inbound"
        role={null}
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
        currentSource="Email"
        currentDirection="Outbound"
        role={null}
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
        role={{ title: 'Engineer' } as any}
        company={{ name: 'Acme' } as any}
        currentSource="Email"
        setValue={mockSetValue}
        autoGenerate={true}
      />,
    );

    expect(mockSetValue).toHaveBeenCalled();
  });
});
