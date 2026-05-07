import { createFeature, createReducer, on } from '@ngrx/store';
import { QuizFormModel } from '../../models/quiz';
import { QuizActions } from './quiz.actions';

export const QUIZ_FEATURE_KEY = 'quiz-feature';

export interface QuizFeatureState {
  loading: boolean;
  isEditing: boolean;
  currentQuiz: QuizFormModel | null;
}

const initialState: QuizFeatureState = {
  loading: false,
  isEditing: false,
  currentQuiz: null,
};

export const quizFeature = createFeature({
  name: QUIZ_FEATURE_KEY,
  reducer: createReducer(
    initialState,
    on(
      QuizActions.openQuizDialog,
      (state, { channelId, stageId }): QuizFeatureState => ({
        ...state,
        isEditing: false,
        currentQuiz: {
          title: '',
          questions: [],
          channel_id: channelId ?? null,
          stage: stageId ?? null,
          randomize_questions: false,
          randomize_options: false,
          questions_to_show: null,
        },
      }),
    ),
    on(QuizActions.openQuizEditDialog, (state): QuizFeatureState => ({ ...state, loading: true })),
    on(QuizActions.createQuiz, QuizActions.updateQuiz, (state): QuizFeatureState => ({ ...state, loading: true })),
    on(
      QuizActions.loadQuizForEditSuccess,
      (state, { quiz }): QuizFeatureState => ({
        ...state,
        loading: false,
        isEditing: true,
        currentQuiz: quiz,
      }),
    ),
    on(QuizActions.loadQuizForEditFailure, (state): QuizFeatureState => ({ ...state, loading: false })),
    on(QuizActions.createQuizSuccess, QuizActions.updateQuizSuccess, (state, { quiz }): QuizFeatureState => {
      return { ...state, currentQuiz: quiz, isEditing: true, loading: false };
    }),
    on(
      QuizActions.createQuizFailure,
      QuizActions.updateQuizFailure,
      (state): QuizFeatureState => ({ ...state, loading: false }),
    ),
    on(QuizActions.quizDialogClosed, (): QuizFeatureState => initialState),
  ),
});
