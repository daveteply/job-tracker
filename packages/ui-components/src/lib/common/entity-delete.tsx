'use client';

import { useRouter } from 'next/navigation';
import { useToast } from './toast-context';
import Link from 'next/link';

export interface EntityDeleteProps {
  id: string;
  onDeleteAction: (id: string) => Promise<{ success: boolean; message: string }>;
  entityName: string;
  postActionRoute: string;
}

export function EntityDelete({
  id,
  onDeleteAction,
  entityName,
  postActionRoute,
}: EntityDeleteProps) {
  const router = useRouter();
  const { showToast } = useToast();

  function handleDelete(id: string) {
    return async () => {
      try {
        const result = await onDeleteAction(id);
        if (result.success) {
          showToast(result.message || `${entityName} deleted successfully!`, 'success');
          router.push(postActionRoute);
        } else {
          showToast(result.message || `Could not delete ${entityName}`, 'error');
        }
      } catch (error) {
        // TODO log this
        console.error('Delete failed', error);
        showToast(`Could not delete ${entityName}`, 'error');
      }
    };
  }

  return (
    <>
      <p className="text-error italic">Reminder: This action cannot be undone</p>
      <div className="flex w-full">
        <button className="btn btn-error mr-3 flex-1" onClick={handleDelete(id)}>
          Delete this <span className="capitalize">{entityName}</span>
        </button>
        <Link className="btn btn-outline" href={postActionRoute}>
          Cancel
        </Link>
      </div>
    </>
  );
}

export default EntityDelete;
