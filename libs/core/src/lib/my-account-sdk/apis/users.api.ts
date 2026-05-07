import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserCreateDTO, UserProfile } from '../models';
import { SetUserApplicationRolesDto, UserApplicationRoles } from '../../users';
import { MyAccountV2Client } from './my-account-v2.client';

@Injectable({
  providedIn: 'root',
})
export class UsersApi {
  private readonly basePath = '/users';

  constructor(private readonly _http: MyAccountV2Client) {}

  fetchProfile(): Observable<UserProfile> {
    return this._http.get(`${this.basePath}/info`);
  }

  updateProfile(userId: string, user: UserCreateDTO): Observable<UserProfile> {
    return this._http.patch(`${this.basePath}/${userId}`, user);
  }

  uploadAvatar(userId: string, image: File): Observable<UserProfile> {
    const formData = new FormData();
    formData.append('file', image);

    return this._http
      .postFormData<{ url: string }>(`${this.basePath}/${userId}/avatar`, formData)
      .pipe(switchMap((response) => this.updateProfile(userId, { avatar: response.url })));
  }

  importUsersByFile(file: File, rolesIds: string[], temporaryPassword = true) {
    const formData = new FormData();

    formData.append('file', file);
    if (rolesIds.length) {
      formData.append('permissions', JSON.stringify(rolesIds));
    }
    formData.append('temporary_password', temporaryPassword.toString());

    return this._http.postFormData(`/user-imports`, formData);
  }

  getUserApplicationRoles(userId: string) {
    return this._http.get<UserApplicationRoles[]>(`/user-roles/${userId}`);
  }

  setUserApplicationRoles(userId: string, roles: SetUserApplicationRolesDto[]) {
    return this._http.patch<UserApplicationRoles[]>(`/user-roles/${userId}`, roles);
  }
}
