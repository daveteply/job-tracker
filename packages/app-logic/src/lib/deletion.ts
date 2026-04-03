export interface DeletionBlockers {
  events: number;
  contacts: number;
  roles: number;
}

export interface DeletionCheck {
  canDelete: boolean;
  blockers: DeletionBlockers;
  loading: boolean;
}

export const EMPTY_DELETION_BLOCKERS: DeletionBlockers = {
  events: 0,
  contacts: 0,
  roles: 0,
};

export function canDeleteEntity(blockers: DeletionBlockers): boolean {
  return blockers.events === 0 && blockers.contacts === 0 && blockers.roles === 0;
}
