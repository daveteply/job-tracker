import { render } from '@testing-library/react';

import { PageLoading } from './page-loading';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: { entityName: string }) => {
    if (key === 'count') return '2';
    return `Loading ${params?.entityName || ''}`;
  },
}));

describe('PageLoading', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(<PageLoading entityName="Jobs" />);
    expect(baseElement).toBeTruthy();
    expect(getByText('Loading Jobs')).toBeTruthy();
  });
});
