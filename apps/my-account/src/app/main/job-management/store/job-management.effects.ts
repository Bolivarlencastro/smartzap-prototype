import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { JobManagementActions } from '.';
import { jobManagementFeature } from './job-management.feature';
import { JobManagementService } from '@app/shared/services/job-management.service';

@Injectable()
export class JobManagementEffects {
  constructor(
    private _actions$: Actions,
    private store: Store,
    private _jobManagementService: JobManagementService,
  ) {}

  loadItems$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(JobManagementActions.loadItems),
      concatLatestFrom(() => [
        this.store.select(jobManagementFeature.selectActiveTab),
        this.store.select(jobManagementFeature.selectSearchTerm),
      ]),
      switchMap(([_, jobType, searchTerm]) => {
        return this._jobManagementService.getJobs(jobType, searchTerm).pipe(
          map((response) => JobManagementActions.loadItemsSuccess({ response })),
          catchError(() => of(JobManagementActions.loadItemsFailure())),
        );
      }),
    );
  });

  deleteItem$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(JobManagementActions.deleteItem),
      concatLatestFrom(() => this.store.select(jobManagementFeature.selectActiveTab)),
      switchMap(([{ id }, jobType]) => {
        return this._jobManagementService.openDeleteConfirmDialog(jobType, id).pipe(
          filter((result) => !result),
          switchMap(() => {
            return this._jobManagementService.deleteJob(jobType, id).pipe(map(() => JobManagementActions.loadItems()));
          }),
        );
      }),
    );
  });

  saveItem$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(JobManagementActions.saveItem),
      concatLatestFrom(() => [
        this.store.select(jobManagementFeature.selectActiveTab),
        this.store.select(jobManagementFeature.selectItem),
      ]),
      map(([{ response }, jobType, item]) => {
        return item
          ? JobManagementActions.editItem({ jobType, response })
          : JobManagementActions.createItem({ jobType, response });
      }),
    );
  });

  createItem$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(JobManagementActions.createItem),
      switchMap(({ jobType, response }) => {
        return this._jobManagementService
          .createJob(jobType, response)
          .pipe(map(() => JobManagementActions.loadItems()));
      }),
    );
  });

  editItem$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(JobManagementActions.editItem),
      switchMap(({ jobType, response }) => {
        return this._jobManagementService.editJob(jobType, response).pipe(map(() => JobManagementActions.loadItems()));
      }),
    );
  });

  changeTab$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(JobManagementActions.changeTab),
      map(() => JobManagementActions.loadItems()),
    );
  });

  updateSearchTerm$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(JobManagementActions.updateSearchTerm),
      map(() => JobManagementActions.loadItems()),
    );
  });

  openDialog$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(JobManagementActions.openDialog),
      switchMap(() => {
        return this._jobManagementService
          .openDialog()
          .afterClosed()
          .pipe(map(() => JobManagementActions.dialogClosed()));
      }),
    );
  });
}
