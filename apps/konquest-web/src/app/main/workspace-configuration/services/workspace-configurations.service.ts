import { Injectable } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { WorkspaceKonquestSettings } from '@core/model';
import { ModuleService } from '@core/model/workspace-configuration.model';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { TranslocoService } from '@jsverse/transloco';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { catchError, forkJoin, map, Observable, tap } from 'rxjs';
import { WorkspaceConfigurationAPI } from './workspace-configuration.api';
import {
  ApplicationService,
  Workspace,
  WorkspaceConfigurationInputData,
} from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceConfigurationsService {
  private readonly acceptableServices = [
    {
      name: 'Dashboard',
      id: '0d3752f0-15d7-402a-8628-04ed47bcbf43',
    },
    {
      name: 'Learning Trail',
      id: '0d3752f0-15d7-402a-8628-04ed47bcbf42',
    },
    {
      name: 'Mission',
      id: '0d3752f0-15d7-402a-8628-04ed47bcbf41',
    },
    {
      name: 'Event',
      id: '8064f5d7-e9cb-4bb8-8cb5-09030a14bf52',
    },
    {
      name: 'Pulse',
      id: 'f19a1f71-82fb-46df-ab88-bdd3700da124',
    },
    {
      name: 'Regulatory Compliance',
      id: '6064f5d7-e9cb-4bb8-8cb5-09030a14bf5f',
    },
    {
      name: 'Custom Sections',
      id: '8d572fd1-cca9-4979-9e72-f3871ac8ee97',
    },
    {
      name: 'Gamification',
      id: '786f7dc6-5b82-4834-a7a4-6a938ed7dafc',
    },
  ];

  constructor(
    private _translateService: TranslocoService,
    private _messageService: KpMessageService,
    private _fuseLoadingService: FuseLoadingService,
    private _workspaceConfigurationAPI: WorkspaceConfigurationAPI,
  ) {}

  getWorkspaceSettingsWithServices(workspaceId: string) {
    return forkJoin({ services: this.getKonquestFilteredServices(), settings: this.getWorkspaceConfig(workspaceId) });
  }

  enableService(workspaceId: string, service: ModuleService) {
    return this._workspaceConfigurationAPI.enableService(workspaceId, service.field).pipe(
      tap(() => {
        this._messageService.success('WORKSPACE_CONFIGURATIONS.ENABLED_SERVICE_SUCCESS', {
          serviceName: this._translateService.translate('WORKSPACE_CONFIGURATIONS.MODULES.' + service.label),
        });
      }),
    );
  }

  disableService(workspaceId: string, service: ModuleService) {
    return this._workspaceConfigurationAPI.disableService(workspaceId, service.field).pipe(
      tap(() => {
        this._messageService.success('WORKSPACE_CONFIGURATIONS.DISABLED_SERVICE_SUCCESS', {
          serviceName: this._translateService.translate('WORKSPACE_CONFIGURATIONS.MODULES.' + service.label),
        });
      }),
    );
  }

  /**
   * Returns the minimum performance points for the specified workspace,
   * scaled from 0 to 100 and workspace's goal date.
   */
  getPassMarkAndGoalDate(workspaceId: string): Observable<WorkspaceConfigurationInputData> {
    return this._workspaceConfigurationAPI.getWorkspace(workspaceId).pipe(
      map((workspace) => ({
        passMark: workspace.min_performance_certificate * 100 || 0,
        goal_date: workspace.enrollment_goal_duration_days,
      })),
    );
  }

  /**
   * Saves the minimum performance points for the specified workspace,
   * scaled from 0 to 100.
   */
  savePassMark(workspaceId: string, value: number): Observable<Workspace> {
    return this._workspaceConfigurationAPI
      .updateWorkspace(workspaceId, {
        min_performance_certificate: value / 100,
      })
      .pipe(
        tap(() => {
          this._messageService.success(marker('WORKSPACE_CONFIGURATIONS.SAVE_PASS_MARK_SUCCESS'));
        }),
      );
  }

  updateDefaultSettings(id: string, settings: WorkspaceKonquestSettings): Observable<Workspace> {
    return this._workspaceConfigurationAPI.updateWorkspace(id, settings).pipe(
      tap(() => {
        this._messageService.success(marker('WORKSPACE_CONFIGURATIONS.SETTINGS_UPDATED_SUCCESS'));
      }),
    );
  }

  updateGoalDate(id: string, enrollment_goal_duration_days: number): Observable<Workspace> {
    return this._workspaceConfigurationAPI.updateWorkspace(id, { enrollment_goal_duration_days }).pipe(
      tap(() => {
        this._messageService.success(marker('WORKSPACE_CONFIGURATIONS.GOAL_DATE_SUCCESS'));
      }),
      catchError((error) => {
        if (error.error?.status_code === 400) {
          this._messageService.error(marker('WORKSPACE_CONFIGURATIONS.GOAL_DATE_ERROR'));
        }
        return error;
      }),
    );
  }

  displayLoading(show: boolean): void {
    this._fuseLoadingService[show ? 'show' : 'hide']();
  }

  private getWorkspaceConfig(id: string): Observable<WorkspaceKonquestSettings> {
    return this._workspaceConfigurationAPI.getWorkspace(id).pipe(
      map(
        ({
          allow_list_public_categories,
          min_performance_certificate,
          block_reenrollment,
          enrollment_goal_duration_days,
        }) => ({
          allow_list_public_categories,
          min_performance_certificate,
          block_reenrollment,
          enrollment_goal_duration_days,
        }),
      ),
    );
  }

  getKonquestFilteredServices(): Observable<ModuleService[]> {
    return this._workspaceConfigurationAPI.getAllServices().pipe(map((allServices) => this.buildServices(allServices)));
  }

  private buildServices(services: ApplicationService[]): ModuleService[] {
    return this.acceptableServices
      .map((acceptableService) => ({
        ...acceptableService,
        status: !!services.find((service) => service.id === acceptableService.id),
      }))
      .map((service) => ({ label: service.name, field: service.id, status: service.status }));
  }
}
