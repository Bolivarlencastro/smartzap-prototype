import { createFeatureSelector, createSelector } from '@ngrx/store';
import { learningTrailDoneKey, LearningTrailEnrollmentsState } from './learning-trail-enrollments.reducer';

export const selectEnrollmentsState = createFeatureSelector<LearningTrailEnrollmentsState>(learningTrailDoneKey);

export const selectEnrollments = createSelector(
  selectEnrollmentsState,
  (state: LearningTrailEnrollmentsState) => state.enrollments,
);

export const selectFilter = createSelector(
  selectEnrollmentsState,
  (state: LearningTrailEnrollmentsState) => state.filter,
);

export const selectIsLoading = createSelector(
  selectEnrollmentsState,
  (state: LearningTrailEnrollmentsState) => state.isLoading,
);

export const selectHistory = createSelector(
  selectEnrollmentsState,
  (state: LearningTrailEnrollmentsState) => state.history,
);

export const selectCurrentPage = createSelector(selectFilter, (filter) => Math.max((filter?.page || 0) - 1, 0));

export const selectPerPage = createSelector(selectFilter, (filter) => filter.per_page);

export const selectFilterByAllUsers = createSelector(
  selectEnrollmentsState,
  (state: LearningTrailEnrollmentsState) => state.filteringAllUsers,
);

export const selectCount = createSelector(
  selectEnrollmentsState,
  (state: LearningTrailEnrollmentsState) => state.count,
);

export const selectSort = createSelector(selectEnrollmentsState, (state: LearningTrailEnrollmentsState) => state.sort);

export const selectIsFinished = createSelector(
  selectEnrollmentsState,
  (state: LearningTrailEnrollmentsState) => state.isFinished,
);

export const selectStatuses = createSelector(
  selectEnrollmentsState,
  (state: LearningTrailEnrollmentsState) => state.statuses,
);

export const selectIsContentCreator = createSelector(
  selectEnrollmentsState,
  (state: LearningTrailEnrollmentsState) => state.isContentCreator,
);
