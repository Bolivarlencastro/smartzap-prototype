import { createAction, props } from '@ngrx/store';
import { UserImportItemDto } from 'app/main/users/user-import-types';

export const loadUserImports = createAction('[User Imports] Load User Imports');

export const loadUserImportsSuccess = createAction(
  '[UserImports API] Load User Imports Success',
  props<{ results: UserImportItemDto[] }>(),
);

export const loadUserImportsFailure = createAction(
  '[User Imports API] Load User Imports Failure',
  props<{ error: unknown }>(),
);

export const resetState = createAction('[User Imports] Reset State');
