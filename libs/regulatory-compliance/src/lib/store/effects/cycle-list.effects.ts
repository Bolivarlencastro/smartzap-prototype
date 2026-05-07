import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { CycleCreateService } from '../../services';
import { ComplianceDialogActions, CyclesListActions } from '../actions';
import { cyclesListFeature } from '../features';

@Injectable()
export class CycleListEffects {
  constructor(
    private _actions$: Actions,
    private _regulatoryComplianceService: CycleCreateService,
    private store: Store,
  ) {}

  loadNormativeCycles$ = createEffect(() =>
    this._actions$.pipe(
      ofType(CyclesListActions.loadCycles),
      concatLatestFrom(() => this.store.select(cyclesListFeature.selectFilter)),
      switchMap(([_, storeFilter]) =>
        this._regulatoryComplianceService.getNormativeCycles(storeFilter).pipe(
          map((response) => CyclesListActions.loadCyclesSuccess({ response })),
          catchError(() => of(CyclesListActions.loadCyclesFailure())),
        ),
      ),
    ),
  );

  reload$ = createEffect(() =>
    this._actions$.pipe(
      ofType(CyclesListActions.setFilter, CyclesListActions.setPagination, ComplianceDialogActions.reset),
      map(() => CyclesListActions.loadCycles()),
    ),
  );

  deleteNormativeCycle$ = createEffect(() =>
    this._actions$.pipe(
      ofType(CyclesListActions.deleteCycle),
      switchMap(({ ids }) =>
        this._regulatoryComplianceService.openDeleteConfirmDialog(ids.length).pipe(
          filter((value) => value),
          switchMap(() =>
            this._regulatoryComplianceService
              .deleteNormativeCycles(ids)
              .pipe(map(() => CyclesListActions.loadCycles())),
          ),
        ),
      ),
    ),
  );
}
