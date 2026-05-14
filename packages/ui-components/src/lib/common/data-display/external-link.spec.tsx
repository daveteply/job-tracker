import { render } from '@testing-library/react';

import { ExternalLink, ExternalLinkType } from './external-link';

describe('ExternalLink', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ExternalLink url="https://example.com" />);
    expect(baseElement).toBeTruthy();
  });

  it('should render nothing if url is missing', () => {
    const { container } = render(<ExternalLink />);
    expect(container.firstChild).toBeNull();
  });

  it('should render nothing if url is empty string', () => {
    const { container } = render(<ExternalLink url="" />);
    expect(container.firstChild).toBeNull();
  });

  it('should render url as link text if linkText is not provided', () => {
    const url = 'https://example.com';
    const { getByText } = render(<ExternalLink url={url} />);
    expect(getByText(url)).toBeTruthy();
  });

  it('should render linkText if provided', () => {
    const url = 'https://example.com';
    const linkText = 'Visit Example';
    const { getByText, queryByText } = render(<ExternalLink url={url} linkText={linkText} />);
    expect(getByText(linkText)).toBeTruthy();
    expect(queryByText(url)).toBeNull();
  });

  it('should have correct attributes for standard link', () => {
    const url = 'https://example.com';
    const { getByRole } = render(<ExternalLink url={url} />);
    const link = getByRole('link');
    expect(link.getAttribute('href')).toBe(url);
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should have correct attributes for email link', () => {
    const email = 'test@example.com';
    const { getByRole } = render(<ExternalLink url={email} linkType={ExternalLinkType.Email} />);
    const link = getByRole('link');
    expect(link.getAttribute('href')).toBe(`mailto:${email}`);
    expect(link.getAttribute('target')).toBe('_self');
  });

  it('should have correct attributes for phone link', () => {
    const phone = '123456789';
    const { getByRole } = render(<ExternalLink url={phone} linkType={ExternalLinkType.Phone} />);
    const link = getByRole('link');
    expect(link.getAttribute('href')).toBe(`tel:${phone}`);
    expect(link.getAttribute('target')).toBe('_self');
  });
});
