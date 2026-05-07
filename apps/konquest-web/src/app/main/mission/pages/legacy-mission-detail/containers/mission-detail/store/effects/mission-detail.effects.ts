import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Action, Store } from '@ngrx/store';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { concat, of } from 'rxjs';
import { catchError, concatMap, map, mergeMap, switchMap } from 'rxjs/operators';
import * as fromActions from '../actions/mission-detail.actions';
import { MissionDetailSelectors } from '../selectors';
import { EvaluationAPI } from '@core/api/evaluation.api';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable()
export class MissionDetailEffects {
  loadCourse$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(fromActions.loadCourse),
      switchMap(({ id }) =>
        this._missionService.fetchMissionById(id).pipe(
          concatMap((data) => {
            const actions: Action[] = [fromActions.loadCourseSuccess({ course: data })];
            return concat(...actions.map((action) => of(action)));
          }),
          catchError((error) => of(fromActions.loadCourseFailure({ error }))),
        ),
      ),
    );
  });

  reloadCourse$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(fromActions.reloadCourse),
      concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectCourse)),
      map(([_, { id }]) => fromActions.loadCourse({ id: id ?? '' })),
    );
  });

  loadCourseFailure$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(fromActions.loadCourseFailure),
        map(({ error }) => {
          this._messageService.error(error?.error?.detail ?? 'NOTIFICATION.NOT_FOUND');
          this._router.navigate(['/', 'missions']);
        }),
      );
    },
    { dispatch: false },
  );

  loadEvaluationQuestions$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(fromActions.loadEvaluationQuestions),
      mergeMap(() => {
        return this._evaluationAPI.getEvaluationsQuestions().pipe(
          map((payload) => fromActions.loadEvaluationQuestionsSuccess({ payload })),
          catchError((error) => of(fromActions.loadEvaluationQuestionsError(error))),
        );
      }),
    );
  });

  loadEvaluationSummary$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(fromActions.loadEvaluationSummary),
      switchMap(({ id, filters }) => {
        return this._evaluationAPI.getEvaluationSummary(id, filters).pipe(
          map((payload) => fromActions.loadEvaluationSummarySuccess({ payload })),
          catchError((error) => of(fromActions.loadEvaluationSummaryError(error))),
        );
      }),
    );
  });

  loadEvaluations$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(fromActions.loadEvaluations),
      concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectCourseEvaluationFilter)),
      switchMap(([_, filters]) => {
        return this._evaluationAPI.getEvaluations(filters).pipe(
          map((payload) => {
            const formattedPayload = this._missionService.formatEvaluations(payload);
            return fromActions.loadEvaluationsSuccess({
              payload: formattedPayload,
              userId: this._authService.userId || '',
              missionId: filters?.['mission__id'] as string,
            });
          }),
          catchError((error) => of(fromActions.loadEvaluationsError(error))),
        );
      }),
    );
  });

  constructor(
    private _missionService: MissionServiceV2,
    private _actions$: Actions,
    private store: Store,
    private _router: Router,
    private _messageService: KpMessageService,
    private _evaluationAPI: EvaluationAPI,
    private _authService: AuthService,
  ) {}
}
