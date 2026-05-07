import { Injectable } from '@angular/core';
import { RawModuleService } from '@core/model/workspace-configuration.model';
import { WorkspaceKonquestSettings } from '@core/model/workspace.model';
import {
  ApplicationService,
  ApplicationServicesApi,
  MyAccountV2Client,
  Workspace,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable } from 'rxjs';

@Injectable()
export class WorkspaceConfigurationAPI {
  constructor(
    private http: MyAccountV2Client,
    private applicationServicesApi: ApplicationServicesApi,
  ) {}

  getAllServices(): Observable<ApplicationService[]> {
    return this.applicationServicesApi.getApplicationServices();
  }

  enableService(workspaceId: string, serviceId: string): Observable<RawModuleService> {
    return this.http.post<RawModuleService>(`/workspaces/${workspaceId}/services/${serviceId}`, {});
  }

  disableService(workspaceId: string, serviceId: string): Observable<void> {
    return this.http.delete<void>(`/workspaces/${workspaceId}/services/${serviceId}`);
  }

  getWorkspace(workspaceId: string): Observable<Workspace> {
    return this.http.get<Workspace>(`/workspaces/${workspaceId}`);
  }

  updateWorkspace(workspaceId: string, settings: WorkspaceKonquestSettings): Observable<Workspace> {
    return this.http.patch<Workspace>(`/workspaces/${workspaceId}`, settings);
  }
}
