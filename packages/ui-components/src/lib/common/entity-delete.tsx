'use client';

import { useRouter } from 'next/navigation';
import { useToast } from './toast-context';
import Link from 'next/link';

export interface EntityDeleteTranslations {
  reminder: string;
  confirm: string;
  cancel: string;
  success: string;
  error: string;
}

export interface EntityDeleteProps {
  id: string;
  onDeleteAction: (id: string) => Promise<{ success: boolean; message: string }>;
  entityName: string;
  postActionRoute: string;
  translations?: Partial<EntityDeleteTranslations>;
}

export function EntityDelete({
  id,
  onDeleteAction,
  entityName,
  postActionRoute,
  translations,
}: EntityDeleteProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const t = {
    reminder: 'Reminder: This action cannot be undone',
    confirm: `Delete this ${entityName}`,
    cancel: 'Cancel',
    success: `${entityName} deleted successfully!`,
    error: `Could not delete ${entityName}`,
    ...translations,
  };

  function handleDelete(id: string) {
    return async () => {
      try {
        const result = await onDeleteAction(id);
        if (result.success) {
          showToast(result.message || t.success, 'success');
          router.push(postActionRoute);
        } else {
          showToast(result.message || t.error, 'error');
        }
      } catch (error) {
        // TODO log this
        console.error('Delete failed', error);
        showToast(t.error, 'error');
      }
    };
  }

  return (
    <>
      <p className="text-error italic">{t.reminder}</p>
      <div className="flex w-full">
        <button className="btn btn-error mr-3 flex-1" onClick={handleDelete(id)}>
          <span className="capitalize">{t.confirm}</span>
        </button>
        <Link className="btn btn-outline" href={postActionRoute}>
          {t.cancel}
        </Link>
      </div>
    </>
  );
}

export default EntityDelete;
