import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersImportService } from 'app/main/users/services/users-import.service';
import { catchError, of, switchMap } from 'rxjs';
import { UsersImportDialogActions } from '../actions';
import { map } from 'rxjs/operators';

@Injectable()
export class UsersImportDialogEffects {
  openDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UsersImportDialogActions.openDialog),
        map(() => this.usersImportService.openDialog()),
      );
    },
    { dispatch: false },
  );

  importUserSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UsersImportDialogActions.importUsersSuccess),
        map(() => this.usersImportService.closeDialog()),
      );
    },
    { dispatch: false },
  );

  importUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersImportDialogActions.importUsers),
      switchMap(({ selectedRoles, temporaryPassword }) =>
        this.usersImportService.importUsers(selectedRoles, temporaryPassword).pipe(
          map(() => UsersImportDialogActions.importUsersSuccess()),
          catchError((error) => of(UsersImportDialogActions.importUsersFailure({ error }))),
        ),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly usersImportService: UsersImportService,
  ) {}
}
