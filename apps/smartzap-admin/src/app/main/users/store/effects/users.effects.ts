import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, switchMap, tap } from 'rxjs/operators';
import { UsersService } from '../../services';
import { UsersActions } from '../actions';
import { UsersSelector } from '../selectors';
import { UIActions } from 'app/shared/store';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

@Injectable()
export class UsersEffects {
  init$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UsersActions.init),
      map(() => UsersActions.loadUsers({})),
    );
  });

  removeUser$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UsersActions.removeUser),
      concatMap(({ id }) =>
        this._usersService.removeUser(id).pipe(
          map(() => UsersActions.removeUserSuccess({ id })),
          catchError((error) => of(UsersActions.removeUserFailure({ error }))),
        ),
      ),
    );
  });

  loadUsers$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UsersActions.loadUsers),
      concatLatestFrom(() => [
        this.store.select(UsersSelector.selectGetDatatableQuery),
        this.store.select(UsersSelector.selectFilters),
      ]),
      switchMap(([_, query, filters]) => {
        const params = {
          page: query.pagination.page,
          per_page: query.pagination.per_page,
          searchTerm: query.searchTerm,
          sort: query.sort || '',
          tags: filters.tags,
          synced: filters.synced,
        };

        return this._usersService.fetchUsers(params).pipe(
          map((data) => UsersActions.loadUsersSuccess({ data })),
          catchError((error) => of(UsersActions.loadUsersFailure({ error }))),
        );
      }),
    );
  });

  filterUsers$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UsersActions.filterUsers),
      map(() => UsersActions.loadUsers({})),
    );
  });

  updateUser$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UsersActions.updateUser),
      concatMap(({ id, user }) => {
        return this._usersService.updateUser(id, user).pipe(
          map(() => UsersActions.updateUserSuccess({ user: { id, ...user } })),
          catchError((error) => {
            const defaultErrorMessage = error.i18n;
            const statusCode = error.status;
            const errorMessageByStatusCodeMap: Record<number, string> = {
              409: 'USERS.ERROR.USER_EXISTS',
            };
            const errorMessage = errorMessageByStatusCodeMap[statusCode] || defaultErrorMessage;
            return of(UsersActions.updateUserFailure({ error: errorMessage }));
          }),
        );
      }),
    );
  });

  showProcessing$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UsersActions.updateUser),
      map(() => UIActions.showProcessing()),
    );
  });

  hideProcessing$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UsersActions.updateUserSuccess),
      map(() => UIActions.hideProcessing()),
    );
  });

  showFailureMessage$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UsersActions.updateUserFailure),
      tap(({ error }) => {
        this._messageService.error(error);
      }),
      map(() => UIActions.hideProcessing()),
    );
  });

  toggleSelectAll$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UsersActions.toggleSelectAll),
      concatLatestFrom(() => this.store.select(UsersSelector.selectGetUsers)),
      switchMap(([, users]) => {
        const nonSelectedUsers = users.filter(({ selected }) => !selected);

        if (nonSelectedUsers.length) {
          const actions = nonSelectedUsers.map(({ id }) => UsersActions.toggleSelectUser({ id, selected: true }));
          return of(...actions);
        }

        const actions = users.map(({ id }) => UsersActions.toggleSelectUser({ id, selected: false }));
        return of(...actions);
      }),
    );
  });

  fetchMoreUsers$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UsersActions.fetchMoreUsers),
      concatLatestFrom(() => [
        this.store.select(UsersSelector.selectIsFinished),
        this.store.select(UsersSelector.selectIsLoading),
      ]),
      filter(([_, finished, isLoading]) => !finished && !isLoading),
      map(() => UsersActions.loadUsers({})),
    );
  });

  searchUserByName$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UsersActions.searchUsers),
      map(() => UsersActions.loadUsers({})),
    );
  });

  sortUsers$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UsersActions.sortUsers),
      map(() => UsersActions.loadUsers({})),
    );
  });

  setPagination$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UsersActions.setUserPagination),
      concatLatestFrom(() => this.store.select(UsersSelector.selectGetDatatableQuery)),
      map(([{ currentPage, per_page }, query]) => {
        const pageParams = { ...query.pagination, page: currentPage, per_page };
        return UsersActions.loadUsers({ page: pageParams });
      }),
    );
  });

  constructor(
    private _usersService: UsersService,
    private readonly _messageService: KpMessageService,
    private store: Store,
    private _actions$: Actions,
  ) {}
}
