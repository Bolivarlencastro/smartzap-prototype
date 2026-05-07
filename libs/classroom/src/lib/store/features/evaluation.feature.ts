import { createFeature, createReducer, on } from '@ngrx/store';
import { EvaluationActions } from '../actions';
import { Evaluation, EvaluationQuestion } from '@keeps-platform-frontend-workspace/kp-keeps';

export const classroomEvaluationFeatureKey = 'classroomEvaluation';

export interface EvaluationState {
  missionId: string | null;
  enrollmentId: string | null;
  evaluations: Evaluation[] | undefined;
  questions: EvaluationQuestion[];
}

export const classroomEvaluationInitialState: EvaluationState = {
  missionId: null,
  enrollmentId: null,
  evaluations: [],
  questions: [],
};

const classroomEvaluationReducer = createReducer(
  classroomEvaluationInitialState,

  on(
    EvaluationActions.loadEvaluationsSuccess,
    (state, { payload, missionId }): EvaluationState => ({
      ...state,
      evaluations: payload,
      missionId,
    }),
  ),

  on(
    EvaluationActions.loadEvaluations,
    (state, { missionId, enrollmentId }): EvaluationState => ({
      ...state,
      missionId: missionId || '',
      enrollmentId: enrollmentId || '',
    }),
  ),

  on(
    EvaluationActions.loadEvaluationQuestionsSuccess,
    (state, { payload }): EvaluationState => ({
      ...state,
      questions: payload.questions,
    }),
  ),

  on(EvaluationActions.clearCache, (): EvaluationState => classroomEvaluationInitialState),
);

export const classroomEvaluationFeature = createFeature({
  name: classroomEvaluationFeatureKey,
  reducer: classroomEvaluationReducer,
});
