import { createSelector } from '@ngrx/store';
import * as fromStore from '../reducers';
import * as fromUsers from '../reducers/users.reducer';

export interface UserSummary {
  total: number;
  synced: number;
  notSynced: number;
}

export const selectCollectionState = createSelector(
  fromStore.selectUseresFeatureState,
  (state: fromStore.UsersState) => state.users,
);

export const selectGetUsers = createSelector(selectCollectionState, fromUsers.selectAll);

export const selectIsLoading = createSelector(selectCollectionState, (state) => state.isLoading);

export const selectGetDatatableQuery = createSelector(selectCollectionState, (state) => state.datatableQuery);

export const selectGetSearchTerm = createSelector(selectGetDatatableQuery, (state) => state.searchTerm);

export const selectGetReportButtons = createSelector(selectCollectionState, (state) => state.reportButtons);

export const selectIsFinished = createSelector(selectCollectionState, (state) => state.finished);

export const selectPage = createSelector(selectGetDatatableQuery, (state) => state.pagination);

export const selectFilters = createSelector(selectCollectionState, (state) => state.filters);

export const selectAvailableTags = createSelector(selectCollectionState, (state) => state.availableTags);

export const selectSelectedUsersCount = createSelector(
  selectGetUsers,
  (users) => users.filter((user) => user.selected).length,
);

export const selectUserSummary = createSelector(selectGetUsers, selectPage, (users, page): UserSummary => {
  return {
    total: page?.count || 0,
    synced: users.filter((u) => !u.sync_check).length,
    notSynced: users.filter((u) => !!u.sync_check).length,
  };
});
