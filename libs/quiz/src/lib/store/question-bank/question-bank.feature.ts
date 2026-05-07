import { createFeature, createReducer, on } from '@ngrx/store';
import { QuestionBankOutput } from '../../models/quiz';
import { QuestionBankActions } from './question-bank.actions';

export const QUESTION_BANK_FEATURE_KEY = 'question-bank-feature';

export interface QuestionBankFeatureState {
  loading: boolean;
  questions: QuestionBankOutput[];
}

const initialState: QuestionBankFeatureState = {
  loading: false,
  questions: [],
};

export const questionBankFeature = createFeature({
  name: QUESTION_BANK_FEATURE_KEY,
  reducer: createReducer(
    initialState,
    on(QuestionBankActions.loadQuestionBank, (state): QuestionBankFeatureState => ({ ...state, loading: true })),
    on(
      QuestionBankActions.loadQuestionBankSuccess,
      (state, { questions }): QuestionBankFeatureState => ({ ...state, loading: false, questions }),
    ),
    on(
      QuestionBankActions.loadQuestionBankFailure,
      (state): QuestionBankFeatureState => ({ ...state, loading: false }),
    ),
    on(
      QuestionBankActions.deleteQuestionFromBankSuccess,
      (state, { id }): QuestionBankFeatureState => ({
        ...state,
        questions: state.questions.filter((q) => q.id !== id),
      }),
    ),
  ),
});
