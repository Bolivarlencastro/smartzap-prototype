import { createReducer, on } from '@ngrx/store';
import { RecommendationsActions } from '../actions';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';

export const featureKey = 'recommendedLearningTrails';

export interface RecommendationsState {
  recommendations: LearnContentCardData[];
  isLoading: boolean;
}

export const recommendationsInitialState: RecommendationsState = {
  recommendations: [],
  isLoading: false,
};

export const reducer = createReducer(
  recommendationsInitialState,

  on(RecommendationsActions.loadRecommendations, (state): RecommendationsState => ({ ...state, isLoading: true })),

  on(RecommendationsActions.loadRecommendationsSuccess, (state, { recommendations }): RecommendationsState => {
    return { ...state, recommendations, isLoading: false };
  }),

  on(
    RecommendationsActions.loadRecommendationsFailure,
    (state): RecommendationsState => ({ ...state, isLoading: true }),
  ),
);
