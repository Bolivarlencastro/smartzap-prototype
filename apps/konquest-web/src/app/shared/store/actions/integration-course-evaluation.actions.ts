import { createAction, props } from '@ngrx/store';
import { BellNotification } from '@core/model/notification';
import { Mission } from 'app/main/mission/mission.model';

export const loadCourse = createAction(
  '[INTEGRATION COURSE EVALUATION] Load Course',
  props<{
    notification: BellNotification;
  }>(),
);

export const loadCourseSuccess = createAction(
  '[INTEGRATION COURSE EVALUATION] Load Course Success',
  props<{
    mission: Mission;
  }>(),
);

export const loadCourseFailure = createAction(
  '[INTEGRATION COURSE EVALUATION] Load Course Failure',
  props<{
    error: any;
  }>(),
);
