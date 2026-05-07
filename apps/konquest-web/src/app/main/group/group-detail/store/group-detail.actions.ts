import { createAction, props } from '@ngrx/store';
import { Group } from '../../groups/group.model';

export const getGroupDetail = createAction('[Group Detail] Get Group Detail', props<{ id: string }>());
export const getGroupDetailSuccess = createAction('[Group Detail] Get Group Detail Success', props<{ group: Group }>());

export const reset = createAction('[Group Detail] Reset');
