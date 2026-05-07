import { createAction, props } from '@ngrx/store';
import { UserImportErrorItemDto } from 'app/main/users/user-import-types';

export const loadUserImportErrors = createAction(
  '[User Import Errors] Load User Import Errors',
  props<{ importId: string }>(),
);

export const loadUserImportErrorsSuccess = createAction(
  '[UserImports API] Load User Import Errors Success',
  props<{ results: UserImportErrorItemDto[] }>(),
);

export const loadUserImportErrorsFailure = createAction(
  '[User Import Errors API] Load User Import Errors Failure',
  props<{ error: unknown }>(),
);

export const resetState = createAction('[User Import Errors] Reset State');
