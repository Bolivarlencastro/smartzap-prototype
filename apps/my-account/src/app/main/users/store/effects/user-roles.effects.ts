import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { UserDetailsActions, UserRolesActions, UsersImportDialogActions } from 'app/main/users/store/actions';
import { UserRolesService } from 'app/main/users/services/user-roles.service';
import { catchError, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserRolesEffects {
  loadApplications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        UserDetailsActions.openUserDetails,
        UsersImportDialogActions.openDialog,
        UserDetailsActions.refreshUserAccess,
      ),
      switchMap(() =>
        this.userRolesService.getApplicationsWithRoles().pipe(
          map((applications) => UserRolesActions.loadApplicationsSuccess({ applications })),
          catchError(() => of(UserRolesActions.loadApplicationsFailure())),
        ),
      ),
    );
  });

  loadUserRoles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserDetailsActions.openUserDetails, UserDetailsActions.refreshUserAccess),
      switchMap(({ userId }) =>
        this.userRolesService.getUserRoles(userId).pipe(
          map((userRoles) => UserRolesActions.loadUserRolesSuccess({ userRoles })),
          catchError(() => of(UserRolesActions.loadUserRolesFailure())),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private store: Store,
    private userRolesService: UserRolesService,
  ) {}
}
