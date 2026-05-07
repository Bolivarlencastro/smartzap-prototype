import { SortDirection } from '@angular/material/sort';
import { Enrollment, EnrollmentFilter, ExtendDeadlinePayload } from '@core/model/enrollment.model';
import { createAction, props } from '@ngrx/store';
import { LearningTrailDoneActionType } from '../consts';
import { EnrollmentType } from '@app/shared/components/enrollments-filter';
import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

export const loadEnrollments = createAction('[LEARNING TRAIL ENROLLMENTS] Load enrollments');

export const initializeRouteData = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Initialize Route Data',
  props<{ filteringAllUsers: boolean; field: string; direction: SortDirection; isContentCreator: boolean }>(),
);

export const setFilteringAllUsers = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Set filtering all users',
  props<{ filteringAllUsers?: boolean; isContentCreator: boolean }>(),
);

export const saveFilter = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Save filter',
  props<{ filter: EnrollmentFilter }>(),
);

export const searchChange = createAction('[LEARNING TRAIL ENROLLMENTS] Search change', props<{ search: string }>());

export const paginationChange = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Pagination change',
  props<{ page: number; per_page: number }>(),
);

export const sortChange = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Sort change',
  props<{ field: string; direction: SortDirection }>(),
);

export const executeAction = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Execute action',
  props<{ action: LearningTrailDoneActionType; payload: unknown }>(),
);

export const viewLearningTrail = createAction(
  '[LEARNING TRAIL ENROLLMENTS] View Learning Trail',
  props<{ enrollment: Enrollment }>(),
);

export const openExtendDeadlineDialog = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Open Extend Deadline Dialog',
  props<{ enrollment: Enrollment }>(),
);

export const extendDeadline = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Extend Deadline',
  props<{ payload: ExtendDeadlinePayload }>(),
);

export const extendDeadlineSuccess = createAction('[LEARNING TRAIL ENROLLMENTS] Extend Deadline Success');

export const extendDeadlineFailure = createAction('[LEARNING TRAIL ENROLLMENTS] Extend Deadline Failure');

export const loadEnrollmentsSuccess = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Load enrollments success',
  props<{ enrollments: Enrollment[]; count: number | undefined; next: string }>(),
);

export const loadEnrollmentsFailure = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Load enrollments failure',
  props<{ payload: Error }>(),
);

export const loadEnrollmentsByUser = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Load enrollments by User',
  props<{ userId: string }>(),
);

export const loadEnrollmentsByUserSuccess = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Load enrollments by User success',
  props<{ payload: Enrollment[] }>(),
);

export const loadEnrollmentsByUserFailure = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Load enrollments by User failure',
  props<{ payload: Error }>(),
);

export const generateCertificate = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Generate Certificate',
  props<{ enrollmentId: string; isMobile?: boolean }>(),
);

export const generateCertificateSuccess = createAction('[LEARNING TRAIL ENROLLMENTS] Generate Certificate success');

export const generateCertificateFailure = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Generate Certificate failure',
  props<{ payload: Error }>(),
);

export const loadTracking = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Load Tracking Enrollment',
  props<{ enrollment: Enrollment }>(),
);

export const loadTrackingSuccess = createAction('[LEARNING TRAIL ENROLLMENTS] Load Tracking Enrollment Success');

export const loadTrackingFailure = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Load Tracking Enrollment Failure',
  props<{ error: Error }>(),
);

export const approveEnrollment = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Approve Enrollment',
  props<{ id: string; performance: number; status: EnrollmentStatuses }>(),
);

export const approveEnrollmentSuccess = createAction('[LEARNING TRAIL ENROLLMENTS] Approve Enrollment Success');

export const approveEnrollmentFailure = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Approve Enrollment Failure',
  props<{ error: Error }>(),
);

export const deleteEnrollment = createAction('[LEARNING TRAIL ENROLLMENTS] Delete Enrollment', props<{ id: string }>());

export const deleteEnrollmentSuccess = createAction('[LEARNING TRAIL ENROLLMENTS] Delete Enrollment Success');

export const deleteEnrollmentFailure = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Delete Enrollment Failure',
  props<{ error: Error }>(),
);

export const reEnrollEnrollment = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Re-Enroll Enrollment',
  props<{ id: string; goalDate: string; userId: string }>(),
);

export const reEnrollEnrollmentSuccess = createAction('[LEARNING TRAIL ENROLLMENTS] Re-Enroll Enrollment Success');

export const reEnrollEnrollmentFailure = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Re-Enroll Enrollment Failure',
  props<{ error: Error }>(),
);

export const restartEnrollment = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Restart Enrollment',
  props<{ id: string; goalDate: string }>(),
);

export const restartEnrollmentSuccess = createAction('[LEARNING TRAIL ENROLLMENTS] Restart Enrollment Success');

export const restartEnrollmentFailure = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Restart Enrollment Failure',
  props<{ error: Error }>(),
);

export const setEnrollment = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Set Enrollment',
  props<{ enrollment: Enrollment }>(),
);

export const resetEnrollments = createAction('[LEARNING TRAIL ENROLLMENTS] Reset Enrollments');

export const resetEnrollmentHistory = createAction('[LEARNING TRAIL ENROLLMENTS] Reset Enrollment History');

export const fetchMoreItems = createAction('[LEARNING TRAIL ENROLLMENTS] Fetch More Items');

export const fetchMoreItemsSuccess = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Fetch More Items Success',
  props<{ enrollments: Enrollment[]; count: number; next: string }>(),
);

export const fetchStatusOptions = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Fetch Status Options',
  props<{ enrollmentType: EnrollmentType }>(),
);

export const fetchStatusOptionsSuccess = createAction(
  '[LEARNING TRAIL ENROLLMENTS] Fetch Status Options Success',
  props<{ statuses: KpFilterSelectOption[] }>(),
);

export const giveUp = createAction('[LEARNING TRAIL ENROLLMENTS] Give Up', props<{ enrollmentId: string }>());
export const giveUpSuccess = createAction('[LEARNING TRAIL ENROLLMENTS] Give Up Success');
