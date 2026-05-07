import { Injectable } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { ApplicationServicesApi, AppServicesConfigStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { MyAccountV2API } from 'app/shared/api/myaccount-v2.api';
import { KonquestConfig } from 'app/shared/model';
import { environment } from 'environments/environment';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, map, mergeMap, tap, toArray } from 'rxjs/operators';

export interface AppServicesConfig {
  KONQUEST_MISSION: boolean;
  KONQUEST_EVENT: boolean;
  KONQUEST_PULSE: boolean;
  KONQUEST_LEARNING_TRAIL: boolean;
  KONQUEST_REGULATORY_COMPLIANCE: boolean;
  KONQUEST_DASHBOARD: boolean;
  KONQUEST_GAMIFICATION: boolean;
  SMARTZAP: boolean;
  LEARN_ANALYTICS: boolean;
}

export const servicesId: Record<string, string> = {
  KONQUEST_MISSION: environment.apps.konquest.services.mission.id,
  KONQUEST_EVENT: environment.apps.konquest.services.event.id,
  KONQUEST_PULSE: environment.apps.konquest.services.pulse.id,
  KONQUEST_LEARNING_TRAIL: environment.apps.konquest.services.learning_trail.id,
  KONQUEST_REGULATORY_COMPLIANCE: environment.apps.konquest.services.regulatory_compliance.id,
  KONQUEST_DASHBOARD: environment.apps.konquest.services.dashboard.id,
  KONQUEST_GAMIFICATION: environment.apps.konquest.services.gamification.id,
  SMARTZAP: environment.apps.smartzap.services.id,
  LEARN_ANALYTICS: environment.apps.learnAnalytics.services.id,
};

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  konquestConfigChanged: Subject<KonquestConfig>;
  smartzapConfigChanged: Subject<any>;

  private config: AppServicesConfig = {
    KONQUEST_MISSION: false,
    KONQUEST_EVENT: false,
    KONQUEST_PULSE: false,
    KONQUEST_LEARNING_TRAIL: false,
    KONQUEST_REGULATORY_COMPLIANCE: false,
    KONQUEST_DASHBOARD: false,
    KONQUEST_GAMIFICATION: false,
    SMARTZAP: false,
    LEARN_ANALYTICS: false,
  };

  private _appServicesConfigChanged = new BehaviorSubject<AppServicesConfig>(this.config);
  readonly appServicesConfigChanged$ = this._appServicesConfigChanged.asObservable();

  constructor(
    private readonly _http: MyAccountV2API,
    private readonly applicationServicesApi: ApplicationServicesApi,
    private readonly _messageService: KpMessageService,
  ) {
    this.konquestConfigChanged = new Subject<any>();
    this.smartzapConfigChanged = new Subject<any>();
  }

  fetchWorkspacesServices() {
    return this.applicationServicesApi.getApplicationServices();
  }

  private changeAppStatus(service: string, status: boolean): void {
    (this.config as Record<string, any>)[service] = status;
    this._appServicesConfigChanged.next({ ...this.config });
  }

  handleSuccess(service: string): void {
    this.changeAppStatus(service, !(this.config as Record<string, any>)[service]);
    this._messageService.success(marker('SERVICES.STATUS_UPDATE_SUCCESS'));
  }

  handleError(error: Error, service: string, status: boolean): any {
    this.changeAppStatus(service, status);
    this._messageService.error(marker('SERVICES.STATUS_UPDATE_ALTER'));
    return throwError(() => error);
  }

  changeWorkspaceService({ checked, service, workspaceId }: AppServicesConfigStatus): void {
    const serviceId = servicesId[service];
    if (checked) {
      this._http
        .post(`/workspaces/${workspaceId}/services/${serviceId}`, { serviceId })
        .pipe(
          tap(() => this.handleSuccess(service)),
          catchError((error) => this.handleError(error, service, (this.config as Record<string, any>)[service])),
        )
        .subscribe();
      return;
    }
    this._http
      .delete(`/workspaces/${workspaceId}/services/${serviceId}`)
      .pipe(
        tap(() => this.handleSuccess(service)),
        catchError((error) => this.handleError(error, service, (this.config as Record<string, any>)[service])),
      )
      .subscribe();
  }

  fetchAppConfig(): void {
    this.fetchWorkspacesServices()
      .pipe(
        mergeMap((response) => response),
        map((service) => service.id),
        toArray(),
        map((servicesIds) => {
          const config = this.config;

          for (const c of Object.keys(config)) {
            const id = servicesId[c];
            (config as Record<string, any>)[c] = servicesIds.includes(id);
          }

          return config;
        }),
        tap((config) => this._appServicesConfigChanged.next(config)),
      )
      .subscribe();
  }
}
