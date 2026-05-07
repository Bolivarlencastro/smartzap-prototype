import { createAction, props } from '@ngrx/store';
import { ApplicationWithRoles, UserApplicationRoles } from '@keeps-platform-frontend-workspace/kp-keeps';

export const loadApplicationsSuccess = createAction(
  '[USER ROLES] Load Applications Success',
  props<{
    applications: ApplicationWithRoles[];
  }>(),
);

export const loadApplicationsFailure = createAction('[USER ROLES] Load Applications Failure');

export const skipApplicationsLoad = createAction('[USER ROLES] Skip Applications Load');

export const loadUserRolesSuccess = createAction(
  '[USER ROLES] Load User Roles Success',
  props<{ userRoles: UserApplicationRoles[] }>(),
);

export const loadUserRolesFailure = createAction('[USER ROLES] Load User Roles Failure');

export const resetState = createAction('[USER ROLES] Reset State');
