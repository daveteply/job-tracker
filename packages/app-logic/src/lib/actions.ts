import { Action, DirectionType, SourceType } from '@job-tracker/domain';

export const AVAILABLE_ACTIONS: Action[] = [
  {
    id: 'not-selected',
    nameKey: 'actionNotSelected',
    iconName: 'XCircleIcon',
    defaults: {
      eventTypeName: 'Not Selected',
      direction: DirectionType.Inbound,
      source: SourceType.Email,
    },
  },
  {
    id: 'networking-chat',
    nameKey: 'actionNetworkingChat',
    iconName: 'UserGroupIcon',
    defaults: {
      eventTypeName: 'Networking/Coffee Chat',
      direction: DirectionType.Outbound,
      source: SourceType.LinkedIn,
    },
  },
  {
    id: 'interview-completed',
    nameKey: 'actionInterviewCompleted',
    iconName: 'ClipboardDocumentCheckIcon',
    defaults: {
      eventTypeName: 'Interview Completed',
      direction: DirectionType.Outbound,
      source: SourceType.Website,
      suggestReminderDays: 1,
    },
  },
  {
    id: 'scheduled-interview',
    nameKey: 'actionScheduledInterview',
    iconName: 'CalendarIcon',
    defaults: {
      eventTypeName: 'Interview Scheduled',
      direction: DirectionType.Inbound,
      source: SourceType.Email,
      suggestReminderDays: -1,
      suggestReminderRelativeToEvent: true,
    },
  },
  {
    id: 'email-received',
    nameKey: 'actionEmailReceived',
    iconName: 'EnvelopeIcon',
    defaults: {
      eventTypeName: 'Email Received',
      direction: DirectionType.Inbound,
      source: SourceType.Email,
    },
  },
  {
    id: 'sent-follow-up',
    nameKey: 'actionSentFollowUp',
    iconName: 'PaperAirplaneIcon',
    defaults: {
      eventTypeName: 'Follow-up Sent',
      direction: DirectionType.Outbound,
      source: SourceType.Email,
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
