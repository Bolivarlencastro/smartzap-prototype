import { Injectable } from '@angular/core';
import { CyclesActions, GamificationActions, GlobalSettingsActions } from '@app/shared/store';
import { ModuleService } from '@core/model/workspace-configuration.model';
import { AbstractNavigationService } from '@keeps-platform-frontend-workspace/layout';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { KonquestFeaturesService } from 'app/shared/services';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { WorkspaceConfigurationsService } from '../services/workspace-configurations.service';
import * as fromActions from './workspace-configurations.actions';

const REGULATORY_COMPLIANCE_FEATURE_ID = environment.apps.konquest.services.regulatory_compliance.id;
const GAMIFICATION_FEATURE_ID = environment.apps.konquest.services.gamification.id;

@Injectable()
export class WorkspaceConfigurationsEffects {
  getWorkspaceConfigurations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.workspaceInit),
      switchMap(({ workspaceId }) => this.workspaceConfigurationsService.getWorkspaceSettingsWithServices(workspaceId)),
      map(({ services, settings }) => fromActions.getWorkspaceConfigurationsSuccess({ services, settings })),
    );
  });

  enableService$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.changeServiceStatus),
      filter(({ status }) => status),
      switchMap(({ workspaceId, service }) => {
        return this.workspaceConfigurationsService.enableService(workspaceId, service).pipe(
          map(() =>
            fromActions.changeServiceStatusSuccess({
              serviceId: service.field,
              status: true,
              navigationItemId: this.getNavigationItemId(service),
            }),
          ),
          catchError((error) => {
            return of(fromActions.changeServiceStatusFailure({ error }));
          }),
        );
      }),
    );
  });

  disableService$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.changeServiceStatus),
      filter(({ status }) => !status),
      switchMap(({ workspaceId, service }) => {
        return this.workspaceConfigurationsService.disableService(workspaceId, service).pipe(
          map(() =>
            fromActions.changeServiceStatusSuccess({
              serviceId: service.field,
              status: false,
              navigationItemId: this.getNavigationItemId(service),
            }),
          ),
          catchError((error) => {
            return of(fromActions.changeServiceStatusFailure({ error }));
          }),
        );
      }),
    );
  });

  updateGamificationModule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.changeServiceStatusSuccess),
      filter(({ serviceId }) => serviceId === GAMIFICATION_FEATURE_ID),
      map(() => GamificationActions.loadGamification()),
    );
  });

  updateRegulatoryComplianceModule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.changeServiceStatusSuccess),
      filter(({ serviceId }) => serviceId === REGULATORY_COMPLIANCE_FEATURE_ID),
      map(() => CyclesActions.fetchNormativeModule()),
    );
  });

  changeServiceStatusSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromActions.changeServiceStatusSuccess),
        map(({ serviceId, navigationItemId, status }) => {
          this.navigationService.setItemVisibility(navigationItemId, status);
          this.konquestFeaturesService.toggleWorkspaceServiceFeature(serviceId, status);
        }),
      );
    },
    { dispatch: false },
  );

  savePassMark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.savePassMark),
      mergeMap(({ workspaceId, passMark }) =>
        this.workspaceConfigurationsService.savePassMark(workspaceId, passMark).pipe(
          map(() => fromActions.savePassMarkSuccess()),
          catchError((error) => of(fromActions.savePassMarkFailure({ error }))),
        ),
      ),
    );
  });

  showLoading$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(...[fromActions.savePassMark, fromActions.changeServiceStatus]),
        tap(() => this.workspaceConfigurationsService.displayLoading(true)),
      );
    },
    { dispatch: false },
  );

  hideLoading$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          ...[
            fromActions.savePassMarkSuccess,
            fromActions.savePassMarkFailure,
            fromActions.changeServiceStatusSuccess,
            fromActions.changeServiceStatusFailure,
            fromActions.updateGamificationModule,
            fromActions.updateRegulatoryComplianceModule,
          ],
        ),
        tap(() => this.workspaceConfigurationsService.displayLoading(false)),
      );
    },
    { dispatch: false },
  );

  updateWorkspaceGeneralSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.updateWorkspaceGeneralSettings),
      switchMap(({ id, settings }) =>
        this.workspaceConfigurationsService.updateDefaultSettings(id, settings).pipe(
          map((settings) => fromActions.updateWorkspaceGeneralSettingsSuccess({ settings })),
          catchError((error) => of(fromActions.updateWorkspaceGeneralSettingsFailure({ error }))),
        ),
      ),
    );
  });

  updateBlockReEnrollmentGlobalSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.updateWorkspaceGeneralSettingsSuccess),
      filter(({ settings }) => this.isBoolean(settings.block_reenrollment)),
      map(({ settings }) =>
        GlobalSettingsActions.updateBlockReEnrollment({ blockReEnrollment: settings.block_reenrollment }),
      ),
    );
  });

  updateWorkspaceGoalDate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.updateWorkspaceGoalDate),
      switchMap(({ id, goal_date }) =>
        this.workspaceConfigurationsService.updateGoalDate(id, goal_date).pipe(
          map((settings) =>
            fromActions.updateWorkspaceGoalDateSuccess({ goal_date: settings.enrollment_goal_duration_days }),
          ),
          catchError(() => of(fromActions.getWorkspaceConfigurationsFailure())),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private workspaceConfigurationsService: WorkspaceConfigurationsService,
    private konquestFeaturesService: KonquestFeaturesService,
    private navigationService: AbstractNavigationService,
  ) {}

  private getNavigationItemId(service: ModuleService): string {
    if (service.field === REGULATORY_COMPLIANCE_FEATURE_ID) {
      return 'normatives';
    }

    if (service.field === GAMIFICATION_FEATURE_ID) {
      return 'gamification';
    }

    return service.label.toLowerCase().replace(/ /g, '-');
  }

  private isBoolean(value: any): value is boolean {
    return typeof value === 'boolean';
  }
}
