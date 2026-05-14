import { render } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import {
  useCompany,
  useContactWithCompany,
  useEventWithChildren,
  useReminder,
  useRoleWithCompany,
} from '@job-tracker/hooks';

import { Breadcrumbs } from './bread-crumbs';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

// Mock @job-tracker/hooks
jest.mock('@job-tracker/hooks', () => ({
  useCompany: jest.fn(),
  useContactWithCompany: jest.fn(),
  useRoleWithCompany: jest.fn(),
  useEventWithChildren: jest.fn(),
  useReminder: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

describe('Breadcrumbs', () => {
  const mockT = jest.fn((key, options) => options?.defaultValue ?? key);

  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard/settings');
    (useTranslations as jest.Mock).mockReturnValue(mockT);
    (useCompany as jest.Mock).mockReturnValue({ company: null, loading: false });
    (useContactWithCompany as jest.Mock).mockReturnValue({ contact: null, loading: false });
    (useRoleWithCompany as jest.Mock).mockReturnValue({ role: null, loading: false });
    (useEventWithChildren as jest.Mock).mockReturnValue({ event: null, loading: false });
    (useReminder as jest.Mock).mockReturnValue({ reminder: null, loading: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { getByText } = render(<Breadcrumbs />);
    expect(getByText(/dashboard/i)).toBeTruthy();
    expect(getByText(/settings/i)).toBeTruthy();
  });

  it('should handle locale prefix', () => {
    (usePathname as jest.Mock).mockReturnValue('/en-us/dashboard/settings');
    const { getByText, getAllByRole } = render(<Breadcrumbs />);
    expect(getByText(/dashboard/i)).toBeTruthy();
    expect(getByText(/settings/i)).toBeTruthy();
    const links = getAllByRole('link');
    expect(links[0].getAttribute('href')).toBe('/en-us/dashboard');
  });

  it('should resolve company name for UUID', () => {
    const companyId = '12345678-1234-1234-1234-1234567890ab';
    (usePathname as jest.Mock).mockReturnValue(`/companies/${companyId}`);
    (useCompany as jest.Mock).mockReturnValue({
      company: { name: 'Acme Corp' },
      loading: false,
    });

    const { getByText } = render(<Breadcrumbs />);
    expect(getByText('Acme Corp')).toBeTruthy();
    expect(useCompany).toHaveBeenCalledWith(companyId);
  });

  it('should resolve contact name for UUID', () => {
    const contactId = '12345678-1234-1234-1234-1234567890ab';
    (usePathname as jest.Mock).mockReturnValue(`/contacts/${contactId}`);
    (useContactWithCompany as jest.Mock).mockReturnValue({
      contact: { firstName: 'John', lastName: 'Doe' },
      loading: false,
    });

    const { getByText } = render(<Breadcrumbs />);
    expect(getByText('John Doe')).toBeTruthy();
    expect(useContactWithCompany).toHaveBeenCalledWith(contactId);
  });

  it('should resolve role title for UUID', () => {
    const roleId = '12345678-1234-1234-1234-1234567890ab';
    (usePathname as jest.Mock).mockReturnValue(`/roles/${roleId}`);
    (useRoleWithCompany as jest.Mock).mockReturnValue({
      role: { title: 'Software Engineer' },
      loading: false,
    });

    const { getByText } = render(<Breadcrumbs />);
    expect(getByText('Software Engineer')).toBeTruthy();
    expect(useRoleWithCompany).toHaveBeenCalledWith(roleId);
  });

  it('should fallback to UUID if entity not found', () => {
    const companyId = '12345678-1234-1234-1234-1234567890ab';
    (usePathname as jest.Mock).mockReturnValue(`/companies/${companyId}`);
    (useCompany as jest.Mock).mockReturnValue({
      company: null,
      loading: false,
    });

    const { getByText } = render(<Breadcrumbs />);
    expect(getByText(companyId)).toBeTruthy();
  });
});
