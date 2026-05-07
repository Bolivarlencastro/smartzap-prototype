import { Injectable } from '@angular/core';
import { KonquestApiClient } from '@core/api';
import {
  AuthService,
  KeepsUtils,
  MyAccountV2Client,
  MyAccountV2Pagination,
  PageDto,
  PageResponse,
  Pagination,
  UserProfileService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { ReportFiltersSearch, ReportFiltersSearchType } from '../interfaces/report-filters-search';
import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ReportFilterDialogComponent, ReportFilterDialogData } from 'app/main/report/container';
import { Observable } from 'rxjs';
import { ReportType } from 'app/main/report/enums/report';
import { format, isDate } from 'date-fns';
import { SearchAPI } from '@core/api/search.api';
import { User } from '@app/shared/model';

const CREATORS_ROLES_IDS = [
  '297a88de-c34b-4661-be8a-7090fa9a89e5',
  'c2a0da89-311d-4e4f-bf7b-c49d7c15f2b6',
  '97f4a026-f727-4e23-bdf9-971fec7ce20e',
];

const LEADER_ROLE_ID = '6a2b41b4-54c2-40d1-a587-cf25ab284aa0';

type DefaultSearchParams = { search: string; per_page: number; ordering: string } | Record<string, unknown>;

@Injectable({
  providedIn: 'root',
})
export class ReportFiltersService {
  constructor(
    private searchAPI: SearchAPI,
    private konquestApi: KonquestApiClient,
    private myAccountApi: MyAccountV2Client,
    private userProfileService: UserProfileService,
    private authService: AuthService,
    private dialog: MatDialog,
  ) {}

  openDialog(reportType: ReportType): Observable<Record<string, unknown> | null> {
    const dialogData: ReportFilterDialogData = { reportType };
    return this.dialog
      .open(ReportFilterDialogComponent, {
        minWidth: '400px',
        maxWidth: '90vw',
        autoFocus: 'dialog',
        data: dialogData,
      })
      .afterClosed()
      .pipe(map((result) => ReportFiltersService.normalizeFilter(result)));
  }

  getSelectOptions({ search, searchType }: ReportFiltersSearch) {
    let defaultParams: DefaultSearchParams = { per_page: 10, ordering: 'name', search };

    switch (searchType) {
      case 'channels':
        return this.fetchChannels(defaultParams);
      case 'missions':
        return this.fetchCourses(defaultParams);
      case 'trails':
        return this.fetchTrails(defaultParams);
      case 'categories':
        return this.fetchCategories(defaultParams);
      case 'providers':
        return this.fetchProviders(defaultParams);
      case 'groups':
        return this.fetchGroups(defaultParams);
      case 'users':
      case 'leaders':
      case 'creators':
        defaultParams = { limit: 10, sortBy: 'name:ASC', search };
        return this.fetchUsers(searchType, defaultParams);
      case 'activityAreas':
        defaultParams = { perPage: 10, search };
        return this.fetchActivityAreas(defaultParams);
      case 'managers':
        defaultParams = { perPage: 10, search };
        return this.fetchManagers(defaultParams);
      case 'directors':
        defaultParams = { perPage: 10, search };
        return this.fetchDirectors(defaultParams);
      case 'jobs':
        return this.fetchJobs(defaultParams);
      case 'jobFunctions':
        return this.fetchJobFunctions(defaultParams);
    }
  }

  private fetchCourses(queryParams?: DefaultSearchParams) {
    return this.searchAPI.get(`/v1/courses/for-reports`, queryParams).pipe(map(this.mapCourseToOptions));
  }

  private fetchTrails(queryParams?: DefaultSearchParams) {
    return this.konquestApi.get(`/learning-trails`, queryParams).pipe(map(this.mapToOptions));
  }

  private fetchChannels(queryParams?: DefaultSearchParams) {
    return this.konquestApi.get(`/channels`, queryParams).pipe(map(this.mapToOptions));
  }

  private fetchCategories(queryParams?: DefaultSearchParams) {
    return this.konquestApi.get(`/categories`, queryParams).pipe(map(this.mapToOptions));
  }

  private fetchProviders(queryParams?: DefaultSearchParams) {
    return this.konquestApi.get(`/missions/providers`, queryParams).pipe(map(this.mapToOptions));
  }

  private fetchGroups(queryParams?: DefaultSearchParams) {
    return this.konquestApi.get(`/groups`, queryParams).pipe(map(this.mapToOptions));
  }

  private fetchUsers(searchType: ReportFiltersSearchType, queryParams?: DefaultSearchParams) {
    // If we are filtering users, and the current user is a leader, but isn't an admin, we filter only the users related to him
    if (this.userProfileService.isAnalyticsLeader() && searchType === 'users') {
      queryParams = { ...queryParams, 'filter.relatedUserLeaderId': `$in:${this.authService.userId}` };
    }

    // If filtering users with any of the creator roles, sets the roles ID's
    if (searchType === 'creators') {
      queryParams = { ...queryParams, 'filter.roles.role.id': `$in:${CREATORS_ROLES_IDS.join(',')}` };
    }

    // If filtering users with the leader role, sets the role ID
    if (searchType === 'leaders') {
      queryParams = { ...queryParams, 'filter.roles.role.id': `$in:${LEADER_ROLE_ID}` };
    }

    return this.myAccountApi.get(`/users`, queryParams).pipe(map(this.mapUserToOptions));
  }

  private fetchActivityAreas(queryParams?: DefaultSearchParams) {
    return this.myAccountApi
      .get(`/users/employee-infos/areas-of-activity`, queryParams)
      .pipe(map(this.mapToStringOptions));
  }

  private fetchManagers(queryParams?: DefaultSearchParams) {
    return this.myAccountApi.get(`/users/employee-infos/managers`, queryParams).pipe(map(this.mapToStringOptions));
  }

  private fetchDirectors(queryParams?: DefaultSearchParams) {
    return this.myAccountApi.get(`/users/employee-infos/directors`, queryParams).pipe(map(this.mapToStringOptions));
  }

  private fetchJobs(queryParams?: DefaultSearchParams) {
    return this.myAccountApi.get(`/jobs`, queryParams).pipe(map(this.mapJobToOptions));
  }

  private fetchJobFunctions(queryParams?: DefaultSearchParams) {
    return this.myAccountApi.get(`/job-functions`, queryParams).pipe(map(this.mapJobToOptions));
  }

  private mapToStringOptions(response: PageDto<string>): KpFilterSelectOption[] {
    const { items } = response;

    return items.map((item) => ({ value: item, label: item }));
  }

  private mapToOptions(response: Pagination<{ id: string; name: string }>): KpFilterSelectOption[] {
    const { results } = response;

    return results.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
  }

  private mapCourseToOptions(
    response: PageResponse<{ id: string; name: string; development_status: string }>,
  ): KpFilterSelectOption[] {
    const { items } = response;
    return items.map(({ id, name, development_status }) => ({
      value: id,
      label: name,
      status: development_status,
    }));
  }

  private mapJobToOptions(response: any): KpFilterSelectOption[] {
    return response.map(({ name }) => ({
      value: name,
      label: name,
    }));
  }

  private mapUserToOptions(response: MyAccountV2Pagination<User>): KpFilterSelectOption[] {
    return response.data.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
  }

  private static normalizeFilter(filter: Record<string, unknown>): Record<string, unknown> | null {
    if (!filter) {
      return null;
    }
    const preNormalizedFilter = this.normalizeAutoCompleteOptions(filter);
    const result: Record<string, unknown> = {};
    const dateSelectors = [
      'created_date',
      'end_date',
      'start_date',
      'updated_date',
      'goal_date',
      'mission__deleted_date',
      'mission__expiration_date',
      'deleted_date',
      'expiration_date',
      'learning_trail__deleted_date',
      'user_role_workspace__created_date',
      'time_start',
      'activity',
    ];
    const workspaceSelectors = ['area_of_activity__in', 'director__in', 'manager__in'];
    const timeSelectors = ['duration_time'];
    const percentSelectors = ['performance', 'progress'];
    const mustBeArray = ['user__country__in', 'country__in'];

    Object.entries(preNormalizedFilter).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      // Dates normalization
      if (dateSelectors.some((selector) => key.startsWith(selector))) {
        result[key] = this.formatDate(value as string);
        return;
      }

      // Some filters need to be informed inside a `user_profile_workspace` object
      if (workspaceSelectors.includes(key)) {
        const userWorkspace = (result['user_profile_workspace'] || {}) as Record<string, string[]>;
        userWorkspace[key] = [value as string];
        result['user_profile_workspace'] = userWorkspace;
        return;
      }

      // Time string to minutes normalization
      if (timeSelectors.some((selector) => key.startsWith(selector))) {
        result[key] = KeepsUtils.convertToSeconds(value as string);
        return;
      }

      // Percent values normalization
      if (percentSelectors.some((selector) => key.startsWith(selector))) {
        result[key] = this.convertToPercent(value as string);
        return;
      }

      // Arrays normalization
      if (mustBeArray.some((selector) => key.startsWith(selector))) {
        result[key] = [value as string];
        return;
      }

      result[key] = value;
    });

    return result;
  }

  private static formatDate(date: string): string | null {
    const parsed = new Date(date);
    if (isDate(parsed)) {
      return format(parsed, 'yyyy-MM-dd');
    }
    return null;
  }

  private static convertToPercent(value: string): string | null {
    const parsedValue = +value;
    if (isNaN(parsedValue)) {
      return null;
    }

    return (parsedValue / 100).toString();
  }

  private static normalizeAutoCompleteOptions(filter: Record<string, unknown>): Record<string, unknown> {
    const autoCompleteOptions = [
      'learning_trail_step__learning_trail_id__in',
      'mission_category_id__in',
      'id__in',
      'user_creator_id__in',
      'mission_id__in',
      'user__related_user_leader_id__in',
      'user_id__in',
      'related_user_leader_id__in',
      'learning_object_id__in',
      'job__name__in',
      'job_function__name__in',
      'mission_provider__id__in',
      'learning_trail_id__in',
    ];

    const filterCopy = { ...filter };

    Object.entries(filter).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      if (autoCompleteOptions.some((selector) => key.startsWith(selector))) {
        filterCopy[key] = this.mapAutocompleteOptions(filter[key] as KpFilterSelectOption[]);
      }
    });

    return filterCopy;
  }

  private static mapAutocompleteOptions(options: KpFilterSelectOption[]): string[] {
    return options.map((option: KpFilterSelectOption) => option.value as string);
  }
}
