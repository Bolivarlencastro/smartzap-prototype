import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SimpleFilterReportService } from '../../services';
import { UsersFilterListActions } from '../actions';

@Injectable()
export class UsersFilterListEffects {
  loadItems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersFilterListActions.loadFilterItems),
      switchMap(({ filter }) =>
        this.service.fetchOptions('USERS', filter).pipe(
          map(({ items, loaded }) => UsersFilterListActions.loadFilterItemsSuccess({ items, loaded })),
          catchError((error) => of(UsersFilterListActions.loadFilterItemsFailure({ error }))),
        ),
      ),
    );
  });

  search$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersFilterListActions.searchItems),
      switchMap(({ filter }) =>
        this.service.fetchOptions('USERS', filter).pipe(
          map(({ items, loaded }) => UsersFilterListActions.searchItemsSuccess({ items, loaded })),
          catchError((error) => of(UsersFilterListActions.searchItemsFailure({ error }))),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private service: SimpleFilterReportService,
  ) {}
}
