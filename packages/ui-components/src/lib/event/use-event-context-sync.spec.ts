import { useFormContext } from 'react-hook-form';

import { renderHook } from '@testing-library/react';

import { useEventContextSync } from './use-event-context-sync';

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: jest.fn(),
}));

describe('useEventContextSync', () => {
  const mockOnSearchRole = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('populates company when role with company is selected and company is empty', () => {
    const mockSetValue = jest.fn();
    const mockWatch = jest.fn((name: string) => {
      if (name === 'role') return { id: 'r1', title: 'Eng', company: { id: 'c1', name: 'Google' } };
      if (name === 'company') return null;
      return null;
    });

    (useFormContext as jest.Mock).mockReturnValue({
      setValue: mockSetValue,
      watch: mockWatch,
    });

    renderHook(() =>
      useEventContextSync({ setValue: mockSetValue, watch: mockWatch, onSearchRole: mockOnSearchRole }),
    );

    expect(mockSetValue).toHaveBeenCalledWith(
      'company',
      expect.objectContaining({ id: 'c1', name: 'Google' }),
      expect.any(Object),
    );
  });

  it('populates company when contact with company is selected and company is empty', () => {
    const mockSetValue = jest.fn();
    const mockWatch = jest.fn((name: string) => {
      if (name === 'contact') return { id: 'ct1', company: { id: 'c2', name: 'Apple' } };
      if (name === 'company') return null;
      return null;
    });

    (useFormContext as jest.Mock).mockReturnValue({
      setValue: mockSetValue,
      watch: mockWatch,
    });

    renderHook(() =>
      useEventContextSync({ setValue: mockSetValue, watch: mockWatch, onSearchRole: mockOnSearchRole }),
    );

    expect(mockSetValue).toHaveBeenCalledWith(
      'company',
      expect.objectContaining({ id: 'c2', name: 'Apple' }),
      expect.any(Object),
    );
  });

  it('does not overwrite existing company when role with different company is selected', () => {
    const mockSetValue = jest.fn();
    const mockWatch = jest.fn((name: string) => {
      if (name === 'role') return { id: 'r1', title: 'Eng', company: { id: 'c1', name: 'Google' } };
      if (name === 'company') return { id: 'c2', name: 'Apple' };
      return null;
    });

    (useFormContext as jest.Mock).mockReturnValue({
      setValue: mockSetValue,
      watch: mockWatch,
    });

    renderHook(() =>
      useEventContextSync({ setValue: mockSetValue, watch: mockWatch, onSearchRole: mockOnSearchRole }),
    );

    expect(mockSetValue).not.toHaveBeenCalledWith('company', expect.anything(), expect.anything());
  });

  it('auto-fills role when company changes and company has exactly 1 role', async () => {
    const mockSetValue = jest.fn();
    const singleRole = { id: 'r99', title: 'Lone Role' };
    mockOnSearchRole.mockResolvedValue([singleRole]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock company form value
    let companyVal: any = null;
    const mockWatch = jest.fn((name: string) => {
      if (name === 'company') return companyVal;
      return null;
    });

    (useFormContext as jest.Mock).mockReturnValue({
      setValue: mockSetValue,
      watch: mockWatch,
    });

    const { rerender } = renderHook(() =>
      useEventContextSync({ setValue: mockSetValue, watch: mockWatch, onSearchRole: mockOnSearchRole }),
    );

    companyVal = { id: 'c-single' };
    rerender();

    await Promise.resolve();

    expect(mockSetValue).toHaveBeenCalledWith(
      'role',
      expect.objectContaining({ id: 'r99', title: 'Lone Role' }),
      expect.any(Object),
    );
  });

  it('clears role when company changes to a company with no matching role', async () => {
    const mockSetValue = jest.fn();
    mockOnSearchRole.mockResolvedValue([]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock company form value
    let companyVal: any = { id: 'c1' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock role form value
    const roleVal: any = { id: 'r1', companyId: 'c1', title: 'Dev' };

    const mockWatch = jest.fn((name: string) => {
      if (name === 'company') return companyVal;
      if (name === 'role') return roleVal;
      return null;
    });

    (useFormContext as jest.Mock).mockReturnValue({
      setValue: mockSetValue,
      watch: mockWatch,
    });

    const { rerender } = renderHook(() =>
      useEventContextSync({ setValue: mockSetValue, watch: mockWatch, onSearchRole: mockOnSearchRole }),
    );

    companyVal = { id: 'c2' };
    rerender();

    await Promise.resolve();

    expect(mockSetValue).toHaveBeenCalledWith('role', null, expect.any(Object));
  });
});
