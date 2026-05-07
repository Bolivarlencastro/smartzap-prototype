import { EnrollmentConfig } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[GroupUser/API] Initialize GroupUser', props<{ groupId: string }>());

export const loadGroupUsers = createAction('[GroupUser/API] Load GroupUsers');

export const loadGroupUsersSuccess = createAction('[GroupUser/API] Load GroupUsers Success', props<{ data: any }>());

export const loadGroupUsersFailure = createAction('[GroupUser/API] Load GroupUsers Failure', props<{ error: Error }>());

export const addGroupUsers = createAction(
  '[GroupUser/API] Add GroupUsers',
  props<{ userIds: string[]; enrollment?: EnrollmentConfig }>(),
);

export const deleteGroupUser = createAction(
  '[GroupUser/API] Delete GroupUser',
  props<{
    id: string;
    userId: string;
    removeEnrollments?: boolean;
  }>(),
);

export const deleteGroupUserSuccess = createAction('[GroupUser/API] Delete GroupUser Success', props<{ id: string }>());

export const filter = createAction('[GroupUser/API] Filter GroupUser', props<{ search: string }>());

export const order = createAction('[GroupUser/API] Order GroupUser', props<{ ordering: string }>());

export const filterByDeletedUsers = createAction(
  '[GroupUser/API] Filter By Deleted GroupUser',
  props<{ deleted: boolean }>(),
);

export const setPagination = createAction(
  '[GroupUser/API] Set Pagination',
  props<{ page: number; per_page: number }>(),
);

export const clearCache = createAction('[GroupUser/API] Clear GroupUsers');
