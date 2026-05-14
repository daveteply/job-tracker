import React from 'react';

import { render } from '@testing-library/react';

import { CompanyCombobox } from './company-combobox';

// Mock EntityCombobox
jest.mock('../common/forms/entity-combobox/entity-combobox', () => {
  return (props: any) => <div data-testid="entity-combobox">{JSON.stringify(props.name)}</div>;
});

describe('CompanyCombobox', () => {
  it('should render successfully and pass props to EntityCombobox', () => {
    const mockOnSearch = jest.fn();
    const { getByTestId } = render(
      <CompanyCombobox
        control={{} as any}
        name="company"
        onSearch={mockOnSearch}
        required={true}
        placeholder="Select company"
      />,
    );
    
    const combobox = getByTestId('entity-combobox');
    expect(combobox).toBeTruthy();
    expect(combobox.textContent).toContain('company');
  });
});
