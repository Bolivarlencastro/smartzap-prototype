import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';

export const serviceActive: CanActivateFn = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
  const workspaceService = inject(WorkspaceService);
  const router = inject(Router);

  const serviceId: string = route.data['serviceId'];
  if (!serviceId) {
    return true;
  }

  const canAccess = workspaceService.isServiceActive(serviceId);
  if (!canAccess) {
    return router.parseUrl('/404');
  }

  return true;
};
