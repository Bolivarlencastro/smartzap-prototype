import { Workspace } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Global Settings] Init', props<{ workspaceId: string }>());

export const setSettingsOnInit = createAction(
  '[Global Settings] Set Settings On Init',
  props<{ workspace: Workspace }>(),
);

export const loadWorkspacesSuccess = createAction(
  '[Global Settings] Load Workspaces Success',
  props<{ hasMultipleWorkspaces: boolean }>(),
);
