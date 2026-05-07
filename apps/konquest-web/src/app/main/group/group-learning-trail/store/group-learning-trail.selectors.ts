import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromGroupLearningTrail from './group-learning-trail.reducer';

export const selectGroupLearningTrailState = createFeatureSelector<fromGroupLearningTrail.State>(
  fromGroupLearningTrail.groupLearningTrailsFeatureKey,
);

export const selectAll = createSelector(selectGroupLearningTrailState, fromGroupLearningTrail.selectAll);
export const selectIsLoading = createSelector(selectGroupLearningTrailState, (state) => state.isLoading);
export const selectTotal = createSelector(selectGroupLearningTrailState, (state) => state.total);
export const selectCurrentPage = createSelector(selectGroupLearningTrailState, (state) => Math.max(state.page - 1, 0));
export const selectPerPage = createSelector(selectGroupLearningTrailState, (state) => state.per_page);
