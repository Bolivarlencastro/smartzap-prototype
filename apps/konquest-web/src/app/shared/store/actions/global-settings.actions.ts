import { Service, WorkspaceWithServices } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Global Settings] Init', props<{ workspaceId: string }>());

export const loadWorkspaceDetailsSuccess = createAction(
  '[Global Settings] Load Workspace Details Success',
  props<{ workspace: WorkspaceWithServices }>(),
);

export const loadWorkspaceServicesSuccess = createAction(
  '[Global Settings] Load Workspace Services Success',
  props<{ services: Service[] }>(),
);

export const updateBlockReEnrollment = createAction(
  '[Global Settings] Update Block Re-enrollment',
  props<{ blockReEnrollment: boolean }>(),
);

export const loadWorkspacesSuccess = createAction(
  '[Global Settings] Load Workspaces Success',
  props<{ hasMultipleWorkspaces: boolean }>(),
);
