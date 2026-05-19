import React from 'react';

import { render } from '@testing-library/react';
import { useTranslations } from 'next-intl';

import { ContactList } from './contact-list';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

// Mock ContactInfoCard
jest.mock('./contact-info-card', () => {
  return ({ contact }: any) => <div data-testid="contact-card">{contact.firstName}</div>;
});

describe('ContactList', () => {
  const mockT = jest.fn((key) => key);

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(mockT);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render contact cards', () => {
    const mockContacts = [
      { id: '1', firstName: 'John' },
      { id: '2', firstName: 'Jane' },
    ];
    const { getAllByTestId } = render(<ContactList contacts={mockContacts as any} />);
    expect(getAllByTestId('contact-card')).toHaveLength(2);
  });

  it('should render empty message when no contacts', () => {
    const { getByText } = render(<ContactList contacts={[]} />);
    expect(getByText('noContactsFound')).toBeTruthy();
  });

  it('should render custom empty message', () => {
    const { getByText } = render(<ContactList contacts={[]} noContactsMessage="No contacts yet" />);
    expect(getByText('No contacts yet')).toBeTruthy();
  });
});
