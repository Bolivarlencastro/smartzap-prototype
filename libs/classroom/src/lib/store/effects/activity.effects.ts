import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { ActivityService } from '../../services';
import { ActivityActions } from '../actions';
import { classroomActivityFeature, classroomContentFeature, classroomStepsFeature } from '../features';

@Injectable()
export class ActivityEffects {
  createActivity$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActivityActions.onActivityEvent),
      filter(({ event }) => event === 'CREATE'),
      concatLatestFrom(() => [
        this.store.select(classroomStepsFeature.selectCurrentStep),
        this.store.select(classroomContentFeature.selectContent),
      ]),
      switchMap(([_, currentStep, content]) =>
        this.activityService.createLearnActivity(currentStep.id, content).pipe(
          map((activity) => ActivityActions.createActivitySuccess({ activity })),
          catchError((error) => of(ActivityActions.createActivityFailure({ error }))),
        ),
      ),
    );
  });

  updateActivity$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActivityActions.onActivityEvent),
      filter(({ event }) => event === 'UPDATE'),
      concatLatestFrom(() => [
        this.store.select(classroomActivityFeature.selectLastCreatedActivity),
        this.store.select(classroomContentFeature.selectContent),
      ]),
      filter(([_, lastCreatedActivity, content]) => !!lastCreatedActivity && !!content),
      switchMap(([_, lastCreatedActivity, content]) =>
        this.activityService.updateLearnActivityStopTime(lastCreatedActivity, content).pipe(
          map((activity) => ActivityActions.updateActivitySuccess({ activity })),
          catchError((error) => of(ActivityActions.updateActivityFailure({ error }))),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private activityService: ActivityService,
    private store: Store,
  ) {}
}
