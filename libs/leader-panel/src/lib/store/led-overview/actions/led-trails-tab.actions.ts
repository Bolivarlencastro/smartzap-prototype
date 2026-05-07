import { createAction, props } from '@ngrx/store';
import { Enrollment } from '../../../models/enrollment';
import { LedEnrollmentsTabViewMode } from '../../../models/led-overview';

const fetchTrailEnrollments = createAction('[Led Trails Tab] Fetch Trail Enrollments');

const fetchTrailEnrollmentsSuccess = createAction(
  '[Led Trails Tab] Fetch Trails Enrollments Success',
  props<{ enrollments: Enrollment[] }>(),
);

const fetchTrailEnrollmentsFailure = createAction(
  '[Led Trails Tab] Fetch Trails Enrollments Failure',
  props<{ error: unknown }>(),
);

const setViewMode = createAction('[Led Trails Tab] Set View Mode', props<{ viewMode: LedEnrollmentsTabViewMode }>());

const goToCourses = createAction('[Led Trails Tab] Go To Courses', props<{ trailEnrollment: Enrollment }>());

const goToCourseDetails = createAction('[Led Trails Tab] Go To Course Details', props<{ courseId: string }>());

export const LedTrailsTabActions = {
  fetchTrailEnrollments,
  fetchTrailEnrollmentsSuccess,
  fetchTrailEnrollmentsFailure,
  setViewMode,
  goToCourses,
  goToCourseDetails,
};
