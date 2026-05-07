import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { QuizWizardDialogService } from '../../services/quiz-wizard-dialog/quiz-wizard-dialog.service';
import { QuizDialogService } from '../../services/quiz-dialog/quiz-dialog.service';
import { QuizService } from '../../services/quiz.service';
import { QuizActions } from './quiz.actions';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Injectable()
export class QuizEffects {
  private readonly _actions$ = inject(Actions);
  private readonly _quizWizardDialogService = inject(QuizWizardDialogService);
  private readonly _quizDialogService = inject(QuizDialogService);
  private readonly _quizService = inject(QuizService);
  private readonly _messageService = inject(KpMessageService);

  readonly openQuizWizardDialog$ = createEffect(() =>
    this._actions$.pipe(
      ofType(QuizActions.openQuizWizardDialog),
      switchMap(({ channelId, stageId }) =>
        this._quizWizardDialogService.open().pipe(
          map((result) => {
            if (result) {
              return QuizActions.openQuizDialog({ ...result, channelId, stageId });
            }

            return QuizActions.quizWizardDialogCancelled();
          }),
        ),
      ),
    ),
  );

  readonly openQuizDialog$ = createEffect(() =>
    this._actions$.pipe(
      ofType(QuizActions.openQuizDialog),
      switchMap(() => this._quizDialogService.open().pipe(map(() => QuizActions.quizDialogClosed()))),
    ),
  );

  readonly openQuizEditDialog$ = createEffect(() =>
    this._actions$.pipe(
      ofType(QuizActions.openQuizEditDialog),
      switchMap(({ quizId }) =>
        this._quizService.getQuiz(quizId).pipe(
          map((quiz) => QuizActions.loadQuizForEditSuccess({ quiz })),
          catchError((err: { message: string }) => of(QuizActions.loadQuizForEditFailure({ error: err.message }))),
        ),
      ),
    ),
  );

  readonly openEditDialogAfterLoad$ = createEffect(() =>
    this._actions$.pipe(
      ofType(QuizActions.loadQuizForEditSuccess),
      switchMap(() => this._quizDialogService.open().pipe(map(() => QuizActions.quizDialogClosed()))),
    ),
  );

  readonly createQuiz$ = createEffect(() =>
    this._actions$.pipe(
      ofType(QuizActions.createQuiz),
      switchMap(({ quiz }) =>
        this._quizService.createQuiz(quiz).pipe(
          tap({
            next: () => this._messageService.success(marker('QUIZ.QUIZ_DIALOG.CREATE_SUCCESS')),
            error: () => this._messageService.error(marker('QUIZ.QUIZ_DIALOG.CREATE_ERROR')),
          }),
          map((created) => QuizActions.createQuizSuccess({ quiz: created })),
          catchError((err: { message: string }) => of(QuizActions.createQuizFailure({ error: err.message }))),
        ),
      ),
    ),
  );

  readonly updateQuiz$ = createEffect(() =>
    this._actions$.pipe(
      ofType(QuizActions.updateQuiz),
      switchMap(({ quiz }) =>
        this._quizService.updateQuiz(quiz.id, quiz).pipe(
          tap({
            next: () => this._messageService.success(marker('QUIZ.QUIZ_DIALOG.UPDATE_SUCCESS')),
            error: () => this._messageService.error(marker('QUIZ.QUIZ_DIALOG.UPDATE_ERROR')),
          }),
          map((updated) => QuizActions.updateQuizSuccess({ quiz: updated })),
          catchError((err: { message: string }) => of(QuizActions.updateQuizFailure({ error: err.message }))),
        ),
      ),
    ),
  );

  readonly closeDialogOnSuccess$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(QuizActions.createQuizSuccess, QuizActions.updateQuizSuccess),
        tap(() => this._quizDialogService.close()),
      ),
    { dispatch: false },
  );
}
