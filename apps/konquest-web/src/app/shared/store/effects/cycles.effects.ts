import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { RegulatoryComplianceService } from '@app/shared/services/regulatory-compliance.service';
import { RegulatoryComplianceApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CyclesActions, LearningTrailActions, MissionActions, UserActions } from '../actions';

@Injectable()
export class CyclesEffects {
  filterCycles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CyclesActions.filterCycles),
      switchMap(({ search }) =>
        this.regulatoryComplianceApi.getCycles({ search }).pipe(
          map(({ items }) => CyclesActions.filterCyclesSuccess({ results: items })),
          catchError(() => of(CyclesActions.filterCyclesFailure())),
        ),
      ),
    );
  });

  resetState = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.clearCache, LearningTrailActions.clearCache, MissionActions.clearCache),
      map(() => CyclesActions.reset()),
    );
  });

  fetchNormativeModule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CyclesActions.fetchNormativeModule),
      switchMap(() =>
        this.regulatoryComplianceService
          .fetchNormativeStatus()
          .pipe(map((value) => CyclesActions.fetchNormativeModuleSuccess({ isNormativeActive: value }))),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private regulatoryComplianceApi: RegulatoryComplianceApi,
    private regulatoryComplianceService: RegulatoryComplianceService,
  ) {}
}
