import { Action, DirectionType, SourceType } from '@job-tracker/domain';

export const AVAILABLE_ACTIONS: Action[] = [
  {
    id: 'applied-to-role',
    nameKey: 'actionAppliedToRole',
    iconName: 'DocumentPlusIcon',
    defaults: {
      eventTypeName: 'Applied',
      direction: DirectionType.Outbound,
      source: SourceType.Website,
      suggestReminderDays: 5,
    },
  },
];
