import { createAction, props } from '@ngrx/store';
import { ActivityTrackerEvent } from '@keeps-platform-frontend-workspace/ui/kp-player-activity-tracker-wrapper';
import { LearnContentActivity } from '@keeps-platform-frontend-workspace/kp-keeps';

export const onActivityEvent = createAction(
  '[Classroom Activity] On Activity Track Event',
  props<{ event: ActivityTrackerEvent }>(),
);

export const createActivitySuccess = createAction(
  '[Classroom Activity] Create Activity Success',
  props<{ activity: LearnContentActivity }>(),
);

export const createActivityFailure = createAction(
  '[Classroom Activity] Create Activity Failure',
  props<{ error: Error }>(),
);

export const updateActivitySuccess = createAction(
  '[Classroom Activity] Update Activity Success',
  props<{ activity: LearnContentActivity }>(),
);

export const updateActivityFailure = createAction(
  '[Classroom Activity] Update Activity Failure',
  props<{ error: Error }>(),
);
