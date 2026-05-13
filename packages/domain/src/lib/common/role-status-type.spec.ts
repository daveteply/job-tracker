import { ACTIVE_STATUSES, INACTIVE_STATUSES, PIPELINE_STATUSES, RoleStatus } from './role-status-type';

describe('RoleStatus', () => {
  it('should have all expected statuses in either active or inactive lists', () => {
    const allStatuses = Object.values(RoleStatus);
    const categorizedStatuses = [...ACTIVE_STATUSES, ...INACTIVE_STATUSES];

    expect(categorizedStatuses.length).toBe(allStatuses.length);
    allStatuses.forEach((status) => {
      expect(categorizedStatuses).toContain(status);
    });
  });

  it('should correctly identify active statuses', () => {
    expect(ACTIVE_STATUSES).toContain(RoleStatus.Lead);
    expect(ACTIVE_STATUSES).toContain(RoleStatus.Applied);
    expect(ACTIVE_STATUSES).toContain(RoleStatus.Interviewing);
    expect(ACTIVE_STATUSES).toContain(RoleStatus.Offer);
    expect(ACTIVE_STATUSES).toContain(RoleStatus.Accepted);
  });

  it('should correctly identify inactive statuses', () => {
    expect(INACTIVE_STATUSES).toContain(RoleStatus.NotSelected);
    expect(INACTIVE_STATUSES).toContain(RoleStatus.Withdrawn);
    expect(INACTIVE_STATUSES).toContain(RoleStatus.Ghosted);
  });

  it('should correctly identify pipeline statuses', () => {
    expect(PIPELINE_STATUSES).toContain(RoleStatus.Lead);
    expect(PIPELINE_STATUSES).toContain(RoleStatus.Applied);
    expect(PIPELINE_STATUSES).toContain(RoleStatus.Interviewing);
    expect(PIPELINE_STATUSES).toContain(RoleStatus.Offer);
    expect(PIPELINE_STATUSES).not.toContain(RoleStatus.Accepted);
  });
});
