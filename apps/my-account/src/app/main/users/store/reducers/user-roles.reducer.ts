import { ApplicationWithRoles, UserApplicationRoles } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createReducer, on } from '@ngrx/store';
import { UserRolesActions } from '../actions';

export const userRolesFeatureKey = 'userRoles';

export interface UserRolesState {
  applications: ApplicationWithRoles[];
  userRoles: UserApplicationRoles[];
  isLoading: boolean;
  applicationsLoaded: boolean;
  userRolesLoaded: boolean;
}

export const initialState: UserRolesState = {
  applications: [],
  userRoles: [],
  isLoading: false,
  applicationsLoaded: false,
  userRolesLoaded: false,
};

export const reducer = createReducer(
  initialState,

  on(
    UserRolesActions.loadApplicationsSuccess,
    (state, { applications }): UserRolesState => ({
      ...state,
      applications,
      applicationsLoaded: true,
    }),
  ),

  on(
    UserRolesActions.loadUserRolesSuccess,
    (state, { userRoles }): UserRolesState => ({
      ...state,
      userRoles,
      userRolesLoaded: true,
    }),
  ),

  on(UserRolesActions.resetState, (): UserRolesState => {
    return { ...initialState };
  }),
);
