import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersImportService } from 'app/main/users/services/users-import.service';
import { UserImportsActions } from '../actions';
import { catchError, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserImportsEffects {
  loadImports$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserImportsActions.loadUserImports),
      switchMap(() =>
        this.usersImportService.listUserImports().pipe(
          map((imports) => UserImportsActions.loadUserImportsSuccess({ results: imports })),
          catchError((error) => of(UserImportsActions.loadUserImportsFailure({ error }))),
        ),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly usersImportService: UsersImportService,
  ) {}
}
