import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  MissionListingConfig,
  SmartzapConfiguration,
  SmartzapConfigurationResponse,
  Workspace,
  WorkspaceBasicDto,
} from '../models';
import { MyAccountV2Client } from './my-account-v2.client';
import { Paginated } from '../../pagination';

const BASE_URL = '/workspaces';
const WORKSPACE_ADMIN_ROLE = '77e3a833-94b5-4c37-891d-988513eabb67';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceApi {
  constructor(private readonly _http: MyAccountV2Client) {}

  updateWorkspace(workspaceId: string, workspace: Partial<Workspace>): Observable<Workspace> {
    return this._http.patch<Workspace>(`${BASE_URL}/${workspaceId}`, workspace);
  }

  getWorkspaces(applicationId?: string): Observable<WorkspaceBasicDto[]> {
    const selectProperties = [
      'id',
      'name',
      'logoUrl',
      'iconUrl',
      'hashId',
      'themeDark',
      'customColor',
      'logoutUrl',
      'notifyTeams',
      'notifySlack',
      'defaultFederatedIdentityProviderAlias',
    ];

    const params: Record<string, any> = {
      select: selectProperties.join(','),
      'filter.serviceWorkspaces.status': true,
    };

    if (applicationId) {
      params['filter.userRoleWorkspaces.role.applicationId'] = `$eq:${applicationId}`;
    }

    return this._http.get<Paginated<WorkspaceBasicDto>>(BASE_URL, params).pipe(map((result) => result?.data));
  }

  getAdminWorkspaces(): Observable<WorkspaceBasicDto[]> {
    const params = {
      select: 'id,name',
      'filter.serviceWorkspaces.status': true,
      'filter.userRoleWorkspaces.role.id': WORKSPACE_ADMIN_ROLE,
    };
    return this._http.get<Paginated<WorkspaceBasicDto>>(BASE_URL, params).pipe(map((result) => result?.data));
  }

  getWorkspacesWithQuery(query: Record<string, string | boolean | string[]>) {
    return this._http.get<Paginated<WorkspaceBasicDto>>(BASE_URL, query);
  }

  getLoginUrl(workspaceHash: string): Observable<string> {
    return this._http
      .get<{ custom_login_url: string }>(`/workspaces/hash-login-url/${workspaceHash}`)
      .pipe(map(({ custom_login_url }) => custom_login_url));
  }

  getWorkspace(workspaceId: string): Observable<Workspace> {
    return this._http.get<Workspace>(`${BASE_URL}/${workspaceId}`);
  }

  getMissionListingConfig(): Observable<Partial<MissionListingConfig>[]> {
    return this._http.get<Partial<MissionListingConfig>[]>(`/workspaces-filter-settings`);
  }

  updateMissionListingConfig(id: string, isEnabled: boolean) {
    return this._http.patch<Workspace>(`/workspaces-filter-settings/${id}/toggle-status`, { isEnabled });
  }

  fetchSmartzapConfiguration(workspaceId: string): Observable<SmartzapConfiguration> {
    return this._http
      .get<SmartzapConfigurationResponse>(`/workspaces/${workspaceId}/smartzap-configuration`)
      .pipe(map((res) => this.prepareSmartzapConfigurationData(res)));
  }

  updateSmartzapConfiguration(config: SmartzapConfiguration, workspaceId: string): Observable<SmartzapConfiguration> {
    const coursesPortalUrl = config?.coursesPortalUrl || null;
    const enrollmentIdleDaysLimit = Number(config?.enrollmentIdleDaysLimit) || null;
    return this._http
      .patch<SmartzapConfigurationResponse>(`${BASE_URL}/${workspaceId}/smartzap-configuration`, {
        ...config,
        coursesPortalUrl,
        enrollmentIdleDaysLimit,
      })
      .pipe(map((res) => this.prepareSmartzapConfigurationData(res)));
  }

  updateUserTokenExpiration(user_token_expiration: number, workspaceId: string): Observable<Workspace> {
    return this._http.patch<Workspace>(`${BASE_URL}/${workspaceId}`, { user_token_expiration });
  }

  private prepareSmartzapConfigurationData(res: SmartzapConfigurationResponse): SmartzapConfiguration {
    return {
      messagesContentEmbed: res.messages_content_embed,
      sendCoursesRecommendationMessage: res.send_courses_recommendation_message,
      sendCourseReminderMessage: res.send_course_reminder_message,
      interactWithRandomMessages: res.interact_with_random_messages,
      enrollmentIdleDaysLimit: res.enrollment_idle_days_limit,
      coursesPortalUrl: res.courses_portal_url,
    };
  }
}
