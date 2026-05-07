import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanMatch, Router } from '@angular/router';
import { WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceGuard implements CanActivate, CanActivateChild, CanMatch {
  constructor(
    private workspaceService: WorkspaceService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    return this.checkWorkspaces();
  }

  canActivateChild(): boolean {
    return this.canActivate();
  }

  canMatch(): boolean {
    return this.checkWorkspaces();
  }

  checkWorkspaces(): boolean {
    if (this.workspaceService.workspaceSelected()) {
      return true;
    }

    this.router.navigate(['/workspaces']);
    return false;
  }
}
