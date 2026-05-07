import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { CycleCreateService } from '../../services';
import { CycleCreateActions, CyclesListActions } from '../actions';
import { cycleCreateFeature } from '../features';

@Injectable()
export class CycleCreateEffects {
  openCreationDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CycleCreateActions.openNewCycleDialog),
      switchMap(() =>
        this.regulatoryComplianceService.openCycleDialog().pipe(map(() => CycleCreateActions.dialogClosed())),
      ),
    );
  });

  openEditionDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CycleCreateActions.openEditCycleDialog),
      switchMap(({ cycle }) =>
        this.regulatoryComplianceService.openEditConfirmDialog().pipe(
          filter((value) => value),
          map(() => CycleCreateActions.loadCycleForEdition({ cycleId: cycle.id })),
        ),
      ),
    );
  });

  loadCycleForEdition$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CycleCreateActions.loadCycleForEdition),
      switchMap(({ cycleId }) =>
        this.regulatoryComplianceService.loadCycle(cycleId).pipe(
          map((cycle) => CycleCreateActions.loadCycleForEditionSuccess({ cycle })),
          catchError(() => of(CycleCreateActions.loadCycleForEditionFailure())),
        ),
      ),
    );
  });

  loadCycleForEditionSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CycleCreateActions.loadCycleForEditionSuccess),
      switchMap(() =>
        this.regulatoryComplianceService.openCycleDialog().pipe(map(() => CycleCreateActions.dialogClosed())),
      ),
    );
  });

  dialogClosed$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CycleCreateActions.dialogClosed),
      map(() => CycleCreateActions.resetState()),
    );
  });

  saveNormativeCycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CycleCreateActions.saveNormativeCycle),
      concatLatestFrom(() => this.store.select(cycleCreateFeature.selectCycle).pipe(map((cycle) => cycle?.id))),
      switchMap(([{ cycle }, currentCycleId]) =>
        this.regulatoryComplianceService.saveNormativeCycle(cycle, currentCycleId).pipe(
          catchError(() => of(CycleCreateActions.saveNormativeCycleFailure())),
          map(() => CycleCreateActions.saveNormativeCycleSuccess()),
        ),
      ),
    );
  });

  deleteNormativeCycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CycleCreateActions.deleteNormativeCycles),
      switchMap(({ ids }) =>
        this.regulatoryComplianceService.openDeleteConfirmDialog().pipe(
          filter((value) => value),
          switchMap(() =>
            this.regulatoryComplianceService
              .deleteNormativeCycles(ids)
              .pipe(map(() => CycleCreateActions.deleteNormativeCyclesSuccess())),
          ),
        ),
      ),
    );
  });

  closeDialogAfterSaving$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CycleCreateActions.deleteNormativeCyclesSuccess, CycleCreateActions.saveNormativeCycleSuccess),
      map(() => {
        this.regulatoryComplianceService.closeDialog();
        return CyclesListActions.loadCycles();
      }),
    );
  });

  loadJobsAndFunctions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CycleCreateActions.openNewCycleDialog, CycleCreateActions.openEditCycleDialog),
      switchMap(() =>
        this.regulatoryComplianceService.loadJobAndPositions().pipe(
          map(({ jobs, jobFunctions }) =>
            CycleCreateActions.loadJobsAndFunctionsSuccess({
              jobs,
              jobFunctions,
            }),
          ),
        ),
      ),
    );
  });

  filterItems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CycleCreateActions.filterItems),
      switchMap(({ search }) =>
        this.regulatoryComplianceService.filterItems(search).pipe(
          map((results) =>
            CycleCreateActions.filterItemsSuccess({
              results,
              searchType: search.type,
            }),
          ),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private regulatoryComplianceService: CycleCreateService,
    private store: Store,
  ) {}
}
