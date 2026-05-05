'use client';

import { use } from 'react';

import { useTranslations } from 'next-intl';

import { useEventActions, useEventWithChildren } from '@job-tracker/hooks';
import { EntityDelete, EventInfoCard, PageLoading } from '@job-tracker/ui-components';

export default function DeleteEventPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('Events');
  const tCommon = useTranslations('Common');
  const { id } = use(params);
  const { event, loading } = useEventWithChildren(id);

  const { removeEvent } = useEventActions();

  if (loading) return <PageLoading entityName={t('eventEntityName')} />;
  if (!event) return <div>{t('notFound')}</div>;

  return (
    <div className="mx-auto flex max-w-2xl flex-col">
      <div className="mb-6">
        <h1 className="px-1 text-2xl font-bold">{t('deleteTitle')}</h1>
      </div>

      <div className="flex flex-col gap-4">
        <EventInfoCard event={event} showControls={false}></EventInfoCard>
        <EntityDelete
          id={event.id}
          entityName={t('eventEntityName')}
          postActionRoute="/activity"
          onDeleteAction={removeEvent}
          translations={{
            reminder: tCommon('deleteReminder'),
            confirm: tCommon('deleteAction', { name: t('eventEntityName') }),
            cancel: tCommon('cancel'),
            success: tCommon('deleteSuccess', { name: t('eventEntityName') }),
            error: tCommon('deleteError', { name: t('eventEntityName') }),
          }}
        />
      </div>
    </div>
  );
}
