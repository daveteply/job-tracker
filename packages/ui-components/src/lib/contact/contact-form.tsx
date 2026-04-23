'use client';

import { useEffect } from 'react';
import { DefaultValues, FieldValues, Path, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '../common/toast-context';
import { useRouter } from 'next/navigation';
import { CompanyDTO, ContactCreateSchema, ContactUpdateSchema } from '@job-tracker/validation';
import CompanyCombobox from '../company/company-combobox';
import Link from 'next/link';
import { FloatingButtonContainer } from '../common/floating-button-container';
import { useTranslations } from 'next-intl';

interface ContactFormProps<T extends FieldValues> {
  onSubmitAction: (data: T) => Promise<{ success: boolean; message: string }>;
  onSearchCompany: (query: string) => Promise<CompanyDTO[]>;
  initialData?: DefaultValues<T>;
  isEdit?: boolean;
  postActionRoute: string;
  companyPlaceholder?: string;
  createCompanyLabel?: (input: string) => string;
}

export function ContactForm<T extends FieldValues>({
  onSubmitAction,
  onSearchCompany,
  initialData,
  isEdit = false,
  postActionRoute,
  companyPlaceholder,
  createCompanyLabel,
}: ContactFormProps<T>) {
  const t = useTranslations('Contacts');
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
    <form onSubmit={handleSubmit(onSubmit)} className="px-12pt-6 mx-auto mb-4 max-w-md pb-8">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formFirstName')}</legend>
        <input className="input" {...register('firstName' as Path<T>)} />
        <p className="label">{t('required')}</p>
        <ErrorMsg name={'firstName' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formLastName')}</legend>
        <input className="input" {...register('lastName' as Path<T>)} />
        <p className="label">{t('required')}</p>
        <ErrorMsg name={'lastName' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formTitle')}</legend>
        <input className="input" {...register('title' as Path<T>)} />
        <ErrorMsg name={'title' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formCompany')}</legend>
        <CompanyCombobox
          control={control}
          name={'company' as Path<T>}
          onSearch={onSearchCompany}
          placeholder={companyPlaceholder}
          createNewLabel={createCompanyLabel}
        />
        <ErrorMsg name={'company' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formEmail')}</legend>
        <input className="input" {...register('email' as Path<T>)} />
        <ErrorMsg name={'email' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formPhone')}</legend>
        <input className="input" {...register('phoneNumber' as Path<T>)} />
        <ErrorMsg name={'phoneNumber' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formLinkedInUrl')}</legend>
        <input className="input" {...register('linkedInUrl' as Path<T>)} />
        <ErrorMsg name={'linkedInUrl' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formIsRecruiter')}</legend>
        <label className="label cursor-pointer justify-start gap-4">
          <input
            type="checkbox"
            className={`checkbox ${errors.isPrimaryRecruiter ? 'checkbox-error' : 'checkbox-primary'}`}
            {...register('isPrimaryRecruiter' as Path<T>)}
          />
          <span className="label-text">{t('formIsRecruiterCheckbox')}</span>
        </label>
        <ErrorMsg name={'isPrimaryRecruiter' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formNotes')}</legend>
        <textarea className="textarea" {...register('notes' as Path<T>)} />
        <ErrorMsg name={'notes' as Path<T>} />
      </fieldset>

      <FloatingButtonContainer>
        <Link href={postActionRoute} className="btn btn-ghost">
          {t('cancel')}
        </Link>
        <button className="btn btn-primary px-8" type="submit" disabled={isSubmitting}>
          {isEdit ? t('update') : t('create')}
        </button>
      </FloatingButtonContainer>
    </form>
  );
}

export default ContactForm;
