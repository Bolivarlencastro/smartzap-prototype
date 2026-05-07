import { createAction, props } from '@ngrx/store';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';

export const loadRecommendations = createAction(
  '[LEARNING TRAIL RECOMMENDATIONS] Load Learning Trails Recommendations',
);

export const loadRecommendationsSuccess = createAction(
  '[LEARNING TRAIL RECOMMENDATIONS] Load Learning Trails Recommendations Success',
  props<{ recommendations: LearnContentCardData[] }>(),
);

export const loadRecommendationsFailure = createAction(
  '[LEARNING TRAIL RECOMMENDATIONS] Load Learning Trails Recommendations Failure',
  props<{ error: Error }>(),
);
