import { Injectable } from '@angular/core';
import { QuizApiService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { ClassroomAnswerData, ClassroomQuestionData } from '../actions/exam.actions';
import { CourseExamActions, StepNavigationActions } from '../actions';
import { classroomCourseFeature, classroomExamFeature, classroomStepsFeature } from '../features';

@Injectable()
export class ExamEffects {
  loadExamOnNavigation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StepNavigationActions.navigate),
      concatLatestFrom(({ stepId }) => [this.store.select(classroomStepsFeature.selectStepById(stepId))]),
      filter(([, step]) => !!step?.learn_content_id && step.stepType === 'QUESTION'),
      map(([_action, step]) => CourseExamActions.loadQuiz({ quizId: step.learn_content_id })),
    );
  });

  loadQuiz$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseExamActions.loadQuiz),
      concatLatestFrom(() => [
        this.store.select(classroomCourseFeature.selectEnrollment),
        this.store.select(classroomCourseFeature.selectIsViewingAsUser),
      ]),
      switchMap(([{ quizId }, enrollment, isViewingAsUser]) =>
        this.quizApiService
          .getQuizAsConsumer(quizId, isViewingAsUser ? undefined : enrollment?.id, isViewingAsUser || undefined)
          .pipe(
            map((quiz) => {
              const questions: ClassroomQuestionData[] = quiz.questions.map((q) => ({
                id: q.id,
                exam_question: q.question_text,
                options: q.options,
                count_correct_options: 0,
              }));
              const answers: ClassroomAnswerData[] = quiz.questions
                .filter((q) => q.answer !== null)
                .map((q) => ({
                  exam_has_question: q.id,
                  options: q.answer?.chosen_options,
                  correct_options: q.answer?.correct_options,
                  is_ok: q.answer?.is_ok,
                }));
              return CourseExamActions.loadQuizSuccess({
                quizId,
                questions,
                answers,
                randomizeQuestions: quiz.randomize_questions,
                randomizeOptions: quiz.randomize_options,
              });
            }),
            catchError((error) => of(CourseExamActions.loadExamFailure({ error: String(error) }))),
          ),
      ),
    );
  });

  answerQuestion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseExamActions.answerQuestion),
      concatLatestFrom(() => [
        this.store.select(classroomExamFeature.selectQuizId),
        this.store.select(classroomCourseFeature.selectEnrollment),
        this.store.select(classroomCourseFeature.selectIsViewingAsUser),
      ]),
      switchMap(([{ answer }, quizId, enrollment, isViewingAsUser]) => {
        if (!quizId) return EMPTY;
        const payload = {
          options: answer.options,
          enrollment_id: isViewingAsUser ? undefined : enrollment?.id,
        };
        return this.quizApiService.submitAnswer(quizId, answer.id, payload, isViewingAsUser || undefined).pipe(
          map((apiAnswer) =>
            CourseExamActions.answerQuestionSuccess({
              questionId: answer.id,
              answer: {
                exam_has_question: answer.id,
                options: apiAnswer.options,
                correct_options: apiAnswer.correct_options,
                is_ok: apiAnswer.is_ok,
              },
            }),
          ),
          catchError((error) => of(CourseExamActions.answerQuestionFailure({ error: String(error) }))),
        );
      }),
    );
  });

  /** Trigger score loading as soon as all questions have been answered. */
  triggerLoadScore$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseExamActions.answerQuestionSuccess),
      concatLatestFrom(() => [
        this.store.select(classroomExamFeature.selectAnswers),
        this.store.select(classroomExamFeature.selectQuestions),
        this.store.select(classroomCourseFeature.selectIsViewingAsUser),
      ]),
      filter(([, answers, questions]) => questions.length > 0 && answers.length >= questions.length),
      map(([, answers, questions, isViewingAsUser]) => {
        if (isViewingAsUser) {
          const correctAnswers = answers.filter((a) => a.is_ok).length;
          return CourseExamActions.loadScoreSuccess({
            score: {
              total_questions: questions.length,
              total_correct_answers: correctAnswers,
              quiz_awarded_score: correctAnswers * 5,
              quiz_available_score: questions.length * 5,
            },
          });
        }
        return CourseExamActions.loadScore();
      }),
    );
  });

  /** Trigger score loading when a previously-completed quiz is reopened. */
  triggerLoadScoreOnReopen$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseExamActions.loadQuizSuccess),
      concatLatestFrom(() => this.store.select(classroomCourseFeature.selectIsViewingAsUser)),
      filter(([{ questions, answers }]) => questions.length > 0 && answers.length >= questions.length),
      map(([{ questions, answers }, isViewingAsUser]) => {
        if (isViewingAsUser) {
          const correctAnswers = answers.filter((a) => a.is_ok).length;
          return CourseExamActions.loadScoreSuccess({
            score: {
              total_questions: questions.length,
              total_correct_answers: correctAnswers,
              quiz_awarded_score: correctAnswers * 5,
              quiz_available_score: questions.length * 5,
            },
          });
        }
        return CourseExamActions.loadScore();
      }),
    );
  });

  loadScore$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseExamActions.loadScore),
      concatLatestFrom(() => [
        this.store.select(classroomExamFeature.selectQuizId),
        this.store.select(classroomCourseFeature.selectEnrollment),
        this.store.select(classroomCourseFeature.selectIsViewingAsUser),
      ]),
      switchMap(([, quizId, enrollment, isViewingAsUser]) => {
        if (!quizId || isViewingAsUser) return EMPTY;
        return this.quizApiService.getScore(quizId, enrollment?.id).pipe(
          map((score) => CourseExamActions.loadScoreSuccess({ score })),
          catchError((error) => of(CourseExamActions.loadScoreError({ error: String(error) }))),
        );
      }),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly quizApiService: QuizApiService,
    private readonly store: Store,
  ) {}
}
