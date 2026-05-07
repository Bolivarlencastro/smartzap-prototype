import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserWorkspacesService } from '../../services/user-workspaces.service';
import { UserDetailsActions, UserWorkspacesActions } from '../actions';
import { filter, map, switchMap } from 'rxjs/operators';
import { concatLatestFrom } from '@ngrx/operators';
import { userWorkspacesFeature } from 'app/main/users/store/features';
import { catchError, of } from 'rxjs';
import { UserDetailsSelector } from '../selectors';
import { WorkspaceListDto, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable()
export class UserWorkspacesEffects {
  loadUserWorkspaces$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        UserDetailsActions.openUserDetails,
        UserDetailsActions.refreshUserAccess,
        UserWorkspacesActions.saveRolesSuccess,
      ),
      switchMap(({ userId }) =>
        this.userWorkspacesService.loadUserWorkspaces(userId).pipe(
          map((result) =>
            UserWorkspacesActions.loadUserWorkspacesSuccess({
              workspaces: this.filterCurrentWorkspace(result),
            }),
          ),
          catchError((error) => of(UserWorkspacesActions.loadUserWorkspacesFailure({ error }))),
        ),
      ),
    );
  });

  openAddDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserWorkspacesActions.openAddWorkspaceDialog, UserWorkspacesActions.openEditWorkspaceDialog),
        map(() => this.userWorkspacesService.openRolesDialog()),
      );
    },
    { dispatch: false },
  );

  closeDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          UserWorkspacesActions.saveRolesSuccess,
          UserWorkspacesActions.loadWorkspaceUserRolesFailure,
          UserWorkspacesActions.removeUserFromWorkspaceSuccess,
        ),
        map(() => this.userWorkspacesService.closeDialog()),
      );
    },
    { dispatch: false },
  );

  loadAdminWorkspaces$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserWorkspacesActions.openAddWorkspaceDialog),
      concatLatestFrom(() => this.store.select(userWorkspacesFeature.adminWorkspacesLoaded)),
      filter(([_, adminWorkspacesLoaded]) => !adminWorkspacesLoaded),
      switchMap(() =>
        this.userWorkspacesService.loadAdminWorkspaces().pipe(
          map((result) =>
            UserWorkspacesActions.loadAdminWorkspacesSuccess({ workspaces: this.filterCurrentWorkspace(result) }),
          ),
          catchError((error) => of(UserWorkspacesActions.loadAdminWorkspacesFailure({ error }))),
        ),
      ),
    );
  });

  loadWorkspaceApplications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserWorkspacesActions.selectWorkspace, UserWorkspacesActions.openEditWorkspaceDialog),
      map(() => UserWorkspacesActions.loadWorkspaceApplications()),
    );
  });

  onLoadWorkspaceApplications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserWorkspacesActions.loadWorkspaceApplications),
      concatLatestFrom(() => this.store.select(userWorkspacesFeature.selectSelectedWorkspaceId)),
      switchMap(([_, workspaceId]) =>
        this.userWorkspacesService.loadWorkspaceApplications(workspaceId).pipe(
          map((result) => UserWorkspacesActions.loadWorkspaceApplicationsSuccess({ applications: result })),
          catchError((error) => of(UserWorkspacesActions.loadWorkspaceApplicationsFailure({ error }))),
        ),
      ),
    );
  });

  saveUserRoles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserWorkspacesActions.saveRoles),
      concatLatestFrom(() => [
        this.store.select(UserDetailsSelector.selectCurrentUserId),
        this.store.select(userWorkspacesFeature.selectSelectedWorkspaceId),
      ]),
      switchMap(([{ roles }, userId, workspaceId]) =>
        this.userWorkspacesService.saveUserRoles(userId, roles, workspaceId).pipe(
          map(() => UserWorkspacesActions.saveRolesSuccess({ userId })),
          catchError((error) => of(UserWorkspacesActions.saveRolesFailure({ error }))),
        ),
      ),
    );
  });

  loadWorkspaceUserRoles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserWorkspacesActions.selectWorkspace, UserWorkspacesActions.openEditWorkspaceDialog),
      map(() => UserWorkspacesActions.loadWorkspaceUserRoles()),
    );
  });

  onLoadWorkspaceUserRoles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserWorkspacesActions.loadWorkspaceUserRoles),
      concatLatestFrom(() => [
        this.store.select(userWorkspacesFeature.selectSelectedWorkspaceId),
        this.store.select(UserDetailsSelector.selectCurrentUserId),
      ]),
      switchMap(([_, workspaceId, userId]) =>
        this.userWorkspacesService.loadUserWorkspaceRoles(userId, workspaceId).pipe(
          map((roles) => UserWorkspacesActions.loadWorkspaceUserRolesSuccess({ roles })),
          catchError((error) => of(UserWorkspacesActions.loadWorkspaceUserRolesFailure({ error }))),
        ),
      ),
    );
  });

  deleteUserFromWorkspace$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserWorkspacesActions.openRemoveUserFromWorkspaceDialog),
      concatLatestFrom(() => this.store.select(UserDetailsSelector.selectCurrentUserId)),
      switchMap(([{ workspaceId }, userId]) =>
        this.userWorkspacesService.openRemoveFromWorkspaceConfirmationDialog().pipe(
          filter((result) => !!result),
          switchMap(() =>
            this.userWorkspacesService.removeUserFromWorkspace(userId, workspaceId).pipe(
              map(() => UserWorkspacesActions.removeUserFromWorkspaceSuccess({ workspaceId })),
              catchError((error) => of(UserWorkspacesActions.removeUserFromWorkspaceFailure({ error }))),
            ),
          ),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private store: Store,
    private userWorkspacesService: UserWorkspacesService,
    private workspaceService: WorkspaceService,
  ) {}

  private filterCurrentWorkspace(workspaces: WorkspaceListDto[]) {
    return workspaces.filter((workspace) => workspace.id !== this.workspaceService.currentWorkspaceId);
  }
}
