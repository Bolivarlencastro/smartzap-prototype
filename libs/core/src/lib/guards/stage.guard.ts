import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CORE_CONFIG } from '../core-config';

export const stageGuard: CanActivateFn = (_route, _state) => {
  const coreConfig = inject(CORE_CONFIG);
  const router = inject(Router);

  if (coreConfig.production) {
    return router.parseUrl('/');
  }

  return true;
};
