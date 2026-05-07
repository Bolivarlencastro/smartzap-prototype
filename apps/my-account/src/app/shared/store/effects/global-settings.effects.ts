import { Injectable } from '@angular/core';
import { JobEnum } from '@app/main/job-management/models';
import { WorkspacesService } from '@app/shared/services';
import { JobManagementService } from '@app/shared/services/job-management.service';
import { WorkspaceApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { environment } from 'environments/environment';
import { filter, map, switchMap } from 'rxjs';
import * as GlobalSettingsActions from '../actions/global-settings.actions';
import { globalSettingsFeature } from '../features';

@Injectable()
export class GlobalSettingsEffects {
  setSettingsOnInit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalSettingsActions.init),
      switchMap(({ workspaceId }) =>
        this.workspaceApi
          .getWorkspace(workspaceId)
          .pipe(map((workspace) => GlobalSettingsActions.setSettingsOnInit({ workspace }))),
      ),
    );
  });

  setJobsOnInit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalSettingsActions.init),
      switchMap(() =>
        this.jobManagementService
          .getJobs(JobEnum.JOB_POSITION)
          .pipe(map((jobs) => GlobalSettingsActions.updateJobs({ jobs }))),
      ),
    );
  });

  createWorkspace$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(GlobalSettingsActions.createWorkspace),
        switchMap(({ workspace }) => this.workspacesService.createWorkspace(workspace)),
      );
    },
    { dispatch: false },
  );

  updateWorkspace$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalSettingsActions.updateWorkspace),
      switchMap(({ workspace }) =>
        this.workspacesService
          .updateWorkspace(workspace)
          .pipe(map((workspace) => GlobalSettingsActions.updateWorkspaceSuccess({ workspace }))),
      ),
    );
  });

  updateWorkspaceCustomColor$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalSettingsActions.updateWorkspaceCustomColor),
      concatLatestFrom(() => this.store.select(globalSettingsFeature.selectWorkspace)),
      switchMap(([{ custom_color }, workspace]) =>
        this.workspacesService
          .updateWorkspaceCustomColor(custom_color, workspace)
          .pipe(map((workspace) => GlobalSettingsActions.updateWorkspaceSuccess({ workspace }))),
      ),
    );
  });

  updateWorkspaceDarkTheme$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalSettingsActions.updateWorkspaceDarkTheme),
      concatLatestFrom(() => this.store.select(globalSettingsFeature.selectWorkspace)),
      switchMap(([{ theme_dark }, workspace]) =>
        this.workspacesService
          .updateWorkspaceDarkTheme(theme_dark, workspace)
          .pipe(map((workspace) => GlobalSettingsActions.updateWorkspaceSuccess({ workspace }))),
      ),
    );
  });

  updateWorkspaceImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalSettingsActions.updateWorkspaceImage),
      switchMap(({ payload }) =>
        this.workspacesService
          .uploadWorkspaceImage(payload)
          .pipe(map((workspace) => GlobalSettingsActions.updateWorkspaceSuccess({ workspace }))),
      ),
    );
  });

  deleteWorkspace$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(GlobalSettingsActions.deleteWorkspace),
        switchMap(({ id }) => this.workspacesService.deleteWorkspace(id)),
      );
    },
    { dispatch: false },
  );

  loadWorkspaces$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalSettingsActions.init),
      filter(({ workspaceId }) => !!workspaceId),
      switchMap(() => {
        const appId = environment.coreModuleConfig.appId;
        return this.workspaceApi
          .getWorkspaces(appId)
          .pipe(
            map((workspaces) =>
              GlobalSettingsActions.loadWorkspacesSuccess({ hasMultipleWorkspaces: workspaces?.length > 1 }),
            ),
          );
      }),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly workspaceApi: WorkspaceApi,
    private readonly jobManagementService: JobManagementService,
    private readonly workspacesService: WorkspacesService,
    private readonly store: Store,
  ) {}
}
