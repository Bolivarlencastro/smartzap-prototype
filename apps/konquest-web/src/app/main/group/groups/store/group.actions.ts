import { Pagination } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';
import { Group, ImportType } from '../group.model';

export const loadGroups = createAction('[Group/API] Load Groups');

export const loadGroupsSuccess = createAction(
  '[Group/API] Load Groups Success',
  props<{ pagination: Pagination<Group> }>(),
);

export const loadGroupsFailure = createAction('[Group/API] Load Group Failure', props<{ error: Error }>());

// Update Actions
export const updateGroup = createAction('[Group/API] Update Group', props<{ id: string; data: any }>());

export const updateGroupSuccess = createAction('[Group/API] Update Group Success');

export const updateGroupFailure = createAction('[Group/API] Update Group Failure', props<{ error: Error }>());

// Delete Actions
export const deleteGroup = createAction('[Group/API] Delete Group', props<{ id: string }>());

export const deleteGroupSuccess = createAction('[Group/API] Delete Group Success', props<{ id: string }>());

export const deleteGroupFailure = createAction('[Group/API] Delete Group Failure', props<{ error: Error }>());

// Import Actions
export const importGroup = createAction(
  '[Group/API] Import Group Users',
  props<{
    data: any;
    objectType: ImportType;
    goal_date?: string;
  }>(),
);

export const importGroupSuccess = createAction('[Group/API] Import Success', props<{ data: any }>());

export const importGroupFailure = createAction('[Group/API] Import Group  Failure', props<{ error: string }>());

// Clear Actions
export const clearCache = createAction('[Group] Clear Group Cache');

export const setPagination = createAction('[Group] Set Pagination', props<{ page: number; per_page: number }>());

export const updateFilter = createAction('[Group] Update Filter', props<{ search: string }>());
