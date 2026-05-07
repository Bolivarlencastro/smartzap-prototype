import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { MissionActions } from '../actions';

@Injectable()
export class MissionEffects {
  loadMissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MissionActions.loadMissions, MissionActions.filterMissions),
      mergeMap(({ queryParams }) =>
        this.service.fetchMissions(queryParams).pipe(
          map((data) => MissionActions.loadMissionsSuccess({ data })),
          catchError((error) => of(MissionActions.loadMissionsFailure({ error }))),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private service: MissionServiceV2,
  ) {}
}
