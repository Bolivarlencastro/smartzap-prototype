import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { createAuthGuard } from 'keycloak-angular';
import { redirectToLogin } from '../shared';
import { inject } from '@angular/core';
import Keycloak from 'keycloak-js';
import { KeepsPathLocationStrategy } from '../services';
import { WorkspaceApi } from '../my-account-sdk';
import { LazyRolesChecker } from './lazy-roles-checker/lazy-roles-checker.service';
import { lastValueFrom, map } from 'rxjs';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
): Promise<boolean | UrlTree> => {
  const keycloak = inject(Keycloak);
  const locationStrategy = inject(KeepsPathLocationStrategy);

  if (!keycloak.authenticated) {
    const workspaceApi = inject(WorkspaceApi);
    await redirectToLogin(locationStrategy.getHashFromUrl(), workspaceApi, keycloak);
    return false;
  }

  const requiredRoles: string[] = route.data['roles'];

  if (!requiredRoles?.length) {
    return true;
  }

  const lazyRolesChecker = inject(LazyRolesChecker);
  const router = inject(Router);
  return await lastValueFrom(
    lazyRolesChecker.lazyCheckRoles(...requiredRoles).pipe(
      map((authorized) => {
        if (!authorized) {
          return router.parseUrl('/');
        }
        return true;
      }),
    ),
  );
};

export const canActivateAuthGuard = createAuthGuard<CanActivateFn>(isAccessAllowed);
