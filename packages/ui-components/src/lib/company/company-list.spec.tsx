import { fireEvent, render } from '@testing-library/react';
import { useTranslations } from 'next-intl';

import { useUserSettings } from '@job-tracker/hooks';

import { CompanyList } from './company-list';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

// Mock @job-tracker/hooks
jest.mock('@job-tracker/hooks', () => ({
  useUserSettings: jest.fn(),
}));

// Mock CompanyInfoCard
jest.mock('./company-info-card', () => {
  return ({ company }: any) => <div data-testid="company-card">{company.name}</div>;
});

describe('CompanyList', () => {
  const mockT = jest.fn((key) => key);
  const mockUpdateSettings = jest.fn();

  const mockActiveCompanies = [{ id: '1', name: 'Active Corp', roles: [], contacts: [] }];

  const mockInactiveCompanies = [{ id: '2', name: 'Inactive Corp', roles: [], contacts: [] }];

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(mockT);
    (useUserSettings as jest.Mock).mockReturnValue({
      settings: { showInactiveRoles: false },
      updateSettings: mockUpdateSettings,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render active companies', () => {
    const { getByText, getAllByTestId } = render(
      <CompanyList activeCompanies={mockActiveCompanies as any} />,
    );
    expect(getByText('Active Corp')).toBeTruthy();
    expect(getAllByTestId('company-card')).toHaveLength(1);
  });

  it('should render empty message when no companies', () => {
    const { getByText } = render(<CompanyList activeCompanies={[]} />);
    expect(getByText('noCompaniesFound')).toBeTruthy();
  });

  it('should render custom empty message', () => {
    const { getByText } = render(
      <CompanyList activeCompanies={[]} noCompaniesMessage="Nothing here" />,
    );
    expect(getByText('Nothing here')).toBeTruthy();
  });

  it('should show inactive companies toggle when inactive companies exist', () => {
    const { getByText } = render(
      <CompanyList activeCompanies={[]} inactiveCompanies={mockInactiveCompanies as any} />,
    );
    expect(getByText('inactiveCompanies (1)')).toBeTruthy();
  });

  it('should not show inactive companies by default', () => {
    const { queryByText } = render(
      <CompanyList activeCompanies={[]} inactiveCompanies={mockInactiveCompanies as any} />,
    );
    expect(queryByText('Inactive Corp')).toBeNull();
  });

  it('should show inactive companies when settings allow', () => {
    (useUserSettings as jest.Mock).mockReturnValue({
      settings: { showInactiveRoles: true },
      updateSettings: mockUpdateSettings,
    });

    const { getByText } = render(
      <CompanyList activeCompanies={[]} inactiveCompanies={mockInactiveCompanies as any} />,
    );
    expect(getByText('Inactive Corp')).toBeTruthy();
  });

  it('should call updateSettings when toggle button is clicked', () => {
    const { getByRole } = render(
      <CompanyList activeCompanies={[]} inactiveCompanies={mockInactiveCompanies as any} />,
    );
    const toggleButton = getByRole('button');
    fireEvent.click(toggleButton);
    expect(mockUpdateSettings).toHaveBeenCalledWith({ showInactiveRoles: true });
  });
});
