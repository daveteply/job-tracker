import { render } from '@testing-library/react';
import { useTranslations } from 'next-intl';

import { EnumSelector } from './enum-selector';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

describe('EnumSelector', () => {
  const mockT = jest.fn((key) => `translated:${key}`);
  const mockRegister = {
    name: 'testEnum',
    onChange: jest.fn(),
    onBlur: jest.fn(),
    ref: jest.fn(),
  };

  enum TestEnum {
    Option1 = 'VALUE1',
    Option2 = 'VALUE2',
  }

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(mockT);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render as a select by default', () => {
    const { getByRole, getAllByRole } = render(
      <EnumSelector enumObject={TestEnum} register={mockRegister as any} />,
    );
    expect(getByRole('combobox')).toBeTruthy();
    const options = getAllByRole('option') as HTMLOptionElement[];
    expect(options).toHaveLength(3); // placeholder + 2 options
    expect(options[0].textContent).toBe('translated:selectOption');
    expect(options[1].textContent).toBe('Option1');
    expect(options[1].value).toBe('VALUE1');
  });

  it('should render as radio buttons when useButtons is true', () => {
    const { getAllByRole } = render(
      <EnumSelector enumObject={TestEnum} register={mockRegister as any} useButtons={true} />,
    );
    const radios = getAllByRole('radio') as HTMLInputElement[];
    expect(radios).toHaveLength(2);
    expect(radios[0].value).toBe('VALUE1');
    expect(radios[0].getAttribute('aria-label')).toBe('Option1');
  });

  it('should use translation namespace if provided', () => {
    const { getAllByRole } = render(
      <EnumSelector
        enumObject={TestEnum}
        register={mockRegister as any}
        translationNamespace="TestNamespace"
      />,
    );
    const options = getAllByRole('option');
    expect(options[1].textContent).toBe('translated:TestNamespace.Option1');
  });

  it('should apply required attribute to select', () => {
    const { getByRole } = render(
      <EnumSelector enumObject={TestEnum} register={mockRegister as any} required={true} />,
    );
    expect((getByRole('combobox') as HTMLSelectElement).required).toBe(true);
  });

  it('should apply required attribute to radio buttons', () => {
    const { getAllByRole } = render(
      <EnumSelector
        enumObject={TestEnum}
        register={mockRegister as any}
        useButtons={true}
        required={true}
      />,
    );
    const radios = getAllByRole('radio') as HTMLInputElement[];
    expect(radios[0].required).toBe(true);
  });
});
