import { combineReducers, createFeatureSelector } from '@ngrx/store';
import * as UsersListReducer from './users-list.reducer';
import * as fromRoot from 'app/shared/store/reducers';
import * as UserDetailsReducer from './user-details.reducer';
import * as UserWorkspacesReducer from './user-roles.reducer';

export interface State extends fromRoot.State {
  [featureKey]: UsersState;
}

export const featureKey = 'users';

export interface UsersState {
  [UsersListReducer.featureKey]: UsersListReducer.UsersListState;
  [UserDetailsReducer.userDetailsFeatureKey]: UserDetailsReducer.UserDetailsState;
  [UserWorkspacesReducer.userRolesFeatureKey]: UserWorkspacesReducer.UserRolesState;
}

export const usersInitialState = {
  [featureKey]: {
    [UsersListReducer.featureKey]: UsersListReducer.initialState,
    [UserDetailsReducer.userDetailsFeatureKey]: UserDetailsReducer.initialState,
    [UserWorkspacesReducer.userRolesFeatureKey]: UserWorkspacesReducer.initialState,
  },
};

export const reducers = combineReducers({
  [UsersListReducer.featureKey]: UsersListReducer.reducer,
  [UserDetailsReducer.userDetailsFeatureKey]: UserDetailsReducer.reducer,
  [UserWorkspacesReducer.userRolesFeatureKey]: UserWorkspacesReducer.reducer,
});

export const selectUsersFeatureState = createFeatureSelector<UsersState>(featureKey);

export { UserDetailsReducer, UserWorkspacesReducer, UsersListReducer };
