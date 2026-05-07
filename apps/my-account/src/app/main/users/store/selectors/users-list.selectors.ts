import { createSelector } from '@ngrx/store';
import { UsersState, selectUsersFeatureState } from '../reducers';

const selectUsersListState = createSelector(selectUsersFeatureState, (state: UsersState) => state.usersList);

export const selectUsers = createSelector(selectUsersListState, (state) => state.users);
export const selectIsLoading = createSelector(selectUsersListState, (state) => state.isLoading);
export const selectPage = createSelector(selectUsersListState, (state) => state.filter.pageEvent);
export const selectFilters = createSelector(selectUsersListState, (state) => state.filter);
export const selectDisplayedColumns = createSelector(selectUsersListState, ({ displayedColumns }) => displayedColumns);
export const selectHasAppliedFilter = createSelector(
  selectUsersListState,
  ({ filter }) =>
    !!filter.search ||
    !!filter.roleId?.length ||
    typeof filter.status === 'boolean' ||
    !!filter.jobPositions?.length ||
    !!filter.activityAreas?.length ||
    !!filter.directors?.length ||
    !!filter.managers?.length,
);
