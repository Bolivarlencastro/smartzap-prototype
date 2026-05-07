import { createAction, props } from '@ngrx/store';
import { SortDirection } from '@angular/material/sort';
import { CollectionResponse, Page } from 'app/shared/model';
import { Enrollment, EnrollmentApiResponse } from 'app/main/courses/model';
import { EnrollmentFilter } from 'app/shared/services/enrollments.service';

// Enrollments
export const loadEnrollments = createAction('[Course Enrollments] Load Enrollments');

export const loadEnrollmentsSuccess = createAction(
  '[Course Enrollments] Load Enrollments Success',
  props<{ payload: CollectionResponse<Enrollment> }>(),
);

export const loadEnrollmentsFailure = createAction(
  '[Course Enrollments] Load Enrollments Failure',
  props<{ error: any }>(),
);

export const sortEnrollments = createAction(
  '[Course Enrollments] Sort Enrollments',
  props<{ field: string; direction: SortDirection }>(),
);

export const setPage = createAction('[Course Enrollments] Set Page', props<{ page: Page }>());

export const fetchMoreEnrollments = createAction('[Course Enrollments] Fetch More Enrollmens');

export const setFilter = createAction('[Course Enrollments] Set Filter', props<{ filter: EnrollmentFilter }>());

export const createEnrolment = createAction(
  '[Course Enrollments] Create Enrollment',
  props<{ course_id: string; data: any }>(),
);

export const createEnrolmentSuccess = createAction(
  '[Course Enrollments] Create Enrollment Success',
  props<{ course_id: string }>(),
);

export const createEnrolmentFailure = createAction(
  '[Course Enrollments] Create Enrollment Failure',
  props<{ error: any }>(),
);

export const importEnrolments = createAction(
  '[Course Enrollments] Import Enrollments',
  props<{ course_id: string; data: any }>(),
);

export const importEnrolmentsSuccess = createAction(
  '[Course Enrollments] Import Enrollments Success',
  props<{ data: EnrollmentApiResponse; course_id: string }>(),
);

export const importEnrolmentsFailure = createAction(
  '[Course Enrollments] Import Enrollments Failure',
  props<{ error: any }>(),
);

export const refreshEnrollments = createAction(
  '[Course Enrollments] Refresh Enrollments List',
  props<{ course_id: string }>(),
);

export const removeEnrollment = createAction('[Course Enrollments] Remove Enrollment', props<{ id: string }>());

export const removeEnrollmentSuccess = createAction(
  '[Course Enrollments] Remove Enrollment Success',
  props<{ id: string }>(),
);

export const removeEnrollmentFailure = createAction(
  '[Course Enrollments] Remove Enrollment Failure',
  props<{ error: any }>(),
);

export const cancelEnrollment = createAction(
  '[Course Enrollments] Cancel Enrollment',
  props<{ enrollmentId: string }>(),
);

export const cancelEnrollmentSuccess = createAction(
  '[Course Enrollments] Cancel Enrollment Success',
  props<{ enrollment: Enrollment }>(),
);

export const cancelEnrollmentFailure = createAction(
  '[Course Enrollments] Cancel Enrollment Failure',
  props<{ error: any }>(),
);

export const reenroll = createAction('[Course Enrollments] Reenroll', props<{ courseId: string; userId: string }>());

export const reenrollSuccess = createAction(
  '[Course Enrollments] Reenroll Success',
  props<{ enrollment: Enrollment }>(),
);

export const reenrollFailure = createAction('[Course Enrollments] Reenroll Failure', props<{ error: any }>());

export const resetPage = createAction('[Course Enrollments] Reset Page');

export const clear = createAction('[Course Enrollments] Clear Enrollments State');
