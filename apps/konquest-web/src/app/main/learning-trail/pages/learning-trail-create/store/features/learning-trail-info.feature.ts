import { LearningTrailType } from '@app/main/learning-trail/model/learning-trail';
import { createFeature, createReducer, on } from '@ngrx/store';
import { LearningTrailInfoActions } from '../actions';

export interface LearningTailInfoState {
  isLoading: boolean;
  types: LearningTrailType[];
}

export const initialState: LearningTailInfoState = {
  isLoading: false,
  types: [],
};

const reducer = createReducer(
  initialState,
  on(
    LearningTrailInfoActions.loadTypes,
    (state): LearningTailInfoState => ({
      ...state,
      isLoading: true,
    }),
  ),
  on(
    LearningTrailInfoActions.loadTypesSuccess,
    (state, { types }): LearningTailInfoState => ({
      ...state,
      isLoading: false,
      types,
    }),
  ),
  on(
    LearningTrailInfoActions.loadTypesFailure,
    (state): LearningTailInfoState => ({
      ...state,
      isLoading: false,
    }),
  ),
);

export const learningTrailInfoFeature = createFeature({
  name: 'learningTrailInfo',
  reducer,
});
