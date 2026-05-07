import { Injectable } from '@angular/core';
import { RatingService } from '@core/api';
import { EvaluationAPI } from '@core/api/evaluation.api';
import { Evaluation } from '@core/model/evaluation.model';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { CertificateUploadActions } from 'app/shared/components/certificate-upload';

import { CourseEvaluationActions } from '../actions';
import { CourseEvaluationSelectors } from '../selectors';
import { EvaluationService } from '../../evaluation.service';

@Injectable()
export class CourseEvaluationEffects {
  constructor(
    private _evaluationAPI: EvaluationAPI,
    private _ratingService: RatingService,
    private _authService: AuthService,
    private _actions$: Actions,
    private _loadingService: FuseLoadingService,
    private store: Store,
    private _evaluationService: EvaluationService,
  ) {}

  show$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(CourseEvaluationActions.postEvaluation),
        tap(() => this._loadingService.show()),
      );
    },
    { dispatch: false },
  );

  hide$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(CourseEvaluationActions.postEvaluationError, CourseEvaluationActions.postEvaluationSuccess),
        tap(() => this._loadingService.hide()),
      );
    },
    { dispatch: false },
  );

  loadEvaluations$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CourseEvaluationActions.setRequiredData),
      concatLatestFrom(() => [
        this.store.select(CourseEvaluationSelectors.selectMissionId),
        this.store.select(CourseEvaluationSelectors.selectEnrollmentId),
      ]),
      mergeMap(([_, missionId, enrollmentId]) => {
        return this._evaluationAPI.getEvaluations({ mission__id: missionId, enrollment__id: enrollmentId }).pipe(
          map((payload) =>
            CourseEvaluationActions.loadEvaluationsSuccess({
              payload: payload.results?.map(
                (evaluation) =>
                  ({
                    ...evaluation,
                    questions_rating_avg: evaluation.questions_rating_avg?.toFixed(1) ?? 0,
                  }) as Evaluation,
              ),
              userId: this._authService.userId || '',
              missionId,
            }),
          ),
          catchError((error) => of(CourseEvaluationActions.loadEvaluationsError(error))),
        );
      }),
    );
  });

  loadEvaluationQuestions$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CourseEvaluationActions.loadEvaluationQuestions),
      mergeMap(() => {
        return this._evaluationAPI.getEvaluationsQuestions().pipe(
          map((payload) => CourseEvaluationActions.loadEvaluationQuestionsSuccess({ payload })),
          catchError((error) => of(CourseEvaluationActions.loadEvaluationQuestionsError(error))),
        );
      }),
    );
  });

  postEvaluation$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CourseEvaluationActions.postEvaluation),
      concatLatestFrom(() => [
        this.store.select(CourseEvaluationSelectors.selectMissionId),
        this.store.select(CourseEvaluationSelectors.selectEnrollmentId),
      ]),
      switchMap(([{ evaluation }, missionId, enrollmentId]) => {
        const { comment, rating, isOnCourse, ...otherProperties } = evaluation;

        return forkJoin({
          evaluation: this._evaluationAPI.postEvaluation({
            ...otherProperties,
            ...(!!comment && { comment }),
            version: 1,
            user: this._authService.userId,
            mission: missionId,
            enrollment: enrollmentId,
          }),
          rating: this._ratingService.rateMission(missionId, rating),
        }).pipe(
          map(() => CourseEvaluationActions.postEvaluationSuccess({ gotoNextStep: isOnCourse })),
          catchError((error) => of(CourseEvaluationActions.postEvaluationError(error))),
        );
      }),
    );
  });

  postEvaluationSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CourseEvaluationActions.postEvaluationSuccess),
      concatLatestFrom(() => [
        this.store.select(CourseEvaluationSelectors.selectIsExternalMission),
        this.store.select(CourseEvaluationSelectors.selectEnrollmentId),
      ]),
      tap(() => {
        this._evaluationService.closeDialog();
      }),
      map(([_, isExternalMission, enrollmentId]) => ({
        isExternalMission,
        enrollmentId,
      })),
      filter(({ isExternalMission }) => isExternalMission),
      map(({ enrollmentId }) => CertificateUploadActions.openDialog({ enrollmentId })),
    );
  });
}
