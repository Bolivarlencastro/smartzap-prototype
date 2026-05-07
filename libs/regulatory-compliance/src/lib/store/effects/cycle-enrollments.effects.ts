import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { CycleEnrollmentsActions } from '../actions';
import { cycleEnrollmentsFeature } from '../features';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { CycleEnrollmentsService } from '../../services';

@Injectable()
export class CycleEnrollmentsEffects {
  $loadCycleEnrollments = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CycleEnrollmentsActions.loadEnrollments,
        CycleEnrollmentsActions.searchEnrollments,
        CycleEnrollmentsActions.filterEnrollments,
        CycleEnrollmentsActions.pageChange,
        CycleEnrollmentsActions.sortEnrollments,
      ),
      concatLatestFrom(() => [
        this.store.select(cycleEnrollmentsFeature.selectFilter),
        this.store.select(cycleEnrollmentsFeature.selectSort),
      ]),
      switchMap(([_, filter, sort]) =>
        this._cycleManagementService.loadEnrollments(filter, sort).pipe(
          map(({ data, meta }) =>
            CycleEnrollmentsActions.loadEnrollmentsSuccess({
              results: data,
              totalItems: meta?.totalItems,
            }),
          ),
          catchError(() => of(CycleEnrollmentsActions.loadEnrollmentsFailure())),
        ),
      ),
    ),
  );

  $renewCycle = createEffect(() =>
    this.actions$.pipe(
      ofType(CycleEnrollmentsActions.renewCycle),
      switchMap(({ cycle }) =>
        this._cycleManagementService.openConfirmationDialog('renew').pipe(
          filter((result) => !!result),
          switchMap(() =>
            this._cycleManagementService.renewEnrollment(cycle.cycle.id, cycle.enrollment.id).pipe(
              map(() => CycleEnrollmentsActions.renewCycleSuccess({ cycle })),
              catchError(() => of(CycleEnrollmentsActions.renewCycleFailure())),
            ),
          ),
        ),
      ),
    ),
  );

  $cancelCycle = createEffect(() =>
    this.actions$.pipe(
      ofType(CycleEnrollmentsActions.inactivateCycle),
      switchMap(({ cycle }) =>
        this._cycleManagementService.openConfirmationDialog('inactivate').pipe(
          filter((result) => !!result),
          switchMap(() =>
            this._cycleManagementService.inactivateCycle(cycle.id).pipe(
              map(() => CycleEnrollmentsActions.inactivateCycleSuccess({ cycle })),
              catchError(() => of(CycleEnrollmentsActions.inactivateCycleFailure())),
            ),
          ),
        ),
      ),
    ),
  );

  generateReport$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CycleEnrollmentsActions.generateReport),
        switchMap(() => this._cycleManagementService.generateReport()),
      );
    },
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private _cycleManagementService: CycleEnrollmentsService,
  ) {}
}
