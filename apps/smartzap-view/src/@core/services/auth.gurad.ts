import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services';
import { environment } from 'environments/environment';

@Injectable()
export class AuthGuard {
  constructor(
    private _authService: AuthService,
    private _router: Router,
  ) {}

  canLoad(): boolean {
    if (environment.prototypeMode) {
      return true;
    }

    const isAuthenticated = this._authService.isAuthenticated();

    if (isAuthenticated) {
      return true;
    }

    this._router.navigate(['/invalid-token']);

    return false;
  }

  canActivate(): boolean {
    return this.canLoad();
  }
}
