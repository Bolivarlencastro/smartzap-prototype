import { createAction, props } from '@ngrx/store';
import { Mission, MissionTag } from 'app/main/mission/mission.model';
import { MissionAction } from 'app/main/mission/pages/mission-detail-v2/builders/models/mission-action';
import { SupportMaterial } from '@keeps-platform-frontend-workspace/kp-keeps';

export const openMissionDetails = createAction(
  '[MISSION DETAILS] Open Dialog',
  props<{
    missionId: string;
    rollbackTrailId?: string;
  }>(),
);

export const openMissionDetailsFromContainer = createAction(
  '[MISSION DETAILS] Open Dialog From Container',
  props<{ missionId: string }>(),
);

export const reloadMission = createAction('[MISSION DETAILS] Reload Mission');

export const reloadMissionFailure = createAction('[MISSION DETAILS] Reload Mission Failure', props<{ error: any }>());

export const closeMissionDetails = createAction('[MISSION DETAILS] Close Dialog');

export const dialogDestroy = createAction('[MISSION DETAILS] Details Dialog Destroyed');

export const loadMissionSuccess = createAction('[MISSION DETAILS] Load Mission Success', props<{ mission: Mission }>());

export const loadMissionFailure = createAction('[MISSION DETAILS] Load Mission Failure', props<{ error: any }>());

export const resetState = createAction('[MISSION DETAILS] Reset Details State');

export const updateMissionSummary = createAction(
  '[MISSION DETAILS] Update Summary',
  props<{
    summary: string;
  }>(),
);

export const updateMissionSummarySuccess = createAction(
  '[MISSION DETAILS] Update Summary Success',
  props<{
    summary: string;
  }>(),
);

export const updateMissionSummaryFailure = createAction('[MISSION DETAILS] Update Summary Failure');

export const createTags = createAction(
  '[MISSION DETAILS] Create Tags',
  props<{
    tags: string | string[];
  }>(),
);

export const updateLiveMissionSummary = createAction(
  '[MISSION DETAILS] Update Live Summary',
  props<{
    description: string;
  }>(),
);

export const updateLiveMissionSummarySuccess = createAction(
  '[MISSION DETAILS] Update Live Summary Success',
  props<{
    description: string;
  }>(),
);

export const updateLiveMissionSummaryFailure = createAction('[MISSION DETAILS] Update Live Summary Failure');

export const createTagsSuccess = createAction(
  '[MISSION DETAILS] Create Tags Success',
  props<{
    tags: MissionTag[];
  }>(),
);

export const createTagsFailure = createAction('[MISSION DETAILS] Create Tags Failure');

export const removeTag = createAction('[MISSION DETAILS] Remove Tag', props<{ tagId: string }>());

export const removeTagSuccess = createAction('[MISSION DETAILS] Remove Tag Success', props<{ tagId: string }>());

export const removeTagFailure = createAction('[MISSION DETAILS] Remove Tag Failure');

export const setMissionActions = createAction(
  '[MISSION DETAILS] Set Mission Actions',
  props<{
    actions: MissionAction[];
  }>(),
);

export const setSupportMaterials = createAction(
  '[MISSION DETAILS] Set Support Materials',
  props<{ supportMaterials: SupportMaterial[] }>(),
);
