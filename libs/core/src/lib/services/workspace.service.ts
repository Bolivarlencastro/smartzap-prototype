import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Service, WorkspaceBasicDto, WorkspaceWithServices } from '../my-account-sdk';
import { KeepsUtils } from '../shared';

export type WorkspaceHashMap = Pick<WorkspaceWithServices, 'id' | 'hash_id'>[];

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  public static WORKSPACE_KEY = 'WORKSPACE_KEY';
  public static AVAILABLE_WORKSPACES_HASHES = 'AVAILABLE_WORKSPACES_HASHES';

  private _currentWorkspace = new BehaviorSubject<WorkspaceBasicDto | undefined>(undefined);
  private _createWorkspace = new Subject<void>();
  private _workspaceServices = new BehaviorSubject<Service[]>([]);

  readonly workspaceServices$ = this._workspaceServices.asObservable();
  readonly currentWorkspace$ = this._currentWorkspace.asObservable();
  readonly createWorkspace$ = this._createWorkspace.asObservable();

  get currentWorkspaceId(): string | undefined {
    return this.getCurrentWorkspace()?.id;
  }

  workspaceSelected(): boolean {
    return !!this.getCurrentWorkspace()?.id;
  }

  setCurrentWorkspace(workspace: WorkspaceBasicDto): void {
    if (workspace && !KeepsUtils.areObjectEqual(this._currentWorkspace.getValue(), workspace)) {
      this._currentWorkspace.next(workspace);
      localStorage.setItem(WorkspaceService.WORKSPACE_KEY, JSON.stringify(workspace));
    }
  }

  /**
   * Returns the current workspace.
   * If not yet defined, tries to load the one stored on localstorage, if none, returns undefined.
   * If one from the localStorage is loaded, it's also set as the current workspace.
   */
  getCurrentWorkspace(): WorkspaceBasicDto | undefined {
    const currentWorkspace = this._currentWorkspace.getValue();

    if (currentWorkspace) {
      return currentWorkspace;
    }

    try {
      const workspace = this.getWorkspace();
      if (workspace) {
        this._currentWorkspace.next(workspace);
      }
      return workspace;
    } catch {
      console.error('Error while parsing Workspace from LocalStorage');
    }

    return undefined;
  }

  clearCurrentWorkspace(): void {
    localStorage.removeItem(WorkspaceService.WORKSPACE_KEY);
    this._workspaceServices.next([]);
    this._currentWorkspace.next(undefined);
  }

  setWorkspaceServices(services: Service[]): void {
    this._workspaceServices.next(services);
  }

  getWorkspaceServices(): Service[] {
    return this._workspaceServices.getValue();
  }

  createWorkspace(): void {
    this._createWorkspace.next();
  }

  storeAvailableWorkspaces(workspaces: WorkspaceWithServices[]) {
    if (!workspaces?.length) {
      return;
    }

    const workspacesHashMap: WorkspaceHashMap = workspaces.map((workspace) => {
      return { id: workspace.id, hash_id: workspace.hash_id };
    });
    localStorage.setItem(WorkspaceService.AVAILABLE_WORKSPACES_HASHES, JSON.stringify(workspacesHashMap));
  }

  isWorkspaceAvailable(workspaceHash: string): boolean {
    try {
      const workspaces: WorkspaceHashMap = JSON.parse(
        localStorage.getItem(WorkspaceService.AVAILABLE_WORKSPACES_HASHES),
      );
      return workspaces?.findIndex((workspace) => workspace.hash_id === workspaceHash) > -1;
    } catch (_e) {
      return false;
    }
  }

  isServiceActive(serviceId: string): boolean {
    const services = this.getWorkspaceServices();
    if (!services?.length) {
      return false;
    }

    return services?.findIndex((service) => service.id === serviceId) > -1;
  }

  private getWorkspace(): WorkspaceBasicDto | undefined {
    const workspace = JSON.parse(localStorage.getItem(WorkspaceService.WORKSPACE_KEY));
    if (workspace && !this.isWorkspace(workspace)) {
      throw new Error('Invalid Workspace');
    }
    return workspace;
  }

  private isWorkspace(o: any): o is WorkspaceBasicDto {
    return typeof o.id === 'string' && typeof o.name === 'string';
  }
}
