import React from 'react';

import { render } from '@testing-library/react';

import { RoleCombobox } from './role-combobox';

// Mock EntityCombobox
jest.mock('../common/forms/entity-combobox/entity-combobox', () => {
  return (props: any) => <div data-testid="entity-combobox">{JSON.stringify(props.name)}</div>;
});

describe('RoleCombobox', () => {
  it('should render successfully and pass props to EntityCombobox', () => {
    const mockOnSearch = jest.fn();
    const { getByTestId } = render(
      <RoleCombobox
        control={{} as any}
        name="role"
        onSearch={mockOnSearch}
        required={true}
        placeholder="Select role"
      />,
    );
    
    const combobox = getByTestId('entity-combobox');
    expect(combobox).toBeTruthy();
    expect(combobox.textContent).toContain('role');
  });
});
