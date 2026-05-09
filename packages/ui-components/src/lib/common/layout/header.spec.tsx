import { fireEvent, render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

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

// Mock Link from next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Header', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/current-path');
    (useSession as jest.Mock).mockReturnValue({ data: null, status: 'unauthenticated' });
  });

  it('renders title correctly', () => {
    render(<Header title="Test App" />);
    expect(screen.getByText('Test App')).toBeTruthy();
  });

  it('renders sign-in link with callbackUrl on mobile', () => {
    render(<Header title="Test App" />);
    const signinLinks = screen.getAllByRole('link', { name: /Sign In/i });
    // The mobile link is likely the second one if AuthMenu also renders one for desktop
    // But in tests, they might both be present.
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
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/home');
  });

  it('links to provided homeHref', () => {
    render(<Header title="Test App" homeHref="/custom-home" />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/custom-home');
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
