import { FieldErrors } from 'react-hook-form';

import { render } from '@testing-library/react';

import { ErrorMsg } from './error-msg';

describe('ErrorMsg', () => {
  const tValidation = (key: string) => `translated:${key}`;

  it('should render nothing if there is no error for the field', () => {
    const errors: FieldErrors = {};
    const { container } = render(
      <ErrorMsg name="testField" errors={errors} tValidation={tValidation} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render error message for a top-level field', () => {
    const errors: FieldErrors = {
      testField: {
        type: 'required',
        message: 'field_required',
      },
    };
    const { getByText } = render(
      <ErrorMsg name="testField" errors={errors} tValidation={tValidation} />,
    );
    expect(getByText('translated:field_required')).toBeTruthy();
  });

  it('should render error message for a nested field', () => {
    const errors: FieldErrors = {
      parent: {
        child: {
          type: 'required',
          message: 'nested_field_required',
        },
      } as any,
    };
    const { getByText } = render(
      <ErrorMsg name="parent.child" errors={errors} tValidation={tValidation} />,
    );
    expect(getByText('translated:nested_field_required')).toBeTruthy();
  });

  it('should render nothing if field error has no message', () => {
    const errors: FieldErrors = {
      testField: {
        type: 'required',
      },
    };
    const { container } = render(
      <ErrorMsg name="testField" errors={errors} tValidation={tValidation} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('should handle deeply nested fields even if parent is missing in errors', () => {
    const errors: FieldErrors = {};
    const { container } = render(
      <ErrorMsg name="deeply.nested.field" errors={errors} tValidation={tValidation} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
