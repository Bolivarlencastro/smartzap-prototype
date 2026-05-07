import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GlobalSearchReducer } from '../reducers';
import { selectAll } from '../reducers/global-search.reducer';

const selectGlobalSearchState = createFeatureSelector<GlobalSearchReducer.State>(
  GlobalSearchReducer.globalSearchFeatureKey,
);

export const selectItems = createSelector(selectGlobalSearchState, selectAll);
export const selectCount = createSelector(selectGlobalSearchState, (state) => state?.count);
export const selectLoading = createSelector(selectGlobalSearchState, (state) => state?.loading);
export const selectLoadingMore = createSelector(selectGlobalSearchState, (state) => state?.loadingMore);
export const selectFilter = createSelector(selectGlobalSearchState, (state) => state?.filter);
export const selectIsFinished = createSelector(selectGlobalSearchState, (state) => state?.isFinished);
export const selectSearchTerm = createSelector(selectGlobalSearchState, (state) => state?.filter?.search);
export const selectActiveTab = createSelector(selectGlobalSearchState, (state) => state?.filter?.contentType);
export const selectFilterOptions = createSelector(selectGlobalSearchState, (state) => state?.filterOptions);
export const selectTabs = createSelector(selectGlobalSearchState, (state) => state?.tabs);
