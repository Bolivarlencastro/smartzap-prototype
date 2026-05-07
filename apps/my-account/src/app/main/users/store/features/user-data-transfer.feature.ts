import { UserDataTransferOption } from '@app/shared/model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { UserDataTransferActions } from '../actions';

export interface UserDataTransferFeatureState {
  search: string;
  users: UserDataTransferOption[];
}

export const userDataTransferInitialState: UserDataTransferFeatureState = {
  search: '',
  users: [],
};

export const userDataTransferReducer = createReducer(
  userDataTransferInitialState,

  on(
    UserDataTransferActions.loadSourceUsers,
    (state, { search }): UserDataTransferFeatureState => ({ ...state, search }),
  ),

  on(
    UserDataTransferActions.loadSourceUsersSuccess,
    (state, { users }): UserDataTransferFeatureState => ({ ...state, users }),
  ),

  on(UserDataTransferActions.resetState, (): UserDataTransferFeatureState => userDataTransferInitialState),
);

export const userDataTransferFeature = createFeature({
  name: 'userDataTransfer',
  reducer: userDataTransferReducer,
});
