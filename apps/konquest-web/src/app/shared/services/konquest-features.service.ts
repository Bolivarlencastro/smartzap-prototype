import { Injectable } from '@angular/core';
import { Service, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { environment } from 'environments/environment';

const SERVICES_MAP = new Map<string, Service>([
  [environment.apps.konquest.services.dashboard.id, environment.apps.konquest.services.dashboard],
  [environment.apps.konquest.services.learning_trail.id, environment.apps.konquest.services.learning_trail],
  [environment.apps.konquest.services.mission.id, environment.apps.konquest.services.mission],
  [environment.apps.konquest.services.pulse.id, environment.apps.konquest.services.pulse],
  [
    environment.apps.konquest.services.regulatory_compliance.id,
    environment.apps.konquest.services.regulatory_compliance,
  ],
  [environment.apps.konquest.services.gamification.id, environment.apps.konquest.services.gamification],
  [environment.apps.konquest.services.event.id, environment.apps.konquest.services.event],
  [environment.apps.konquest.services.customSections.id, environment.apps.konquest.services.customSections],
]);

@Injectable({
  providedIn: 'root',
})
export class KonquestFeaturesService {
  constructor(private workspacesService: WorkspaceService) {}

  isServiceActive(serviceId: string) {
    return this.workspacesService.isServiceActive(serviceId);
  }

  toggleWorkspaceServiceFeature(serviceId: string, enabled: boolean) {
    const workspaceServices = this.workspacesService.getWorkspaceServices();
    const service = SERVICES_MAP.get(serviceId);
    if (!service) {
      return;
    }

    if (enabled) {
      this.addServiceToWorkspace(service, workspaceServices);
      return;
    }

    const serviceIndex = workspaceServices.findIndex((service) => service.id === serviceId);
    this.removeServiceFromWorkspace(serviceIndex, workspaceServices);
  }

  private addServiceToWorkspace(service: Service, workspaceServices: Service[]) {
    // Skip adding service if it's already in the workspace
    if (workspaceServices?.some((workspaceService) => workspaceService.id === service.id)) {
      return;
    }

    const updatedServices = workspaceServices?.length ? [...workspaceServices] : [];
    updatedServices.push(service);

    this.workspacesService.setWorkspaceServices(updatedServices);
  }

  private removeServiceFromWorkspace(serviceIndex: number, workspaceServices: Service[]) {
    const filteredServices = workspaceServices.filter((_service, index) => index !== serviceIndex);
    this.workspacesService.setWorkspaceServices(filteredServices);
  }
}
