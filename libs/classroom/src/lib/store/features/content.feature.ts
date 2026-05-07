import { LearnContent } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createFeature, createReducer, on } from '@ngrx/store';
import { ContentActions, CourseActions } from '../actions';

export const classroomContentFeatureKey = 'classroomContent';

export interface ContentFeatureState {
  content: LearnContent | null;
  loading: boolean;
}

const classroomContentInitialState: ContentFeatureState = {
  content: null,
  loading: true,
};

const classroomContentReducer = createReducer(
  classroomContentInitialState,

  on(ContentActions.loadContent, CourseActions.reset, (): ContentFeatureState => classroomContentInitialState),

  on(
    ContentActions.loadContentSuccess,
    (_state, { content }): ContentFeatureState => ({
      ...classroomContentInitialState,
      loading: false,
      content,
    }),
  ),
);

export const classroomContentFeature = createFeature({
  name: classroomContentFeatureKey,
  reducer: classroomContentReducer,
});
