import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('UserSettings');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-base-content/60 mt-2">{t('description')}</p>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Account Profile</h2>
          <div className="space-y-4">
             <p className="text-sm">Profile settings will go here.</p>
             <div className="divider"></div>
             <div className="flex justify-end">
                <button className="btn btn-primary btn-sm">Save Changes</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
