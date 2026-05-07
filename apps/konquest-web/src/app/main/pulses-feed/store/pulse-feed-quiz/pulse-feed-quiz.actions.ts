import { createAction, props } from '@ngrx/store';
import { AnswerOutput, QuestionConsumerOutput, QuizScoreOutput } from '@core/api/quiz-api.service';
import { QuestionRequest } from '@keeps-platform-frontend-workspace/kp-keeps';

export const loadPulseFeedQuiz = createAction('[Pulse Feed Quiz] Load Quiz');

export const loadPulseFeedQuizSuccess = createAction(
  '[Pulse Feed Quiz] Load Quiz Success',
  props<{
    quizId: string;
    questions: QuestionConsumerOutput[];
    pulseName: string;
    pulseDescription?: string;
    randomizeQuestions: boolean;
    randomizeOptions: boolean;
  }>(),
);

export const loadPulseFeedQuizError = createAction('[Pulse Feed Quiz] Load Quiz Error', props<{ error: string }>());

export const saveAnswer = createAction('[Pulse Feed Quiz] Save Answer', props<{ answer: QuestionRequest }>());

export const saveAnswerSuccess = createAction(
  '[Pulse Feed Quiz] Save Answer Success',
  props<{ questionId: string; answer: AnswerOutput }>(),
);

export const saveAnswerError = createAction('[Pulse Feed Quiz] Save Answer Error', props<{ error: string }>());

export const loadScore = createAction('[Pulse Feed Quiz] Load Score');

export const loadScoreSuccess = createAction(
  '[Pulse Feed Quiz] Load Score Success',
  props<{ score: QuizScoreOutput }>(),
);

export const loadScoreError = createAction('[Pulse Feed Quiz] Load Score Error', props<{ error: string }>());

export const pulseFeedQuizReset = createAction('[Pulse Feed Quiz] Reset');
