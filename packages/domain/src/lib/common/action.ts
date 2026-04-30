import { DirectionType } from './direction-type';
import { SourceType } from './source-type';

export interface ActionDefaults {
  eventTypeName: string;
  direction: DirectionType;
  source: SourceType;
  suggestReminderDays?: number;
  suggestReminderRelativeToEvent?: boolean;
}

export interface Action {
  id: string;
  nameKey: string;
  iconName: string;
  defaults: ActionDefaults;
}
