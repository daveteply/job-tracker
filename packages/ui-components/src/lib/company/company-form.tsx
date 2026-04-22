'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DefaultValues, FieldValues, Path, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CompanyCreateSchema, CompanyUpdateSchema } from '@job-tracker/validation';
import { useToast } from '../common/toast-context';
import Link from 'next/link';
import { FloatingButtonContainer } from '../common/floating-button-container';

interface CompanyFormProps<T extends FieldValues> {
  onSubmitAction: (data: T) => Promise<{ success: boolean; message: string }>;
  initialData?: DefaultValues<T>;
  isEdit?: boolean;
  postActionRoute: string;
}

export function CompanyForm<T extends FieldValues>({
  onSubmitAction,
  initialData,
  isEdit = false,
  postActionRoute,
}: CompanyFormProps<T>) {
  const router = useRouter();
  const { showToast } = useToast();
  const schema = isEdit ? CompanyUpdateSchema : CompanyCreateSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: initialData,
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  const onSubmit = async (data: T) => {
    try {
      const result = await onSubmitAction(data);
      if (result.success) {
        showToast(`Company ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
        router.push(postActionRoute);
      } else {
        // TODO log this
        showToast(result.message || 'Could not save Company', 'error');
      }
    } catch (error) {
      // TODO log this
      console.error('Submission failed', error);
    }
  };

  // Helper to render error messages cleanly
  const ErrorMsg = ({ name }: { name: Path<T> }) => {
    const error = errors[name];
    if (!error) return null;
    return (
      <p className="text-red-600">
        <span>{error.message?.toString()}</span>
      </p>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-12pt-6 mx-auto mb-4 max-w-md pb-8">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Company Name</legend>
        <input className="input" {...register('name' as Path<T>)} />
        <p className="label">Required</p>
        <ErrorMsg name={'name' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Website</legend>
        <input className="input" {...register('website' as Path<T>)} />
        <ErrorMsg name={'website' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Industry</legend>
        <input className="input" {...register('industry' as Path<T>)} />
        <ErrorMsg name={'industry' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Size Range</legend>
        <input className="input" {...register('sizeRange' as Path<T>)} />
        <ErrorMsg name={'sizeRange' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Notes</legend>
        <textarea className="textarea" {...register('notes' as Path<T>)} />
        <ErrorMsg name={'notes' as Path<T>} />
      </fieldset>

      <FloatingButtonContainer>
        <Link href={postActionRoute} className="btn btn-ghost">
          Cancel
        </Link>
        <button className="btn btn-primary px-8" type="submit" disabled={isSubmitting}>
          {isEdit ? 'Update' : 'Create'}
        </button>
      </FloatingButtonContainer>
    </form>
  );
}

export default CompanyForm;
