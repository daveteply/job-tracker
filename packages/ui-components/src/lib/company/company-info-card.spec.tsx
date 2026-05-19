import React from 'react';

import { render } from '@testing-library/react';

import { useUserSettings } from '@job-tracker/hooks';

import { CompanyInfoCard } from './company-info-card';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  );
});

// Mock @job-tracker/hooks
jest.mock('@job-tracker/hooks', () => ({
  useUserSettings: jest.fn(),
}));

// Mock child components to isolate CompanyInfoCard
jest.mock('../common/data-display/base-info-card', () => {
  return ({ title, children, header, controls, detailsUrl }: any) => (
    <div data-testid="base-info-card">
      <div data-testid="card-title">{title}</div>
      <div data-testid="card-header">{header}</div>
      <div data-testid="card-controls">{controls}</div>
      <div data-testid="card-details-url">{detailsUrl}</div>
      {children}
    </div>
  );
});

jest.mock('../common/data-display/external-link', () => {
  return ({ url }: any) => <div data-testid="external-link">{url}</div>;
});

describe('CompanyInfoCard', () => {
  const mockCompany = {
    id: 'comp-1',
    name: 'Acme Corp',
    website: 'https://acme.com',
    industry: 'Software',
    sizeRange: '100-500',
    notes: 'Some notes',
  };

  const mockRoles = [
    { id: 'role-1', title: 'Software Engineer', status: 'Applied' },
    { id: 'role-2', title: 'Senior Engineer', status: 'Not Selected' }, // Not Selected is inactive
  ];

  const mockContacts = [{ id: 'cont-1', firstName: 'John', lastName: 'Doe', title: 'Recruiter' }];

  beforeEach(() => {
    (useUserSettings as jest.Mock).mockReturnValue({
      settings: { showInactiveRoles: false },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render basic company information', () => {
    const { getByText, getByTestId } = render(<CompanyInfoCard company={mockCompany} />);

    expect(getByTestId('card-title').textContent).toBe('Acme Corp');
    expect(getByText('Software')).toBeTruthy();
    expect(getByText('100-500')).toBeTruthy();
    expect(getByText('Some notes')).toBeTruthy();
    expect(getByTestId('external-link').textContent).toBe('https://acme.com');
  });

  it('should render roles and contacts', () => {
    const { getByText } = render(
      <CompanyInfoCard
        company={mockCompany}
        roles={mockRoles as any}
        contacts={mockContacts as any}
      />,
    );

    expect(getByText('Software Engineer')).toBeTruthy();
    expect(getByText('(Applied)')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('(Recruiter)')).toBeTruthy();
  });

  it('should filter inactive roles by default', () => {
    const { queryByText } = render(
      <CompanyInfoCard company={mockCompany} roles={mockRoles as any} />,
    );

    expect(queryByText('Senior Engineer')).toBeNull();
  });

  it('should show inactive roles if settings allow', () => {
    (useUserSettings as jest.Mock).mockReturnValue({
      settings: { showInactiveRoles: true },
    });

    const { getByText } = render(
      <CompanyInfoCard company={mockCompany} roles={mockRoles as any} />,
    );

    expect(getByText('Senior Engineer')).toBeTruthy();
  });

  it('should show controls when showControls and showFull are true', () => {
    const { getByTestId } = render(
      <CompanyInfoCard company={mockCompany} showControls={true} showFull={true} />,
    );
    const controls = getByTestId('card-controls');
    expect(controls.querySelector('a[href="/companies/comp-1/edit"]')).toBeTruthy();
    expect(controls.querySelector('a[href="/companies/comp-1/delete"]')).toBeTruthy();
  });

  it('should hide controls when showControls is false', () => {
    const { getByTestId } = render(<CompanyInfoCard company={mockCompany} showControls={false} />);
    expect(getByTestId('card-controls').textContent).toBe('');
  });
});
