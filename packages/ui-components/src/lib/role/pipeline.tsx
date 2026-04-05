import { RoleStatus } from '@job-tracker/domain';
import { RoleDTO } from '@job-tracker/validation';
import RoleInfoCard from './role-info-card';
import { useMemo } from 'react';
import {
  BriefcaseIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  XCircleIcon,
  ArchiveBoxIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

const STATUS_ORDER = [
  RoleStatus.Lead,
  RoleStatus.Applied,
  RoleStatus.Interviewing,
  RoleStatus.Offer,
  RoleStatus.Accepted,
  RoleStatus.Rejected,
  RoleStatus.Withdrawn,
  RoleStatus.Ghosted,
];

const STATUS_CONFIG: Record<
  RoleStatus,
  { title: string; icon: React.ElementType; color: string }
> = {
  [RoleStatus.Lead]: { title: 'Leads', icon: UserGroupIcon, color: 'text-info' },
  [RoleStatus.Applied]: { title: 'Applied', icon: RocketLaunchIcon, color: 'text-primary' },
  [RoleStatus.Interviewing]: {
    title: 'Interviewing',
    icon: ChatBubbleLeftRightIcon,
    color: 'text-warning',
  },
  [RoleStatus.Offer]: { title: 'Offers', icon: CheckCircleIcon, color: 'text-success' },
  [RoleStatus.Accepted]: { title: 'Accepted', icon: BriefcaseIcon, color: 'text-success' },
  [RoleStatus.Rejected]: { title: 'Rejected', icon: XCircleIcon, color: 'text-error' },
  [RoleStatus.Withdrawn]: {
    title: 'Withdrawn',
    icon: ArchiveBoxIcon,
    color: 'text-base-content/50',
  },
  [RoleStatus.Ghosted]: { title: 'Ghosted', icon: EyeSlashIcon, color: 'text-base-content/30' },
};

export interface PipelineColumnProps {
  status: RoleStatus;
  roles: RoleDTO[];
  loading?: boolean;
}

export function PipelineColumn({ status, roles, loading }: PipelineColumnProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <div className="flex flex-col gap-4 bg-base-200/40 p-4 rounded-2xl h-full border border-base-300/30 shadow-sm transition-colors hover:bg-base-200/60">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${config.color}`} />
          <h2 className="font-bold text-lg tracking-tight">{config.title}</h2>
        </div>
        <span className="badge badge-ghost badge-sm font-mono opacity-60">{roles.length}</span>
      </div>

      <div className="flex-grow space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-md opacity-20"></span>
          </div>
        ) : roles.length > 0 ? (
          roles.map((role) => (
            <div key={role.id} className="transition-all active:scale-[0.98]">
              <RoleInfoCard role={role} renderFull={false} />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 bg-base-100/20 rounded-xl border border-dashed border-base-300/40">
            <p className="text-[10px] uppercase tracking-widest opacity-30 font-bold">Empty</p>
          </div>
        )}
      </div>
    </div>
  );
}

export interface PipelineProps {
  roles: RoleDTO[];
  loading?: boolean;
  columns?: { title: string; status: RoleStatus }[];
}

export function Pipeline({ roles, loading, columns }: PipelineProps) {
  const activeColumns = useMemo(() => {
    if (columns) return columns;

    const statusesInData = new Set(roles.map((r) => r.status as RoleStatus));

    // Only show statuses that have data
    return STATUS_ORDER.filter((status) => statusesInData.has(status)).map((status) => ({
      title: STATUS_CONFIG[status].title,
      status,
    }));
  }, [roles, columns]);

  const groupedRoles = (status: RoleStatus) => roles.filter((role) => role.status === status);

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:overflow-x-auto pb-8 items-start sm:snap-x sm:snap-mandatory sm:scroll-smooth -mx-1 px-1">
      {activeColumns.map((column: { title: string; status: RoleStatus }) => (
        <div key={column.status} className="w-full sm:w-72 md:w-80 shrink-0 sm:snap-center">
          <PipelineColumn
            status={column.status}
            roles={groupedRoles(column.status)}
            loading={loading}
          />
        </div>
      ))}

      {activeColumns.length === 0 && !loading && (
        <div className="flex-grow flex flex-col items-center justify-center p-12 bg-base-200/30 rounded-2xl border-2 border-dashed border-base-300 min-h-[300px] w-full">
          <ArchiveBoxIcon className="h-12 w-12 opacity-10 mb-4" />
          <p className="text-lg font-bold opacity-60">Your pipeline is empty</p>
          <p className="text-sm opacity-40 text-center mt-2 max-w-xs">
            Add a new job lead to begin tracking your progress.
          </p>
        </div>
      )}
    </div>
  );
}
