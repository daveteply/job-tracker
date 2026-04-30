import {
  addBusinessDays,
  addDays,
  AVAILABLE_ACTIONS,
  formatDateForInput,
  inferDirectionFromEventType,
} from '@job-tracker/app-logic';
import { Action } from '@job-tracker/domain';

export { addBusinessDays, addDays, formatDateForInput, inferDirectionFromEventType };

export function useAvailableActions(): Action[] {
  return AVAILABLE_ACTIONS;
}
