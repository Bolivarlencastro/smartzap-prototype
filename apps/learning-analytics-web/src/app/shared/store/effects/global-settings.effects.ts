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
      switchMap(({ workspaceId }) =>
        this.workspaceApi
          .getWorkspace(workspaceId)
          .pipe(map((workspace) => GlobalSettingsActions.setSettingsOnInit({ workspace }))),
      ),
    );
  });

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
    private actions$: Actions,
    private workspaceApi: WorkspaceApi,
  ) {}
}
