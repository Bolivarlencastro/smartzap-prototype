import { RouteDialogService } from 'app/shared/services';

export function initializeRouteDialogService(routeDialogService: RouteDialogService) {
  return () => routeDialogService.init();
}
