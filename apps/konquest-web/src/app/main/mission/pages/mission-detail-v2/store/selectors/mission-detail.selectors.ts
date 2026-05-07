import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import {
  createEnrollmentInfoTag,
  DEVELOPMENT_STATUS_TAG_TYPE_MAP,
  ENROLLMENT_STATUS_TAG_TYPE_MAP,
} from '@keeps-platform-frontend-workspace/ui/helpers';
import { LearnContentCardTag } from '@keeps-platform-frontend-workspace/ui/models';
import { createSelector } from '@ngrx/store';
import { Mission, MissionModel } from 'app/main/mission/mission.model';
import { MissionDetailDialogFeatureState, MissionDetailReducer } from '../reducers';
import { selectDetailDialogState } from './feature.selectors';
import { selectIsAdmin, selectIsSuperAdmin } from 'app/shared/store/selectors/user-profile.selectors';

const selectMissionDetailState = createSelector(
  selectDetailDialogState,
  (state: MissionDetailDialogFeatureState) => state[MissionDetailReducer.missionDetailFeatureKey],
);

export const selectRollbackTrailId = createSelector(selectMissionDetailState, (state) => state.rollbackTrailId);

export const selectLoading = createSelector(selectMissionDetailState, (state) => state.loading);

export const selectMission = createSelector(selectMissionDetailState, (state) => state.mission);

export const selectMissionTags = createSelector(selectMission, (mission) => buildMissionTags(mission));

export const selectMissionEnrollment = createSelector(selectMission, (mission) => mission?.enrollment);

export const selectActionInProgress = createSelector(selectMissionDetailState, (state) => state.actionInProgress);

export const selectCanEditTags = createSelector(
  selectMission,
  (mission) => mission?.development_status !== DevelopmentStatus.PROCESSING && mission?.is_owner,
);

export const selectMissionId = createSelector(selectMission, (mission) => mission?.id || '');

export const selectMissionModel = createSelector(selectMission, (mission) => mission?.mission_model);

export const selectIsPresentialLiveMission = createSelector(
  selectMissionModel,
  (missionModel) => missionModel === MissionModel.PRESENTIAL || missionModel === MissionModel.LIVE,
);

export const selectMissionProgress = createSelector(selectMission, (mission) => {
  if (mission?.enrollment?.status === EnrollmentStatuses.GIVE_UP) {
    return undefined;
  }
  return mission?.enrollment?.progress;
});

export const selectMissionActions = createSelector(selectMissionDetailState, (state) => state.actions);

export const selectSupportMaterials = createSelector(selectMissionDetailState, (state) => state?.supportMaterials);

export const selectCanManageCourse = createSelector(
  selectMissionDetailState,
  selectIsAdmin,
  selectIsSuperAdmin,
  (state, isAdmin, isSuperAdmin) =>
    state?.mission?.is_owner || state?.mission?.is_contributor || isAdmin || isSuperAdmin,
);

function buildMissionTags(mission: Mission): LearnContentCardTag[] {
  const enrollment = mission?.enrollment;
  const tags: LearnContentCardTag[] = [];

  tags.push({ type: DEVELOPMENT_STATUS_TAG_TYPE_MAP.get(mission?.development_status) });

  if (mission?.expiration_date) {
    tags.push({ type: 'modifier-temporary' });
  }

  if (enrollment?.status) {
    tags.push({ type: ENROLLMENT_STATUS_TAG_TYPE_MAP.get(enrollment.status) });
    const infoTag = createEnrollmentInfoTag(enrollment.status, enrollment.goal_date);

    if (infoTag) {
      tags.push(infoTag);
    }
  }

  if (enrollment?.required) {
    tags.push({ type: 'modifier-required' });
  }

  return tags;
}
