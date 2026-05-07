import { Action, createReducer, on } from '@ngrx/store';
import { LearningTrailEnrollment, LearningTrail } from 'app/main/learning-trail/model/learning-trail';
import * as LearningTrailDetailActions from './learning-trail-detail.actions';

export const featureKey = 'learning-trail-detail-app';

export interface State {
  certificate: string;
  certificateLoading: boolean;
  giveUpLoading: boolean;
  retakeLoading: boolean;
  enrollLoading: boolean;
  learningTrail: LearningTrail | undefined;
  enrollment: LearningTrailEnrollment | undefined;
}

export const initialState: State = {
  certificate: '',
  certificateLoading: false,
  giveUpLoading: false,
  retakeLoading: false,
  enrollLoading: false,
  learningTrail: undefined,
  enrollment: undefined,
};

const learningTrailDetailReducer = createReducer(
  initialState,

  on(LearningTrailDetailActions.loadLearningTrailSuccess, (state, { payload }): State => {
    return { ...state, learningTrail: payload, enrollment: payload.enrollment };
  }),

  on(LearningTrailDetailActions.loadLearningTrailReset, (): State => initialState),

  on(
    LearningTrailDetailActions.enrollLearningTrailSuccess,
    LearningTrailDetailActions.enrollRetakeLearningTrailSuccess,
    (state, { enrollment }): State => ({
      ...state,
      enrollment,
      learningTrail: state.learningTrail ? { ...state.learningTrail, enrolled: true, enrollment } : undefined,
    }),
  ),

  on(
    LearningTrailDetailActions.enrollGiveUpLearningTrailSuccess,
    (state): State => ({
      ...state,
      enrollment: state.enrollment ? { ...state.enrollment, give_up: true } : undefined,
    }),
  ),
  on(
    LearningTrailDetailActions.updateLearningTrailDescriptionSuccess,
    (state, { description }): State => ({
      ...state,
      learningTrail: state.learningTrail ? { ...state.learningTrail, description } : undefined,
    }),
  ),
);

export function reducer(state: State | undefined, action: Action): any {
  return learningTrailDetailReducer(state, action);
}
