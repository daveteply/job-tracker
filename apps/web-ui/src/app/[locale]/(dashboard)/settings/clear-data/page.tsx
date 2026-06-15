'use client';

import { useState } from 'react';

import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { getStorage, removeRxDatabase, SYNC_URL, useDb } from '@job-tracker/data-access';
import { ContentCard, PageHeader, PageLoading } from '@job-tracker/ui-components';

import { Link } from '../../../../../i18n/routing';

export default function ClearDataPage() {
  const t = useTranslations('UserSettings');
  const tCommon = useTranslations('Common');
  const db = useDb();
  const { data: session, status: sessionStatus } = useSession();
  const [isClearing, setIsClearing] = useState(false);
  const [wipeCloud, setWipeCloud] = useState(false);

  if (sessionStatus === 'loading' || !db) {
    return <PageLoading entityName={t('clearDataTitle')} />;
  }

  const handleClearData = async () => {
    if (!db || isClearing) return;

    setIsClearing(true);
    try {
      if (wipeCloud && session?.user?.id) {
        const response = await fetch(`${SYNC_URL}/wipe`, {
          method: 'DELETE',
          headers: {
            'X-User-Id': session.user.id,
            'X-User-Email': session.user.email || '',
          },
        });
        if (!response.ok) throw new Error('Failed to wipe cloud data');
      }

      const dbName = db.name;
      await db.close();
      await removeRxDatabase(dbName, getStorage());

      // Clear local storage key
      localStorage.removeItem('job_tracker_prev_db_name');

      // Note: We use window.location because signOut might not complete
      // before navigation if we don't wait, and we want a fresh start.
      await signOut({ callbackUrl: '/auth/signin' });
    } catch (err) {
      console.error('Clear data failed:', err);
      setIsClearing(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col">
      <PageHeader title={t('clearDataTitle')} />

      <div className="flex flex-col gap-4">
        <ContentCard>
          <div className="space-y-6">
            <p className="text-base-content/80">{t('clearDataDetailedDescription')}</p>

            <div className="form-control w-fit">
              <label className="label cursor-pointer gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-error checkbox-md"
                  checked={wipeCloud}
                  onChange={(e) => setWipeCloud(e.target.checked)}
                />
                <span className="label-text text-lg font-medium">{t('clearCloudCheckbox')}</span>
              </label>
            </div>

            <div className="divider"></div>

            <p className="text-error italic">{tCommon('deleteReminder')}</p>

            <div className="flex w-full gap-3">
              <button
                className={`btn btn-error flex-1 ${isClearing ? 'btn-disabled' : ''}`}
                onClick={handleClearData}
                disabled={isClearing}
              >
                {isClearing ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    {t('clearing')}
                  </>
                ) : (
                  t('clearDataButton')
                )}
              </button>
              <Link className="btn btn-outline flex-1" href="/settings">
                {tCommon('cancel')}
              </Link>
            </div>
          </div>
        </ContentCard>
      </div>
    </div>
  );
}
