import { createAction, props } from '@ngrx/store';
import { SetUserApplicationRolesDto, UserCreateDTO, UserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';

export const openUserDetails = createAction('[USER DETAILS] Open User Details', props<{ userId: string }>());
export const openCreateUser = createAction('[USER DETAILS] Open Create User');
export const closeUserDetails = createAction('[USER DETAILS] Close User Details');
export const toggleEditMode = createAction('[USER DETAILS] Toggle Edit Mode');

export const loadUser = createAction('[USER DETAILS] Load User', props<{ userId: string }>());
export const loadUserSuccess = createAction('[USER DETAILS] Load User Success', props<{ user: UserProfile }>());
export const loadUserFailure = createAction('[USER DETAILS] Load User Failure');

export const saveUser = createAction(
  '[USER DETAILS] Save User',
  props<{
    user: UserCreateDTO;
    userRoles?: SetUserApplicationRolesDto[];
  }>(),
);
export const saveUserSuccess = createAction('[USER DETAILS] Save User Success', props<{ user: UserProfile }>());
export const saveUserFailure = createAction('[USER DETAILS] Save User Failure');

export const sendEmail = createAction('[USER DETAILS] Send Email');
export const sendEmailSuccess = createAction('[USER DETAILS] Send Email Success');
export const sendEmailFailure = createAction('[USER DETAILS] Send Email Failure');

export const generateTemporaryPassword = createAction('[USER DETAILS] Generate Temporary Password');
export const generateTemporaryPasswordSuccess = createAction(
  '[USER DETAILS] Generate Temporary Password Success',
  props<{
    temporaryPassword: string;
  }>(),
);
export const generateTemporaryPasswordFailure = createAction('[USER DETAILS] Generate Temporary Password Failure');

export const deleteUserFromWorkspace = createAction('[USER DETAILS] Delete User From Workspace');
export const deleteUserFromWorkspaceSuccess = createAction('[USER DETAILS] Delete User From Workspace Success');
export const deleteUserFromWorkspaceFailure = createAction('[USER DETAILS] Delete User From Workspace Failure');

export const fetchAllEmployeeInfos = createAction(
  '[USER DETAILS] Fetch All Employee Infos',
  props<{ activityAreas: string[]; directors: string[]; managers: string[] }>(),
);

export const refreshUserAccess = createAction('[USER DETAILS] Refresh User Access', props<{ userId: string }>());

export const searchLeaders = createAction('[USER DETAILS] User Leader Search', props<{ search: string }>());

export const searchLeadersSuccess = createAction(
  '[USER DETAILS] Search Leaders Success',
  props<{ users: UserProfile[] }>(),
);

export const searchLeadersFailure = createAction('[USER DETAILS] Search Leaders Failure');
