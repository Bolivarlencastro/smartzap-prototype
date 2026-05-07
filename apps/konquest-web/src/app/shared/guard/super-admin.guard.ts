import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { LazyRolesChecker } from '@keeps-platform-frontend-workspace/kp-keeps';

export const superAdminCanActivate: CanActivateFn = (_route, _state): Observable<boolean | UrlTree> => {
  return executeCheck();
};

export const superAdminCanMatch: CanMatchFn = (_route, _segments): Observable<boolean | UrlTree> => {
  return executeCheck();
};

function executeCheck(): Observable<boolean | UrlTree> {
  const router = inject(Router);
  const lazyRolesChecker = inject(LazyRolesChecker);

  return lazyRolesChecker.lazyCheckRoles('super_admin').pipe(
    map((result) => {
      if (!result) {
        return router.parseUrl('/');
      }

      return true;
    }),
  );
}
