import * as fromRoot from 'app/shared/store/reducers';
import * as fromLearningTrailsCollection from './collection.reducer';
import * as fromRecommendations from './recommendations.reducer';
import { combineReducers, createFeatureSelector } from '@ngrx/store';

export const learningTrailsListFeatureKey = 'learningTrailsList';

export interface LearningTrailsListState {
  [fromLearningTrailsCollection.featureKey]: fromLearningTrailsCollection.LearningTrailsCollectionState;
  [fromRecommendations.featureKey]: fromRecommendations.RecommendationsState;
}

export const learningTrailsListInitialState = {
  [fromLearningTrailsCollection.featureKey]: fromLearningTrailsCollection.learningTrailsCollectionInitialState,
  [fromRecommendations.featureKey]: fromRecommendations.recommendationsInitialState,
};

export interface State extends fromRoot.State {
  [learningTrailsListFeatureKey]: LearningTrailsListState;
}

export const reducers = combineReducers(
  {
    [fromLearningTrailsCollection.featureKey]: fromLearningTrailsCollection.reducer,
    [fromRecommendations.featureKey]: fromRecommendations.reducer,
  },
  learningTrailsListInitialState,
);

export const selectLearningTrailsListStateSelector =
  createFeatureSelector<LearningTrailsListState>(learningTrailsListFeatureKey);
