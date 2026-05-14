import React from 'react';

import { render } from '@testing-library/react';

import { ContactInfoCard } from './contact-info-card';

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
  return ({ title, children, header, controls }: any) => (
    <div data-testid="base-info-card">
      <div data-testid="card-title">{title}</div>
      <div data-testid="card-header">{header}</div>
      <div data-testid="card-controls">{controls}</div>
      {children}
    </div>
  );
});

jest.mock('../common/data-display/external-link', () => {
  return {
    __esModule: true,
    default: ({ url }: any) => (url ? <div data-testid="external-link">{url}</div> : null),
    ExternalLink: ({ url }: any) => (url ? <div data-testid="external-link">{url}</div> : null),
    ExternalLinkType: {
      Link: 0,
      Phone: 1,
      Email: 2,
    },
  };
});

describe('ContactInfoCard', () => {
  const mockContact = {
    id: 'cont-1',
    firstName: 'John',
    lastName: 'Doe',
    title: 'Recruiter',
    email: 'john@example.com',
    phoneNumber: '123456789',
    linkedInUrl: 'https://linkedin.com/in/johndoe',
    notes: 'Good contact',
    isPrimaryRecruiter: true,
    company: { id: 'comp-1', name: 'Acme Corp' },
  };

  it('should render contact information successfully', () => {
    const { getByText, getByTestId, getAllByTestId } = render(<ContactInfoCard contact={mockContact as any} />);
    
    expect(getByTestId('card-title').textContent).toBe('John Doe');
    expect(getByText('Recruiter')).toBeTruthy();
    expect(getByText('Acme Corp')).toBeTruthy();
    expect(getByText('Good contact')).toBeTruthy();
    expect(getByText('(Primary Recruiter)')).toBeTruthy();
    
    const externalLinks = getAllByTestId('external-link');
    expect(externalLinks.map(l => l.textContent)).toContain('john@example.com');
    expect(externalLinks.map(l => l.textContent)).toContain('123456789');
    expect(externalLinks.map(l => l.textContent)).toContain('https://linkedin.com/in/johndoe');
  });

  it('should show controls when showControls and renderFull are true', () => {
    const { getByTestId } = render(<ContactInfoCard contact={mockContact as any} showControls={true} renderFull={true} />);
    const controls = getByTestId('card-controls');
    expect(controls.querySelector('a[href="/contacts/cont-1/edit"]')).toBeTruthy();
    expect(controls.querySelector('a[href="/contacts/cont-1/delete"]')).toBeTruthy();
  });

  it('should hide controls when showControls is false', () => {
    const { getByTestId } = render(<ContactInfoCard contact={mockContact as any} showControls={false} />);
    expect(getByTestId('card-controls').textContent).toBe('');
  });
});
