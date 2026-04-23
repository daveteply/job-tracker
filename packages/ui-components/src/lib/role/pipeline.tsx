import { RoleStatus } from '@job-tracker/domain';
import { RoleDTO } from '@job-tracker/validation';
import RoleInfoCard from './role-info-card';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
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

const STATUS_CONFIG: Record<RoleStatus, { icon: React.ElementType; color: string }> = {
  [RoleStatus.Lead]: { icon: UserGroupIcon, color: 'text-info' },
  [RoleStatus.Applied]: { icon: RocketLaunchIcon, color: 'text-primary' },
  [RoleStatus.Interviewing]: {
    icon: ChatBubbleLeftRightIcon,
    color: 'text-warning',
  },
  [RoleStatus.Offer]: { icon: CheckCircleIcon, color: 'text-success' },
  [RoleStatus.Accepted]: { icon: BriefcaseIcon, color: 'text-success' },
  [RoleStatus.Rejected]: { icon: XCircleIcon, color: 'text-error' },
  [RoleStatus.Withdrawn]: {
    icon: ArchiveBoxIcon,
    color: 'text-base-content/50',
  },
  [RoleStatus.Ghosted]: { icon: EyeSlashIcon, color: 'text-base-content/30' },
};

export interface PipelineColumnProps {
  status: RoleStatus;
  roles: RoleDTO[];
  loading?: boolean;
}

export function PipelineColumn({ status, roles, loading }: PipelineColumnProps) {
  const t = useTranslations('Enums.RoleStatus');
  const tCommon = useTranslations('Common');
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <div className="bg-base-200/40 border-base-300/30 hover:bg-base-200/60 flex h-full flex-col gap-4 rounded-2xl border p-4 shadow-sm transition-colors">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${config.color}`} />
          <h2 className="text-lg font-bold tracking-tight">{t(status)}</h2>
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
          <div className="bg-base-100/20 border-base-300/40 flex flex-col items-center justify-center rounded-xl border border-dashed py-10">
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-30">
              {tCommon('empty')}
            </p>
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
  const t = useTranslations('Enums.RoleStatus');
  const tPipeline = useTranslations('Pipeline');

  const activeColumns = useMemo(() => {
    if (columns) return columns;

    const statusesInData = new Set(roles.map((r) => r.status as RoleStatus));

    // Only show statuses that have data
    return STATUS_ORDER.filter((status) => statusesInData.has(status)).map((status) => ({
      title: t(status),
      status,
    }));
  }, [roles, columns, t]);

  const groupedRoles = (status: RoleStatus) => roles.filter((role) => role.status === status);

  return (
    <div className="-mx-1 flex flex-col items-start gap-6 px-1 pb-8 sm:snap-x sm:snap-mandatory sm:flex-row sm:overflow-x-auto sm:scroll-smooth">
      {activeColumns.map((column: { title: string; status: RoleStatus }) => (
        <div key={column.status} className="w-full shrink-0 sm:w-72 sm:snap-center md:w-80">
          <PipelineColumn
            status={column.status}
            roles={groupedRoles(column.status)}
            loading={loading}
          />
        </div>
      ))}

      {activeColumns.length === 0 && !loading && (
        <div className="bg-base-200/30 border-base-300 flex min-h-[300px] w-full flex-grow flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12">
          <ArchiveBoxIcon className="mb-4 h-12 w-12 opacity-10" />
          <p className="text-lg font-bold opacity-60">{tPipeline('emptyTitle')}</p>
          <p className="mt-2 max-w-xs text-center text-sm opacity-40">
            {tPipeline('emptyDescription')}
          </p>
        </div>
      )}
    </div>
  );
}
