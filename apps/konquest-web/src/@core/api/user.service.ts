import { Injectable } from '@angular/core';
import { MyAccountV2Client } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private readonly _http2: MyAccountV2Client) {}

  fetchByQuery(queryParams: any, workspaceId?: string) {
    const customHeaders = workspaceId ? { 'x-client': workspaceId } : null;
    return this._http2.get<any>('/users', queryParams, false, false, customHeaders);
  }
}
