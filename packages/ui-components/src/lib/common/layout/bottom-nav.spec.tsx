import { render } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { BottomNav } from './bottom-nav';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  );
});

describe('BottomNav', () => {
  const mockT = jest.fn((key) => key);

  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/home');
    (useTranslations as jest.Mock).mockReturnValue(mockT);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { getByText } = render(<BottomNav />);
    expect(getByText('home')).toBeTruthy();
    expect(getByText('pipeline')).toBeTruthy();
    expect(getByText('activity')).toBeTruthy();
    expect(getByText('companies')).toBeTruthy();
  });

  it('should highlight the active link', () => {
    (usePathname as jest.Mock).mockReturnValue('/pipeline');
    const { getByText } = render(<BottomNav />);
    const pipelineLink = getByText('pipeline').closest('a');
    const homeLink = getByText('home').closest('a');

    expect(pipelineLink?.className).toContain('bg-primary');
    expect(homeLink?.className).not.toContain('bg-primary');
  });

  it('should highlight parent route as active', () => {
    (usePathname as jest.Mock).mockReturnValue('/pipeline/123');
    const { getByText } = render(<BottomNav />);
    const pipelineLink = getByText('pipeline').closest('a');
    expect(pipelineLink?.className).toContain('bg-primary');
  });
});
