import { render } from '@testing-library/react';

import { BaseInfoCard } from './base-info-card';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, className, 'aria-label': ariaLabel }: any) => (
    <a href={href} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
});

describe('BaseInfoCard', () => {
  it('should render successfully with string title', () => {
    const { getByText } = render(
      <BaseInfoCard title="Test Title">
        <div>Test Content</div>
      </BaseInfoCard>,
    );
    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should render successfully with ReactNode title', () => {
    const { getByText } = render(
      <BaseInfoCard title={<span>Node Title</span>}>
        <div>Test Content</div>
      </BaseInfoCard>,
    );
    expect(getByText('Node Title')).toBeTruthy();
  });

  it('should render header and controls', () => {
    const { getByText } = render(
      <BaseInfoCard
        title="Title"
        header={<span>Header Content</span>}
        controls={<span>Control Content</span>}
      />,
    );
    expect(getByText('Header Content')).toBeTruthy();
    expect(getByText('Control Content')).toBeTruthy();
  });

  it('should render details link when detailsUrl is provided', () => {
    const { getByLabelText } = render(<BaseInfoCard title="Title" detailsUrl="/details" />);
    const link = getByLabelText('View Details');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/details');
  });

  it('should not render chevron when showChevron is false', () => {
    const { queryByLabelText } = render(
      <BaseInfoCard title="Title" detailsUrl="/details" showChevron={false} />,
    );
    expect(queryByLabelText('View Details')).toBeNull();
  });

  it('should apply custom className', () => {
    const { container } = render(<BaseInfoCard title="Title" className="custom-class" />);
    expect((container.firstChild as HTMLElement).classList.contains('custom-class')).toBe(true);
  });

  it('should apply showFull classes when true', () => {
    const { container } = render(<BaseInfoCard title="Title" showFull={true} />);
    const contentWrapper = container.querySelector('.grid') as HTMLElement;
    expect(contentWrapper.classList.contains('grid-rows-[1fr]')).toBe(true);
    expect(contentWrapper.classList.contains('opacity-100')).toBe(true);
  });

  it('should apply showFull classes when false', () => {
    const { container } = render(<BaseInfoCard title="Title" showFull={false} />);
    const contentWrapper = container.querySelector('.grid') as HTMLElement;
    expect(contentWrapper.classList.contains('grid-rows-[0fr]')).toBe(true);
    expect(contentWrapper.classList.contains('opacity-0')).toBe(true);
  });
});
