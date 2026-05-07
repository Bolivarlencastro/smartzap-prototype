import { Evaluation, EvaluationQuestions, RawEvaluation } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';

export const loadEvaluations = createAction(
  '[Classroom Evaluation] Load Evaluations',
  props<{ missionId: string | undefined; enrollmentId: string | undefined }>(),
);

export const loadEvaluationsSuccess = createAction(
  '[Classroom Evaluation] Load Evaluations Success',
  props<{ payload: Evaluation[] | undefined; missionId: string | null; userId: string }>(),
);

export const loadEvaluationQuestions = createAction('[Classroom Evaluation] Load Evaluation Questions');

export const loadEvaluationQuestionsSuccess = createAction(
  '[Classroom Evaluation] Load Evaluation Questions Success',
  props<{ payload: EvaluationQuestions }>(),
);

export const postEvaluation = createAction(
  '[Classroom Evaluation] Post Evaluation',
  props<{ evaluation: RawEvaluation }>(),
);

export const clearCache = createAction('[Classroom Evaluation] Clear Cache');
