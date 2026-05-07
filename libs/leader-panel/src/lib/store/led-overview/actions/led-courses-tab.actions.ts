import { createAction, props } from '@ngrx/store';
import { Enrollment } from '../../../models/enrollment';
import { LedEnrollmentsTabViewMode } from '../../../models/led-overview';

const fetchCourseEnrollments = createAction('[Led Courses Tab] Fetch Course Enrollments');

const fetchEnrollmentsSuccess = createAction(
  '[Led Courses Tab] Fetch Course Enrollments Success',
  props<{ enrollments: Enrollment[] }>(),
);

const fetchEnrollmentsFailure = createAction(
  '[Led Courses Tab] Fetch Course Enrollments Failure',
  props<{ error: unknown }>(),
);

const setViewMode = createAction('[Led Courses Tab] Set View Mode', props<{ viewMode: LedEnrollmentsTabViewMode }>());

const goToCourseDetails = createAction('[Led Courses Tab] Go To Course Details', props<{ courseId: string }>());

export const LedCoursesTabActions = {
  fetchCourseEnrollments,
  fetchEnrollmentsSuccess,
  fetchEnrollmentsFailure,
  setViewMode,
  goToCourseDetails,
};
