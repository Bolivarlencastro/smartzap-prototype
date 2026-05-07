import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUserProfileReducer from '../reducers/user-profile.reducer';

const selectUserProfileState = createFeatureSelector<fromUserProfileReducer.UserProfileState>(
  fromUserProfileReducer.userProfileFeatureKey,
);

export const selectIsAdmin = createSelector(selectUserProfileState, (state) => state?.isAdmin);

export const selectIsSuperAdmin = createSelector(selectUserProfileState, (state) => state?.isSuperAdmin);
