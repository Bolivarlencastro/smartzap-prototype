import { Injectable } from '@angular/core';
import { UserProfileService, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CONTENT_MANAGEMENT_ROUTES, ManagementRoute } from '../management-routes-definition';

@Injectable()
export class ManagementRouteResolver {
  protected readonly ROUTES_DEFINITION = CONTENT_MANAGEMENT_ROUTES;

  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly userProfileService: UserProfileService,
  ) {}

  getRoutes(): ManagementRoute[] {
    const routes = Object.values(this.ROUTES_DEFINITION);
    const filteredByService = this.filterRoutesByServiceStatus(routes);
    return this.filterRoutesByRoles(filteredByService);
  }

  private filterRoutesByServiceStatus(routes: ManagementRoute[]): ManagementRoute[] {
    return routes.filter((route) => {
      if (!route.serviceId) {
        return true;
      }
      return this.workspaceService.isServiceActive(route.serviceId);
    });
  }

  private filterRoutesByRoles(routes: ManagementRoute[]): ManagementRoute[] {
    const isContentCreator = this.userProfileService.isContentCreator();

    if (isContentCreator) {
      return routes;
    }

    return routes.filter((route) => route.path === 'events');
  }
}
