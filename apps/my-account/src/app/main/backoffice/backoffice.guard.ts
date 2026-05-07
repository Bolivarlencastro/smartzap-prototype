import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable({ providedIn: 'root' })
export class BackofficeGuard implements CanActivate {
  constructor(
    private _router: Router,
    private readonly userProfileService: UserProfileService,
  ) {}

  canActivate(): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    const hasAccess = this.userProfileService.hasRoles(['manage-users']);

    if (!hasAccess) {
      alert('Você não possui permissão para acessar esta tela');
      this._router.navigate(['/']);
    }

    return hasAccess;
  }
}
