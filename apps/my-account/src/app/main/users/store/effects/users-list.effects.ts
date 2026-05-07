import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { UsersListActions, UsersImportDialogActions } from '../actions';
import { UsersListSelectors } from '../selectors';
import { UsersServiceV2 } from '@app/shared/services/users-v2.service';

@Injectable()
export class UsersListEffects {
  loadUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersListActions.loadUsers),
      concatLatestFrom(() => this.store.select(UsersListSelectors.selectFilters)),
      switchMap(([_, filter]) =>
        this._serviceV2.fetchWorkspaceUsers(filter).pipe(
          map((response) => UsersListActions.loadUsersSuccess({ response })),
          catchError((error) => of(UsersListActions.loadUsersFailure({ error }))),
        ),
      ),
    );
  });

  toggleUserStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersListActions.toggleUserStatus),
      switchMap(({ user }) =>
        this._serviceV2.updateUserStatus(user.id, !user.status).pipe(
          map(() => UsersListActions.toggleUserStatusSuccess({ userId: user.id })),
          catchError(() => of(UsersListActions.toggleUserStatusFailure())),
        ),
      ),
    );
  });

  reload$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        UsersListActions.init,
        UsersListActions.search,
        UsersListActions.filter,
        UsersListActions.changePage,
        UsersListActions.sort,
        UsersImportDialogActions.importUsersSuccess,
      ),
      map(() => UsersListActions.loadUsers()),
    );
  });

  constructor(
    private actions$: Actions,
    private _serviceV2: UsersServiceV2,
    private store: Store,
  ) {}
}
