import { Injectable } from '@angular/core';
import { UsersServiceV2 } from '@app/shared/services/users-v2.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';
import { UsersListActions, UsersListFilterActions } from '../actions';

@Injectable()
export class UsersListFilterEffects {
  fetchJobPositions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersListActions.init),
      switchMap(() =>
        this._serviceV2
          .fetchJobPositions()
          .pipe(map((jobPositions) => UsersListFilterActions.fetchJobPositions({ jobPositions }))),
      ),
    );
  });

  fetchActivityAreas$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersListActions.init),
      switchMap(() =>
        this._serviceV2
          .fetchEmployeeInfosByType('areas-of-activity')
          .pipe(map((activityAreas) => UsersListFilterActions.fetchActivityAreas({ activityAreas }))),
      ),
    );
  });

  fetchLeaders$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersListActions.init),
      switchMap(() =>
        this._serviceV2
          .fetchCurrentWorkspaceLeaders()
          .pipe(map((leaders) => UsersListFilterActions.fetchLeaders({ leaders }))),
      ),
    );
  });

  fetchDirectors$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersListActions.init),
      switchMap(() =>
        this._serviceV2
          .fetchEmployeeInfosByType('directors')
          .pipe(map((directors) => UsersListFilterActions.fetchDirectors({ directors }))),
      ),
    );
  });

  fetchManagers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersListActions.init),
      switchMap(() =>
        this._serviceV2
          .fetchEmployeeInfosByType('managers')
          .pipe(map((managers) => UsersListFilterActions.fetchManagers({ managers }))),
      ),
    );
  });

  clear$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersListActions.clear),
      map(() => UsersListFilterActions.clear()),
    );
  });

  constructor(
    private actions$: Actions,
    private _serviceV2: UsersServiceV2,
    private store: Store,
  ) {}
}
