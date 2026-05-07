import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersImportService } from 'app/main/users/services/users-import.service';
import { UserImportErrorsActions } from '../actions';
import { catchError, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserImportErrorsEffects {
  loadImports$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserImportErrorsActions.loadUserImportErrors),
      switchMap(({ importId }) =>
        this.usersImportService.listImportErrors(importId).pipe(
          map((imports) => UserImportErrorsActions.loadUserImportErrorsSuccess({ results: imports })),
          catchError((error) => of(UserImportErrorsActions.loadUserImportErrorsFailure({ error }))),
        ),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly usersImportService: UsersImportService,
  ) {}
}
