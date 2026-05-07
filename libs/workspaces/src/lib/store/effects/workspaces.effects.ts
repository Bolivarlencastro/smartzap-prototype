import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { WorkspacesListService } from '../../services';
import { WorkspacesActions } from '../actions';
import {
  ApplicationServicesApi,
  UserProfileService,
  WorkspaceService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { WorkspacesSelectors } from '../selectors';
import { WorkspaceViewMode } from '../models/workspaces.model';

@Injectable()
export class WorkspacesEffects {
  private readonly viewModeStorageKey = 'workspaces:view-mode';

  constructor(
    private readonly _actions$: Actions,
    private readonly _workspacesListService: WorkspacesListService,
    private readonly workspaceService: WorkspaceService,
    private readonly applicationServicesApi: ApplicationServicesApi,
    private readonly userProfileService: UserProfileService,
    private readonly store: Store,
  ) {}

  loadWorkspaces$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(WorkspacesActions.loadWorkspaces),
      switchMap(() =>
        this._workspacesListService.getWorkspaces().pipe(
          map((results) => WorkspacesActions.loadWorkspacesSuccess({ results })),
          catchError((error) => of(WorkspacesActions.loadWorkspacesFailure({ error }))),
        ),
      ),
    );
  });

  updateWorkspacesIntoLocalStorage = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(WorkspacesActions.loadWorkspacesSuccess),
        tap(({ results }) => this.workspaceService.storeAvailableWorkspaces(results)),
      );
    },
    { dispatch: false },
  );

  workspaceSelected = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(WorkspacesActions.selectWorkspace),
        map(({ workspace }) => this._workspacesListService.workspaceSelected(workspace)),
      );
    },
    { dispatch: false },
  );

  loadWorkspaceServices = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(WorkspacesActions.selectWorkspace),
        switchMap(() =>
          this.applicationServicesApi.getApplicationServices().pipe(
            map((services) => {
              this.workspaceService.setWorkspaceServices(services);
              this._workspacesListService.navigateToHome();
            }),
          ),
        ),
      );
    },
    { dispatch: false },
  );

  initViewPreferences = createEffect(() => {
    return this._actions$.pipe(
      ofType(WorkspacesActions.initViewPreferences),
      map(() => WorkspacesActions.setViewMode({ viewMode: this.loadStoredViewMode() })),
    );
  });

  syncListViewPermission = createEffect(() => {
    return this.userProfileService.roles$.pipe(
      map(() => this.canUseListView()),
      map((canUseListView) => WorkspacesActions.setCanUseListView({ canUseListView })),
    );
  });

  persistViewMode = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(WorkspacesActions.setViewMode, WorkspacesActions.toggleViewMode, WorkspacesActions.setCanUseListView),
        concatLatestFrom(() => this.store.select(WorkspacesSelectors.getViewMode)),
        tap(([_, viewMode]) => globalThis?.localStorage?.setItem(this.viewModeStorageKey, viewMode)),
      );
    },
    { dispatch: false },
  );

  private loadStoredViewMode(): WorkspaceViewMode {
    const storedViewMode = globalThis?.localStorage?.getItem(this.viewModeStorageKey);
    return storedViewMode === 'list' ? 'list' : 'grid';
  }

  private canUseListView(): boolean {
    return (
      this.userProfileService.isAdmin() ||
      this.userProfileService.isSuperAdmin() ||
      this.userProfileService.isKeepsAdmin()
    );
  }
}
