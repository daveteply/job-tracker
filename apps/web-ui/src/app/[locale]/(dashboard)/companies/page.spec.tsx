import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';

import { useCompaniesWithChildren, useGroupedCompanies } from '@job-tracker/hooks';

import CompaniesListPage from './page';

// Mock dependencies
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

jest.mock('@job-tracker/hooks', () => ({
  useCompaniesWithChildren: jest.fn(),
  useGroupedCompanies: jest.fn(),
}));

jest.mock('@job-tracker/ui-components', () => ({
  CompanyList: ({
    activeCompanies,
    inactiveCompanies,
  }: {
    activeCompanies: unknown[];
    inactiveCompanies: unknown[];
  }) => (
    <div data-testid="company-list">
      {activeCompanies.length} active, {inactiveCompanies.length} inactive
    </div>
  ),
  EmptyState: ({ title }: { title: string }) => <div data-testid="empty-state">{title}</div>,
  ListSkeleton: () => <div data-testid="list-skeleton">Loading...</div>,
  PageHeader: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

jest.mock('../../../../i18n/routing', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('CompaniesListPage', () => {
  const mockT = (key: string) => key;

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(mockT);
  });

  it('renders loading state', () => {
    (useCompaniesWithChildren as jest.Mock).mockReturnValue({
      companies: [],
      loading: true,
    });
    (useGroupedCompanies as jest.Mock).mockReturnValue({
      active: [],
      inactive: [],
    });

    render(<CompaniesListPage />);
    expect(screen.getByTestId('list-skeleton')).toBeTruthy();
  });

  it('renders empty state when no companies are found', () => {
    (useCompaniesWithChildren as jest.Mock).mockReturnValue({
      companies: [],
      loading: false,
    });
    (useGroupedCompanies as jest.Mock).mockReturnValue({
      active: [],
      inactive: [],
    });

    render(<CompaniesListPage />);
    expect(screen.getByTestId('empty-state')).toBeTruthy();
    expect(screen.getByText('noCompaniesFound')).toBeTruthy();
  });

  it('renders company list when companies are found', () => {
    const mockCompanies = [{ id: '1', name: 'Company 1' }];
    (useCompaniesWithChildren as jest.Mock).mockReturnValue({
      companies: mockCompanies,
      loading: false,
    });
    (useGroupedCompanies as jest.Mock).mockReturnValue({
      active: mockCompanies,
      inactive: [],
    });

    render(<CompaniesListPage />);
    expect(screen.getByTestId('company-list')).toBeTruthy();
    expect(screen.getByText('1 active, 0 inactive')).toBeTruthy();
  });
});
