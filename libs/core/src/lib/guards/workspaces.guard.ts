import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { WorkspaceService } from '../services';

export const workspacesGuardActivate: CanActivateFn = () => {
  return guardCheck();
};

export const workspacesGuardMatch: CanMatchFn = () => {
  return guardCheck();
};

function guardCheck(): boolean | UrlTree {
  const router = inject(Router);
  const workspaceService = inject(WorkspaceService);

  if (!workspaceService.workspaceSelected()) {
    return router.parseUrl('/workspaces');
  }
  return true;
}
