import { UserDataTransfer } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';
import { UserDataTransferOption } from 'app/shared/model';

export const init = createAction('[User Data Transfer] Init');

export const transferData = createAction('[User Data Transfer] Transfer Data', props<{ data: UserDataTransfer }>());
export const transferDataSuccess = createAction('[User Data Transfer] Transfer Data Success');
export const transferDataFailure = createAction('[User Data Transfer] Transfer Data Failure');

export const loadSourceUsers = createAction('[User Data Transfer] Load Source Users', props<{ search: string }>());
export const loadSourceUsersSuccess = createAction(
  '[User Data Transfer] Load Source User Success',
  props<{ users: UserDataTransferOption[] }>(),
);

export const resetState = createAction('[User Data Transfer] Reset State');
