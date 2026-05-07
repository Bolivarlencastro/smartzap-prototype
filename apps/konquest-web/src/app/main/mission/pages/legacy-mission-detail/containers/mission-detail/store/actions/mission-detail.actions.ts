import { createAction, props } from '@ngrx/store';
import { Mission } from 'app/main/mission/mission.model';
import { Evaluation, EvaluationQuestions } from '@core/model/evaluation.model';
import { Pagination } from '@core/model';

export const loadCourse = createAction('[Mission Detail] Load Course', props<{ id: string; update?: boolean }>());

export const reloadCourse = createAction('[Mission Summary] Reload Course');

export const loadCourseSuccess = createAction('[Mission Detail] Load Course Success', props<{ course: Mission }>());

export const loadCourseFailure = createAction('[Mission Detail] Load Course Failure', props<{ error: any }>());

export const cleanCache = createAction('[Mission Detail] Clean Cache');

export const loadEvaluationQuestions = createAction('[EVALUATIONS] Load evaluation questions');

export const loadEvaluationQuestionsSuccess = createAction(
  '[EVALUATIONS] Load evaluation questions success',
  props<{ payload: EvaluationQuestions }>(),
);

export const loadEvaluationQuestionsError = createAction(
  '[EVALUATIONS] Load evaluation questions error',
  props<{
    payload: string;
  }>(),
);

export const loadEvaluationSummary = createAction(
  '[EVALUATIONS] Load evaluation summary',
  props<{
    id: string;
    filters?: any;
  }>(),
);

export const loadEvaluationSummarySuccess = createAction(
  '[EVALUATIONS] Load evaluation summary success',
  props<{
    payload: any;
  }>(),
);

export const loadEvaluationSummaryError = createAction(
  '[EVALUATIONS] Load evaluation summary error',
  props<{
    payload: string;
  }>(),
);

export const loadEvaluations = createAction('[EVALUATIONS] Load evaluations', props<{ filters: any }>());

export const loadEvaluationsSuccess = createAction(
  '[EVALUATIONS] Load evaluations success',
  props<{ payload: Pagination<Evaluation>; missionId: string; userId: string }>(),
);

export const loadEvaluationsError = createAction('[EVALUATIONS] Load evaluations error', props<{ payload: string }>());
