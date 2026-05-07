import { createSelector } from '@ngrx/store';
import * as fromStore from '../reducers';
import * as fromEnrollments from '../reducers/enrollments.reducer';

export const selectCollectionState = createSelector(
  fromStore.selectSettingsFeatureState,
  (state: fromStore.SettingsState) => state.enrollments,
);

export const selectAll = createSelector(selectCollectionState, fromEnrollments.selectAll);

export const selectPagination = createSelector(selectCollectionState, (state) => state.page);

export const selectSort = createSelector(selectCollectionState, (state) => state.sort);

export const selectFilter = createSelector(selectCollectionState, (state) => state.filter);

export const selectStatistics = createSelector(selectCollectionState, (state) => state.statistics);

export const selectIsLoading = createSelector(selectCollectionState, (state) => state.isLoading);

export const selectEnrollmentTracking = createSelector(selectCollectionState, (state) => state.enrollmentTracking);

export const selectIsLoadingEnrollmentTracking = createSelector(
  selectCollectionState,
  (state) => state.isLoadingEnrollmentTracking,
);
