import { createAction, props } from '@ngrx/store';
import { QuestionBankFilters, QuestionBankOutput } from '../../models/quiz';

const loadQuestionBank = createAction('[Question Bank] Load', props<{ filters?: QuestionBankFilters }>());

const loadQuestionBankSuccess = createAction(
  '[Question Bank] Load Success',
  props<{ questions: QuestionBankOutput[] }>(),
);

const loadQuestionBankFailure = createAction('[Question Bank] Load Failure', props<{ error: string }>());

const deleteQuestionFromBank = createAction('[Question Bank] Delete', props<{ id: string }>());

const deleteQuestionFromBankSuccess = createAction('[Question Bank] Delete Success', props<{ id: string }>());

const deleteQuestionFromBankFailure = createAction('[Question Bank] Delete Failure', props<{ error: string }>());

export const QuestionBankActions = {
  loadQuestionBank,
  loadQuestionBankSuccess,
  loadQuestionBankFailure,
  deleteQuestionFromBank,
  deleteQuestionFromBankSuccess,
  deleteQuestionFromBankFailure,
};
