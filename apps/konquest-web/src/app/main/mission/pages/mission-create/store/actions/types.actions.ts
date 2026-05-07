import { createAction, props } from '@ngrx/store';
import { MissionType } from 'app/main/mission/mission.model';

export const loadTypes = createAction('[MISSION CREATION] Load Types');

export const loadTypesSuccess = createAction(
  '[MISSION CREATION] Load Types Success',
  props<{
    types: MissionType[];
  }>(),
);

export const loadTypesFailure = createAction('[MISSION CREATION] Load Types Failure', props<{ error: any }>());

export const skipTypesLoad = createAction('[MISSION CREATION] Skip Types Load');
