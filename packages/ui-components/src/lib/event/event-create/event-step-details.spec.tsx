import { FormProvider, useForm } from 'react-hook-form';

import { fireEvent, render } from '@testing-library/react';
import { useTranslations } from 'next-intl';

import { EventStepDetails } from './event-step-details';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

// Mock EventSummaryGenerator
jest.mock('../event-summary-generator', () => () => <div data-testid="summary-generator" />);

const Wrapper = ({ children, defaultValues }: any) => {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('EventStepDetails', () => {
  const mockT = jest.fn((key) => key);
  const mockTEnum = jest.fn((key) => key);

  beforeEach(() => {
    (useTranslations as jest.Mock).mockImplementation((ns) => {
      if (ns === 'Events') return mockT;
      if (ns === 'Enums') return mockTEnum;
      return mockT;
    });
  });

  it('renders successfully', () => {
    const { getByText, getByTestId } = render(
      <Wrapper>
        <EventStepDetails
          register={jest.fn() as any}
          watch={jest.fn() as any}
          setValue={jest.fn() as any}
        />
      </Wrapper>,
    );

    expect(getByText('detailsTitle')).toBeTruthy();
    expect(getByTestId('summary-generator')).toBeTruthy();
  });

  it('allows selecting direction and source', () => {
    const mockSetValue = jest.fn();
    const { getByText } = render(
      <Wrapper defaultValues={{ direction: 'Inbound', source: 'Direct' }}>
        <EventStepDetails
          register={jest.fn() as any}
          watch={((name: string) => (name === 'direction' ? 'Inbound' : 'Direct')) as any}
          setValue={mockSetValue}
        />
      </Wrapper>,
    );

    // Direction buttons
    fireEvent.click(getByText('DirectionType.Outbound'));
    expect(mockSetValue).toHaveBeenCalledWith('direction', 'Outbound', expect.any(Object));

    // Source buttons
    fireEvent.click(getByText('SourceType.Referral'));
    expect(mockSetValue).toHaveBeenCalledWith('source', 'Referral', expect.any(Object));
  });
});
