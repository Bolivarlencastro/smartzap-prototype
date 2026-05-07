import { Service } from '@keeps-platform-frontend-workspace/kp-keeps';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';

const KONQUEST_SERVICES = environment.apps.konquest.services;
const SERVICE_ROUTES: Record<string, string> = {
  [KONQUEST_SERVICES.mission.id]: 'missions',
  [KONQUEST_SERVICES.dashboard.id]: 'dashboard',
  [KONQUEST_SERVICES.pulse.id]: 'pulse',
  [KONQUEST_SERVICES.learning_trail.id]: 'learning-trails',
  [KONQUEST_SERVICES.event.id]: 'events',
};

/**
 * Defines the starting home route for the application.
 * When `customSectionsVisible` is true, the home route is set the path 'home'.
 */
export function setHomeRoute(services: Service[]) {
  const customSectionsActive = services?.some(
    (service) => service.id === environment.apps.konquest.services.customSections.id,
  );

  if (customSectionsActive) {
    environment.routeHome = 'home';
    return;
  }

  const dashboardServiceId = KONQUEST_SERVICES.dashboard.id;
  if (isServiceActive(services, dashboardServiceId)) {
    environment.routeHome = SERVICE_ROUTES[dashboardServiceId];
    return;
  }

  const missionServiceId = KONQUEST_SERVICES.mission.id;
  if (isServiceActive(services, missionServiceId)) {
    environment.routeHome = SERVICE_ROUTES[missionServiceId];
    return;
  }

  const trailServiceId = KONQUEST_SERVICES.learning_trail.id;
  if (isServiceActive(services, trailServiceId)) {
    environment.routeHome = SERVICE_ROUTES[trailServiceId];
    return;
  }

  const pulseServiceId = KONQUEST_SERVICES.pulse.id;
  if (isServiceActive(services, pulseServiceId)) {
    environment.routeHome = SERVICE_ROUTES[pulseServiceId];
    return;
  }

  const eventsServiceId = KONQUEST_SERVICES.event.id;
  if (isServiceActive(services, eventsServiceId)) {
    environment.routeHome = SERVICE_ROUTES[eventsServiceId];
    return;
  }

  environment.routeHome = 'home';
}

function isServiceActive(services: Service[], serviceId: string) {
  return services.some((service) => service.id === serviceId);
}

/**
 * Updates the initial route configuration by modifying the wildcard and empty path routes.
 */
export function updateInitialRouteConfig(route: string, router: Router) {
  const config = router.config;
  const wildcardRoute = config.find((route) => route.path === '**');
  const emptyPathRoute = config.find((route) => route.path === '');

  if (wildcardRoute) {
    wildcardRoute.redirectTo = route;
  }

  if (emptyPathRoute) {
    emptyPathRoute.redirectTo = route;
  }

  router.resetConfig(config);
}
