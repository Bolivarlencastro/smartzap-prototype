import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppGuard {
  constructor(
    private _workspaceService: WorkspaceService,
    private _router: Router,
  ) {}

  canActivate(): boolean {
    const workspaceSet = this._workspaceService.workspaceSelected();
    if (workspaceSet) {
      this._router.navigate([environment.routeHome]);
    }
    return true;
  }
}
