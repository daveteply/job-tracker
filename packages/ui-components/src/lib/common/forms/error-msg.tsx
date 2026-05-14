import { FieldErrors, FieldValues, Path } from 'react-hook-form';

interface ErrorMsgProps<T extends FieldValues> {
  name: Path<T>;
  errors: FieldErrors<T>;
  tValidation: (key: string) => string;
}

export function ErrorMsg<T extends FieldValues>({ name, errors, tValidation }: ErrorMsgProps<T>) {
  const nameParts = (name as string).split('.');

  // Traverse the errors object to find the specific field error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- FieldErrors structure is deeply nested and difficult to type dynamically without 'any'
  let currentError: any = errors;

  for (const part of nameParts) {
    if (!currentError) break;
    currentError = currentError[part];
  }

  if (!currentError || typeof currentError.message !== 'string') return null;

  return (
    <p className="text-error">
      <span>{tValidation(currentError.message)}</span>
    </p>
  );
}
