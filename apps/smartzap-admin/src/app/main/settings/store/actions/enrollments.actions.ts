import { SortDirection } from '@angular/material/sort';
import { createAction, props } from '@ngrx/store';
import { Enrollment } from 'app/main/courses/model';
import { RenewAccess, Tracking } from 'app/main/courses/model/tracking';
import { CollectionResponse } from 'app/shared/model';
import { EnrollmentFilter } from 'app/shared/services/enrollments.service';
import { EnrollmentsStatistics } from '../reducers/enrollments.reducer';
import { Update } from '@ngrx/entity';

export const loadEnrollments = createAction('[Enrollments] Load Enrollments');

export const loadEnrollmentsAndStatistics = createAction('[Enrollments] Load Enrollments and Statistics');

export const loadEnrollmentsSuccess = createAction(
  '[Enrollments] Load Enrollments Success',
  props<{ payload: CollectionResponse<Enrollment> }>(),
);

export const loadEnrollmentsFailure = createAction('[Enrollments] Load Enrollments Failure', props<{ error: any }>());

export const setPagination = createAction(
  '[Enrollments] Set Pagination',
  props<{ payload: { page: number; perPage: number } }>(),
);

export const setSort = createAction(
  '[Enrollments] Set Sort',
  props<{ payload: { field: string; direction: SortDirection } }>(),
);

export const setFilter = createAction('[Enrollments] Set Filter', props<{ payload: EnrollmentFilter }>());

export const loadStatistics = createAction('[Enrollments] Load Statistics');

export const resetState = createAction('[Enrollments] Reset State');

export const loadStatisticsSuccess = createAction(
  '[Enrollments] Load Statistics Success',
  props<{ payload: EnrollmentsStatistics }>(),
);

export const loadStatisticsFailure = createAction('[Enrollments] Load Statistics Failure', props<{ error: any }>());

export const deleteEnrollment = createAction('[Enrollments] Delete Enrollment', props<{ payload: { id: string } }>());

export const deleteEnrollmentSuccess = createAction(
  '[Enrollments] Delete Enrollment Success',
  props<{ payload: string }>(),
);

export const deleteEnrollmentFailure = createAction('[Enrollments] Delete Enrollment Failure', props<{ error: any }>());

export const cancelEnrollment = createAction('[Enrollments] Cancel Enrollment', props<{ payload: { id: string } }>());

export const cancelEnrollmentSuccess = createAction(
  '[Enrollments] Cancel Enrollment Success',
  props<{ payload: Update<Enrollment> }>(),
);

export const cancelEnrollmentFailure = createAction('[Enrollments] Cancel Enrollment Failure', props<{ error: any }>());

export const reenroll = createAction(
  '[Enrollments] Reenroll',
  props<{ payload: { courseId: string; userId: string } }>(),
);

export const reenrollSuccess = createAction('[Enrollments] Reenroll Success', props<{ payload: Enrollment }>());

export const reenrollFailure = createAction('[Enrollments] Reenroll Failure', props<{ error: any }>());

export const openEnrollmentActivities = createAction(
  '[Enrollments] Open Enrollment Activities',
  props<{ payload: Enrollment }>(),
);

export const loadEnrollmentTracking = createAction(
  '[Enrollments] Load Enrollment Tracking',
  props<{ payload: string }>(),
);

export const loadEnrollmentTrackingSuccess = createAction(
  '[Enrollments] Load Enrollment Tracking Success',
  props<{ payload: Tracking[] }>(),
);

export const loadEnrollmentTrackingFailure = createAction(
  '[Enrollments] Load Enrollment Tracking Failure',
  props<{ error: any }>(),
);

export const enrollmentRenewContentAccess = createAction(
  '[Enrollments] Enrollment Renew Content Access',
  props<{ payload: RenewAccess }>(),
);

export const enrollmentRenewContentAccessSuccess = createAction(
  '[Enrollments] Enrollment Renew Content Access Success',
);

export const enrollmentRenewContentAccessFailure = createAction(
  '[Enrollments] Enrollment Renew Content Access Failure',
  props<{ error: any }>(),
);
