import { LearningTrail, TrailLearnContent } from '@app/main/learning-trail/model/learning-trail';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { LearningTrailCreateActions } from '../actions';

export interface LearningTrailCreateState {
  isLoading: boolean;
  loadingContents: boolean;
  contents: TrailLearnContent[];
  learningTrail: LearningTrail | undefined;
}

export const initialState: LearningTrailCreateState = {
  isLoading: false,
  contents: [],
  loadingContents: false,
  learningTrail: undefined,
};

const reducer = createReducer(
  initialState,
  on(LearningTrailCreateActions.clearCache, (): LearningTrailCreateState => ({ ...initialState })),

  on(
    LearningTrailCreateActions.loadLearningTrail,
    LearningTrailCreateActions.loadContents,
    LearningTrailCreateActions.postLearningTrailContent,
    (state): LearningTrailCreateState => ({
      ...state,
      isLoading: true,
    }),
  ),

  on(
    LearningTrailCreateActions.loadLearningTrailSuccess,
    LearningTrailCreateActions.saveLearningTrailSuccess,
    (state, { learningTrail }): LearningTrailCreateState => ({
      ...state,
      isLoading: false,
      learningTrail: { ...state.learningTrail, ...learningTrail },
    }),
  ),

  on(
    LearningTrailCreateActions.updateTrailImageSuccess,
    (state, { url, imageType }): LearningTrailCreateState => ({
      ...state,
      learningTrail: {
        ...state.learningTrail,
        [imageType]: url,
      },
    }),
  ),

  on(
    LearningTrailCreateActions.loadContents,
    (state): LearningTrailCreateState => ({
      ...state,
      loadingContents: true,
    }),
  ),

  on(
    LearningTrailCreateActions.loadContentsSuccess,
    (state, { contents }): LearningTrailCreateState => ({
      ...state,
      loadingContents: false,
      contents,
    }),
  ),

  on(
    LearningTrailCreateActions.postLearningTrailContentFailure,
    LearningTrailCreateActions.loadContentsFailure,
    LearningTrailCreateActions.loadLearningTrailFailure,
    LearningTrailCreateActions.postLearningTrailContentSuccess,
    (state): LearningTrailCreateState => ({
      ...state,
      isLoading: false,
    }),
  ),

  on(
    LearningTrailCreateActions.postLearningTrailImageSuccess,
    (state, { url, imageType }): LearningTrailCreateState => {
      const learningTrail: LearningTrail = structuredClone(state.learningTrail);
      learningTrail[imageType] = url;
      return { ...state, learningTrail };
    },
  ),

  on(LearningTrailCreateActions.resetStore, (): LearningTrailCreateState => initialState),
);

export const learningTrailCreateFeature = createFeature({
  name: 'learningTrailCreate',
  reducer,
  extraSelectors: ({ selectLearningTrail }) => ({
    selectLearningTrailId: createSelector(selectLearningTrail, (learningTrail) => learningTrail?.id),
    selectLearningTrailThumbImage: createSelector(selectLearningTrail, (learningTrail) => learningTrail?.thumb_image),
    selectLearningTrailHolderImage: createSelector(selectLearningTrail, (learningTrail) => learningTrail?.holder_image),
    selectLearningTrailSteps: createSelector(selectLearningTrail, (learningTrail) => learningTrail?.steps),
  }),
});
