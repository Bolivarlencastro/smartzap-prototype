import { LearnContentActivity } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createFeature, createReducer, on } from '@ngrx/store';
import { ActivityActions, ContentActions, CourseActions } from '../actions';

export const classroomActivityFeatureKey = 'classroomActivity';

export interface ActivityFeatureState {
  lastCreatedActivity: LearnContentActivity | null;
}

const classroomContentInitialState: ActivityFeatureState = {
  lastCreatedActivity: null,
};

const classroomActivityReducer = createReducer(
  classroomContentInitialState,

  on(ContentActions.loadContent, CourseActions.reset, (): ActivityFeatureState => classroomContentInitialState),

  on(
    ActivityActions.createActivitySuccess,
    (state, { activity }): ActivityFeatureState => ({
      ...state,
      lastCreatedActivity: activity,
    }),
  ),
);

export const classroomActivityFeature = createFeature({
  name: classroomActivityFeatureKey,
  reducer: classroomActivityReducer,
});
