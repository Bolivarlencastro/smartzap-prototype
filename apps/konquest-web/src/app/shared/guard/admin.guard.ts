import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { environment } from 'environments/environment.prod';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard {
  constructor(
    private _router: Router,
    private _userProfileService: UserProfileService,
  ) {}

  canActivate(): boolean | Observable<boolean> {
    return this.canAccess();
  }

  canLoad(): boolean | Observable<boolean> {
    return this.canAccess();
  }

  canAccess(): Observable<boolean> {
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
    const canAccess = this._userProfileService.isAdmin();

    if (!canAccess) {
      this._router.navigate([environment.routeHome]);
    }

    return canAccess;
  }
}
