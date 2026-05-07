import { createAction, props } from '@ngrx/store';
import { User, UsersFilter } from '../../model';
import { Page } from '@app/shared/model';

export const init = createAction('[Users] Initialize Users Component');
export const loadUsers = createAction('[Users] Load users', props<{ page?: Page }>());
export const loadUsersFailure = createAction('[Users] Load Users Failure', props<{ error: Error }>());
export const searchUsers = createAction('[Users] Search user by name', props<{ searchTerm: string }>());
export const sortUsers = createAction('[Users] Sort users', props<{ sort: string }>());
export const loadUsersSuccess = createAction('[Users] Load Users Success', props<{ data: any }>());
export const removeUser = createAction('[Users] Remove User', props<{ id: string }>());
export const removeUserSuccess = createAction('[Users] Remove User Success', props<{ id: string }>());
export const removeUserFailure = createAction('[Users] Remove User Failure', props<{ error: Error }>());
export const generateUserReport = createAction('[User] Generate User Report', props<{ data: any }>());

export const toggleSelectUser = createAction('[User] Toggle Select User', props<{ id: string; selected: boolean }>());
export const toggleSelectAll = createAction('[User] Toggle Select All');

export const updateUser = createAction('[User] Update User', props<{ id: string; user: Omit<User, 'id'> }>());
export const updateUserSuccess = createAction('[User] Update User Success', props<{ user: User }>());
export const updateUserFailure = createAction('[User] Update User Failure', props<{ error: any }>());

export const fetchMoreUsers = createAction('[User] Fetch More Users');
export const setUserPagination = createAction(
  '[Users] Set User Pagination',
  props<{ currentPage: number; per_page: number }>(),
);

export const filterUsers = createAction('[Users] Filter Users', props<{ filters: UsersFilter }>());
