import { createAction, props } from '@ngrx/store';
import { LedEnrollmentActivityModel } from '../../../models/led-enrollment-activity';

const init = createAction('[Led Enrollment Activity] Init', props<{ courseId: string }>());

const fetchData = createAction('[Led Enrollment Activity] Fetch Data', props<{ courseId: string }>());
const fetchDataSuccess = createAction(
  '[Led Enrollment Activity] Fetch Data Success',
  props<{ data: LedEnrollmentActivityModel }>(),
);
const fetchDataFailure = createAction('[Led Enrollment Activity] Fetch Data Failure');

export const LedEnrollmentActivityActions = {
  init,
  fetchData,
  fetchDataSuccess,
  fetchDataFailure,
};
