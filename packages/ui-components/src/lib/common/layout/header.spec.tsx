import { fireEvent, render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { useBetaApproved } from '@job-tracker/hooks';

import { Header } from './header';

// Mock SyncIndicator
jest.mock('../feedback/sync-indicator', () => ({
  SyncIndicator: () => <div data-testid="sync-indicator">SyncIndicator</div>,
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

// Mock @job-tracker/hooks
jest.mock('@job-tracker/hooks', () => ({
  useBetaApproved: jest.fn(),
  useAvailableActions: () => [],
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      signIn: 'Enable Sync',
      settings: 'Settings',
      signOut: 'Sign Out',
      toggleMenu: 'Toggle menu',
      contacts: 'Contacts',
      reminders: 'Reminders',
      roles: 'Roles',
    };
    return translations[key] || key;
  },
}));

// Mock Link from next/link
jest.mock('next/link', () => {
  return ({
    children,
    href,
    onClick,
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
  }) => {
    return (
      <a href={href} onClick={onClick}>
        {children}
      </a>
    );
  };
});

describe('Header', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/current-path');
    (useSession as jest.Mock).mockReturnValue({ data: null, status: 'unauthenticated' });
    (useBetaApproved as jest.Mock).mockReturnValue(true);
  });

  it('renders title correctly', () => {
    render(<Header title="Test App" />);
    expect(screen.getByText('Test App')).toBeTruthy();
  });

  it('renders sign-in link with callbackUrl on mobile', () => {
    render(<Header title="Test App" />);
    const signinLinks = screen.getAllByRole('link', { name: /Enable Sync/i });
    // The mobile link is likely the second one if UserMenu also renders one for desktop
    const mobileSigninLink = signinLinks.find((link) =>
      link.getAttribute('href')?.includes('callbackUrl=%2Fcurrent-path'),
    );
    expect(mobileSigninLink).toBeTruthy();
    expect(mobileSigninLink?.getAttribute('href')).toBe('/auth/signin?callbackUrl=%2Fcurrent-path');
  });

  it('renders icon when iconSrc is provided', () => {
    render(<Header title="Test App" iconSrc="/icon.png" />);
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toBe('/icon.png');
  });

  it('links to home by default', () => {
    render(<Header title="Test App" />);
    const link = screen.getByRole('link', { name: /Test App/i });
    expect(link.getAttribute('href')).toBe('/home');
  });

  it('links to provided homeHref', () => {
    render(<Header title="Test App" homeHref="/custom-home" />);
    const link = screen.getByRole('link', { name: /Test App/i });
    expect(link.getAttribute('href')).toBe('/custom-home');
  });

  it('renders dashboard links when authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User', email: 'test@example.com' } },
      status: 'authenticated',
    });
    render(<Header title="Test App" />);

    // Dashboard links should be present (at least one for mobile, one for desktop)
    const contactsLinks = screen.getAllByText('Contacts');
    expect(contactsLinks.length).toBeGreaterThanOrEqual(1);

    const remindersLinks = screen.getAllByText('Reminders');
    expect(remindersLinks.length).toBeGreaterThanOrEqual(1);

    const rolesLinks = screen.getAllByText('Roles');
    expect(rolesLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('renders dashboard links when unauthenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
    render(<Header title="Test App" />);

    // Dashboard links should still be present
    const contactsLinks = screen.getAllByText('Contacts');
    expect(contactsLinks.length).toBeGreaterThanOrEqual(1);

    const remindersLinks = screen.getAllByText('Reminders');
    expect(remindersLinks.length).toBeGreaterThanOrEqual(1);

    const rolesLinks = screen.getAllByText('Roles');
    expect(rolesLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('toggles shadow on scroll', () => {
    render(<Header title="Test App" />);
    const header = screen.getByRole('banner');

    expect(header.className).toContain('shadow-none');

    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { value: 10, writable: true });
    fireEvent.scroll(window);

    expect(header.className).toContain('shadow-lg');

    // Scroll back
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    fireEvent.scroll(window);

    expect(header.className).toContain('shadow-none');
  });
});
