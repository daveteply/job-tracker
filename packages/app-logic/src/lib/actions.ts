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
  {
    id: 'recruiter-outreach',
    nameKey: 'actionRecruiterOutreach',
    iconName: 'ChatBubbleLeftEllipsisIcon',
    defaults: {
      eventTypeName: 'Recruiter Outreach',
      direction: DirectionType.Inbound,
      source: SourceType.LinkedIn,
    },
  },
];
