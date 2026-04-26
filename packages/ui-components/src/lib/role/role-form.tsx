'use client';

import { useEffect } from 'react';
import { DefaultValues, FieldValues, Path, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { RoleStatus } from '@job-tracker/domain';
import { CompanyDTO, RoleCreateSchema, RoleUpdateSchema } from '@job-tracker/validation';

import EnumSelector from '../common/enum-selector';
import { FloatingButtonContainer } from '../common/floating-button-container';
import { useToast } from '../common/toast-context';
import CompanyCombobox from '../company/company-combobox';

interface RoleFormProps<T extends FieldValues> {
  onSubmitAction: (data: T) => Promise<{ success: boolean; message: string }>;
  onSearchCompany: (query: string) => Promise<CompanyDTO[]>;
  initialData?: DefaultValues<T>;
  isEdit?: boolean;
  postActionRoute: string;
  companyPlaceholder?: string;
  createCompanyLabel?: (input: string) => string;
}

export function RoleForm<T extends FieldValues>({
  onSubmitAction,
  onSearchCompany,
  initialData,
  isEdit = false,
  postActionRoute,
  companyPlaceholder,
  createCompanyLabel,
}: RoleFormProps<T>) {
  const t = useTranslations('Roles');
  const tCommon = useTranslations('Common');
  const tValidation = useTranslations('Validation');
  const router = useRouter();
  const { showToast } = useToast();
  const schema = isEdit ? RoleUpdateSchema : RoleCreateSchema;

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
        showToast(`Role ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
        router.push(postActionRoute);
      } else {
        // TODO log this
        showToast(result.message || 'Could not save Role', 'error');
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
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <span>{tValidation(error.message.toString() as any)}</span>
      </p>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-12pt-6 mx-auto mb-4 max-w-md pb-8">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formTitle')}</legend>
        <input className="input" {...register('title' as Path<T>)} />
        <p className="label">{tCommon('required')}</p>
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

      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">{t('formStatus')}</legend>
        <EnumSelector
          register={register('status' as Path<T>)}
          enumObject={RoleStatus}
          translationNamespace="RoleStatus"
        />
        <ErrorMsg name={'status' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formJobPostingUrl')}</legend>
        <input className="input" {...register('jobPostingUrl' as Path<T>)} />
        <ErrorMsg name={'jobPostingUrl' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formLocation')}</legend>
        <input className="input" {...register('location' as Path<T>)} />
        <ErrorMsg name={'location' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formLevel')}</legend>
        <input className="input" {...register('level' as Path<T>)} />
        <ErrorMsg name={'level' as Path<T>} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t('formSalaryRange')}</legend>
        <input className="input" {...register('salaryRange' as Path<T>)} />
        <ErrorMsg name={'salaryRange' as Path<T>} />
      </fieldset>

      <FloatingButtonContainer>
        <Link href={postActionRoute} className="btn btn-ghost">
          {tCommon('cancel')}
        </Link>
        <button className="btn btn-primary px-8" type="submit" disabled={isSubmitting}>
          {isEdit ? tCommon('update') : tCommon('create')}
        </button>
      </FloatingButtonContainer>
    </form>
  );
}

export default RoleForm;
