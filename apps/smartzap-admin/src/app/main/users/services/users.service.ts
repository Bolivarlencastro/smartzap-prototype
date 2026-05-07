import { Injectable } from '@angular/core';
import { SmartzapAPI } from '@core/api/smartzap.api';

import { Observable } from 'rxjs';

import { User } from '../model';
import { UserRolesApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { map } from 'rxjs/operators';

const PATH = '/user';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(
    private _http: SmartzapAPI,
    private userRolesApi: UserRolesApi,
  ) {}

  fetchUsers(pagination: {
    page: number;
    per_page: number;
    searchTerm: string;
    sort: string;
    tags?: string[];
    synced?: string[];
  }): Observable<any> {
    const { page = 1, per_page = 10, searchTerm = '', sort = '', tags = [], synced = [] } = pagination;

    const params: Record<string, string | number> = { page, per_page };

    if (searchTerm) {
      if (!/\p{L}/u.test(searchTerm)) {
        params['phone__ilike'] = searchTerm.replace(/[-+()\s]/g, '');
      } else if (/^\w+@(\w+\.)+\w{2,4}$/g.test(searchTerm)) {
        params['email__ilike'] = searchTerm;
      } else {
        params['name__ilike'] = searchTerm;
      }
    }

    if (sort) {
      params['sort'] = sort;
    }

    if (tags.length) {
      params['tags__in'] = tags.join(',');
    }

    if (synced.length) {
      params['synced__in'] = synced.join(',');
    }

    return this._http.get<any>(PATH, params);
  }

  fetchUsersByRoleId(roleId: string) {
    return this.userRolesApi.findUsersByRoleId(roleId).pipe(map((result) => result.items));
  }

  removeUser(id: string): Observable<any> {
    return this._http.delete(`${PATH}/${id}`);
  }

  updateUser(id: string, user: Partial<User>): Observable<void> {
    return this._http.patch<void>(`${PATH}/${id}`, user);
  }
}
