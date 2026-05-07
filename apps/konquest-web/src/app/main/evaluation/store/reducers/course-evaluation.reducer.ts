import { Evaluation, EvaluationQuestion } from '@core/model/evaluation.model';
import { createReducer, on } from '@ngrx/store';
import { CourseEvaluationActions } from '../actions';

export const courseEvaluationFeatureKey = 'course-evaluation';

export interface State {
  missionId: string | null;
  enrollmentId: string | null;
  questions: EvaluationQuestion[];
  evaluations: Evaluation[] | undefined;
  isLoading: boolean;
  isExternalMission: boolean;
}

export const courseEvaluationInitialState: State = {
  missionId: null,
  enrollmentId: null,
  evaluations: [],
  questions: [],
  isLoading: false,
  isExternalMission: false,
};

export const courseEvaluationReducers = createReducer(
  courseEvaluationInitialState,

  on(
    CourseEvaluationActions.loadEvaluationsSuccess,
    (state, { payload, missionId }): State => ({
      ...state,
      evaluations: payload,
      missionId,
    }),
  ),

  on(
    CourseEvaluationActions.setRequiredData,
    (state, { missionId, enrollmentId, isExternalMission }): State => ({
      ...state,
      missionId: missionId || '',
      enrollmentId: enrollmentId || '',
      isExternalMission,
    }),
  ),

  on(CourseEvaluationActions.loadEvaluationQuestions, (state): State => ({ ...state, isLoading: true })),

  on(
    CourseEvaluationActions.loadEvaluationQuestionsSuccess,
    (state, { payload }): State => ({
      ...state,
      questions: payload.questions,
      isLoading: false,
    }),
  ),

  on(CourseEvaluationActions.loadEvaluationQuestionsError, (state): State => ({ ...state, isLoading: false })),

  on(CourseEvaluationActions.clearCache, (): State => courseEvaluationInitialState),
);
