import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { ActivityLogService } from '../services/activity-log.service';
import { ActivityLogActions, activityLogFeature } from '.';

@Injectable()
export class ActivityLogEffects {
  constructor(
    private actions: Actions,
    private store: Store,
    private activityLogService: ActivityLogService,
  ) {}

  init$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ActivityLogActions.init),
      switchMap(() =>
        this.activityLogService.getUsers().pipe(map((users) => ActivityLogActions.setUserOptions({ users }))),
      ),
    );
  });

  loadData$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ActivityLogActions.loadData),
      concatLatestFrom(() => [this.store.select(activityLogFeature.selectFilter)]),
      switchMap(([_, filter]) =>
        this.activityLogService.getData(filter).pipe(
          map((response) => ActivityLogActions.loadDataSuccess({ response })),
          catchError(() => of(ActivityLogActions.loadDataFailure())),
        ),
      ),
    );
  });

  reload$ = createEffect(() => {
    return this.actions.pipe(
      ofType(
        ActivityLogActions.setUserOptions,
        ActivityLogActions.filterByTerm,
        ActivityLogActions.setPagination,
        ActivityLogActions.setFilter,
      ),
      map(() => ActivityLogActions.loadData()),
    );
  });

  exportLog$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(ActivityLogActions.exportLog),
        switchMap(({ id }) => this.activityLogService.exportLog(id)),
      );
    },
    { dispatch: false },
  );
}
