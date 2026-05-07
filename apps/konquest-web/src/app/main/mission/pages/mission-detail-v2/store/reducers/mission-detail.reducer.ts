import { Mission, MissionModelInformation } from 'app/main/mission/mission.model';
import { EnrollmentStatuses, SupportMaterial } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createReducer, on } from '@ngrx/store';
import { MissionDetailActions, MissionOptionsMenuActions } from '../actions';
import { CourseEvaluationActions } from 'app/main/evaluation/store';
import { MissionAction } from '../../builders/models/mission-action';
import { CertificateUploadActions } from 'app/shared/components/certificate-upload';

export const missionDetailFeatureKey = 'mission-detail';

export interface MissionDetailState {
  loading: boolean;
  mission: Mission | undefined;
  actions: MissionAction[];
  actionInProgress: boolean;
  rollbackTrailId: string | undefined;
  supportMaterials: SupportMaterial[];
}

export const initialState: MissionDetailState = {
  loading: true,
  mission: undefined,
  actions: [],
  actionInProgress: false,
  rollbackTrailId: undefined,
  supportMaterials: [],
};

export const missionDetailReducer = createReducer(
  initialState,

  on(
    MissionDetailActions.openMissionDetails,
    (state, { rollbackTrailId }): MissionDetailState => ({
      ...state,
      loading: true,
      rollbackTrailId,
    }),
  ),

  on(MissionDetailActions.setMissionActions, (state, { actions }): MissionDetailState => ({ ...state, actions })),

  on(
    MissionDetailActions.loadMissionSuccess,
    (state, { mission }): MissionDetailState => ({ ...state, mission, loading: false }),
  ),

  on(MissionDetailActions.loadMissionFailure, (state): MissionDetailState => ({ ...state, loading: false })),

  on(CertificateUploadActions.uploadCertificateSuccess, (state): MissionDetailState => {
    if (!state.mission) {
      return state;
    }

    const updatedMission: Mission = structuredClone(state.mission);
    updatedMission.enrollment.status = EnrollmentStatuses.PENDING_VALIDATION;
    return { ...state, mission: updatedMission };
  }),

  on(CourseEvaluationActions.postEvaluationSuccess, (state): MissionDetailState => {
    if (!state?.mission) {
      return state;
    }

    const updatedMission: Mission = structuredClone(state.mission);
    updatedMission.enrollment.evaluated = true;

    return { ...state, mission: updatedMission };
  }),

  on(MissionDetailActions.resetState, (): MissionDetailState => initialState),

  on(MissionOptionsMenuActions.enrollToMission, (state): MissionDetailState => {
    return { ...state, actionInProgress: true };
  }),

  on(
    MissionOptionsMenuActions.enrollToMissionSuccess,
    MissionOptionsMenuActions.enrollToMissionFailure,
    (state): MissionDetailState => {
      return { ...state, actionInProgress: false };
    },
  ),

  on(
    MissionOptionsMenuActions.enrollToMissionSuccess,
    MissionOptionsMenuActions.enrollToPresentialLiveMissionSuccess,
    (state, { enrollment }): MissionDetailState => {
      const updatedMission: Mission = structuredClone(state.mission);

      updatedMission.enrollment = enrollment;
      updatedMission.users_enrolled++;
      incrementAcceptedEnrollments(updatedMission);

      return { ...state, mission: updatedMission };
    },
  ),

  on(MissionOptionsMenuActions.giveUpSuccess, (state, { enrollment }): MissionDetailState => {
    const updatedMission: Mission = structuredClone(state.mission);

    updatedMission.enrollment = enrollment;
    updatedMission.users_enrolled--;
    updatedMission.enrollments_accepted--;

    return { ...state, mission: updatedMission };
  }),

  on(MissionDetailActions.updateMissionSummarySuccess, (state, { summary }): MissionDetailState => {
    const updatedMission: Mission = structuredClone(state.mission);
    updatedMission.summary = summary;
    return { ...state, mission: updatedMission };
  }),

  on(MissionDetailActions.updateLiveMissionSummarySuccess, (state, { description }): MissionDetailState => {
    const updatedMission: Mission = structuredClone(state.mission);
    updatedMission.description = description;
    return { ...state, mission: updatedMission };
  }),

  on(MissionDetailActions.createTagsSuccess, (state, { tags }): MissionDetailState => {
    const updatedMission: Mission = structuredClone(state.mission);
    updatedMission.tags = [...updatedMission.tags, ...tags];
    return { ...state, mission: updatedMission };
  }),

  on(MissionDetailActions.removeTagSuccess, (state, { tagId }): MissionDetailState => {
    const updatedMission: Mission = structuredClone(state.mission);
    updatedMission.tags = updatedMission.tags.filter((tag) => tag.id !== tagId);
    return { ...state, mission: updatedMission };
  }),

  on(MissionOptionsMenuActions.redirectTo, (state): MissionDetailState => ({ ...state, rollbackTrailId: undefined })),

  on(
    MissionDetailActions.setSupportMaterials,
    (state, { supportMaterials }): MissionDetailState => ({ ...state, supportMaterials }),
  ),
);

function incrementAcceptedEnrollments(mission: Mission): void {
  if (missionAllowsAnyEnrollment(mission)) {
    mission.enrollments_accepted++;
  }
}

function missionAllowsAnyEnrollment(mission: Mission) {
  const missionModel: MissionModelInformation | undefined = mission[mission.mission_model?.toLowerCase()];
  return missionModel?.allow_any_enrollment;
}
