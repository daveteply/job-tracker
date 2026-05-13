import React from 'react';

import { render } from '@testing-library/react';

import { ContentCard } from './content-card';

describe('ContentCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ContentCard>Test Content</ContentCard>);
    expect(baseElement).toBeTruthy();
  });

  it('should render title when provided', () => {
    const { getByText } = render(<ContentCard title="Test Title">Test Content</ContentCard>);
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('should render children', () => {
    const { getByText } = render(<ContentCard>Test Content</ContentCard>);
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should apply custom className', () => {
    const { container } = render(<ContentCard className="custom-class">Test Content</ContentCard>);
    expect(container.firstChild).toHaveProperty('className');
    expect((container.firstChild as HTMLElement).className).toContain('custom-class');
  });
});
