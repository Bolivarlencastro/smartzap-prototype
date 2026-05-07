import { ExtendDeadlinePayload } from '@core/model/enrollment.model';
import { BellNotification } from '@core/model/notification';
import { createAction, props } from '@ngrx/store';

export const openExtendDeadlineDialog = createAction(
  '[EXTEND DEADLINE MISSION ENROLLMENTS] Open Extend Deadline Dialog',
  props<{ notification: BellNotification }>(),
);

export const closeExtendDeadlineDialog = createAction(
  '[EXTEND DEADLINE MISSION ENROLLMENTS] Close Extend Deadline Dialog',
  props<{ payload: ExtendDeadlinePayload }>(),
);
