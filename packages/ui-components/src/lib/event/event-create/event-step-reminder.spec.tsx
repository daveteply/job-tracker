import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { fireEvent, render } from '@testing-library/react';
import { useTranslations } from 'next-intl';

import { EventStepReminder } from './event-step-reminder';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

// Mock react-hook-form's useWatch
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useWatch: jest.fn(),
}));

// Mock hooks
jest.mock('@job-tracker/hooks', () => ({
  addDays: jest.fn((date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }),
  addBusinessDays: jest.fn((date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }),
  formatDateForInput: jest.fn((date) => date.toISOString().split('T')[0]),
}));

describe('EventStepReminder', () => {
  const mockT = jest.fn((key) => key);

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(mockT);
  });

  const TestComponent = ({ hasReminder, customSetValue }: any) => {
    (useWatch as jest.Mock).mockImplementation(({ name }) => {
        if (name === 'hasReminder') return hasReminder;
        return undefined;
    });

    const methods = useForm({ defaultValues: { hasReminder } });
    return (
      <FormProvider {...methods}>
        <EventStepReminder
          register={methods.register}
          control={methods.control}
          setValue={customSetValue || methods.setValue}
          errors={methods.formState.errors}
        />
      </FormProvider>
    );
  };

  it('renders successfully', () => {
    const { getByText } = render(<TestComponent hasReminder={false} />);
    expect(getByText('reminderTitle')).toBeTruthy();
    expect(getByText('createReminder')).toBeTruthy();
    expect(getByText('noReminderNote')).toBeTruthy();
  });

  it('shows reminder date input when checked', () => {
    const { getByText } = render(<TestComponent hasReminder={true} />);
    expect(getByText('remindMeOn')).toBeTruthy();
  });

  it('handles business day buttons', () => {
    const mockSetValue = jest.fn();
    const { getByText } = render(
      <TestComponent 
        hasReminder={true} 
        customSetValue={mockSetValue}
      />
    );

    fireEvent.click(getByText('fiveBusinessDays'));
    expect(mockSetValue).toHaveBeenCalledWith('remindAt', expect.any(String), expect.any(Object));

    fireEvent.click(getByText('tenBusinessDays'));
    expect(mockSetValue).toHaveBeenCalledWith('remindAt', expect.any(String), expect.any(Object));
  });
});
