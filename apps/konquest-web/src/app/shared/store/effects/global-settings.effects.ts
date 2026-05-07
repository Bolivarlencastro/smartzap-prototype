import { Injectable } from '@angular/core';
import { WorkspaceApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { environment } from 'environments/environment';
import { filter, map, switchMap } from 'rxjs';
import { GlobalSettingsActions } from '../actions';

@Injectable()
export class GlobalSettingsEffects {
  setSettingsOnInit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalSettingsActions.init),
      filter(({ workspaceId }) => !!workspaceId),
      switchMap(({ workspaceId }) =>
        this.workspaceApi
          .getWorkspace(workspaceId)
          .pipe(map((workspace) => GlobalSettingsActions.loadWorkspaceDetailsSuccess({ workspace }))),
      ),
    );
  });

  loadWorkspaces$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalSettingsActions.init),
      filter(({ workspaceId }) => !!workspaceId),
      switchMap(() => {
        const konquestId = environment.coreModuleConfig.appId;
        return this.workspaceApi
          .getWorkspaces(konquestId)
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
  ) {}
}
