import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { CheckInService } from '../services/check-in.service';

export const workspaceGuardActivate: CanActivateFn = () => {
  return guardCheck();
};

function guardCheck(): boolean | UrlTree {
  const router = inject(Router);
  const checkinService = inject(CheckInService);

  if (!checkinService.sessionData()?.workspaceId) {
    return router.parseUrl('/unauthorized');
  }

  return true;
}
