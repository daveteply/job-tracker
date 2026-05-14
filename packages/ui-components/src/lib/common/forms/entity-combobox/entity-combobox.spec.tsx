import { useController } from 'react-hook-form';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { EntityCombobox, EntityComboboxConfig } from './entity-combobox';

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useController: jest.fn(),
}));

describe('EntityCombobox', () => {
  const mockOnChange = jest.fn();
  const mockRef = jest.fn();

  const mockConfig: EntityComboboxConfig<{ id: string; name: string }, any> = {
    getDisplayValue: (entity) => entity.name,
    parseNewEntity: (input) => ({ name: input }),
    placeholder: 'Search entities...',
    createNewLabel: (input) => `Create new: ${input}`,
  };

  const mockOnSearch = jest.fn();

  beforeEach(() => {
    (useController as jest.Mock).mockReturnValue({
      field: {
        value: null,
        onChange: mockOnChange,
        ref: mockRef,
      },
      fieldState: { error: null },
    });
    mockOnSearch.mockResolvedValue([]);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should render successfully', () => {
    render(
      <EntityCombobox
        control={{} as any}
        name="test"
        onSearch={mockOnSearch}
        config={mockConfig}
      />,
    );
    expect(screen.getByPlaceholderText('Search entities...')).toBeTruthy();
  });

  it('should show suggestions when typing', async () => {
    const suggestions = [{ id: '1', name: 'Suggestion 1' }];
    mockOnSearch.mockResolvedValue(suggestions);

    render(
      <EntityCombobox
        control={{} as any}
        name="test"
        onSearch={mockOnSearch}
        config={mockConfig}
      />,
    );

    const input = screen.getByPlaceholderText('Search entities...');
    fireEvent.change(input, { target: { value: 'Sugg' } });

    // Fast-forward debounce timer
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('Sugg');
      expect(screen.getByText('Suggestion 1')).toBeTruthy();
    });
  });

  it('should call onChange when a suggestion is selected', async () => {
    const suggestions = [{ id: '1', name: 'Suggestion 1' }];
    mockOnSearch.mockResolvedValue(suggestions);

    render(
      <EntityCombobox
        control={{} as any}
        name="test"
        onSearch={mockOnSearch}
        config={mockConfig}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('Search entities...'), {
      target: { value: 'Sugg' },
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => screen.getByText('Suggestion 1'));
    fireEvent.click(screen.getByText('Suggestion 1'));

    expect(mockOnChange).toHaveBeenCalledWith({
      id: '1',
      name: 'Suggestion 1',
      isNew: false,
    });
  });

  it('should show "create new" option when no exact match', async () => {
    render(
      <EntityCombobox
        control={{} as any}
        name="test"
        onSearch={mockOnSearch}
        config={mockConfig}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('Search entities...'), {
      target: { value: 'New Entity' },
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByText('Create new: New Entity')).toBeTruthy();
    });
  });

  it('should call onChange with new entity data while typing', () => {
    render(
      <EntityCombobox
        control={{} as any}
        name="test"
        onSearch={mockOnSearch}
        config={mockConfig}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('Search entities...'), {
      target: { value: 'New Entity' },
    });

    expect(mockOnChange).toHaveBeenCalledWith({
      name: 'New Entity',
      id: undefined,
      displayValue: 'New Entity',
      isNew: true,
    });
  });

  it('should handle clearing the input', () => {
    // We need to simulate that there WAS a value, and then it's cleared
    (useController as jest.Mock).mockReturnValue({
      field: {
        value: { id: '1', name: 'Existing', isNew: false },
        onChange: mockOnChange,
        ref: mockRef,
      },
      fieldState: { error: null },
    });

    render(
      <EntityCombobox
        control={{} as any}
        name="test"
        onSearch={mockOnSearch}
        config={mockConfig}
      />,
    );

    const input = screen.getByPlaceholderText('Search entities...');
    fireEvent.change(input, { target: { value: '' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      shouldRemove: true,
      isNew: false,
    });
  });
});
