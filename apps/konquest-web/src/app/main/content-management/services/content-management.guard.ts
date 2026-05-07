import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { UserProfileService, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { environment } from 'environments/environment';
import { CONTENT_MANAGEMENT_ROUTES } from '../management-routes-definition';

export function getDefaultManagementRedirect() {
  return () => {
    const userProfileService = inject(UserProfileService);
    const workspaceService = inject(WorkspaceService);

    const isContentCreator = userProfileService.isContentCreator();
    const isInstructor = userProfileService.hasRoles(['instructor']);

    if (!isContentCreator && isInstructor) {
      const eventsActive = workspaceService.isServiceActive(CONTENT_MANAGEMENT_ROUTES.events.serviceId);
      return eventsActive ? CONTENT_MANAGEMENT_ROUTES.events.path : environment.routeHome;
    }

    const coursesActive = workspaceService.isServiceActive(CONTENT_MANAGEMENT_ROUTES.courses.serviceId);
    const eventsActive = workspaceService.isServiceActive(CONTENT_MANAGEMENT_ROUTES.events.serviceId);
    const trailsActive = workspaceService.isServiceActive(CONTENT_MANAGEMENT_ROUTES.trails.serviceId);
    const channelsActive = workspaceService.isServiceActive(CONTENT_MANAGEMENT_ROUTES.channels.serviceId);

    if (coursesActive) {
      return CONTENT_MANAGEMENT_ROUTES.courses.path;
    }

    if (eventsActive) {
      return CONTENT_MANAGEMENT_ROUTES.events.path;
    }

    if (trailsActive) {
      return CONTENT_MANAGEMENT_ROUTES.trails.path;
    }

    if (channelsActive) {
      return CONTENT_MANAGEMENT_ROUTES.channels.path;
    }

    return environment.routeHome;
  };
}

export const contentManagementGuard = (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const userProfileService = inject(UserProfileService);
  const workspaceService = inject(WorkspaceService);

  const isContentCreator = userProfileService.isContentCreator();
  const isInstructor = userProfileService.hasRoles(['instructor']);
  const url = state.url;
  const urlSegments = url.split('/').filter(Boolean);
  const segmentsAfterManagement = urlSegments.slice(urlSegments.indexOf('management') + 1);
  const subRoute = segmentsAfterManagement[0];

  if (!subRoute) {
    return redirectToDefaultAvailableRoute();
  }

  if (!isContentCreator && isInstructor && subRoute !== 'events') {
    return router.createUrlTree([environment.routeHome]);
  }

  const routeConfig = Object.values(CONTENT_MANAGEMENT_ROUTES).find((r) => r.path === subRoute);

  if (!routeConfig) {
    return router.createUrlTree([environment.routeHome]);
  }

  const serviceActive = workspaceService.isServiceActive(routeConfig.serviceId);

  if (!serviceActive) {
    return router.createUrlTree([environment.routeHome]);
  }

  return true;
};

function redirectToDefaultAvailableRoute() {
  const router = inject(Router);
  const defaultRoute = getDefaultManagementRedirect()();

  return defaultRoute === environment.routeHome
    ? router.createUrlTree([environment.routeHome])
    : router.createUrlTree(['management', defaultRoute]);
}
