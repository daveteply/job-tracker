import { act, fireEvent, render, screen } from '@testing-library/react';

import { ToastProvider, useToast } from './toast-context';

const TestComponent = () => {
  const { showToast } = useToast();
  return <button onClick={() => showToast('Test Message', 'success')}>Show Toast</button>;
};

describe('ToastProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should show toast when showToast is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Show Toast'));

    expect(screen.getByText('Test Message')).toBeTruthy();
    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('alert-success');
  });

  it('should hide toast after 3 seconds (start fade out)', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Test Message')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // It should have opacity-0 class now
    const toastContainer = screen.getByText('Test Message').closest('.toast');
    expect(toastContainer?.className).toContain('opacity-0');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.queryByText('Test Message')).toBeNull();
  });

  it('should dismiss toast immediately when close button is clicked', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Test Message')).toBeTruthy();

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Test Message')).toBeNull();
  });
});
