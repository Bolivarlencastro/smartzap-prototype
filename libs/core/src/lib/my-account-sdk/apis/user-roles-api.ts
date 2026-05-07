import { Injectable } from '@angular/core';
import { MyAccountV2Client } from './my-account-v2.client';
import { UserRole } from '../models';
import { PageDto } from '../../regulatory-compliance-sdk';

@Injectable({
  providedIn: 'root',
})
export class UserRolesApi {
  private readonly basePath = '/users-roles';

  constructor(private http: MyAccountV2Client) {}

  findUsersByRoleId(roleId: string) {
    return this.http.get<PageDto<UserRole>>(this.basePath, { roleId });
  }
}
