import React from 'react';

import { render } from '@testing-library/react';

import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EmptyState title="No data" />);
    expect(baseElement).toBeTruthy();
  });

  it('should render title and description', () => {
    const { getByText } = render(
      <EmptyState title="No data" description="Try searching for something else" />,
    );
    expect(getByText('No data')).toBeTruthy();
    expect(getByText('Try searching for something else')).toBeTruthy();
  });

  it('should render icon when provided', () => {
    const { getByTestId } = render(
      <EmptyState title="No data" icon={<span data-testid="test-icon" />} />,
    );
    expect(getByTestId('test-icon')).toBeTruthy();
  });

  it('should render action when provided', () => {
    const { getByText } = render(<EmptyState title="No data" action={<button>Click me</button>} />);
    expect(getByText('Click me')).toBeTruthy();
  });
});
