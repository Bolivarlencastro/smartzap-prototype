import { createAction, props } from '@ngrx/store';
import { GroupMissionActionData } from '../group-mission.model';

export const loadGroupMissions = createAction(
  '[GroupMission/API] Load GroupMissions',
  props<{ id: string; queryParams?: any }>(),
);

export const filterGroupMissions = createAction(
  '[GroupMission/API] Filter GroupMissions',
  props<{ id: string; queryParams?: any }>(),
);

export const loadGroupMissionsSuccess = createAction(
  '[GroupMission/API] Load GroupMissions Success',
  props<{ data: any }>(),
);

export const loadGroupMissionsFailure = createAction(
  '[GroupMission/API] Load GroupMissions Failure',
  props<{ error: Error }>(),
);

export const addGroupMissions = createAction(
  '[GroupMission/API] Add GroupMissions',
  props<{ groupMissionData: GroupMissionActionData }>(),
);

export const addGroupMissionsSuccess = createAction(
  '[GroupMission/API] Add GroupMissions Success',
  props<{ missionIds: string[] }>(),
);

export const deleteGroupMission = createAction(
  '[GroupMission/API] Delete GroupMission',
  props<{ id: string; groupId: string; missionId: string }>(),
);

export const deleteGroupMissionSuccess = createAction('[GroupMission/API] Delete GroupMission Sucess');

export const clearCache = createAction('[GroupMission/API] Clear GroupMissions');
