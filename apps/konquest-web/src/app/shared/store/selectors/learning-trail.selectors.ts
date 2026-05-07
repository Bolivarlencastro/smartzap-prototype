import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromLearningTrail from '../reducers/learning-trail.reducer';

export const selectLearningTrailState = createFeatureSelector<fromLearningTrail.State>(fromLearningTrail.featureKey);

export const selectAll = createSelector(selectLearningTrailState, fromLearningTrail.selectAll);
export const selectIsLoading = createSelector(selectLearningTrailState, (state) => state.isLoading);
export const selectTotal = createSelector(selectLearningTrailState, (state) => state.total);
export const selectPage = createSelector(selectLearningTrailState, (state) => state.page);
export const selectLoaded = createSelector(selectLearningTrailState, (state) => selectAll.length >= state.total);
