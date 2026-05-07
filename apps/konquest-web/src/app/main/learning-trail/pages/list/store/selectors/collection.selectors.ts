import { createSelector } from '@ngrx/store';
import { LearningTrailsListState, selectLearningTrailsListStateSelector } from '../reducers';
import { selectAll } from '../reducers/collection.reducer';
import { QuickFilterType } from '@keeps-platform-frontend-workspace/ui/kp-filter';

const selectLearningTrailsCollectionState = createSelector(
  selectLearningTrailsListStateSelector,
  (state: LearningTrailsListState) => state.learningTrailsCollection,
);

export const selectCurrentFilter = createSelector(selectLearningTrailsCollectionState, (state) => state.filter);

export const selectCurrentQuickFilterType = createSelector(
  selectLearningTrailsCollectionState,
  (state) => state.quickFilterType,
);

export const selectLearningTrails = createSelector(selectLearningTrailsCollectionState, selectAll);

export const selectIsLoading = createSelector(selectLearningTrailsCollectionState, (state) => state.isLoading);

export const selectIsFinished = createSelector(selectLearningTrailsCollectionState, (state) => state.finished);

export const selectShowRecommendations = createSelector(
  selectCurrentFilter,
  selectCurrentQuickFilterType,
  (filter, quickFilterType) => {
    return !filter.search && quickFilterType === QuickFilterType.LEARNING_TRAILS;
  },
);
