import { Category, Language } from '@app/main/courses/model';
import { SmartzapConfiguration, Workspace } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Global Settings] Init', props<{ workspaceId: string }>());

export const setSettingsOnInit = createAction(
  '[Global Settings] Set Settings On Init',
  props<{ workspace: Workspace }>(),
);

export const setLanguages = createAction('[Global Settings] Set Languages', props<{ languages: Language[] }>());

export const setCategories = createAction('[Global Settings] Set Categories', props<{ categories: Category[] }>());

export const updateSmartzapConfiguration = createAction(
  '[Global Settings] Update Smartzap Configuration',
  props<{ smartzapConfiguration: SmartzapConfiguration }>(),
);

export const updateSmartzapConfigurationSuccess = createAction(
  '[Global Settings] Update Smartzap Configuration Success',
  props<{ smartzapConfiguration: SmartzapConfiguration }>(),
);

export const updateUserTokenExpiration = createAction(
  '[Global Settings] Update User Token Expiration',
  props<{ user_token_expiration: number }>(),
);

export const updateUserTokenExpirationSuccess = createAction(
  '[Global Settings] Update User Token Expiration Success',
  props<{ user_token_expiration: number }>(),
);

export const loadWorkspacesSuccess = createAction(
  '[Global Settings] Load Workspaces Success',
  props<{ hasMultipleWorkspaces: boolean }>(),
);
