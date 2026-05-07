import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { UpdateUserStatusDto, UsersFilter } from '@app/main/users/users.types';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { TranslocoService } from '@jsverse/transloco';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { MyAccountV2API } from 'app/shared/api/myaccount-v2.api';
import {
  ANALYTICS_ROLE_OPTIONS,
  KONQUEST_ROLE_OPTIONS,
  MY_ACCOUNT_ROLE_OPTIONS,
  SMARTZAP_ROLE_OPTIONS,
  UserSearchFilterOption,
} from 'app/shared/model';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { JobManagementService } from './job-management.service';
import { JobEnum } from '@app/main/job-management/models';
import {
  EmployeeInfosApi,
  EmployeeInfosType,
  MyAccountV2Pagination,
  UserProfile,
} from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable({ providedIn: 'root' })
export class UsersServiceV2 {
  constructor(
    private _http: MyAccountV2API,
    private _messageService: KpMessageService,
    private _translocoService: TranslocoService,
    private _jobManagementService: JobManagementService,
    private _employeeInfosApi: EmployeeInfosApi,
  ) {}

  fetchWorkspaceUsers(filter: UsersFilter): Observable<MyAccountV2Pagination<UserProfile>> {
    const { sort, pageEvent, search, roleId, status, jobPositions, activityAreas, directors, managers, leadersId } =
      filter;
    const sortBy = this.getPageOrdering(sort);

    const params = {
      page: pageEvent.pageIndex + 1,
      limit: pageEvent.pageSize,
      ...(sortBy && { sortBy }),
      ...(search && { search }),
      ...(roleId?.length && { 'filter.roles.role.id': `$in:${roleId}` }),
      ...(jobPositions?.length && { 'filter.employeeInfos.jobPositionId': `$in:${jobPositions}` }),
      ...(activityAreas?.length && { 'filter.employeeInfos.areaOfActivity': `$eq:${activityAreas}` }),
      ...(directors?.length && { 'filter.employeeInfos.director': `$eq:${directors}` }),
      ...(managers?.length && { 'filter.employeeInfos.manager': `$eq:${managers}` }),
      ...(leadersId?.length && { 'filter.relatedUserLeaderId': `$in:${leadersId}` }),
      ...(typeof status === 'boolean' && { 'filter.status': `$eq:${status}` }),
    };

    return this._http.get<MyAccountV2Pagination<UserProfile>>(`/users`, params).pipe(
      map((res) => this.buildUsers(res)),
      catchError((err) => {
        this._messageService.error(marker('COULD_NOT_LOAD_USERS'));
        return throwError(() => new Error(err));
      }),
    );
  }

  updateUserStatus(userId: string, status: boolean): Observable<UpdateUserStatusDto> {
    return this._http
      .patch<UpdateUserStatusDto>(`/users/${userId}/update-status`, { status })
      .pipe(tap({ next: () => this._messageService.success(marker('USERS.UPDATED_SUCCESS')) }));
  }

  fetchJobPositions(): Observable<UserSearchFilterOption[]> {
    return this._jobManagementService
      .getJobs(JobEnum.JOB_POSITION, null)
      .pipe(map((res) => res.map((item) => ({ label: item.name, value: item.id }))));
  }

  fetchEmployeeInfosByType(type: EmployeeInfosType): Observable<string[]> {
    const params = { perPage: 999 };
    return this._employeeInfosApi.fetchEmployeeInfosByType(type, params).pipe(map((res) => res.items));
  }

  fetchCurrentWorkspaceLeaders(): Observable<UserSearchFilterOption[]> {
    return this._http
      .get<UserProfile[]>('/users/leaders')
      .pipe(map((res) => res.map((item) => ({ label: item.name, value: item.id }))));
  }

  private getPageOrdering(sort: Sort) {
    if (!sort?.direction) {
      return '';
    }

    return `${sort.active}:${sort.direction.toUpperCase()}`;
  }

  private buildUsers(response: MyAccountV2Pagination<UserProfile>): MyAccountV2Pagination<UserProfile> {
    const data = response.data.map((item) => {
      return {
        ...item,
        applicationRoles: this.buildUserRoles(item.roles),
      };
    });

    return { ...response, data };
  }

  private buildUserRoles(roles: any) {
    const APP_CONFIG = {
      [environment.apps.konquest.id]: { key: 'Konquest', options: KONQUEST_ROLE_OPTIONS },
      [environment.apps.learnAnalytics.id]: { key: 'Analytics', options: ANALYTICS_ROLE_OPTIONS },
      [environment.apps.myAccount.id]: { key: 'My Account', options: MY_ACCOUNT_ROLE_OPTIONS },
      [environment.apps.smartzap.id]: { key: 'Smartzap', options: SMARTZAP_ROLE_OPTIONS },
    };

    const rolesByApp: Record<string, string[]> = {};

    roles.forEach((role) => {
      const appConfig = APP_CONFIG[role.role.application.id];
      if (!appConfig) {
        return;
      }

      const roleLabel = appConfig.options.find((item) => item.value === role.role.id)?.label;
      if (!roleLabel) {
        return;
      }

      const translatedLabel = this._translocoService.translate(roleLabel);

      if (!rolesByApp[appConfig.key]) {
        rolesByApp[appConfig.key] = [];
      }

      rolesByApp[appConfig.key].push(translatedLabel);
    });

    return Object.entries(rolesByApp)
      .filter(([_, roles]) => roles.length > 0)
      .map(([key, roles]) => ({
        application: key.charAt(0),
        roles: `${key}: ${roles.join(', ')}`,
      }))
      .sort((a, b) => a.application.localeCompare(b.application));
  }
}
