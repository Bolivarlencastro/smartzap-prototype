import { createAction, props } from '@ngrx/store';
import { UserRole } from '@keeps-platform-frontend-workspace/kp-keeps';

export const loadUsersByRoleId = createAction('[Transfer] Load users by RoleId', props<{ roleId: string }>());
export const loadUsersByRoleIdFailure = createAction(
  '[Transfer] Load Users by RoleId Failure',
  props<{ error: Error }>(),
);
export const loadUsersByRoleIdSuccess = createAction(
  '[Transfer] Load Users by RoleId Success',
  props<{ users: UserRole[] }>(),
);
export const transferOwnership = createAction(
  '[Transfer] Transfer Ownership',
  props<{ courseId: string; userId: string }>(),
);
export const transferOwnershipFailure = createAction(
  '[Transfer] Transfer Ownership Failure',
  props<{ error: Error }>(),
);
export const transferOwnershipSuccess = createAction(
  '[Transfer] Transfer Ownership Success',
  props<{ transfer: any; courseId: string }>(),
);

export const clear = createAction('[Transfer] Clear Tracking State');
