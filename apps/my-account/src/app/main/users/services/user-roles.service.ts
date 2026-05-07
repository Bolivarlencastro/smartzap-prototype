import { Injectable } from '@angular/core';
import { ApplicationsApi, UsersApi } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable({
  providedIn: 'root',
})
export class UserRolesService {
  constructor(
    private applicationsApi: ApplicationsApi,
    private usersApi: UsersApi,
  ) {}

  getApplicationsWithRoles() {
    return this.applicationsApi.getApplicationsWithRoles();
  }

  getUserRoles(userId: string) {
    return this.usersApi.getUserApplicationRoles(userId);
  }
}
