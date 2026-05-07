import { createSelector } from '@ngrx/store';
import { selectUsersFeatureState, UsersState } from 'app/main/users/store/reducers';
import { UserDetailViewModel } from 'app/main/users/users.types';
import { UserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';

const selectUserDetailsState = createSelector(selectUsersFeatureState, (state: UsersState) => state.userDetails);

export const selectCurrentUserId = createSelector(selectUserDetailsState, (state) => state.user?.id);

export const selectRefreshAccessesAfterSaving = createSelector(
  selectUserDetailsState,
  (state) => state.creatingNewUser,
);

export const selectUserDetailVM = createSelector(selectUserDetailsState, (state): UserDetailViewModel => {
  const currentUser = state.user;
  return {
    currentUser,
    editing: state.editing,
    loading: state.isLoading,
    activityAreas: state.activityAreas,
    directors: state.directors,
    managers: state.managers,
    filteredLeaders: state.filteredLeaders,
  };
});

export const selectCurrentUser = createSelector(selectUserDetailsState, (state): UserProfile => state.user);
