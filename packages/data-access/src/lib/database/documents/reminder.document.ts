export interface ReminderDocument {
  id: string;
  serverId: number | null;
  updatedAt: string;
  createdAt?: string;

  eventId?: string | null;
  remindAt: string;
  completedAt?: string | null;
}
