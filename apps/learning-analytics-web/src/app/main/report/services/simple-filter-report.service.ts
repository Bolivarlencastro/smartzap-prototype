import { Injectable } from '@angular/core';
import { KonquestApiClient, SmartzapAPI } from '@core/api';
import { AuthService, MyAccountV2Client, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { FetchOptions } from '.';
import { ReportType } from '../enums/report';
import { SimpleFilterListItem, SimpleFilterOptions, SimpleFilterReportModel } from '../interfaces';
import { environment } from 'environments/environment';

@Injectable()
export class SimpleFilterReportService {
  constructor(
    private konquestApi: KonquestApiClient,
    private myAccountApi: MyAccountV2Client,
    private smartzapApi: SmartzapAPI,
    private _userProfileService: UserProfileService,
    private authService: AuthService,
  ) {}

  fetchListOptions(filter: SimpleFilterReportModel) {
    const { reportType, ...remaining } = filter;
    const params = { ...remaining, per_page: 50, ordering: 'name' };
    switch (reportType) {
      case ReportType.USERS_ACCESS:
      case ReportType.USER_OVERVIEW:
        return this.fetchUsers({ ...params, application_id: environment.apps.konquest.id });
      case ReportType.PULSES_QUIZ:
        return this.fetchChannels(params);
      case ReportType.MISSION_QUIZ:
        return this.fetchCourses({ ...params, with_quizzes: true });
      case ReportType.COURSE_OVERVIEW:
      case ReportType.MISSION_EVALUATIONS:
        return this.fetchCourses(params);
      case ReportType.SMARTZAP_COURSE_OVERVIEW:
        return this.fetchSmartZapCourses(params);
      default:
        return throwError(() => 'Invalid report type');
    }
  }

  fetchOptions(type: FetchOptions, filter: SimpleFilterReportModel) {
    const { reportType, ...remaining } = filter;
    let params: Record<string, unknown> = { per_page: 50, ordering: 'name', ...remaining };
    switch (type) {
      case 'CHANNELS':
        return this.fetchChannels(params);
      case 'USERS':
        params = { limit: 50, sortBy: 'name:ASC', ...remaining };
        return this.fetchUsers(params);
      case 'COURSES':
        return this.fetchCourses(params);
      case 'MISSION_CATEGORY':
        return this.fetchCategories(params);
      case 'MISSION_PROVIDER':
        return this.fetchProviders(params);
      case 'GROUPS':
        return this.fetchGroups(params);
      default:
        return throwError(() => 'Invalid report type');
    }
  }

  private fetchCourses(queryParams?: Record<string, unknown>): Observable<SimpleFilterOptions> {
    return this.konquestApi.get(`/missions`, queryParams).pipe(map(this.mapToOption));
  }

  private fetchChannels(queryParams?: Record<string, unknown>): Observable<SimpleFilterOptions> {
    return this.konquestApi.get(`/channels`, queryParams).pipe(map(this.mapToOption));
  }

  private fetchSmartZapCourses(queryParams?: any): Observable<SimpleFilterOptions> {
    const { ordering, search, ...rest } = queryParams;
    const updatedFilter = { ...rest, sort: '-created', ...(search && { name__ilike: search }) };
    return this.smartzapApi.get(`/course`, updatedFilter).pipe(map(this.smartzapMapToOption));
  }

  private fetchUsers(queryParams?: Record<string, unknown>): Observable<any> {
    // If the user has the leader role, but isn't an admin, we filter only the users related to him
    if (this._userProfileService.isAnalyticsLeader()) {
      queryParams = { ...queryParams, 'filter.relatedUserLeaderId': `$in:${this.authService.userId}` };
    }
    return this.myAccountApi.get(`/users`, queryParams).pipe(map(this.userMapToOption));
  }

  private fetchCategories(queryParams?: Record<string, unknown>): Observable<SimpleFilterOptions> {
    return this.konquestApi.get(`/categories`, queryParams).pipe(map(this.mapToOption));
  }

  private fetchProviders(queryParams?: Record<string, unknown>): Observable<SimpleFilterOptions> {
    return this.konquestApi.get(`/missions/providers`, queryParams).pipe(map(this.mapToOption));
  }

  private fetchGroups(queryParams?: Record<string, unknown>): Observable<SimpleFilterOptions> {
    return this.konquestApi.get(`/missions/providers`, queryParams).pipe(map(this.mapToOption));
  }

  private mapToOption(response: any): SimpleFilterOptions {
    const { results, next, count } = response;
    const items: SimpleFilterListItem[] = results.map(({ id, name }: { id: string; name: string }) => ({
      id,
      label: name,
    }));
    const loaded = !next;
    return { items, loaded, count };
  }

  private smartzapMapToOption(response: any): SimpleFilterOptions {
    const { result, total_pages, page, count } = response;
    const items: SimpleFilterListItem[] = result.map(({ id, name }: { id: string; name: string }) => ({
      id,
      label: name,
    }));
    const loaded = page >= total_pages;
    return { items, loaded, count };
  }

  private userMapToOption(response: any): SimpleFilterOptions {
    const { data, link, meta } = response;
    const items: SimpleFilterListItem[] = data.map(({ id, name }: { id: string; name: string }) => ({
      id,
      label: name,
    }));
    const loaded = !link?.next;
    const count = meta?.total_items;
    return { items, loaded, count };
  }
}
