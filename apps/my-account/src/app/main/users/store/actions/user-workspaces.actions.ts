import { createAction, props } from '@ngrx/store';
import {
  ApplicationWithRoles,
  SetUserApplicationRolesDto,
  UserApplicationRoles,
  WorkspaceListDto,
} from '@keeps-platform-frontend-workspace/kp-keeps';

export const loadUserWorkspacesSuccess = createAction(
  '[USER WORKSPACES] Load Workspaces Success',
  props<{ workspaces: WorkspaceListDto[] }>(),
);

export const loadUserWorkspacesFailure = createAction(
  '[USER WORKSPACES] Load Workspaces Failure',
  props<{ error: unknown }>(),
);

export const openAddWorkspaceDialog = createAction('[USER WORKSPACES] Open Add Workspace Dialog');

export const loadAdminWorkspacesSuccess = createAction(
  '[USER WORKSPACES] Load Admin Workspaces Success',
  props<{
    workspaces: WorkspaceListDto[];
  }>(),
);

export const loadAdminWorkspacesFailure = createAction(
  '[USER WORKSPACES] Load Admin Workspaces Failure',
  props<{ error: unknown }>(),
);

export const selectWorkspace = createAction('[USER WORKSPACES] Select Workspace', props<{ workspaceId: string }>());

export const openRemoveUserFromWorkspaceDialog = createAction(
  '[USER WORKSPACES] Open Remove User From Workspace Dialog',
  props<{ workspaceId: string }>(),
);

export const removeUserFromWorkspaceSuccess = createAction(
  '[USER WORKSPACES] Open Remove From Workspace Success',
  props<{ workspaceId: string }>(),
);

export const removeUserFromWorkspaceFailure = createAction(
  '[USER WORKSPACES] Open Remove From Workspace Failure',
  props<{ error: unknown }>(),
);

export const openEditWorkspaceDialog = createAction(
  '[USER WORKSPACES] Open Edit Workspace Dialog',
  props<{ workspaceId: string }>(),
);

export const loadWorkspaceApplications = createAction('[USER WORKSPACES] Load Workspace Applications');

export const loadWorkspaceApplicationsSuccess = createAction(
  '[USER WORKSPACES] Load Workspace Applications Success',
  props<{ applications: ApplicationWithRoles[] }>(),
);

export const loadWorkspaceApplicationsFailure = createAction(
  '[USER WORKSPACES] Load Workspace Applications Failure',
  props<{ error: unknown }>(),
);

export const loadWorkspaceUserRoles = createAction('[USER WORKSPACES] Load Workspace User Roles');

export const loadWorkspaceUserRolesSuccess = createAction(
  '[USER WORKSPACES] Load Workspace User Roles Success',
  props<{ roles: UserApplicationRoles[] }>(),
);

export const loadWorkspaceUserRolesFailure = createAction(
  '[USER WORKSPACES] Load Workspace User Roles Failure',
  props<{ error: unknown }>(),
);

export const saveRoles = createAction('[USER WORKSPACES] Save Roles', props<{ roles: SetUserApplicationRolesDto[] }>());

export const saveRolesSuccess = createAction('[USER WORKSPACES] Save Roles Success', props<{ userId: string }>());

export const saveRolesFailure = createAction('[USER WORKSPACES] Save Roles Failure', props<{ error: unknown }>());

export const onDialogClosed = createAction('[USER WORKSPACES] Dialog Closed');

export const resetState = createAction('[USER WORKSPACES] Reset State');
