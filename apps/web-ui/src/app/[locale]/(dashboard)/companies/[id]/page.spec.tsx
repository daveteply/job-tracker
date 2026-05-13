import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';

import { useCompany, useContactsByCompany, useRolesByCompany } from '@job-tracker/hooks';

import CompanyDetailPage from './page';

// Mocking use from react
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: (promise: Promise<{ id: string }>) => {
    // In tests, we can just return the resolved value if it's already resolved or mock it
    return { id: 'test-id' };
  },
}));

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

jest.mock('@job-tracker/hooks', () => ({
  useCompany: jest.fn(),
  useContactsByCompany: jest.fn(),
  useRolesByCompany: jest.fn(),
}));

jest.mock('@job-tracker/ui-components', () => ({
  CompanyInfoCard: ({ company }: { company: { name: string } }) => (
    <div data-testid="company-card">{company.name}</div>
  ),
  PageHeader: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      {children}
    </div>
  ),
  PageLoading: ({ entityName }: { entityName: string }) => (
    <div data-testid="page-loading">Loading {entityName}...</div>
  ),
}));

jest.mock('../../../../../i18n/routing', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('CompanyDetailPage', () => {
  const mockT = (key: string) => key;

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(mockT);
  });

  it('renders loading state', () => {
    (useCompany as jest.Mock).mockReturnValue({ company: null, loading: true });
    (useRolesByCompany as jest.Mock).mockReturnValue({ roles: [], loading: true });
    (useContactsByCompany as jest.Mock).mockReturnValue({ contacts: [], loading: true });

    render(<CompanyDetailPage params={Promise.resolve({ id: '1' })} />);
    expect(screen.getByTestId('page-loading')).toBeTruthy();
  });

  it('renders company not found state', () => {
    (useCompany as jest.Mock).mockReturnValue({ company: null, loading: false });
    (useRolesByCompany as jest.Mock).mockReturnValue({ roles: [], loading: false });
    (useContactsByCompany as jest.Mock).mockReturnValue({ contacts: [], loading: false });

    render(<CompanyDetailPage params={Promise.resolve({ id: '1' })} />);
    expect(screen.getByText('companyNotFound')).toBeTruthy();
  });

  it('renders company details correctly', () => {
    const mockCompany = { id: '1', name: 'Test Company' };
    (useCompany as jest.Mock).mockReturnValue({ company: mockCompany, loading: false });
    (useRolesByCompany as jest.Mock).mockReturnValue({ roles: [], loading: false });
    (useContactsByCompany as jest.Mock).mockReturnValue({ contacts: [], loading: false });

    render(<CompanyDetailPage params={Promise.resolve({ id: '1' })} />);
    expect(screen.getByTestId('company-card')).toBeTruthy();
    expect(screen.getByText('Test Company')).toBeTruthy();
    expect(screen.getByText('companyDetails')).toBeTruthy();
  });
});
