import { createAction, props } from '@ngrx/store';
import { User } from '@keeps-platform-frontend-workspace/kp-keeps';

export const getMissionContributor = createAction(
  '[MissionDetail] Get Mission Contributor',
  props<{ mission_id: string }>(),
);

export const getMissionContributorSuccess = createAction(
  '[MissionDetail] Get Mission Contributor Success',
  props<{ contributors: any[] }>(),
);

export const getMissionContributorFailure = createAction(
  '[MissionDetail] Get Mission Contributor Failure',
  props<{ errorMsg: string }>(),
);

export const addMissionContributor = createAction(
  '[MissionDetail] Add Mission Contributor',
  props<{ mission_id: any; user_id: any }>(),
);

export const addMissionContributorSuccess = createAction(
  '[MissionDetail] Add Mission Contributor Success',
  props<{ contributors: any[] }>(),
);

export const addMissionContributorFailure = createAction(
  '[MissionDetail] Add Mission Contributor Failure',
  props<{ errorMsg: string }>(),
);

export const deleteMissionContributor = createAction(
  '[MissionDetail] Delete Mission Contributor',
  props<{ mission_id: string; user_id: string }>(),
);

export const deleteMissionContributorSuccess = createAction('[MissionDetail] Delete Mission Contributor Success');

export const deleteMissionContributorFailure = createAction(
  '[MissionDetail] Delete Mission Contributor Failure',
  props<{ errorMsg: string }>(),
);

export const getUsers = createAction('[MissionDetail] Get Users', props<{ per_page: string; search: string }>());

export const getUsersSuccess = createAction('[MissionDetail] Get Users Success', props<{ users: User[] }>());

export const getUsersFailure = createAction('[MissionDetail] Get Users Failure', props<{ errorMsg: string }>());

export const cleanCache = createAction('[Mission Detail Contributors] Clean cache');
