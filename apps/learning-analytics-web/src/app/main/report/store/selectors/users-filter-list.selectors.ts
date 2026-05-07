import { createSelector } from '@ngrx/store';
import * as fromStore from '../reducers';
import * as fromUsersFilterList from '../reducers/users-filter-list.reducer';

const { selectAll } = fromUsersFilterList.adapter.getSelectors();

export const selectUsersFilterListState = createSelector(
  fromStore.selectReportsState,
  (state) => state.usersFilterList,
);

export const selectIsLoading = createSelector(selectUsersFilterListState, (state) => state.loading);
export const selectItems = createSelector(selectUsersFilterListState, selectAll);
export const selectFilter = createSelector(selectUsersFilterListState, (state) => state.filter);
export const selectLoaded = createSelector(selectUsersFilterListState, (state) => state.loaded);
export const selectHasNoItems = createSelector(
  selectUsersFilterListState,
  (state) => state.loaded && !state.ids.length && !state.loading,
);
