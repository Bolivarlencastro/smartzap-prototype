import { WorkspaceBasicDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';
import { WorkspaceViewMode } from '../models/workspaces.model';

export const loadWorkspaces = createAction('[WORKSPACES] Load Workspaces');

export const loadWorkspacesSuccess = createAction(
  '[WORKSPACES] Load Workspaces Sucess',
  props<{ results: WorkspaceBasicDto[] }>(),
);

export const loadWorkspacesFailure = createAction('[WORKSPACES] Load Workspaces Failure', props<{ error: any }>());

export const selectWorkspace = createAction('[WORKSPACES] Select Workspace', props<{ workspace: WorkspaceBasicDto }>());

export const initViewPreferences = createAction('[WORKSPACES] Init View Preferences');

export const setViewMode = createAction('[WORKSPACES] Set View Mode', props<{ viewMode: WorkspaceViewMode }>());

export const toggleViewMode = createAction('[WORKSPACES] Toggle View Mode');

export const setCanUseListView = createAction(
  '[WORKSPACES] Set Can Use List View',
  props<{ canUseListView: boolean }>(),
);

export const resetState = createAction('[WORKSPACES] Reset state');
