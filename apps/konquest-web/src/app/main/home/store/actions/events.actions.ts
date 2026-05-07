import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { createAction, props } from '@ngrx/store';

export const loadEvents = createAction('[Events] Load Events');
export const loadEventsSuccess = createAction(
  '[Events] Load Events Success',
  props<{ events: LearnContentCardData[]; finished: boolean }>(),
);
export const loadEventsFailure = createAction('[Events] Load Events Failure');

export const loadMoreEvents = createAction('[Events] Load More Events');
export const loadMoreEventsSuccess = createAction(
  '[Events] Load More Events Success',
  props<{ events: LearnContentCardData[]; finished: boolean }>(),
);
export const loadMoreEventsFailure = createAction('[Events] Load More Events Failure');

export const reset = createAction('[Events] Reset');
