import { Action, createReducer, on } from '@ngrx/store';
import { CourseEvaluationActions } from 'app/main/evaluation/store';
import { Mission } from 'app/main/mission/mission.model';
import { MissionDetailActions } from '../actions';
import { Evaluation, EvaluationQuestion, EvaluationSummary } from '@core/model/evaluation.model';
import { Pagination } from '@core/model';

export const featureKey = 'mission';

export interface State {
  course: Mission | undefined;
  loadingCourse: boolean;
  loadingEvaluation: boolean;
  questions: EvaluationQuestion[];
  summary: EvaluationSummary | null;
  evaluations: Pagination<Evaluation>;
  loadingEvaluationSummary: boolean;
  loadingEvaluationQuestions: boolean;
  courseEvaluationFilter: any;
}

export const initialState: State = {
  course: undefined,
  loadingCourse: false,
  loadingEvaluation: false,
  questions: [],
  summary: null,
  evaluations: {} as Pagination<Evaluation>,
  loadingEvaluationSummary: false,
  loadingEvaluationQuestions: false,
  courseEvaluationFilter: null,
};

const courseReducer = createReducer(
  initialState,

  // Course
  on(MissionDetailActions.loadCourse, (state): State => ({ ...state, loadingCourse: true, course: undefined })),

  on(
    MissionDetailActions.loadCourseSuccess,
    (state, { course }): State => ({
      ...state,
      course,
      loadingCourse: false,
    }),
  ),

  on(
    MissionDetailActions.loadCourseFailure,
    (state): State => ({
      ...state,
      loadingCourse: false,
    }),
  ),

  on(
    MissionDetailActions.cleanCache,
    (): State => ({
      ...initialState,
    }),
  ),

  on(
    CourseEvaluationActions.postEvaluationSuccess,
    (state): State => ({
      ...state,
      course: {
        ...state?.course,
        enrollment: state.course?.enrollment ? { ...state?.course?.enrollment, evaluated: true } : undefined,
      },
    }),
  ),

  on(
    MissionDetailActions.loadEvaluations,
    (state, { filters }): State => ({
      ...state,
      loadingEvaluation: true,
      courseEvaluationFilter: { ...state.courseEvaluationFilter, ...filters },
    }),
  ),

  on(
    MissionDetailActions.loadEvaluationsSuccess,
    (state, { payload }): State => ({
      ...state,
      evaluations: payload,
      loadingEvaluation: false,
    }),
  ),
  on(
    CourseEvaluationActions.loadEvaluationsError,
    (state): State => ({
      ...state,
      loadingEvaluation: false,
    }),
  ),

  on(
    MissionDetailActions.loadEvaluationQuestions,
    (state): State => ({
      ...state,
      loadingEvaluationQuestions: true,
    }),
  ),
  on(
    MissionDetailActions.loadEvaluationQuestionsSuccess,
    (state, { payload }): State => ({
      ...state,
      questions: payload.questions,
      loadingEvaluationQuestions: false,
    }),
  ),
  on(
    MissionDetailActions.loadEvaluationQuestionsError,
    (state): State => ({
      ...state,
      loadingEvaluationQuestions: false,
    }),
  ),

  on(
    MissionDetailActions.loadEvaluationSummary,
    (state): State => ({
      ...state,
      loadingEvaluationSummary: true,
    }),
  ),
  on(
    MissionDetailActions.loadEvaluationSummarySuccess,
    (state, { payload }): State => ({
      ...state,
      summary: payload,
      loadingEvaluationSummary: false,
    }),
  ),
  on(
    MissionDetailActions.loadEvaluationSummaryError,
    (state): State => ({
      ...state,
      loadingEvaluationSummary: false,
    }),
  ),
);

export function reducer(state: State | undefined, action: Action) {
  return courseReducer(state, action);
}
