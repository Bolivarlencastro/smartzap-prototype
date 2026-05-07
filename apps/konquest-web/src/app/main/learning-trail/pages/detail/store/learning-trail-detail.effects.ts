import { Injectable } from '@angular/core';
import { MissionServiceV2 } from '@app/main/mission/services/mission.service';
import { CertificateUploadActions } from '@app/shared/components/certificate-upload';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { LearningTrailEnrollmentsAPI } from '@core/api/learning-trail-enrollments.api';
import { LearningTrailAPI } from '@core/api/learning-trail.api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { LearningTrailListService } from '../../../services/learning-trail-list.service';
import { CollectionActions } from '../../list/store/actions';
import * as LearningTrailActions from './learning-trail-detail.actions';
import * as LearningTrailSelectors from './learning-trail-detail.selectors';

@Injectable()
export class LearningTrailDetailEffects {
  constructor(
    private _learningTrailAPI: LearningTrailAPI,
    private _learningTrailEnrollmentsAPI: LearningTrailEnrollmentsAPI,
    private _actions$: Actions,
    private _messageService: KpMessageService,
    private _learningTrailListService: LearningTrailListService,
    private _missionService: MissionServiceV2,
    private store: Store,
  ) {}

  loadLearningTrail$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LearningTrailActions.loadLearningTrail),
      switchMap(({ trailId }) => {
        return this._learningTrailListService.loadLearningTrailById(trailId).pipe(
          map((learningTrail) => LearningTrailActions.loadLearningTrailSuccess({ payload: learningTrail })),
          catchError((error) => of(LearningTrailActions.loadLearningTrailFailure({ payload: error }))),
        );
      }),
    );
  });

  loadLearningTrailSuccess$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(LearningTrailActions.loadLearningTrail),
        map(() => this._learningTrailListService.openDetailDialog()),
      );
    },
    { dispatch: false },
  );

  enrollLearningTrail$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LearningTrailActions.enrollLearningTrail),
      switchMap(({ learningTrailId, userId, goalDate }) => {
        return this._learningTrailEnrollmentsAPI.enroll(learningTrailId, userId, goalDate).pipe(
          map((enrollment) => LearningTrailActions.enrollLearningTrailSuccess({ enrollment })),
          catchError((error) => of(LearningTrailActions.enrollLearningTrailFailure(error))),
        );
      }),
    );
  });

  deleteLearningTrail$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LearningTrailActions.deleteLearningTrail),
      switchMap(({ id }) => {
        return this._learningTrailAPI.deleteLearningTrail(id).pipe(
          map(() => {
            this._messageService.success(marker('LEARNING_TRAIL.DETAIL.DELETE_SUCCESS'));
            return LearningTrailActions.deleteLearningTrailSuccess({ id });
          }),
          catchError((error) => of(LearningTrailActions.deleteLearningTrailFailure(error))),
        );
      }),
    );
  });

  deleteLearningTrailSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LearningTrailActions.deleteLearningTrailSuccess),
      tap(() => this._learningTrailListService.closeDialog()),
      map(({ id }) => CollectionActions.removeTrail({ trailId: id })),
    );
  });

  enrollGetCertificateLearningTrail$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LearningTrailActions.enrollGetCertificateLearningTrail),
      switchMap(({ learning_trail_id, user_id }) => {
        return this._learningTrailEnrollmentsAPI.enrollGetCertificate(learning_trail_id, user_id).pipe(
          tap((response) => window.open(response.certificate_url, '_blank')),
          map(() => LearningTrailActions.enrollGetCertificateLearningTrailSuccess()),
          catchError((error) => of(LearningTrailActions.enrollGetCertificateLearningTrailFailure(error))),
        );
      }),
    );
  });

  enrollGiveUpLearningTrail$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LearningTrailActions.enrollGiveUpLearningTrail),
      switchMap(({ enrollment_id }) => {
        return this._learningTrailEnrollmentsAPI.enrollGiveUp(enrollment_id).pipe(
          map(() => LearningTrailActions.enrollGiveUpLearningTrailSuccess()),
          catchError((error) => of(LearningTrailActions.enrollGiveUpLearningTrailFailure(error))),
        );
      }),
    );
  });

  enrollRetakeLearningTrail$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LearningTrailActions.enrollRetakeLearningTrail),
      switchMap(({ enrollment_id, goal_date }) => {
        return this._learningTrailEnrollmentsAPI.enrollRetake(enrollment_id, goal_date).pipe(
          map((enrollment) =>
            LearningTrailActions.enrollRetakeLearningTrailSuccess({
              enrollment,
            }),
          ),
          catchError((error) => of(LearningTrailActions.enrollRetakeLearningTrailFailure(error))),
        );
      }),
    );
  });

  reloadLearningTrails$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(
        LearningTrailActions.enrollLearningTrailSuccess,
        LearningTrailActions.enrollRetakeLearningTrailSuccess,
        LearningTrailActions.enrollGiveUpLearningTrailSuccess,
      ),
      map(() => CollectionActions.loadLearningTrails()),
    );
  });

  openAttachStepCertificate$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LearningTrailActions.openAttachStepCertificate),
      map(({ id }) => CertificateUploadActions.openDialog({ enrollmentId: id })),
    );
  });

  generateStepCertificate$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(LearningTrailActions.generateStepCertificate),
        switchMap(({ id }) => this._missionService.generateCertificate(id)),
      );
    },
    { dispatch: false },
  );

  reloadLearningTrail$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(
        LearningTrailActions.enrollLearningTrailSuccess,
        LearningTrailActions.enrollGiveUpLearningTrailSuccess,
        LearningTrailActions.enrollRetakeLearningTrailSuccess,
        CertificateUploadActions.uploadCertificateSuccess,
      ),
      concatLatestFrom(() => this.store.select(LearningTrailSelectors.selectLearningTrail)),
      switchMap(([_, { id }]) => {
        return this._learningTrailListService.loadLearningTrailById(id).pipe(
          map((learningTrail) => LearningTrailActions.loadLearningTrailSuccess({ payload: learningTrail })),
          catchError((error) => of(LearningTrailActions.loadLearningTrailFailure({ payload: error }))),
        );
      }),
    );
  });

  updateLearningTrailDescription$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LearningTrailActions.updateLearningTrailDescription),
      switchMap(({ id, description }) =>
        this._learningTrailAPI.updateLearningTrailDescription(id, description).pipe(
          map(() => LearningTrailActions.updateLearningTrailDescriptionSuccess({ description })),
          catchError((error) => of(LearningTrailActions.updateLearningTrailDescriptionFailure({ error }))),
        ),
      ),
    );
  });
}
