import { fireEvent, render } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { BackButton } from './back-button';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

describe('BackButton', () => {
  const mockBack = jest.fn();
  const mockT = jest.fn((key) => key);

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      back: mockBack,
    });
    (useTranslations as jest.Mock).mockReturnValue(mockT);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { getByRole, getByText } = render(<BackButton />);
    expect(getByRole('button')).toBeTruthy();
    expect(getByText('back')).toBeTruthy();
    expect(useTranslations).toHaveBeenCalledWith('Common');
  });

  it('should call router.back() when clicked', () => {
    const { getByRole } = render(<BackButton />);
    const button = getByRole('button');
    fireEvent.click(button);
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
