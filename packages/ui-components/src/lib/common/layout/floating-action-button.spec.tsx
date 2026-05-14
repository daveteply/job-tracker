import { fireEvent, render, waitFor } from '@testing-library/react';
import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useAvailableActions } from '@job-tracker/hooks';

import { useFloatingUI } from '../context/floating-ui-context';

import { FloatingActionButton } from './floating-action-button';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useParams: jest.fn(),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

// Mock @job-tracker/hooks
jest.mock('@job-tracker/hooks', () => ({
  useAvailableActions: jest.fn(),
}));

// Mock ../context/floating-ui-context
jest.mock('../context/floating-ui-context', () => ({
  useFloatingUI: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, onClick, 'aria-label': ariaLabel }: any) => (
    <a href={href} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </a>
  );
});

describe('FloatingActionButton', () => {
  const mockT = jest.fn((key) => key);
  const mockActions = [{ id: 'action-1', nameKey: 'action1', iconName: 'PhoneIcon' }];

  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
    (useParams as jest.Mock).mockReturnValue({});
    (useTranslations as jest.Mock).mockReturnValue(mockT);
    (useAvailableActions as jest.Mock).mockReturnValue(mockActions);
    (useFloatingUI as jest.Mock).mockReturnValue({ isContainerActive: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully and be closed by default', () => {
    const { getByLabelText, queryByText } = render(<FloatingActionButton />);
    expect(getByLabelText('toggleMenu')).toBeTruthy();
    expect(queryByText('newEvent')).toBeNull();
  });

  it('should open menu when clicked', async () => {
    const { getByLabelText, getByText } = render(<FloatingActionButton />);
    fireEvent.click(getByLabelText('toggleMenu'));

    await waitFor(() => {
      expect(getByText('newEvent')).toBeTruthy();
      expect(getByText('action1')).toBeTruthy();
    });
  });

  it('should construct correct event URL with context', async () => {
    (usePathname as jest.Mock).mockReturnValue('/roles/123');
    (useParams as jest.Mock).mockReturnValue({ id: '123' });

    const { getByLabelText, getByRole } = render(<FloatingActionButton />);
    fireEvent.click(getByLabelText('toggleMenu'));

    await waitFor(() => {
      const newEventLink = getByRole('link', { name: 'newEvent' });
      expect(newEventLink.getAttribute('href')).toBe('/events/new?roleId=123');

      const actionLink = getByRole('link', { name: 'action1' });
      expect(actionLink.getAttribute('href')).toBe('/events/new?roleId=123&action=action-1');
    });
  });

  it('should close menu when a link is clicked', async () => {
    const { getByLabelText, getByRole, queryByText } = render(<FloatingActionButton />);
    fireEvent.click(getByLabelText('toggleMenu'));

    await waitFor(() => {
      const newEventLink = getByRole('link', { name: 'newEvent' });
      fireEvent.click(newEventLink);
    });

    expect(queryByText('newEvent')).toBeNull();
  });

  it('should not render if container is active', () => {
    (useFloatingUI as jest.Mock).mockReturnValue({ isContainerActive: true });
    const { container } = render(<FloatingActionButton />);
    expect(container.firstChild).toBeNull();
  });
});
