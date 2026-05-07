import { createAction, props } from '@ngrx/store';
import { CaixaSmartZapUser } from '@keeps-platform-frontend-workspace/kp-keeps';

export const checkUserLogin = createAction('[User Login] Check User Login');

export const openDialog = createAction('[User Login] Open Dialog');

export const setUser = createAction('[User Login] Set User', props<{ user: CaixaSmartZapUser }>());

export const searchUserForLogin = createAction('[User Login] Search User For Login', props<{ search: string }>());

export const searchUserForLoginSuccess = createAction(
  '[User Login] Search User For Login Success',
  props<{ user: CaixaSmartZapUser }>(),
);

export const searchUserForLoginFailure = createAction(
  '[User Login] Search User For Login Failure',
  props<{ error: unknown }>(),
);

export const clearCurrentUser = createAction('[User Login] Clear Current User');

export const resetDialogState = createAction('[User Login] Reset Dialog State');
