import { createAction, props } from '@ngrx/store';
import { CycleManagementPageChange, CycleManagementSort } from '../../models';
import { EnrollmentCycleDto, EnrollmentsCyclesFilter } from '@keeps-platform-frontend-workspace/kp-keeps';

export const loadEnrollments = createAction('[Cycle Enrollments] Load Enrollments');

export const loadEnrollmentsSuccess = createAction(
  '[Cycle Enrollments] Load Enrollments Success',
  props<{ results: EnrollmentCycleDto[]; totalItems: number }>(),
);

export const loadEnrollmentsFailure = createAction('[Cycle Enrollments] Load Enrollments Failure');

export const searchEnrollments = createAction('[Cycle Enrollments] Search Enrollments', props<{ filter: string }>());

export const filterEnrollments = createAction(
  '[Cycle Enrollments] Filter Enrollments',
  props<{
    filter: EnrollmentsCyclesFilter;
  }>(),
);

export const sortEnrollments = createAction(
  '[Cycle Enrollments] Sort Enrollments',
  props<{ sort: CycleManagementSort }>(),
);

export const pageChange = createAction(
  '[Cycle Enrollments] Page Change',
  props<{ event: CycleManagementPageChange }>(),
);

export const renewCycle = createAction('[Cycle Enrollments] Renew Cycle', props<{ cycle: EnrollmentCycleDto }>());

export const renewCycleSuccess = createAction(
  '[Cycle Enrollments] Renew Cycle Success',
  props<{ cycle: EnrollmentCycleDto }>(),
);

export const renewCycleFailure = createAction('[Cycle Enrollments] Renew Cycle Failure');

export const inactivateCycle = createAction('[Cycle Enrollments] Cancel Cycle', props<{ cycle: EnrollmentCycleDto }>());

export const inactivateCycleSuccess = createAction(
  '[Cycle Enrollments] Cancel Cycle Success',
  props<{ cycle: EnrollmentCycleDto }>(),
);

export const inactivateCycleFailure = createAction('[Cycle Enrollments] Cancel Cycle Failure');

export const generateReport = createAction('[Cycle Enrollments] Generate Report');

export const reset = createAction('[Cycle Enrollments] Reset state');
