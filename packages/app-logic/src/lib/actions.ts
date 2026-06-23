import {
  Action,
  DirectionType,
  SYSTEM_SOURCE_EMAIL_ID,
  SYSTEM_SOURCE_LINKEDIN_ID,
  SYSTEM_SOURCE_WEBSITE_ID,
} from '@job-tracker/domain';

export const AVAILABLE_ACTIONS: Action[] = [
  {
    id: 'not-selected',
    nameKey: 'actionNotSelected',
    iconName: 'XCircleIcon',
    defaults: {
      eventTypeName: 'Not Selected',
      direction: DirectionType.Inbound,
      sourceTypeId: SYSTEM_SOURCE_EMAIL_ID,
    },
  },
  {
    id: 'networking-chat',
    nameKey: 'actionNetworkingChat',
    iconName: 'UserGroupIcon',
    defaults: {
      eventTypeName: 'Networking/Coffee Chat',
      direction: DirectionType.Outbound,
      sourceTypeId: SYSTEM_SOURCE_LINKEDIN_ID,
    },
  },
  {
    id: 'interview-completed',
    nameKey: 'actionInterviewCompleted',
    iconName: 'ClipboardDocumentCheckIcon',
    defaults: {
      eventTypeName: 'Interview Completed',
      direction: DirectionType.Outbound,
      sourceTypeId: SYSTEM_SOURCE_WEBSITE_ID,
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
      sourceTypeId: SYSTEM_SOURCE_EMAIL_ID,
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
      sourceTypeId: SYSTEM_SOURCE_EMAIL_ID,
    },
  },
  {
    id: 'sent-follow-up',
    nameKey: 'actionSentFollowUp',
    iconName: 'PaperAirplaneIcon',
    defaults: {
      eventTypeName: 'Follow-up Sent',
      direction: DirectionType.Outbound,
      sourceTypeId: SYSTEM_SOURCE_EMAIL_ID,
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
      sourceTypeId: SYSTEM_SOURCE_LINKEDIN_ID,
    },
  },
  {
    id: 'applied-to-role',
    nameKey: 'actionAppliedToRole',
    iconName: 'DocumentPlusIcon',
    defaults: {
      eventTypeName: 'Applied',
      direction: DirectionType.Outbound,
      sourceTypeId: SYSTEM_SOURCE_WEBSITE_ID,
      suggestReminderDays: 5,
    },
  },
];

export const ACTION_CONSTRAINTS: Record<string, string[]> = {
  roles: [
    'not-selected',
    'applied-to-role',
    'scheduled-interview',
    'interview-completed',
    'sent-follow-up',
    'email-received',
    'recruiter-outreach',
  ],
  contacts: ['networking-chat', 'email-received', 'sent-follow-up', 'recruiter-outreach'],
  companies: ['applied-to-role', 'recruiter-outreach', 'email-received'],
};
