import { render } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { useSyncStatus } from '@job-tracker/data-access';
import { useBetaApproved } from '@job-tracker/hooks';

import { SyncIndicator } from './sync-indicator';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock @job-tracker/data-access
jest.mock('@job-tracker/data-access', () => ({
  useSyncStatus: jest.fn(),
}));

// Mock @job-tracker/hooks
jest.mock('@job-tracker/hooks', () => ({
  useBetaApproved: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, title, className }: any) => (
    <a href={href} title={title} className={className}>
      {children}
    </a>
  );
});

describe('SyncIndicator', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
    (useSession as jest.Mock).mockReturnValue({ data: null });
    (useSyncStatus as jest.Mock).mockReturnValue('synced');
    (useBetaApproved as jest.Mock).mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully in synced state', () => {
    const { getByText, getByTitle } = render(<SyncIndicator />);
    expect(getByText('synced')).toBeTruthy();
    expect(getByTitle('All changes backed up')).toBeTruthy();
  });

  it('should render syncing state', () => {
    (useSyncStatus as jest.Mock).mockReturnValue('syncing');
    const { getByText, getByTitle } = render(<SyncIndicator />);
    expect(getByText('syncing')).toBeTruthy();
    expect(getByTitle('Syncing changes...')).toBeTruthy();
  });

  it('should render error state with link', () => {
    (useSyncStatus as jest.Mock).mockReturnValue('error');
    const { getByRole, getByTitle } = render(<SyncIndicator />);
    const link = getByRole('link');
    expect(link.getAttribute('href')).toContain('/beta');
    expect(getByTitle('Sync error - Click to resolve')).toBeTruthy();
  });

  it('should render offline state without session as a link to sign in', () => {
    (useSyncStatus as jest.Mock).mockReturnValue('offline');
    (useSession as jest.Mock).mockReturnValue({ data: null });
    const { getByRole, getByTitle } = render(<SyncIndicator />);
    const link = getByRole('link');
    expect(link.getAttribute('href')).toContain('/auth/signin');
    expect(getByTitle('Click to enable Cloud Sync')).toBeTruthy();
  });

  it('should render offline state with session as a div', () => {
    (useSyncStatus as jest.Mock).mockReturnValue('offline');
    (useSession as jest.Mock).mockReturnValue({ data: { user: { name: 'Test' } } });
    const { queryByRole, getByTitle } = render(<SyncIndicator />);
    expect(queryByRole('link')).toBeNull();
    expect(getByTitle('Disconnected')).toBeTruthy();
  });

  it('should use beta URL if beta gate is enabled and user is not beta approved', () => {
    const originalEnv = process.env.NEXT_PUBLIC_ENABLE_BETA_GATE;
    process.env.NEXT_PUBLIC_ENABLE_BETA_GATE = 'true';
    (useSyncStatus as jest.Mock).mockReturnValue('offline');
    (useSession as jest.Mock).mockReturnValue({ data: null });
    (useBetaApproved as jest.Mock).mockReturnValue(false);

    const { getByRole } = render(<SyncIndicator />);
    const link = getByRole('link');
    expect(link.getAttribute('href')).toContain('/beta');

    process.env.NEXT_PUBLIC_ENABLE_BETA_GATE = originalEnv;
  });
});
