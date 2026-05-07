import { createAction, props } from '@ngrx/store';

export const loadMissions = createAction(
  '[Mission/API] Load Missions',
  props<{ queryParams?: Record<string, unknown> }>(),
);

export const filterMissions = createAction(
  '[Mission/API] Filter Missions',
  props<{ queryParams?: Record<string, unknown> }>(),
);

export const loadMissionsSuccess = createAction('[Mission/API] Load Missions Success', props<{ data: any }>());

export const loadMissionsFailure = createAction('[Mission/API] Load Missions Failure', props<{ error: Error }>());

export const clearCache = createAction('[Mission] Clear Missions Cache');
