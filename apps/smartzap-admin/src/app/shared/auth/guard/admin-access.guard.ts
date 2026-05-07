import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AdminAccessGuard {
  constructor(
    private _router: Router,
    private _userProfileService: UserProfileService,
  ) {}

  canActivate(): Observable<boolean> {
    return this.canAccess();
  }

  canActivateChild(): Observable<boolean> {
    return this.canAccess();
  }

  canLoad(): Observable<boolean> {
    return this.canAccess();
  }

  private canAccess(): Observable<boolean> {
    if (environment.prototypeMode) {
      return of(true);
    }

    const roles = this._userProfileService.getApplicationRoles();

    if (roles?.length === 0) {
      return this._userProfileService.roles$.pipe(
        filter((roles) => !!roles.length),
        map(() => this.checkUserPermissions()),
      );
    }

    return of(this.checkUserPermissions());
  }

  private checkUserPermissions(): boolean {
    const canAccess = this._userProfileService.hasRequiredRoles(['admin']);

    if (!canAccess) {
      this._router.navigate(['/unauthorized-access']);
    }

    return canAccess;
  }
}
