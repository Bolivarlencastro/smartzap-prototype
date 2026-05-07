import { createAction, props } from '@ngrx/store';
import { SetUserApplicationRolesDto } from '@keeps-platform-frontend-workspace/kp-keeps';

export const openDialog = createAction('[USERS IMPORT] Open Dialog');

export const importFileSelected = createAction('[USERS IMPORT] Import File Selected');

export const importUsers = createAction(
  '[USERS IMPORT] Import Users',
  props<{
    selectedRoles: SetUserApplicationRolesDto[];
    temporaryPassword: boolean;
  }>(),
);

export const importUsersSuccess = createAction('[USERS IMPORT] Import Users Success');

export const importUsersFailure = createAction('[USERS IMPORT] Import Users Failure', props<{ error: unknown }>());

export const resetState = createAction('[USERS IMPORT] Reset State');
