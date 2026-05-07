import { createAction, props } from '@ngrx/store';
import { MissionAction, MissionActionId } from '../../builders';
import { Enrollment } from '@core/model/enrollment.model';

export const executeAction = createAction(
  '[MISSION DETAILS] Execute Action',
  props<{
    action: MissionAction;
  }>(),
);

export const finishExternalMission = createAction('[MISSION DETAILS] Finish external mission');

export const openAttachCertificate = createAction('[MISSION DETAILS] Open Attach Certificate');

export const openEvaluationDialog = createAction('[MISSION DETAILS] Open Evaluation Dialog');

export const enrollToMission = createAction('[MISSION DETAILS] Enroll To Mission');

export const enrollToMissionSuccess = createAction(
  '[MISSION DETAILS] Enroll To Mission Success',
  props<{
    enrollment: Enrollment;
  }>(),
);

export const enrollToMissionFailure = createAction('[MISSION DETAILS] Enroll To Mission Failure');

export const enrollToPresentialLiveMission = createAction('[MISSION DETAILS] Enroll To Presential/Live Mission');

export const enrollToPresentialLiveMissionSuccess = createAction(
  '[MISSION DETAILS] Enroll To Presential/Live Mission Success',
  props<{
    enrollment: Enrollment;
  }>(),
);

export const enrollToPresentialLiveMissionFailure = createAction(
  '[MISSION DETAILS] Enroll To Presential/Live Mission Failure',
);

export const giveUp = createAction('[MISSION DETAILS] Give Up on Mission');

export const giveUpSuccess = createAction(
  '[MISSION DETAILS] Give Up on Mission Success',
  props<{
    enrollment: Enrollment;
  }>(),
);

export const giveUpFailure = createAction('[MISSION DETAILS] Give Up on Mission Failure');

export const retakeMission = createAction('[MISSION DETAILS] Retake Mission');

export const retakeMissionSuccess = createAction('[MISSION DETAILS] Retake Mission Success');

export const retakeMissionFailure = createAction('[MISSION DETAILS] Retake Mission Failure');

export const finishMission = createAction('[MISSION DETAILS] Finish Presential/Live Mission');

export const redirectTo = createAction('[MISSION DETAILS] Redirect To', props<{ redirectType: MissionActionId }>());

export const certificateHistory = createAction('[MISSION DETAILS] Open Certificate History Dialog');

export const finishPresentialLiveMission = createAction('[MISSION DETAILS] Finish Presential Live Mission');

export const finishPresentialLiveMissionFailure = createAction(
  '[MISSION DETAILS] Finish Presential Live Mission Failure',
);

export const generatePresentialLiveCertificate = createAction(
  '[MISSION DETAILS] Generate Presential Live Certificate',
  props<{ id?: string }>(),
);

export const generatePresentialLiveCertificateFailure = createAction(
  '[MISSION DETAILS] Generate Presential Live Certificate Failure',
);

export const enterToLiveEventEnrolled = createAction('[MISSION DETAILS] Enter To Live Event Enrolled');

export const enterToLiveEventNotEnrolled = createAction('[MISSION DETAILS] Enter To Live Event Not Enrolled');

export const enterToLiveEventNotEnrolledSuccess = createAction(
  '[MISSION DETAILS] Enter To Live Event Not Enrolled Success',
  props<{
    enrollment: Enrollment;
  }>(),
);
