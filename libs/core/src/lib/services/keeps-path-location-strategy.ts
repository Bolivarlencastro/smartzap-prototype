import { Location, PathLocationStrategy, PlatformLocation } from '@angular/common';
import { Injectable } from '@angular/core';
import { WorkspaceService } from './workspace.service';

@Injectable({ providedIn: 'root' })
export class KeepsPathLocationStrategy extends PathLocationStrategy {
  constructor(
    platformLocation: PlatformLocation,
    private _workspaceService: WorkspaceService,
  ) {
    super(platformLocation);
  }

  override getBaseHref(): string {
    const workspaceHashId = this._workspaceService.getCurrentWorkspace()?.hash_id;
    if (workspaceHashId) {
      return `/${workspaceHashId}/`;
    }
    const href = this.getHashFromUrl();
    return href ? `/${href}/` : '/';
  }

  override prepareExternalUrl(internal: string): string {
    return Location.joinWithSlash(this.getBaseHref(), internal);
  }

  getHashFromUrl(): string | undefined {
    const idRegex = new RegExp(/^\/([a-zA-Z0-9-])+\/?/gm);
    const path = this.path();
    return idRegex.exec(path)?.at(0)?.replace(/\//gm, '');
  }
}
