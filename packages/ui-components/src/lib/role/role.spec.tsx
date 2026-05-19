import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { useTranslations } from 'next-intl';

import { useUserSettings } from '@job-tracker/hooks';

import { RoleInfoCard } from './role-info-card';
import { RoleList } from './role-list';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

// Mock @job-tracker/hooks
jest.mock('@job-tracker/hooks', () => ({
  useUserSettings: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  );
});

// Mock child components
jest.mock('../common/data-display/base-info-card', () => {
  return ({ title, children, controls }: any) => (
    <div data-testid="base-info-card">
      <div data-testid="card-title">{title}</div>
      <div data-testid="card-controls">{controls}</div>
      {children}
    </div>
  );
});

jest.mock('../common/data-display/external-link', () => ({
  __esModule: true,
  default: ({ url }: any) => (url ? <div data-testid="external-link">{url}</div> : null),
}));

describe('Role components', () => {
  const mockT = jest.fn((key) => key);

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(mockT);
    (useUserSettings as jest.Mock).mockReturnValue({
      settings: { showInactiveRoles: false },
      updateSettings: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('RoleInfoCard', () => {
    const mockRole = {
      id: 'role-1',
      title: 'Software Engineer',
      level: 'Senior',
      location: 'Remote',
      salaryRange: '100k-150k',
      status: 'Applied',
      jobPostingUrl: 'https://example.com/job',
      company: { name: 'Acme Corp' },
    };

    const mockEvents = [{ id: 'evt-1', occurredAt: new Date('2023-01-01'), summary: 'Applied' }];

    it('should render role information successfully', () => {
      const { getByText, getByTestId } = render(
        <RoleInfoCard role={mockRole as any} events={mockEvents as any} />,
      );

      expect(getByTestId('card-title').textContent).toBe('Software Engineer');
      expect(getByText('Acme Corp')).toBeTruthy();
      expect(getByText('Senior')).toBeTruthy();
      expect(getByText('Remote')).toBeTruthy();
      expect(getByText('100k-150k')).toBeTruthy();
      expect(getByText('Applied')).toBeTruthy();
      expect(getByText('Recent Events')).toBeTruthy();
    });
  });

  describe('RoleList', () => {
    const mockActiveRoles = [{ id: '1', title: 'Role 1', events: [] }];
    const mockInactiveRoles = [{ id: '2', title: 'Role 2', events: [] }];

    it('should render active roles', () => {
      const { getByText } = render(<RoleList activeRoles={mockActiveRoles as any} />);
      expect(getByText('Role 1')).toBeTruthy();
    });

    it('should show inactive roles toggle and handle click', () => {
      const mockUpdateSettings = jest.fn();
      (useUserSettings as jest.Mock).mockReturnValue({
        settings: { showInactiveRoles: false },
        updateSettings: mockUpdateSettings,
      });

      const { getByText, getByRole } = render(
        <RoleList activeRoles={[]} inactiveRoles={mockInactiveRoles as any} />,
      );

      expect(getByText(/inactiveRoles/)).toBeTruthy();
      fireEvent.click(getByRole('button'));
      expect(mockUpdateSettings).toHaveBeenCalledWith({ showInactiveRoles: true });
    });

    it('should render empty message when no roles', () => {
      const { getByText } = render(<RoleList activeRoles={[]} />);
      expect(getByText('noRolesFound')).toBeTruthy();
    });
  });
});
