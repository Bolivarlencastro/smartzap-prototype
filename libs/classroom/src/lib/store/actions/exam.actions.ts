import { createAction, props } from '@ngrx/store';
import { QuestionRequest, QuizScoreOutput } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface ClassroomQuestionData {
  id: string;
  exam_question: string;
  options: { id: string; option: string }[];
  count_correct_options: number;
}

export interface ClassroomAnswerData {
  /** Question ID — used as the map key by KpQuizCardService.convertAnswersToMap */
  exam_has_question: string;
  options: string[];
  correct_options: string[];
  is_ok: boolean;
}

export const loadQuiz = createAction('[Classroom Exam] Load Quiz', props<{ quizId: string }>());

export const loadQuizSuccess = createAction(
  '[Classroom Exam] Load Quiz Success',
  props<{
    quizId: string;
    questions: ClassroomQuestionData[];
    answers: ClassroomAnswerData[];
    randomizeQuestions: boolean;
    randomizeOptions: boolean;
  }>(),
);

export const loadExamFailure = createAction('[Classroom Exam] Load Exam Failure', props<{ error: string }>());

export const answerQuestion = createAction('[Classroom Exam] Answer Question', props<{ answer: QuestionRequest }>());

export const answerQuestionSuccess = createAction(
  '[Classroom Exam] Answer Question Success',
  props<{ questionId: string; answer: ClassroomAnswerData }>(),
);

export const answerQuestionFailure = createAction(
  '[Classroom Exam] Answer Question Failure',
  props<{ error: string }>(),
);

export const loadScore = createAction('[Classroom Exam] Load Score');

export const loadScoreSuccess = createAction(
  '[Classroom Exam] Load Score Success',
  props<{ score: QuizScoreOutput }>(),
);

export const loadScoreError = createAction('[Classroom Exam] Load Score Error', props<{ error: string }>());
