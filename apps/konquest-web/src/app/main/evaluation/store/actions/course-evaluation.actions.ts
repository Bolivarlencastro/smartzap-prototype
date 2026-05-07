import { Evaluation, EvaluationQuestions, RawEvaluation } from '@core/model/evaluation.model';
import { createAction, props } from '@ngrx/store';

export const loadEvaluationsSuccess = createAction(
  '[COURSE EVALUATIONS] Load evaluations success',
  props<{ payload: Evaluation[] | undefined; missionId: string | null; userId: string }>(),
);

export const loadEvaluationsError = createAction(
  '[COURSE EVALUATIONS] Load evaluations error',
  props<{ payload: string }>(),
);

export const loadEvaluationQuestions = createAction('[COURSE EVALUATION] Load evaluation questions');

export const loadEvaluationQuestionsSuccess = createAction(
  '[COURSE EVALUATION] Load evaluation questions success',
  props<{ payload: EvaluationQuestions }>(),
);

export const loadEvaluationQuestionsError = createAction(
  '[COURSE EVALUATION] Load evaluation questions error',
  props<{ payload: string }>(),
);

export const postEvaluation = createAction(
  '[COURSE EVALUATION] Post evaluation',
  props<{ evaluation: RawEvaluation }>(),
);

export const postEvaluationSuccess = createAction(
  '[COURSE EVALUATION] Post evaluation success',
  props<{ gotoNextStep: boolean | undefined }>(),
);

export const postEvaluationError = createAction(
  '[COURSE EVALUATION] Post evaluation error',
  props<{ payload: string }>(),
);

export const setRequiredData = createAction(
  '[COURSE EVALUATION] Set required data',
  props<{ missionId: string | undefined; enrollmentId: string | undefined; isExternalMission: boolean }>(),
);

export const clearCache = createAction('[COURSE EVALUATION] Clear Cache');
