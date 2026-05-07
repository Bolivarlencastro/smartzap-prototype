import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { PrototypeAdminStateService } from './prototype-admin-state.service';

@Injectable()
export class PrototypeAdminAuthService {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly router: Router,
    private readonly state: PrototypeAdminStateService,
  ) {}

  logout(): void {
    this.workspaceService.clearCurrentWorkspace();
    this.router.navigateByUrl('/courses');
  }

  get userId(): string {
    return this.state.getUserProfile().id;
  }
}

export const prototypeAuthServiceProvider = {
  provide: AuthService,
  useClass: PrototypeAdminAuthService,
};
