import { Injectable } from '@angular/core';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import * as fromActions from './learning-trail-detail.actions';

const START_LOADING_ACTIONS = [
  fromActions.enrollGiveUpLearningTrail,
  fromActions.enrollRetakeLearningTrail,
  fromActions.enrollLearningTrail,
  fromActions.deleteLearningTrail,
  fromActions.enrollGetCertificateLearningTrail,
  fromActions.loadLearningTrail,
];

const HIDE_LOADING_ACTIONS = [
  fromActions.enrollGiveUpLearningTrailSuccess,
  fromActions.enrollGiveUpLearningTrailFailure,
  fromActions.enrollRetakeLearningTrailSuccess,
  fromActions.enrollRetakeLearningTrailFailure,
  fromActions.deleteLearningTrailSuccess,
  fromActions.deleteLearningTrailFailure,
  fromActions.enrollLearningTrailSuccess,
  fromActions.enrollLearningTrailFailure,
  fromActions.enrollGetCertificateLearningTrailSuccess,
  fromActions.enrollGetCertificateLearningTrailFailure,
  fromActions.loadLearningTrailSuccess,
  fromActions.loadLearningTrailFailure,
];

@Injectable()
export class LearningTrailDetailLoadingEffects {
  showLoading$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(...START_LOADING_ACTIONS),
        tap(() => this._fuseLoadingService.show()),
      );
    },
    { dispatch: false },
  );

  hideLoading$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(...HIDE_LOADING_ACTIONS),
        tap(() => {
          this._fuseLoadingService.hide();
        }),
      );
    },
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private _fuseLoadingService: FuseLoadingService,
  ) {}
}
