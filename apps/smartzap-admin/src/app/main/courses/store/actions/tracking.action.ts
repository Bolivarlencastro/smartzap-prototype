import { createAction, props } from '@ngrx/store';
import { Tracking } from '../../model/tracking';

export const loadTrackingEnrolment = createAction('[Tracking] Load Tracking Enrollment', props<{ id: string }>());
export const loadTrackingEnrolmentSuccess = createAction(
  '[Tracking] Load Tracking Enrollment Success',
  props<{ trackings: Tracking[] }>(),
);
export const loadTrackingEnrolmentFailure = createAction(
  '[Tracking] Load Tracking Enrollment Failure',
  props<{ error: Error }>(),
);
export const clear = createAction('[Tracking] Clear Tracking State');
