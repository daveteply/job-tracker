'use client';

import { useEffect } from 'react';
import { DefaultValues, FieldValues, Path, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '../common/toast-context';
import { useRouter } from 'next/navigation';
import { CompanyDTO, ContactCreateSchema, ContactUpdateSchema } from '@job-tracker/validation';
import CompanyCombobox from '../company/company-combobox';
import Link from 'next/link';

interface ContactFormProps<T extends FieldValues> {
  onSubmitAction: (data: T) => Promise<{ success: boolean; message: string }>;
  onSearchCompany: (query: string) => Promise<CompanyDTO[]>;
  initialData?: DefaultValues<T>;
  isEdit?: boolean;
  postActionRoute: string;
}

export function ContactForm<T extends FieldValues>({
  onSubmitAction,
  onSearchCompany,
  initialData,
  isEdit = false,
  postActionRoute,
}: ContactFormProps<T>) {
  const router = useRouter();
  const { showToast } = useToast();
  const schema = isEdit ? ContactUpdateSchema : ContactCreateSchema;

  const {
    register,
    handleSubmit,
    reset,
    control,
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
        showToast(`Contact ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
        router.push(postActionRoute);
      } else {
        // TODO log this
        showToast(result.message || 'Could not save Contact', 'error');
      }
    } catch (error) {
      // TODO log this
      console.error('Submission failed', error);
    }
  };

  // Helper to render error messages cleanly
  const ErrorMsg = ({ name }: { name: Path<T> }) => {
    // Access nested errors (e.g., 'company.name')
    const nameParts = (name as string).split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let error: any = errors;
    for (const part of nameParts) {
      if (!error) break;
      error = error[part];
    }

    if (!error || !error.message) return null;
    return (
      <p className="text-red-600">
        <span>{error.message.toString()}</span>
      </p>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-12pt-6 pb-8 mb-4 max-w-md mx-auto">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">First Name</legend>
        <input className="input" {...register('firstName' as Path<T>)} />
        <p className="label">Required</p>
        <ErrorMsg name={'firstName' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Last Name</legend>
        <input className="input" {...register('lastName' as Path<T>)} />
        <p className="label">Required</p>
        <ErrorMsg name={'lastName' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Title</legend>
        <input className="input" {...register('title' as Path<T>)} />
        <ErrorMsg name={'title' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Company</legend>
        <CompanyCombobox control={control} name={'company' as Path<T>} onSearch={onSearchCompany} />
        <ErrorMsg name={'company' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Email</legend>
        <input className="input" {...register('email' as Path<T>)} />
        <ErrorMsg name={'email' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Phone</legend>
        <input className="input" {...register('phoneNumber' as Path<T>)} />
        <ErrorMsg name={'phoneNumber' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">LinkedIn URL</legend>
        <input className="input" {...register('linkedInUrl' as Path<T>)} />
        <ErrorMsg name={'linkedInUrl' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Is this a recruiter from the Company?</legend>
        <label className="label cursor-pointer justify-start gap-4">
          <input
            type="checkbox"
            className={`checkbox ${errors.isPrimaryRecruiter ? 'checkbox-error' : 'checkbox-primary'}`}
            {...register('isPrimaryRecruiter' as Path<T>)}
          />
          <span className="label-text">Yes, this is the primary recruiter</span>
        </label>
        <ErrorMsg name={'isPrimaryRecruiter' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Notes</legend>
        <textarea className="textarea" {...register('notes' as Path<T>)} />
        <ErrorMsg name={'notes' as Path<T>} />
      </fieldset>

      <div className="flex w-full mt-5">
        <button className="btn btn-outline" type="submit" disabled={isSubmitting}>
          {isEdit ? 'Update' : 'Create'}
        </button>
        <Link href={postActionRoute} className="btn">
          Cancel
        </Link>
      </div>
    </form>
  );
}

export default ContactForm;
