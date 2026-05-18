import {
  ACTION_CONSTRAINTS,
  addBusinessDays,
  addDays,
  AVAILABLE_ACTIONS,
  formatDateForInput,
  inferDirectionFromEventType,
} from '@job-tracker/app-logic';
import { Action } from '@job-tracker/domain';

export {
  ACTION_CONSTRAINTS,
  addBusinessDays,
  addDays,
  formatDateForInput,
  inferDirectionFromEventType,
};

export function useAvailableActions(): Action[] {
  return AVAILABLE_ACTIONS;
}
