import { createAction, props } from '@ngrx/store';
import { Group } from 'app/main/group/groups/group.model';

export const loadGroups = createAction('[MISSION CREATION] Load Mission Groups', props<{ missionId: string }>());

export const loadGroupsSuccess = createAction('[MISSION CREATION] Load Groups Success', props<{ groups: Group[] }>());

export const loadGroupsFailure = createAction(
  '[MISSION CREATION] Load Mission Groups Failure',
  props<{ error: any }>(),
);

export const filterGroups = createAction('[MISSION CREATION] Filter Groups', props<{ filter: string }>());

export const filterGroupsSuccess = createAction(
  '[MISSION CREATION] Filter Groups Success',
  props<{ groups: Group[] }>(),
);

export const filterGroupsFailure = createAction('[MISSION CREATION] Filter Groups Failure', props<{ error: any }>());

export const addGroup = createAction('[MISSION CREATION] Add Group', props<{ group: Group }>());

export const addGroupSuccess = createAction('[MISSION CREATION] Add Group Success', props<{ group: Group }>());

export const addGroupFailure = createAction('[MISSION CREATION] Add Group Failure', props<{ error: any }>());

export const removeGroup = createAction('[MISSION CREATION] Remove Group', props<{ group: Group }>());

export const removeGroupSuccess = createAction('[MISSION CREATION] Remove Group Success', props<{ group: Group }>());

export const removeGroupFailure = createAction('[MISSION CREATION] Remove Group Failure', props<{ error: any }>());
