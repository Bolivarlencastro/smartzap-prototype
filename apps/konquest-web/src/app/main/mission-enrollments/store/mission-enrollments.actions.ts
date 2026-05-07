import { Step } from 'app/main/learning-trail/model/learning-trail';
import { Enrollment, EnrollmentFilter } from '@core/model/enrollment.model';
import { createAction, props } from '@ngrx/store';
import { Mission } from 'app/main/mission/mission.model';
import { MissionDoneActionType } from '../consts';
import { RawEvaluation } from '@core/model/evaluation.model';
import { SortDirection } from '@angular/material/sort';
import { EnrollmentType } from '@app/shared/components/enrollments-filter';
import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

export const getRouteDataAndLoadEnrollments = createAction(
  '[MISSION ENROLLMENTS] Get Route Data and Load Enrollments',
  props<{ filteringAllUsers: boolean; isCourse: boolean; isContentCreator: boolean }>(),
);

export const loadEnrollments = createAction('[MISSION ENROLLMENTS] Load enrollments');

export const setFilteringAllUsers = createAction(
  '[MISSION ENROLLMENTS] Set filtering all users',
  props<{ isCourse: boolean; isContentCreator: boolean; filteringAllUsers?: boolean }>(),
);

export const saveFilter = createAction('[MISSION ENROLLMENTS] Save filter', props<{ filter: EnrollmentFilter }>());

export const searchChange = createAction('[MISSION ENROLLMENTS] Search change', props<{ search: string }>());

export const paginationChange = createAction(
  '[MISSION ENROLLMENTS] Pagination change',
  props<{ page: number; per_page: number }>(),
);

export const sortChange = createAction(
  '[MISSION ENROLLMENTS] Sort change',
  props<{ field: string; direction: SortDirection }>(),
);

export const executeAction = createAction(
  '[MISSION ENROLLMENTS] Execute action',
  props<{ action: MissionDoneActionType; payload: unknown }>(),
);

export const viewMission = createAction('[MISSION ENROLLMENTS] View Mission', props<{ enrollment: Enrollment }>());

export const loadEnrollmentsSuccess = createAction(
  '[MISSION ENROLLMENTS] Load enrollments success',
  props<{ enrollments: Enrollment[]; count: number; next: string }>(),
);

export const loadEnrollmentsFailure = createAction(
  '[MISSION ENROLLMENTS] Load enrollments failure',
  props<{ payload: Error }>(),
);

export const loadLinkedLearningTrails = createAction(
  '[MISSION ENROLLMENTS] Load Linked Learning Trails',
  props<{ missionId: string }>(),
);

export const loadLinkedLearningTrailsSuccess = createAction(
  '[MISSION ENROLLMENTS] Load Linked Learning Trails success',
  props<{ payload: Step[] }>(),
);

export const loadLinkedLearningTrailsFailure = createAction(
  '[MISSION ENROLLMENTS] Load Linked Learning Trails failure',
  props<{ payload: Error }>(),
);

export const loadEnrollmentsByUser = createAction(
  '[MISSION ENROLLMENTS] Load enrollments by User',
  props<{ missionId: string; userId: string }>(),
);

export const loadEnrollmentsByUserSuccess = createAction(
  '[MISSION ENROLLMENTS] Load enrollments by User success',
  props<{ payload: Enrollment[] }>(),
);

export const loadEnrollmentsByUserFailure = createAction(
  '[MISSION ENROLLMENTS] Load enrollments by User failure',
  props<{ payload: Error }>(),
);

export const generateCertificate = createAction(
  '[MISSION ENROLLMENTS] Generate Certificate',
  props<{ id: string; isMobile?: boolean }>(),
);

export const generateCertificateSuccess = createAction('[MISSION ENROLLMENTS] Generate Certificate success');

export const generateCertificateFailure = createAction(
  '[MISSION ENROLLMENTS] Generate Certificate failure',
  props<{ payload: Error }>(),
);

export const openAttachCertificate = createAction(
  '[MISSION ENROLLMENTS] Open Attach Certificate',
  props<{ enrollment: Enrollment }>(),
);

export const openEvaluationDialog = createAction(
  '[MISSION ENROLLMENTS] Open Evaluation Dialog',
  props<{ mission: Mission }>(),
);

export const loadTracking = createAction(
  '[MISSION ENROLLMENTS] Load Tracking Enrollment',
  props<{ enrollment: Enrollment }>(),
);

export const loadTrackingSuccess = createAction('[MISSION ENROLLMENTS] Load Tracking Enrollment Success');

export const loadTrackingFailure = createAction(
  '[MISSION ENROLLMENTS] Load Tracking Enrollment Failure',
  props<{ error: Error }>(),
);

export const approveEnrollment = createAction(
  '[MISSION ENROLLMENTS] Approve Enrollment',
  props<{ id: string; performance: number; status: EnrollmentStatuses }>(),
);

export const approveEnrollmentSuccess = createAction('[MISSION ENROLLMENTS] Approve Enrollment Success');

export const approveEnrollmentFailure = createAction(
  '[MISSION ENROLLMENTS] Approve Enrollment Failure',
  props<{ error: Error }>(),
);

export const approveEnrollmentCertificate = createAction(
  '[MISSION ENROLLMENTS] Approve Enrollment Certificate',
  props<{ id: string; performance: number }>(),
);

export const approveEnrollmentCertificateSuccess = createAction(
  '[MISSION ENROLLMENTS] Approve Enrollment Certificate Success',
);

export const approveEnrollmentCertificateFailure = createAction(
  '[MISSION ENROLLMENTS] Approve Enrollment Certificate Failure',
  props<{ error: Error }>(),
);

export const setPresentialLiveApproval = createAction(
  '[MISSION ENROLLMENTS] Set Presential Live Enrollment Approval',
  props<{ id: string; approved: boolean }>(),
);

export const setPresentialLiveApprovalSuccess = createAction(
  '[MISSION ENROLLMENTS] Set Presential Live Approval Success',
);

export const setPresentialLiveApprovalFailure = createAction(
  '[MISSION ENROLLMENTS] Set Presential Live Enrollment Approval Failure',
  props<{ error: Error }>(),
);

export const finishPresentialLive = createAction(
  '[MISSION ENROLLMENTS] Finish Presential Live Enrollment',
  props<{ id: string }>(),
);

export const finishPresentialLiveSuccess = createAction(
  '[MISSION ENROLLMENTS] Finish Presential Live Enrollment Success',
);

export const finishPresentialLiveFailure = createAction(
  '[MISSION ENROLLMENTS] Finish Presential Live Enrollment Failure',
  props<{ error: Error }>(),
);

export const extendGoalDateEnrollment = createAction(
  '[MISSION ENROLLMENTS] Extend Goal Date Enrollment',
  props<{ id: string; goalDate: string }>(),
);

export const extendGoalDateEnrollmentSuccess = createAction(
  '[MISSION ENROLLMENTS] Extend Goal Date Enrollment Success',
);

export const extendGoalDateEnrollmentFailure = createAction(
  '[MISSION ENROLLMENTS] Extend Goal Date Enrollment Failure',
  props<{ error: Error }>(),
);

export const rejectEnrollmentCertificate = createAction(
  '[MISSION ENROLLMENTS] Reject Enrollment Certificate',
  props<{ id: string; message: string }>(),
);

export const rejectEnrollmentCertificateSuccess = createAction(
  '[MISSION ENROLLMENTS] Reject Enrollment Certificate Success',
);

export const rejectEnrollmentCertificateFailure = createAction(
  '[MISSION ENROLLMENTS] Reject Enrollment Certificate Failure',
  props<{ error: Error }>(),
);

export const requestExtendDeadline = createAction(
  '[MISSION ENROLLMENTS] Request Deadline Enrollment',
  props<{ id: string }>(),
);

export const requestExtendDeadlineSuccess = createAction('[MISSION ENROLLMENTS] Request Deadline Enrollment Success');

export const requestExtendDeadlineFailure = createAction(
  '[MISSION ENROLLMENTS] Request Deadline Enrollment Failure',
  props<{ error: Error }>(),
);

export const deleteEnrollment = createAction('[MISSION ENROLLMENTS] Delete Enrollment', props<{ id: string }>());

export const deleteEnrollmentSuccess = createAction('[MISSION ENROLLMENTS] Delete Enrollment Success');

export const deleteEnrollmentFailure = createAction(
  '[MISSION ENROLLMENTS] Delete Enrollment Failure',
  props<{ error: Error }>(),
);

export const loadEnrollmentHistory = createAction(
  '[MISSION ENROLLMENTS] Load Enrollment History',
  props<{ id: string }>(),
);

export const loadEnrollmentHistorySuccess = createAction(
  '[MISSION ENROLLMENTS] Load Enrollment History Success',
  props<{ approve_msg: string }>(),
);

export const loadEnrollmentHistoryFailure = createAction(
  '[MISSION ENROLLMENTS] Load Enrollment History Failure',
  props<{ error: Error }>(),
);

export const restartEnrollment = createAction(
  '[MISSION ENROLLMENTS] Restart Enrollment',
  props<{ id: string; goalDate: string }>(),
);

export const restartEnrollmentSuccess = createAction('[MISSION ENROLLMENTS] Restart Enrollment Success');

export const restartEnrollmentFailure = createAction(
  '[MISSION ENROLLMENTS] Restart Enrollment Failure',
  props<{ error: Error }>(),
);

export const retakeEnrollment = createAction(
  '[MISSION ENROLLMENTS] Retake Enrollment',
  props<{ id: string; goalDate: string }>(),
);

export const retakeEnrollmentSuccess = createAction('[MISSION ENROLLMENTS] Retake Enrollment Success');

export const retakeEnrollmentFailure = createAction(
  '[MISSION ENROLLMENTS] Retake Enrollment Failure',
  props<{ error: Error }>(),
);

export const giveUpEnrollment = createAction(
  '[MISSION ENROLLMENTS] Give Up Enrollment',
  props<{ id: string; message: string }>(),
);

export const giveUpEnrollmentSuccess = createAction('[MISSION ENROLLMENTS] Give Up Enrollment Success');

export const giveUpEnrollmentFailure = createAction(
  '[MISSION ENROLLMENTS] Give Up Enrollment Failure',
  props<{ error: Error }>(),
);

export const reEnrollEnrollment = createAction(
  '[MISSION ENROLLMENTS] Re-Enroll Enrollment',
  props<{ id: string; goalDate: string; userId: string }>(),
);

export const reEnrollEnrollmentSuccess = createAction('[MISSION ENROLLMENTS] Re-Enroll Enrollment Success');

export const reEnrollEnrollmentFailure = createAction(
  '[MISSION ENROLLMENTS] Re-Enroll Enrollment Failure',
  props<{ error: Error }>(),
);

export const finishExternalMission = createAction(
  '[MISSION ENROLLMENTS] Finish external mission',
  props<{ enrollment: Enrollment }>(),
);

export const finishExternalMissionSuccess = createAction('[MISSION ENROLLMENTS] Finish external mission Success');

export const finishExternalMissionFailure = createAction(
  '[MISSION ENROLLMENTS] Finish external mission Failure',
  props<{ error: Error }>(),
);

export const setEnrollment = createAction('[MISSION ENROLLMENTS] Set Enrollment', props<{ enrollment: Enrollment }>());

export const postEvaluation = createAction(
  '[MISSION ENROLLMENTS] Post evaluation',
  props<{ payload: RawEvaluation; enrollment: Enrollment }>(),
);

export const postEvaluationSuccess = createAction('[MISSION ENROLLMENTS] Post evaluation Success');

export const postEvaluationFailure = createAction(
  '[MISSION ENROLLMENTS] Post evaluation Failure',
  props<{ error: Error }>(),
);

export const resetEnrollments = createAction('[MISSION ENROLLMENTS] Reset Enrollments');

export const resetEnrollmentHistory = createAction('[MISSION ENROLLMENTS] Reset Enrollment History');

export const fetchMoreItems = createAction('[MISSION ENROLLMENTS] Fetch More Items');

export const fetchMoreItemsSuccess = createAction(
  '[MISSION ENROLLMENTS] Fetch More Items Success',
  props<{ enrollments: Enrollment[]; count: number; next: string }>(),
);

export const fetchStatusOptions = createAction(
  '[MISSION ENROLLMENTS] Fetch Status Options',
  props<{ enrollmentType: EnrollmentType }>(),
);

export const fetchStatusOptionsSuccess = createAction(
  '[MISSION ENROLLMENTS] Fetch Status Options Success',
  props<{ statuses: KpFilterSelectOption[] }>(),
);

export const openMission = createAction('[MISSION ENROLLMENTS] Open Mission', props<{ enrollment: Enrollment }>());
