import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { UserDetailsDrawerService } from 'app/main/users/services/user-details-drawer.service';
import { Store } from '@ngrx/store';
import { UserDetailsActions } from 'app/main/users/store/actions';
import { catchError, filter, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsersService } from 'app/shared/services';
import { UserDetailsSelector } from '../selectors';
import { UsersListActions } from '../actions';

@Injectable()
export class UserDetailsEffects {
  openDrawer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserDetailsActions.openUserDetails, UserDetailsActions.openCreateUser),
      switchMap(() => this.detailsDrawerService.openDrawer().pipe(map(() => UserDetailsActions.closeUserDetails()))),
    );
  });

  loadUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserDetailsActions.openUserDetails, UserDetailsActions.loadUser),
      switchMap(({ userId }) =>
        this.usersService.fetchUser(userId).pipe(
          map((user) => UserDetailsActions.loadUserSuccess({ user })),
          catchError(() => of(UserDetailsActions.loadUserFailure())),
        ),
      ),
    );
  });

  loadUserFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserDetailsActions.loadUserFailure),
      map(() => UserDetailsActions.closeUserDetails()),
    );
  });

  closeDrawer$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserDetailsActions.closeUserDetails),
        map(() => this.detailsDrawerService.closeDrawer()),
      );
    },
    { dispatch: false },
  );

  saveUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserDetailsActions.saveUser),
      concatLatestFrom(() => this.store.select(UserDetailsSelector.selectCurrentUserId)),
      switchMap(([{ user, userRoles }, userId]) =>
        this.usersService.saveUser(user, userId, userRoles).pipe(
          map((user) => UserDetailsActions.saveUserSuccess({ user })),
          catchError(() => of(UserDetailsActions.saveUserFailure())),
        ),
      ),
    );
  });

  loadRolesAfterSaving$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserDetailsActions.saveUserSuccess),
      concatLatestFrom(() => this.store.select(UserDetailsSelector.selectRefreshAccessesAfterSaving)),
      filter(([_, refreshUserAccesses]) => refreshUserAccesses === true),
      map(([{ user }]) => UserDetailsActions.refreshUserAccess({ userId: user.id })),
    );
  });

  sendInvitationEmail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserDetailsActions.sendEmail),
      concatLatestFrom(() => this.store.select(UserDetailsSelector.selectCurrentUserId)),
      switchMap(([_, userId]) =>
        this.usersService.sendInvitationEmail(userId).pipe(
          map(() => UserDetailsActions.sendEmailSuccess()),
          catchError(() => of(UserDetailsActions.sendEmailFailure())),
        ),
      ),
    );
  });

  generateTemporaryPassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserDetailsActions.generateTemporaryPassword),
      concatLatestFrom(() => this.store.select(UserDetailsSelector.selectCurrentUserId)),
      switchMap(([_, userId]) =>
        this.usersService.generateTemporaryPassword(userId).pipe(
          map((temporaryPassword) => UserDetailsActions.generateTemporaryPasswordSuccess({ temporaryPassword })),
          catchError(() => of(UserDetailsActions.generateTemporaryPasswordFailure())),
        ),
      ),
    );
  });

  openTemporaryPasswordDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserDetailsActions.generateTemporaryPasswordSuccess),
        map(({ temporaryPassword }) => this.usersService.openTemporaryPasswordPreview(temporaryPassword)),
      );
    },
    { dispatch: false },
  );

  deleteUserFromWorkspace$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserDetailsActions.deleteUserFromWorkspace),
      concatLatestFrom(() => this.store.select(UserDetailsSelector.selectCurrentUserId)),
      switchMap(([_, userId]) =>
        this.usersService.openRemoveFromWorkspaceConfirmationDialog().pipe(
          filter((result) => !!result),
          switchMap(() =>
            this.usersService.removeUserFromCurrentWorkspace(userId).pipe(
              map(() => UserDetailsActions.deleteUserFromWorkspaceSuccess()),
              catchError(() => of(UserDetailsActions.deleteUserFromWorkspaceFailure())),
            ),
          ),
        ),
      ),
    );
  });

  deleteUserFromWorkspaceSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserDetailsActions.deleteUserFromWorkspaceSuccess),
      map(() => UserDetailsActions.closeUserDetails()),
    );
  });

  reloadUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserDetailsActions.deleteUserFromWorkspaceSuccess, UserDetailsActions.saveUserSuccess),
      map(() => UsersListActions.loadUsers()),
    );
  });

  fetchAllEmployeeInfos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserDetailsActions.openUserDetails, UserDetailsActions.openCreateUser),
      switchMap(() =>
        this.usersService.fetchAllEmployeeInfos().pipe(
          map((results) =>
            UserDetailsActions.fetchAllEmployeeInfos({
              activityAreas: results.activityAreas,
              directors: results.directors,
              managers: results.managers,
            }),
          ),
        ),
      ),
    );
  });

  searchUsersAsLeaders$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserDetailsActions.searchLeaders),
      concatLatestFrom(() => this.store.select(UserDetailsSelector.selectCurrentUserId)),
      switchMap(([{ search }, currentUserId]) =>
        this.usersService.listUsersForLeaderAutocomplete(search, currentUserId).pipe(
          map((users) =>
            UserDetailsActions.searchLeadersSuccess({
              users,
            }),
          ),
          catchError(() => of(UserDetailsActions.searchLeadersFailure())),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private store: Store,
    private detailsDrawerService: UserDetailsDrawerService,
    private usersService: UsersService,
  ) {}
}
