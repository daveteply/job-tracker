import { render } from '@testing-library/react';

import { CardSkeleton, HomeSkeleton, ListSkeleton, PipelineSkeleton } from './skeletons';

describe('Skeletons', () => {
  describe('CardSkeleton', () => {
    it('should render successfully', () => {
      const { container } = render(<CardSkeleton />);
      expect(container.querySelector('.skeleton')).toBeTruthy();
    });
  });

  describe('ListSkeleton', () => {
    it('should render successfully', () => {
      const { container } = render(<ListSkeleton />);
      expect(container.querySelectorAll('.card')).toHaveLength(3); // default count
    });

    it('should render correct number of cards', () => {
      const { container } = render(<ListSkeleton count={5} />);
      expect(container.querySelectorAll('.card')).toHaveLength(5);
    });
  });

  describe('PipelineSkeleton', () => {
    it('should render successfully', () => {
      const { container } = render(<PipelineSkeleton />);
      expect(container.querySelectorAll('.card')).toHaveLength(9); // 3 columns * 3 cards
    });
  });

  describe('HomeSkeleton', () => {
    it('should render successfully', () => {
      const { container } = render(<HomeSkeleton />);
      expect(container.querySelectorAll('.skeleton')).not.toHaveLength(0);
    });
  });
});
