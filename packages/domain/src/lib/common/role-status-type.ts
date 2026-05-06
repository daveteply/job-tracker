export enum RoleStatus {
  Lead = 'Lead',
  Applied = 'Applied',
  Interviewing = 'Interviewing',
  Offer = 'Offer',
  Accepted = 'Accepted',
  NotSelected = 'Not Selected',
  Withdrawn = 'Withdrawn',
  Ghosted = 'Ghosted',
}

export const INACTIVE_STATUSES = [
  RoleStatus.NotSelected,
  RoleStatus.Withdrawn,
  RoleStatus.Ghosted,
];

export const ACTIVE_STATUSES = [
  RoleStatus.Lead,
  RoleStatus.Applied,
  RoleStatus.Interviewing,
  RoleStatus.Offer,
  RoleStatus.Accepted,
];

export const PIPELINE_STATUSES = [
  RoleStatus.Lead,
  RoleStatus.Applied,
  RoleStatus.Interviewing,
  RoleStatus.Offer,
];
