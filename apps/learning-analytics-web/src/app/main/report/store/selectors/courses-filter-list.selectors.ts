import { createSelector } from '@ngrx/store';
import * as fromStore from '../reducers';
import * as fromCoursesFilterList from '../reducers/courses-filter-list.reducer';

const { selectAll } = fromCoursesFilterList.adapter.getSelectors();

export const selectCoursesFilterListState = createSelector(
  fromStore.selectReportsState,
  (state) => state.coursesFilterList,
);

export const selectIsLoading = createSelector(selectCoursesFilterListState, (state) => state.loading);
export const selectItems = createSelector(selectCoursesFilterListState, selectAll);
export const selectFilter = createSelector(selectCoursesFilterListState, (state) => state.filter);
export const selectLoaded = createSelector(selectCoursesFilterListState, (state) => state.loaded);

export const selectHasNoItems = createSelector(
  selectCoursesFilterListState,
  (state) => state.loaded && !state.ids.length && !state.loading,
);
