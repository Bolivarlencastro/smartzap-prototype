import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { LinkCycleActions, linkCycleFeature } from '.';
import { LinkCycleService } from '../services/link-cycle.service';

@Injectable()
export class LinkCycleEffects {
  constructor(
    private _actions$: Actions,
    private store: Store,
    private _linkCycleService: LinkCycleService,
  ) {}

  openDialog$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LinkCycleActions.openDialog),
      switchMap(() => {
        return this._linkCycleService
          .openDialog()
          .afterClosed()
          .pipe(map(() => LinkCycleActions.dialogClosed()));
      }),
    );
  });

  dialogClosed$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LinkCycleActions.dialogClosed),
      map(() => LinkCycleActions.resetState()),
    );
  });

  filterCycles$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LinkCycleActions.filterCycles),
      switchMap(({ filter }) => {
        return this._linkCycleService.getCycles(filter).pipe(
          map((cycles) => LinkCycleActions.filterCyclesSuccess({ cycles })),
          catchError(() => of(LinkCycleActions.filterCyclesFailure())),
        );
      }),
    );
  });

  initialCyclesSearch$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LinkCycleActions.openDialog),
      map(() => LinkCycleActions.filterCycles({ filter: '' })),
    );
  });

  linkCycle$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LinkCycleActions.linkCycle),
      concatLatestFrom(() => this.store.select(linkCycleFeature.selectEnrollmentId)),
      switchMap(([{ cycleId }, enrollmentId]) =>
        this._linkCycleService.linkEnrollmentToCycle(cycleId, enrollmentId).pipe(
          map(() => LinkCycleActions.linkCycleSuccess()),
          catchError(() => of(LinkCycleActions.linkCycleFailure())),
        ),
      ),
    );
  });
}
