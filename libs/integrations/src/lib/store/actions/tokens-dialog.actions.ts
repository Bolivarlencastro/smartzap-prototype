import { createAction, props } from '@ngrx/store';
import { IntegrationTokensDto } from '@keeps-platform-frontend-workspace/kp-keeps';

export const openDialog = createAction('[TOKENS DIALOG] Open Dialog');

export const loadTokensSuccess = createAction(
  '[TOKENS DIALOG] Load Workspace Tokens Success',
  props<{
    tokens: IntegrationTokensDto;
  }>(),
);

export const loadTokensFailure = createAction('[TOKENS DIALOG] Load Workspace Tokens Failure');

export const saveTokens = createAction(
  '[TOKENS DIALOG] Save Workspace Tokens',
  props<{ tokens: IntegrationTokensDto }>(),
);

export const saveTokensSuccess = createAction('[TOKENS DIALOG] Save Workspace Tokens Success');

export const saveTokensFailure = createAction('[TOKENS DIALOG] Save Workspace Tokens Failure');

export const reset = createAction('[TOKENS DIALOG] Reset State');
