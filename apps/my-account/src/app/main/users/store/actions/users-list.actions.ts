import { UserSearchFilter } from '@app/shared/model';
import { createAction, props } from '@ngrx/store';
import { MyAccountV2Pagination, UserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

export const init = createAction('[Users List] Init');

export const loadUsers = createAction('[Users List] Fetch all page users');
export const loadUsersSuccess = createAction(
  '[Users List] Fetch all users success',
  props<{ response: MyAccountV2Pagination<UserProfile> }>(),
);
export const loadUsersFailure = createAction('[Users List] Fetch all users failure', props<{ error: any }>());

export const toggleUserStatus = createAction('[Users List] Toggle user status', props<{ user: UserProfile }>());
export const toggleUserStatusSuccess = createAction(
  '[Users List] Toggle user status success',
  props<{ userId: string }>(),
);
export const toggleUserStatusFailure = createAction('[Users List] Toggle user status failure');

export const setDisplayedColumns = createAction('[Users List] Set Displayed Columns', props<{ columns: string[] }>());

export const search = createAction('[Users List] Search', props<{ search: string }>());

export const filter = createAction('[Users List] Filter', props<{ data: UserSearchFilter }>());

export const changePage = createAction('[Users List] Change Page', props<{ pageEvent: PageEvent }>());

export const sort = createAction('[Users List] Sort', props<{ sort: Sort }>());

export const clear = createAction('[Users Clear] Clear users state');
