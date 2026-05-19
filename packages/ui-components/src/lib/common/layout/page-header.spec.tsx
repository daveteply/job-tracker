import React from 'react';

import { render } from '@testing-library/react';

import { PageHeader } from './page-header';

describe('PageHeader', () => {
  it('should render successfully', () => {
    const { getByText } = render(<PageHeader title="Test Title" />);
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('should render children when provided', () => {
    const { getByText } = render(
      <PageHeader title="Test Title">
        <button>Action</button>
      </PageHeader>,
    );
    expect(getByText('Action')).toBeTruthy();
  });

  it('should apply custom className', () => {
    const { container } = render(<PageHeader title="Test Title" className="custom-margin" />);
    expect(container.firstChild).toHaveProperty(
      'className',
      expect.stringContaining('custom-margin'),
    );
  });

  it('should have default className if not provided', () => {
    const { container } = render(<PageHeader title="Test Title" />);
    expect(container.firstChild).toHaveProperty('className', expect.stringContaining('mb-6'));
  });
});
