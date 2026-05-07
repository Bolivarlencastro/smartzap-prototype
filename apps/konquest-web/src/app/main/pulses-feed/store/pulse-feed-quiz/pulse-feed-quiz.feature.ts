import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { QuestionConsumerOutput, QuizScoreOutput } from '@core/api/quiz-api.service';
import * as PulseFeedQuizActions from './pulse-feed-quiz.actions';

export interface PulseFeedQuizState {
  quizId: string | null;
  pulseName: string | null;
  pulseDescription: string | null;
  questionIds: string[];
  questionsCache: Record<string, QuestionConsumerOutput>;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  loading: boolean;
  loadingAnswer: boolean;
  loadingScore: boolean;
  score: QuizScoreOutput | null;
  error: string;
}

const initialState: PulseFeedQuizState = {
  quizId: null,
  pulseName: null,
  pulseDescription: null,
  questionIds: [],
  questionsCache: {},
  randomizeQuestions: false,
  randomizeOptions: false,
  loading: true,
  loadingAnswer: false,
  loadingScore: false,
  score: null,
  error: '',
};

const pulseFeedQuizReducer = createReducer(
  initialState,

  on(PulseFeedQuizActions.loadPulseFeedQuiz, (state): PulseFeedQuizState => ({ ...state, loading: true })),

  on(
    PulseFeedQuizActions.loadPulseFeedQuizSuccess,
    (
      state,
      { quizId, questions, pulseName, pulseDescription, randomizeQuestions, randomizeOptions },
    ): PulseFeedQuizState => ({
      ...state,
      quizId,
      pulseName,
      pulseDescription: pulseDescription ?? null,
      loading: false,
      randomizeQuestions,
      randomizeOptions,
      questionIds: questions.map((q) => q.id),
      questionsCache: questions.reduce<Record<string, QuestionConsumerOutput>>((acc, q) => ({ ...acc, [q.id]: q }), {}),
    }),
  ),

  on(
    PulseFeedQuizActions.loadPulseFeedQuizError,
    (state, { error }): PulseFeedQuizState => ({ ...state, loading: false, error }),
  ),

  on(PulseFeedQuizActions.saveAnswer, (state): PulseFeedQuizState => ({ ...state, loadingAnswer: true })),

  on(PulseFeedQuizActions.saveAnswerSuccess, (state, { questionId, answer }): PulseFeedQuizState => {
    const cachedQuestion = state.questionsCache[questionId];
    if (!cachedQuestion) return { ...state, loadingAnswer: false };
    return {
      ...state,
      loadingAnswer: false,
      questionsCache: {
        ...state.questionsCache,
        [questionId]: {
          ...cachedQuestion,
          answer: {
            chosen_options: answer.options,
            is_ok: answer.is_ok,
            correct_options: answer.correct_options,
          },
        },
      },
    };
  }),

  on(
    PulseFeedQuizActions.saveAnswerError,
    (state, { error }): PulseFeedQuizState => ({ ...state, loadingAnswer: false, error }),
  ),

  on(PulseFeedQuizActions.loadScore, (state): PulseFeedQuizState => ({ ...state, loadingScore: true })),

  on(
    PulseFeedQuizActions.loadScoreSuccess,
    (state, { score }): PulseFeedQuizState => ({ ...state, loadingScore: false, score }),
  ),

  on(
    PulseFeedQuizActions.loadScoreError,
    (state, { error }): PulseFeedQuizState => ({ ...state, loadingScore: false, error }),
  ),

  on(PulseFeedQuizActions.pulseFeedQuizReset, (): PulseFeedQuizState => initialState),
);

export const pulseFeedQuizFeature = createFeature({
  name: 'pulseFeedQuiz',
  reducer: pulseFeedQuizReducer,
  extraSelectors: ({ selectPulseName, selectPulseDescription, selectQuestionIds, selectQuestionsCache }) => ({
    selectPulse: createSelector(selectPulseName, selectPulseDescription, (name, description) =>
      name ? { name, description } : null,
    ),

    selectIsAllAnswered: createSelector(
      selectQuestionIds,
      selectQuestionsCache,
      (ids, cache) => ids.length > 0 && ids.every((id) => !!cache[id]?.answer),
    ),

    /** Questions shaped for `kp-quiz-card` [questions] input. */
    selectQuestionsForCard: createSelector(selectQuestionIds, selectQuestionsCache, (ids, cache) =>
      ids
        .filter((id) => !!cache[id])
        .map((id) => ({
          id: cache[id].id,
          exam_question: cache[id].question_text,
          options: cache[id].options,
          count_correct_options: 0,
        })),
    ),

    /** Answered questions shaped for `kp-quiz-card` [answers] input. */
    selectAnswersForCard: createSelector(selectQuestionIds, selectQuestionsCache, (ids, cache) =>
      ids
        .filter((id) => !!cache[id]?.answer)
        .map((id) => ({
          exam_has_question: id,
          options: cache[id].answer!.chosen_options,
          correct_options: cache[id].answer!.correct_options,
          is_ok: cache[id].answer!.is_ok,
        })),
    ),
  }),
});
