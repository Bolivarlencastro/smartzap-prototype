import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BasicUserProfile,
  MyAccountV2Pagination,
  MyAccountV2UsersApiParams,
  UserProfile,
  WorkspaceListDto,
} from '../models';
import { MyAccountV2Client } from './my-account-v2.client';
import { SetUserApplicationRolesDto, UserApplicationRoles } from '../../users';

@Injectable({
  providedIn: 'root',
})
export class UsersV2Api {
  private readonly basePath = '/users';

  constructor(private _http: MyAccountV2Client) {}

  userInfo(): Observable<UserProfile> {
    return this._http.get(`${this.basePath}/info`);
  }

  fetchByQuery(params: Partial<MyAccountV2UsersApiParams>): Observable<MyAccountV2Pagination<UserProfile>> {
    const defaultParams = { limit: 30, sortBy: 'createdDate:DESC' };
    return this._http.get(this.basePath, { ...defaultParams, ...params });
  }

  listBasicUsers(params: Partial<MyAccountV2UsersApiParams>): Observable<MyAccountV2Pagination<BasicUserProfile>> {
    const defaultParams = { limit: 30, sortBy: 'createdDate:DESC' };
    return this._http.get(`${this.basePath}/basic`, { ...defaultParams, ...params });
  }

  getUserWorkspaces(userId: string) {
    return this._http.get<WorkspaceListDto[]>(`${this.basePath}/${userId}/workspaces`);
  }

  getUserApplicationRoles(userId: string, workspaceId?: string) {
    const customHeaders = workspaceId ? { 'x-client': workspaceId } : null;
    return this._http.get<UserApplicationRoles[]>(`/user-roles/${userId}`, null, null, false, customHeaders);
  }

  setUserApplicationRoles(userId: string, roles: SetUserApplicationRolesDto[], workspaceId?: string) {
    const customHeaders = workspaceId ? { 'x-client': workspaceId } : null;
    return this._http.patch<UserApplicationRoles[]>(`/user-roles/${userId}`, roles, null, null, false, customHeaders);
  }

  removeUserFromWorkspace(userId: string, workspaceId?: string) {
    const customHeaders = workspaceId ? { 'x-client': workspaceId } : null;
    return this._http.delete(`/user-roles/${userId}`, null, false, customHeaders);
  }
}
