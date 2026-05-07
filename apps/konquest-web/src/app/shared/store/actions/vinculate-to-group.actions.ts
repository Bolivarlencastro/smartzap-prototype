import { Group } from '@app/main/group/groups/group.model';
import { VinculateGroupType } from '@app/shared/components/vinculate-to-group/models';
import { createAction, props } from '@ngrx/store';

export const openDialog = createAction(
  '[Vinculate To Group] Open Dialog',
  props<{ vinculateType: VinculateGroupType; contentId: string }>(),
);

export const loadGroups = createAction('[Vinculate To Group] Load Groups');
export const loadGroupsSuccess = createAction('[Vinculate To Group] Load Groups Success', props<{ groups: Group[] }>());

export const search = createAction('[Vinculate To Group] Search', props<{ search: string }>());

export const vinculate = createAction('[Vinculate To Group] Vinculate', props<{ groupId: string }>());

export const resetState = createAction('[Vinculate To Group] Reset State');
