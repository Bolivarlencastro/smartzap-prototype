import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanMatch, Router } from '@angular/router';
import { AuthService, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { hasRouteRole, ROLE_ADMIN, ROLE_LEADER, ROLE_USER } from './helpers/guard-helpers';

@Injectable({ providedIn: 'root' })
export class AdminAccessGuard implements CanActivate, CanActivateChild, CanMatch {
  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _userProfileService: UserProfileService,
  ) {}

  canActivate(): Observable<boolean> {
    return this.canAccess();
  }

  canActivateChild(): Observable<boolean> {
    return this.canAccess();
  }

  canMatch(): Observable<boolean> {
    return this.canAccess();
  }

  private canAccess(): Observable<boolean> {
    const roles = this._userProfileService.getApplicationRoles();

    if (!roles?.length) {
      return this._userProfileService.roles$.pipe(
        filter((roles) => !!roles.length),
        map(() => this.checkUserPermissions()),
      );
    }

    return of(this.checkUserPermissions());
  }

  private checkUserPermissions(): boolean {
    const roles = this._userProfileService.getApplicationRoles();
    const canAccess = hasRouteRole([ROLE_ADMIN], roles || []);

    if (!canAccess && (roles?.includes(ROLE_USER) || roles?.includes(ROLE_LEADER))) {
      this._router.navigate(['/', 'user', this._authService.userId]);
    } else if (!canAccess) {
      this._router.navigate(['/error']);
    }

    return canAccess;
  }
}
