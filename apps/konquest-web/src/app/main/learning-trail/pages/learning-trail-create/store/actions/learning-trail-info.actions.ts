import { LearningTrailType } from '@app/main/learning-trail/model/learning-trail';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Learning Trail Create] Init');

export const loadTypes = createAction('[Learning Trail Create] Load Types');

export const loadTypesSuccess = createAction(
  '[Learning Trail Create] Load Types Success',
  props<{ types: LearningTrailType[] }>(),
);

export const loadTypesFailure = createAction('[Learning Trail Create] Load Types Failure');
