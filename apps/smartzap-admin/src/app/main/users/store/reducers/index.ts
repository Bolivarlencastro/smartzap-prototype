import * as fromRoot from 'app/shared/store/reducers';
import * as fromUsers from './users.reducer';

import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';

export const usersFeatureKey = 'users';

export interface UsersState {
  [fromUsers.usersFeatureKey]: fromUsers.State;
}

export interface State extends fromRoot.State {
  [usersFeatureKey]: UsersState;
}

export function reducers(
  state: UsersState | undefined,
  action: Action,
): { [fromUsers.usersFeatureKey]: fromUsers.State } {
  return combineReducers({
    [fromUsers.usersFeatureKey]: fromUsers.reducer,
  })(state, action);
}

export const selectUseresFeatureState = createFeatureSelector<UsersState>(usersFeatureKey);
