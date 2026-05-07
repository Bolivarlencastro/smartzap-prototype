import { Injectable } from '@angular/core';
import { UserService } from '@core/api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concat, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { UserActions } from '../actions';

const role_id: string[] = [
  'a6d23aea-807e-4374-964e-c725b817742d',
  '45f1fc7f-56f4-4208-a347-ee4d84a8f064',
  '97f4a026-f727-4e23-bdf9-971fec7ce20e',
  '5f19d9b6-dc84-4db3-9074-8f8dfbbe51c8',
  '297a88de-c34b-4661-be8a-7090fa9a89e5',
  'c2a0da89-311d-4e4f-bf7b-c49d7c15f2b6',
];

@Injectable()
export class UserEffects {
  loadUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.loadUsers),
      mergeMap(({ queryParams }) =>
        this.service
          .fetchByQuery({
            ...queryParams,
            'filter.roles.role.id': `$in:${role_id}`,
            'filter.status': `$eq:${true}`,
          })
          .pipe(
            map((data) => UserActions.loadUsersSuccess({ data })),
            catchError((error) => of(UserActions.loadUsersFailure({ error }))),
          ),
      ),
    );
  });

  applyUserFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.applyUserFilter),
      switchMap(({ search }) => {
        return concat(
          of(UserActions.clearCache()),
          of(
            UserActions.loadUsers({
              queryParams: {
                sortBy: 'name:ASC',
                limit: 15,
                page: 1,
                search,
              },
            }),
          ),
        );
      }),
    );
  });

  constructor(
    private actions$: Actions,
    private service: UserService,
  ) {}
}
