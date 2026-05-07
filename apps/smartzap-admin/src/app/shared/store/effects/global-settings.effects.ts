import { Injectable } from '@angular/core';
import { CategoriesService } from '@app/shared/services/categories.service';
import { LanguagesService } from '@app/shared/services/languages.service';
import { WorkspaceApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { environment } from 'environments/environment';
import { filter, map, switchMap, tap } from 'rxjs';
import { GlobalSettingsActions } from '../actions';
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

  setLanguages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalSettingsActions.init),
      switchMap(() =>
        this.languagesService
          .getLanguages()
          .pipe(map((languages) => GlobalSettingsActions.setLanguages({ languages }))),
      ),
    );
  });

  setCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalSettingsActions.init),
      switchMap(() =>
        this.categoriesService
          .getCategories()
          .pipe(map((categories) => GlobalSettingsActions.setCategories({ categories }))),
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

  setSmartzapConfigurationOnInit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalSettingsActions.init),
      switchMap(({ workspaceId }) =>
        this.workspaceApi
          .fetchSmartzapConfiguration(workspaceId)
          .pipe(
            map((smartzapConfiguration) =>
              GlobalSettingsActions.updateSmartzapConfigurationSuccess({ smartzapConfiguration }),
            ),
          ),
      ),
    );
  });

  updateSmartzapConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalSettingsActions.updateSmartzapConfiguration),
      concatLatestFrom(() => this.store.select(globalSettingsFeature.selectWorkspace)),
      switchMap(([{ smartzapConfiguration }, workspace]) =>
        this.workspaceApi.updateSmartzapConfiguration(smartzapConfiguration, workspace?.id).pipe(
          tap({
            next: () => this.messageService.success('GENERAL.CONFIGURATIONS_UPDATED'),
            error: () => this.messageService.error('GENERAL.CONFIGURATIONS_UPDATE_FAILED'),
          }),
          map((smartzapConfiguration) =>
            GlobalSettingsActions.updateSmartzapConfigurationSuccess({ smartzapConfiguration }),
          ),
        ),
      ),
    );
  });

  updateUserTokenExpiration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalSettingsActions.updateUserTokenExpiration),
      concatLatestFrom(() => this.store.select(globalSettingsFeature.selectWorkspace)),
      switchMap(([{ user_token_expiration }, workspace]) =>
        this.workspaceApi.updateUserTokenExpiration(user_token_expiration, workspace?.id).pipe(
          tap({
            next: () => this.messageService.success('GENERAL.CONFIGURATIONS_UPDATED'),
            error: () => this.messageService.error('GENERAL.CONFIGURATIONS_UPDATE_FAILED'),
          }),
          map(() => GlobalSettingsActions.updateUserTokenExpirationSuccess({ user_token_expiration })),
        ),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly workspaceApi: WorkspaceApi,
    private readonly messageService: KpMessageService,
    private readonly languagesService: LanguagesService,
    private readonly categoriesService: CategoriesService,
  ) {}
}
