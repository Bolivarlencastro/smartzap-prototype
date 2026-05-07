import { createSelector } from '@ngrx/store';
import { ENROLLMENT_STATUS_COLORS } from '../../modules/enrollments/consts';
import * as fromStore from '../reducers';
import * as fromEnrollments from '../reducers/enrollments.reducer';

export const selectCollectionState = createSelector(
  fromStore.selectCoursesFeatureState,
  (state: fromStore.CoursesState) => state.enrollments,
);

export const selectAll = createSelector(selectCollectionState, fromEnrollments.selectAll);

export const selectGetPage = createSelector(selectCollectionState, (state) => state.page);

export const selectIsLoading = createSelector(selectCollectionState, (state) => state.isLoading);

export const selectGetSort = createSelector(selectCollectionState, (state) => state.sort);

export const selectGetFilter = createSelector(selectCollectionState, (state) => state.filter);

export const buildStatusOptions = (options = Object.keys(ENROLLMENT_STATUS_COLORS)) => {
  return options.map((key) => ({
    label: 'ENROLLMENTS.TABLE.' + key,
    value: key,
    color: ENROLLMENT_STATUS_COLORS[key],
  }));
};
