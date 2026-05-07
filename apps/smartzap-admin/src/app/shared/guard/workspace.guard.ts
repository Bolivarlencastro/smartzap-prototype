import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceGuard {
  constructor(
    private workspaceService: WorkspaceService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    return this.checkWorkspaces();
  }

  canLoad(): boolean {
    return this.checkWorkspaces();
  }

  canActivateChild(): boolean {
    return this.canActivate();
  }

  checkWorkspaces(): boolean {
    if (environment.prototypeMode) {
      return true;
    }

    if (this.workspaceService.workspaceSelected()) {
      return true;
    }

    this.router.navigate(['/workspaces']);
    return false;
  }
}
