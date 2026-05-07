import { Injectable } from '@angular/core';
import { Service, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { environment } from 'environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegulatoryComplianceService {
  private readonly REGULATORY_COMPLIANCE_ID = environment.apps.konquest.services.regulatory_compliance.id;

  constructor(private workspaceService: WorkspaceService) {}

  fetchNormativeStatus(): Observable<boolean> {
    return this.workspaceService.workspaceServices$.pipe(map((services) => this.fetchModuleStatus(services)));
  }

  private fetchModuleStatus(services: Service[]): boolean {
    return !!services.find((service) => service.id === this.REGULATORY_COMPLIANCE_ID);
  }
}
