import { createAction, props } from '@ngrx/store';
import { MyAccountV2Pagination, User } from '@keeps-platform-frontend-workspace/kp-keeps';

export const loadUsers = createAction(
  '[Users/MyAcc API] Load Users',
  props<{ queryParams?: Record<string, unknown> }>(),
);

export const loadUsersSuccess = createAction(
  '[Users/MyAcc API] Load Users Success',
  props<{ data: MyAccountV2Pagination<User> }>(),
);

export const loadUsersFailure = createAction('[Users/MyAcc API] Load Users Failure', props<{ error: Error }>());

export const clearCache = createAction('[Users] Clear Users Cache');

export const applyUserFilter = createAction('[Users] Apply Filter', props<{ search: string }>());
