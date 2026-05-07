import { Injectable } from '@angular/core';
import { AuthService, EvaluationAPI, RatingService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { forkJoin } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { EvaluationActions, StepNavigationActions } from '../actions';
import { classroomEvaluationFeature } from '../features';
import { EvaluationService } from '../../services/evaluation/evaluation.service';

@Injectable()
export class EvaluationEffects {
  constructor(
    private evaluationAPI: EvaluationAPI,
    private ratingService: RatingService,
    private authService: AuthService,
    private actions$: Actions,
    private store: Store,
    private evaluationService: EvaluationService,
  ) {}

  loadEvaluations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EvaluationActions.loadEvaluations),
      concatLatestFrom(() => [
        this.store.select(classroomEvaluationFeature.selectMissionId),
        this.store.select(classroomEvaluationFeature.selectEnrollmentId),
      ]),
      mergeMap(([_, missionId, enrollmentId]) => {
        return this.evaluationAPI.getEvaluations({ mission__id: missionId, enrollment__id: enrollmentId }).pipe(
          map((payload) => {
            const formattedEvaluations = this.evaluationService.formatEvaluations(payload?.results);
            return EvaluationActions.loadEvaluationsSuccess({
              payload: formattedEvaluations,
              userId: this.authService.userId || '',
              missionId,
            });
          }),
        );
      }),
    );
  });

  loadEvaluationQuestions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EvaluationActions.loadEvaluationQuestions),
      mergeMap(() => {
        return this.evaluationAPI
          .getEvaluationsQuestions()
          .pipe(map((payload) => EvaluationActions.loadEvaluationQuestionsSuccess({ payload })));
      }),
    );
  });

  postEvaluation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EvaluationActions.postEvaluation),
      concatLatestFrom(() => [
        this.store.select(classroomEvaluationFeature.selectMissionId),
        this.store.select(classroomEvaluationFeature.selectEnrollmentId),
      ]),
      switchMap(([{ evaluation }, missionId, enrollmentId]) => {
        const { comment, rating, ...otherProperties } = evaluation;

        return forkJoin({
          evaluation: this.evaluationAPI.postEvaluation({
            ...otherProperties,
            ...(!!comment && { comment }),
            version: 1,
            user: this.authService.userId,
            mission: missionId,
            enrollment: enrollmentId,
          }),
          rating: this.ratingService.rateMission(missionId, rating),
        }).pipe(map(() => StepNavigationActions.next()));
      }),
    );
  });
}
