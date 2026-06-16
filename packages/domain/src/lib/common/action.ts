import { DirectionType } from './direction-type';

export interface ActionDefaults {
  eventTypeName: string;
  direction: DirectionType;
  sourceTypeId: string;
  suggestReminderDays?: number;
  suggestReminderRelativeToEvent?: boolean;
}

export interface Action {
  id: string;
  nameKey: string;
  iconName: string;
  defaults: ActionDefaults;
}
