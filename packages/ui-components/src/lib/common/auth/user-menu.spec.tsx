import React from 'react';

import { render } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { useBetaApproved } from '@job-tracker/hooks';

import { UserMenu } from './user-menu';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

// Mock @job-tracker/hooks
jest.mock('@job-tracker/hooks', () => ({
  useBetaApproved: jest.fn(),
}));

// Mock DashboardMenuLinks
jest.mock('../navigation/dashboard-menu-links', () => ({
  DashboardMenuLinks: () => <div data-testid="dashboard-menu-links" />,
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

describe('UserMenu', () => {
  const mockT = jest.fn((key) => key);

  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/');
    (useSession as jest.Mock).mockReturnValue({ data: null, status: 'unauthenticated' });
    (useTranslations as jest.Mock).mockReturnValue(mockT);
    (useBetaApproved as jest.Mock).mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null, status: 'loading' });
    const { container } = render(<UserMenu />);
    expect(container.querySelector('.loading-spinner')).toBeTruthy();
  });

  it('should render sign in link when unauthenticated', () => {
    const { getByText } = render(<UserMenu />);
    expect(getByText('signIn')).toBeTruthy();
  });

  it('should render sign out button when authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User', email: 'test@example.com' } },
      status: 'authenticated',
    });
    const { getByText } = render(<UserMenu />);
    expect(getByText('signOut')).toBeTruthy();
    expect(getByText('Test User')).toBeTruthy();
    expect(getByText('test@example.com')).toBeTruthy();
  });

  it('should render dashboard menu links', () => {
    const { getByTestId } = render(<UserMenu />);
    expect(getByTestId('dashboard-menu-links')).toBeTruthy();
  });

  it('should render user avatar with initials if no image', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User' } },
      status: 'authenticated',
    });
    const { getByText } = render(<UserMenu />);
    expect(getByText('T')).toBeTruthy();
  });

  it('should render user image if provided', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User', image: 'https://example.com/image.png' } },
      status: 'authenticated',
    });
    const { getByAltText } = render(<UserMenu />);
    const img = getByAltText('Test User');
    expect(img.getAttribute('src')).toBe('https://example.com/image.png');
  });
});
