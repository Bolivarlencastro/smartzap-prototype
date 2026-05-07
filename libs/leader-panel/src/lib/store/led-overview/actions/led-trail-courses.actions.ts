import { createAction, props } from '@ngrx/store';
import { Enrollment } from '../../../models/enrollment';

const init = createAction('[Led Trail Courses] Init', props<{ trailEnrollment: Enrollment }>());

const fetchEnrollments = createAction(
  '[Led Trail Courses] Fetch Enrollments',
  props<{ trailEnrollment: Enrollment }>(),
);
const fetchEnrollmentsSuccess = createAction(
  '[Led Trail Courses] Fetch Enrollments Success',
  props<{ enrollments: Enrollment[] }>(),
);
const fetchEnrollmentsFailure = createAction('[Led Trail Courses] Fetch Enrollments Failure');

export const LedTrailCoursesActions = {
  init,
  fetchEnrollments,
  fetchEnrollmentsSuccess,
  fetchEnrollmentsFailure,
};
