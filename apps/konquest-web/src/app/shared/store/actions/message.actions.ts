import { createAction, props } from '@ngrx/store';

export const success = createAction(
  '[MESSAGE] SUCCESS',
  props<{
    message: string;
    interpolateParams?: Record<string, string>;
  }>(),
);

export const info = createAction(
  '[MESSAGE] ERROR',
  props<{
    message: string;
    interpolateParams?: Record<string, string>;
  }>(),
);

export const error = createAction(
  '[MESSAGE] ERROR',
  props<{
    message: string;
    interpolateParams?: Record<string, string>;
  }>(),
);
