import { JobModel } from '@app/main/job-management/models';
import { UploadWorkspaceImageDto } from '@app/shared/dto';
import { CustomMenuItem, Workspace } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Global Settings] Init', props<{ workspaceId: string }>());

export const setSettingsOnInit = createAction(
  '[Global Settings] Set Settings On Init',
  props<{ workspace: Workspace }>(),
);

export const updateJobs = createAction('[Global Settings] Update Jobs', props<{ jobs: JobModel[] }>());

export const setCustomMenuItems = createAction(
  '[Global Settings] Set Custom Menu Items',
  props<{ customMenuItems: CustomMenuItem[] }>(),
);

export const createWorkspace = createAction('[Global Settings] Create Workspace', props<{ workspace: Workspace }>());

export const updateWorkspace = createAction('[Global Settings] Update Workspace', props<{ workspace: Workspace }>());
export const updateWorkspaceSuccess = createAction(
  '[Global Settings] Update Workspace Success',
  props<{ workspace: Workspace }>(),
);

export const updateWorkspaceCustomColor = createAction(
  '[Global Settings] Update Workspace Custom Color',
  props<{ custom_color: string }>(),
);

export const updateWorkspaceDarkTheme = createAction(
  '[Global Settings] Update Workspace Dark Theme',
  props<{ theme_dark: boolean }>(),
);

export const updateWorkspaceImage = createAction(
  '[Workspace] Update Workspace Image',
  props<{ payload: UploadWorkspaceImageDto }>(),
);

export const deleteWorkspace = createAction('[Global Settings] Delete Workspace', props<{ id: string }>());

export const loadWorkspacesSuccess = createAction(
  '[Global Settings] Load Workspaces Success',
  props<{ hasMultipleWorkspaces: boolean }>(),
);
