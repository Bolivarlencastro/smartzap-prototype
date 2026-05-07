import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { QuizService } from '../../services/quiz.service';
import { QuestionBankActions } from './question-bank.actions';

@Injectable()
export class QuestionBankEffects {
  private readonly _actions$ = inject(Actions);
  private readonly _quizService = inject(QuizService);

  loadQuestionBank$ = createEffect(() =>
    this._actions$.pipe(
      ofType(QuestionBankActions.loadQuestionBank),
      switchMap(({ filters }) =>
        this._quizService.getQuestionBank(filters).pipe(
          map((questions) => QuestionBankActions.loadQuestionBankSuccess({ questions })),
          catchError((err: { message: string }) =>
            of(QuestionBankActions.loadQuestionBankFailure({ error: err.message })),
          ),
        ),
      ),
    ),
  );

  deleteQuestionFromBank$ = createEffect(() =>
    this._actions$.pipe(
      ofType(QuestionBankActions.deleteQuestionFromBank),
      switchMap(({ id }) =>
        this._quizService.deleteQuestionFromBank(id).pipe(
          map(() => QuestionBankActions.deleteQuestionFromBankSuccess({ id })),
          catchError((err: { message: string }) =>
            of(QuestionBankActions.deleteQuestionFromBankFailure({ error: err.message })),
          ),
        ),
      ),
    ),
  );
}
