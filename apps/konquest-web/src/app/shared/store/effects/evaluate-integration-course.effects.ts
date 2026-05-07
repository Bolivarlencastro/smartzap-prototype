import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { IntegrationCourseEvaluationActions } from 'app/shared/store';
import { map, switchMap } from 'rxjs/operators';
import { catchError, of } from 'rxjs';
import { EvaluationService } from 'app/main/evaluation/evaluation.service';
import { Injectable } from '@angular/core';

@Injectable()
export class EvaluateIntegrationCourseEffects {
  loadCourse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(IntegrationCourseEvaluationActions.loadCourse),
      switchMap(({ notification }) =>
        this.missionService.fetchMissionById(notification.objectPk).pipe(
          map((mission) => IntegrationCourseEvaluationActions.loadCourseSuccess({ mission })),
          catchError((error) => of(IntegrationCourseEvaluationActions.loadCourseFailure({ error }))),
        ),
      ),
    );
  });

  loadCourseSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(IntegrationCourseEvaluationActions.loadCourseSuccess),
        map(({ mission }) => this.evaluationService.openEvaluationDialog(mission)),
      );
    },
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private missionService: MissionServiceV2,
    private evaluationService: EvaluationService,
  ) {}
}
