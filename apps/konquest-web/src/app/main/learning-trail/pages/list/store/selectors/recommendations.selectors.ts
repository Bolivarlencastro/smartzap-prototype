import { createSelector } from '@ngrx/store';
import { LearningTrailsListState, selectLearningTrailsListStateSelector } from '../reducers';

const selectRecommendationsState = createSelector(
  selectLearningTrailsListStateSelector,
  (state: LearningTrailsListState) => state.recommendedLearningTrails,
);

export const selectRecommendations = createSelector(selectRecommendationsState, (state) => state.recommendations);

export const selectIsLoading = createSelector(selectRecommendationsState, (state) => state.isLoading);
