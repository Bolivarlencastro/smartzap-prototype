import { createSelector } from '@ngrx/store';
import { selectUsersFeatureState } from 'app/main/users/store/reducers';
import { UserRolesViewModel } from 'app/main/users/users.types';

const selectUserRolesState = createSelector(selectUsersFeatureState, (state) => state.userRoles);

export const selectUserRolesVM = createSelector(selectUserRolesState, (state): UserRolesViewModel => {
  return {
    applications: state.applications,
    userRoles: state.userRoles,
    applicationsLoaded: state.applicationsLoaded,
    userRolesLoaded: state.userRolesLoaded,
  };
});
