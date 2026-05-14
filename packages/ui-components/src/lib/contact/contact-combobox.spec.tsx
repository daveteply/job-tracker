import React from 'react';

import { render } from '@testing-library/react';

import { ContactCombobox } from './contact-combobox';

// Mock EntityCombobox
jest.mock('../common/forms/entity-combobox/entity-combobox', () => {
  return (props: any) => <div data-testid="entity-combobox">{JSON.stringify(props.name)}</div>;
});

describe('ContactCombobox', () => {
  it('should render successfully and pass props to EntityCombobox', () => {
    const mockOnSearch = jest.fn();
    const { getByTestId } = render(
      <ContactCombobox
        control={{} as any}
        name="contact"
        onSearch={mockOnSearch}
        required={true}
        placeholder="Select contact"
      />,
    );
    
    const combobox = getByTestId('entity-combobox');
    expect(combobox).toBeTruthy();
    expect(combobox.textContent).toContain('contact');
  });
});
