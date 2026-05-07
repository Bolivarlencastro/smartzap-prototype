import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ThemingService,
  Workspace,
  WorkspaceBasicDto,
  WorkspaceService,
  WorkspaceWithUserRoles,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { MyAccountV2API } from '../api/myaccount-v2.api';
import { UploadWorkspaceImageDto } from '../dto';

@Injectable({ providedIn: 'root' })
export class WorkspacesService {
  private _isLoading = new BehaviorSubject(false);
  public isLoading$ = this._isLoading.asObservable();
  onWorkspacesChanged: Subject<any>;
  userWorkspacesListEvent: Subject<WorkspaceWithUserRoles[]>;
  imageUpdated: Subject<any>;

  constructor(
    private readonly _http2: MyAccountV2API,
    private readonly _workspaceService: WorkspaceService,
    private readonly _router: Router,
    private readonly _themingService: ThemingService,
    private readonly _messageService: KpMessageService,
  ) {
    this.onWorkspacesChanged = new Subject();
    this.userWorkspacesListEvent = new Subject();
    this.imageUpdated = new Subject();
  }

  public removeCurrentWorkspace(): void {
    this._workspaceService.clearCurrentWorkspace();
  }

  /**
   * Upload and update a workspace logo or an icon.
   *
   * @param uploadDto payload to update
   * @returns
   */
  uploadWorkspaceImage(uploadDto: UploadWorkspaceImageDto): Observable<Workspace> {
    const { file, workspaceId, type } = uploadDto;
    const basePath = `/workspaces`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('width', '200');
    formData.append('height', '200');

    return this._http2.postFormData<{ name: string; url: string }>(`${basePath}/${type}`, formData).pipe(
      switchMap(({ url }) => {
        const payload = type === 'icon' ? { icon_url: url } : { logo_url: url };
        return this._http2.patch<Workspace>(`${basePath}/${workspaceId}`, payload);
      }),
      tap((workspace) => this._workspaceService.setCurrentWorkspace(workspace as WorkspaceBasicDto)),
    );
  }

  createWorkspace(workspace: Workspace) {
    return this._http2.post('/workspaces', workspace).pipe(
      tap((workspace) => {
        this._workspaceService.setCurrentWorkspace(workspace as WorkspaceBasicDto);
        this._router.navigate(['workspace', 'profile']);
      }),
    );
  }

  updateWorkspace(workspace: Workspace) {
    const {
      theme_dark,
      custom_color,
      name,
      doc_number,
      duns_number,
      description,
      address,
      city,
      state,
      post_code,
      country,
      hash_id,
      id,
    } = workspace;

    const payload = {
      theme_dark,
      custom_color,
      name,
      doc_number,
      duns_number,
      description,
      address,
      city,
      state,
      post_code,
      country,
      hash_id,
    };

    return this._http2.patch(`/workspaces/${id}`, payload).pipe(
      tap({
        next: (workspace) => {
          this._workspaceService.setCurrentWorkspace(workspace as WorkspaceBasicDto);
          this._messageService.success('GENERAL.CONFIGURATIONS_UPDATED');
        },
        error: () => this._messageService.error('GENERAL.CONFIGURATIONS_UPDATE_FAILED'),
      }),
    );
  }

  updateWorkspaceCustomColor(custom_color: string, workspace: Workspace) {
    const payload = { ...workspace, custom_color };
    return this.updateWorkspace(payload).pipe(
      tap(() => {
        this._themingService.setThemeColor(custom_color, workspace.theme_dark);
      }),
    );
  }

  updateWorkspaceDarkTheme(theme_dark: boolean, workspace: Workspace) {
    const payload = { ...workspace, theme_dark };
    return this.updateWorkspace(payload).pipe(
      tap(() => this._themingService.setThemeColor(workspace.custom_color, theme_dark)),
    );
  }

  deleteWorkspace(id: string) {
    return this._http2.delete(`/workspaces/${id}`).pipe(
      tap(() => {
        this.removeCurrentWorkspace();
        this._router.navigate(['/', 'workspaces']);
      }),
    );
  }
}
