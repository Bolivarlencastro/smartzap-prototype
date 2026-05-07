import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  CORE_CONFIG,
  CoreConfig,
  WorkspaceApi,
  WorkspaceBasicDto,
  WorkspaceService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable } from 'rxjs';
import { WORKSPACES_CONFIG, WorkspacesConfig } from '../workspaces.module';

@Injectable()
export class WorkspacesListService {
  constructor(
    private _workspaceService: WorkspaceService,
    private workspaceApi: WorkspaceApi,
    private _router: Router,
    @Inject(WORKSPACES_CONFIG) private _config: WorkspacesConfig,
    @Inject(CORE_CONFIG) private _coreConfig: CoreConfig,
  ) {}

  getWorkspaces(): Observable<WorkspaceBasicDto[]> {
    const appId = this._config.isMyAccount ? null : this._coreConfig.appId;
    return this.workspaceApi.getWorkspaces(appId);
  }

  workspaceSelected(workspace: WorkspaceBasicDto): void {
    this._workspaceService.setCurrentWorkspace(workspace);
  }

  navigateToHome() {
    this._router.navigate([this._config.environment?.routeHome]).then();
  }
}
