import { QuizScoreOutput } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createFeature, createReducer, on } from '@ngrx/store';
import { ClassroomAnswerData, ClassroomQuestionData } from '../actions/exam.actions';
import { CourseActions, CourseExamActions } from '../actions';

export const classroomExamFeatureKey = 'classroomExam';

export type ExamState = {
  loading: boolean;
  quizId: string | null;
  questions: ClassroomQuestionData[];
  answers: ClassroomAnswerData[];
  answeringQuestion: boolean;
  loadingScore: boolean;
  score: QuizScoreOutput | null;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
};

export const examInitialState: ExamState = {
  loading: true,
  quizId: null,
  questions: [],
  answers: [],
  answeringQuestion: false,
  loadingScore: false,
  score: null,
  randomizeQuestions: false,
  randomizeOptions: false,
};

const reducer = createReducer(
  examInitialState,

  on(CourseExamActions.loadQuiz, CourseActions.reset, (): ExamState => examInitialState),

  on(
    CourseExamActions.loadQuizSuccess,
    (_state, { quizId, questions, answers, randomizeQuestions, randomizeOptions }): ExamState => ({
      loading: false,
      quizId,
      questions,
      answers,
      answeringQuestion: false,
      loadingScore: false,
      score: null,
      randomizeQuestions,
      randomizeOptions,
    }),
  ),

  on(CourseExamActions.answerQuestion, (state): ExamState => ({ ...state, answeringQuestion: true })),

  on(CourseExamActions.answerQuestionSuccess, (state, { answer }): ExamState => {
    const existingIndex = state.answers.findIndex((a) => a.exam_has_question === answer.exam_has_question);
    const answers =
      existingIndex >= 0 ? state.answers.map((a, i) => (i === existingIndex ? answer : a)) : [...state.answers, answer];
    return { ...state, answers, answeringQuestion: false };
  }),

  on(CourseExamActions.answerQuestionFailure, (state): ExamState => ({ ...state, answeringQuestion: false })),

  on(CourseExamActions.loadScore, (state): ExamState => ({ ...state, loadingScore: true })),

  on(
    CourseExamActions.loadScoreSuccess,
    (state, { score }): ExamState => ({
      ...state,
      loadingScore: false,
      score,
    }),
  ),

  on(CourseExamActions.loadScoreError, (state): ExamState => ({ ...state, loadingScore: false })),
);

export const classroomExamFeature = createFeature({
  name: classroomExamFeatureKey,
  reducer,
});
