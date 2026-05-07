import { createAction, props } from '@ngrx/store';

export const loadLearningTrails = createAction(
  '[Learning Trail/API] Load Learning Trails',
  props<{ queryParams?: Record<string, unknown> }>(),
);

export const filterLearningTrails = createAction(
  '[Learning Trail/API] Filter Learning Trails',
  props<{ queryParams?: Record<string, unknown> }>(),
);

export const loadLearningTrailsSuccess = createAction(
  '[Learning Trail/API] Load Learning Trails Success',
  props<{ data: any }>(),
);

export const loadLearningTrailsFailure = createAction(
  '[Learning Trail/API] Load Learning Trails Failure',
  props<{ error: Error }>(),
);

export const clearCache = createAction('[LearningTrail] Clear Learning Trails Cache');
