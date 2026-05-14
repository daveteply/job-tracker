import { render } from '@testing-library/react';

import { useFloatingUI } from '../context/floating-ui-context';

import { FloatingButtonContainer } from './floating-button-container';

// Mock ../context/floating-ui-context
jest.mock('../context/floating-ui-context', () => ({
  useFloatingUI: jest.fn(),
}));

describe('FloatingButtonContainer', () => {
  const mockSetIsContainerActive = jest.fn();

  beforeEach(() => {
    (useFloatingUI as jest.Mock).mockReturnValue({
      setIsContainerActive: mockSetIsContainerActive,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { getByText } = render(
      <FloatingButtonContainer>
        <button>Test Child</button>
      </FloatingButtonContainer>,
    );
    expect(getByText('Test Child')).toBeTruthy();
  });

  it('should set container active on mount and inactive on unmount', () => {
    const { unmount } = render(
      <FloatingButtonContainer>
        <div>Content</div>
      </FloatingButtonContainer>,
    );

    expect(mockSetIsContainerActive).toHaveBeenCalledWith(true);

    unmount();

    expect(mockSetIsContainerActive).toHaveBeenCalledWith(false);
  });
});
