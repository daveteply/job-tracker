import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './header';

// Mock SyncIndicator
jest.mock('./sync-indicator', () => ({
  SyncIndicator: () => <div data-testid="sync-indicator">SyncIndicator</div>,
}));

// Mock Link from next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Header', () => {
  it('renders title correctly', () => {
    render(<Header title="Test App" />);
    expect(screen.getByText('Test App')).toBeTruthy();
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
