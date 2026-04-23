'use client';

import { UseFormRegisterReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';

interface EnumSelectorProps<T extends Record<string, string | number>> {
  enumObject: T;
  register: UseFormRegisterReturn;
  required?: boolean;
  useButtons?: boolean;
  translationNamespace?: string;
}

export function EnumSelector<T extends Record<string, string | number>>({
  enumObject,
  register,
  required = false,
  useButtons = false,
  translationNamespace,
}: EnumSelectorProps<T>) {
  const t = useTranslations('Enums');
  const options = Object.entries(enumObject);

  const getLabel = (key: string) => {
    if (translationNamespace) {
      return t(`${translationNamespace}.${key}`);
    }
    return key;
  };

  return (
    <div>
      {useButtons ? (
        <div className="join">
          {options.map(([key, value]) => (
            <input
              key={key}
              className="join-item btn"
              type="radio"
              value={value}
              required={required}
              aria-label={getLabel(key)}
              {...register}
            />
          ))}
        </div>
      ) : (
        <select className="select" {...register} required={required}>
          <option value="">{t('selectOption')}</option>
          {options.map(([key, value]) => (
            <option key={key} value={value}>
              {getLabel(key)}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default EnumSelector;
