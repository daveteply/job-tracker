import { fireEvent, render } from '@testing-library/react';

import { ErrorView } from './error-view';

describe('ErrorView', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <ErrorView title="Error Title" description="Error Description" />,
    );
    expect(baseElement).toBeTruthy();
    expect(getByText('Error Title')).toBeTruthy();
    expect(getByText('Error Description')).toBeTruthy();
  });

  it('should call onReset when try again button is clicked', () => {
    const onReset = jest.fn();
    const { getByText } = render(
      <ErrorView title="Error" description="Desc" tryAgainText="Try Again" onReset={onReset} />,
    );
    fireEvent.click(getByText('Try Again'));
    expect(onReset).toHaveBeenCalled();
  });

  it('should call onBackHome when back home button is clicked', () => {
    const onBackHome = jest.fn();
    const { getByText } = render(
      <ErrorView title="Error" description="Desc" backHomeText="Go Home" onBackHome={onBackHome} />,
    );
    fireEvent.click(getByText('Go Home'));
    expect(onBackHome).toHaveBeenCalled();
  });

  it('should log error to console when provided', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      /* no-op */
    });
    const error = new Error('Test Error');
    render(<ErrorView title="Error" description="Desc" error={error} />);
    expect(consoleSpy).toHaveBeenCalledWith(error);
    consoleSpy.mockRestore();
  });
});
