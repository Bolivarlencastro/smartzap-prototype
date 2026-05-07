import { createReducer, on } from '@ngrx/store';
import { UserDetailsActions } from 'app/main/users/store/actions';
import { UserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';

export const userDetailsFeatureKey = 'userDetails';

export interface UserDetailsState {
  user: UserProfile | undefined;
  isLoading: boolean;
  editing: boolean;
  creatingNewUser: boolean;
  activityAreas: string[];
  directors: string[];
  managers: string[];
  filteredLeaders: UserProfile[];
}

export const initialState: UserDetailsState = {
  user: undefined,
  isLoading: true,
  editing: false,
  creatingNewUser: false,
  activityAreas: [],
  directors: [],
  managers: [],
  filteredLeaders: [],
};

export const reducer = createReducer(
  initialState,

  on(
    UserDetailsActions.loadUserSuccess,
    (state, { user }): UserDetailsState => ({
      ...state,
      user,
      isLoading: false,
      editing: true,
    }),
  ),

  on(
    UserDetailsActions.openCreateUser,
    (): UserDetailsState => ({ ...initialState, editing: false, isLoading: false, creatingNewUser: true }),
  ),

  on(
    UserDetailsActions.saveUser,
    (state): UserDetailsState => ({
      ...state,
      isLoading: true,
    }),
  ),

  on(
    UserDetailsActions.saveUserSuccess,
    (state, { user }): UserDetailsState => ({
      ...state,
      user,
      editing: true,
      isLoading: false,
      creatingNewUser: !!state.creatingNewUser,
    }),
  ),

  on(UserDetailsActions.saveUserFailure, (state): UserDetailsState => ({ ...state, isLoading: false })),

  on(
    UserDetailsActions.refreshUserAccess,
    (state): UserDetailsState => ({ ...state, creatingNewUser: !state.creatingNewUser }),
  ),

  on(
    UserDetailsActions.fetchAllEmployeeInfos,
    (state, { activityAreas, directors, managers }): UserDetailsState => ({
      ...state,
      activityAreas,
      directors,
      managers,
    }),
  ),

  on(
    UserDetailsActions.searchLeadersSuccess,
    (state, { users }): UserDetailsState => ({
      ...state,
      filteredLeaders: users,
    }),
  ),

  on(UserDetailsActions.closeUserDetails, UserDetailsActions.openUserDetails, (): UserDetailsState => initialState),
);
