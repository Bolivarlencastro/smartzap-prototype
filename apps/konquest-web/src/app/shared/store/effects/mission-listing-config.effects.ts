import { Injectable } from '@angular/core';
import { GlobalSettingsActions, MissionListingConfigActions } from '@app/shared/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { MissionListingConfigService } from '../../../shared/services/mission-listing-config/mission-listing-config.service';

@Injectable()
export class MissionListingConfigEffects {
  loadConfig$ = createEffect(() => {
    return this.actions.pipe(
      ofType(GlobalSettingsActions.init),
      switchMap(({ workspaceId }) =>
        this.missionListingConfigService
          .getConfig()
          .pipe(map((config) => MissionListingConfigActions.loadConfig({ workspaceId, config }))),
      ),
    );
  });

  updateConfig$ = createEffect(() => {
    return this.actions.pipe(
      ofType(MissionListingConfigActions.updateConfig),
      filter(({ config, checked }) => config.is_enabled !== checked),
      switchMap(({ config, checked }) =>
        this.missionListingConfigService.updateConfig(config, checked).pipe(
          map(() => MissionListingConfigActions.updateConfigSuccess({ config, checked })),
          catchError(() => of(MissionListingConfigActions.updateConfigFailure({ config }))),
        ),
      ),
    );
  });

  constructor(
    private actions: Actions,
    private store: Store,
    private missionListingConfigService: MissionListingConfigService,
  ) {}
}
