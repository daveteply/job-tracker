'use client';

import { use } from 'react';

import { useTranslations } from 'next-intl';

import { useUserSettings } from '@job-tracker/hooks';
import { ContentCard } from '@job-tracker/ui-components';

import { routing, useRouter } from '../../../../i18n/routing';

export default function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: currentLocale } = use(params);
  const t = useTranslations('UserSettings');
  const tLang = useTranslations('Languages');
  const router = useRouter();
  const { settings, updateSettings, isLoading } = useUserSettings();

  const handleApplyLocale = async (newLocale: string) => {
    if (newLocale === currentLocale) return;

    await updateSettings({ locale: newLocale });
    // router.replace will use the new locale because it's wrapped by next-intl
    // but we want to force a full navigation to ensure all server components re-render with the new locale
    router.replace('/settings', { locale: newLocale });
  };

  const selectedLocale = settings?.locale || currentLocale;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-base-content/60 mt-2">{t('description')}</p>
      </div>

      <ContentCard title={t('languageTitle')}>
        <div className="flex flex-col gap-4">
          <div className="join">
            {routing.locales.map((loc) => (
              <button
                key={loc}
                className={`btn join-item btn-sm ${
                  selectedLocale === loc ? 'btn-active btn-primary' : ''
                }`}
                onClick={() => updateSettings({ locale: loc })}
                disabled={isLoading}
              >
                {tLang(loc)}
              </button>
            ))}
          </div>

          {selectedLocale !== currentLocale && (
            <div className="animate-in fade-in slide-in-from-top-1 flex duration-300">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleApplyLocale(selectedLocale)}
              >
                {t('applyLanguage')}
              </button>
            </div>
          )}
        </div>
      </ContentCard>

      <ContentCard title={t('appearanceTitle')}>
        <div className="join">
          <button
            className={`btn join-item btn-sm ${
              settings?.appearance === 'light' ? 'btn-active btn-primary' : ''
            }`}
            onClick={() => updateSettings({ appearance: 'light' })}
            disabled={isLoading}
          >
            {t('appearanceLight')}
          </button>
          <button
            className={`btn join-item btn-sm ${
              settings?.appearance === 'dark' ? 'btn-active btn-primary' : ''
            }`}
            onClick={() => updateSettings({ appearance: 'dark' })}
            disabled={isLoading}
          >
            {t('appearanceDark')}
          </button>
          <button
            className={`btn join-item btn-sm ${
              settings?.appearance === 'system' ? 'btn-active btn-primary' : ''
            }`}
            onClick={() => updateSettings({ appearance: 'system' })}
            disabled={isLoading}
          >
            {t('appearanceSystem')}
          </button>
        </div>
      </ContentCard>
    </div>
  );
}
