import { EventEntity } from '../event/event.entity';

export interface ReminderEntity {
  id: string;
  serverId: number | null;
  version: number;

  eventId?: string;
  remindAt: Date;
  completedAt?: Date;

  updatedAt?: string;
  createdAt?: string;
}

export interface ReminderPopulatedEntity {
  event?: EventEntity;
}
