import { createReducer, on } from '@ngrx/store';
import { UserProfileActions } from '../actions';

export const userProfileFeatureKey = 'user-profile';

export interface UserProfileState {
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export const userProfileInitialState: UserProfileState = {
  isAdmin: false,
  isSuperAdmin: false,
};

export const userProfileReducer = createReducer(
  userProfileInitialState,

  on(UserProfileActions.setUserProfileData, (state, { isAdmin, isSuperAdmin }): UserProfileState => {
    return { isAdmin, isSuperAdmin };
  }),
);
