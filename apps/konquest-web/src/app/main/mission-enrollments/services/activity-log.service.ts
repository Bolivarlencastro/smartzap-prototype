import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivityLogItem,
  ActivityLogOption,
  ActivityLogStoreFilter,
  BatchActionsApi,
  PageResponse,
  UserProfileService,
  UsersV2Api,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { format, isDate, parseISO } from 'date-fns';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class ActivityLogService {
  datePipe: DatePipe;
  private superAdminId = 'c2a0da89-311d-4e4f-bf7b-c49d7c15f2b6';

  constructor(
    private usersApi: UsersV2Api,
    private batchActionsApi: BatchActionsApi,
    private userProfileService: UserProfileService,
  ) {
    this.datePipe = new DatePipe(userProfileService.getUserLocale());
  }

  getData(filter: ActivityLogStoreFilter): Observable<PageResponse<ActivityLogItem>> {
    const params = this.buildParams(filter);
    return this.batchActionsApi.getActions(params).pipe(map((response) => this.buildActions(response)));
  }

  getUsers(): Observable<ActivityLogOption[]> {
    return this.usersApi
      .fetchByQuery({
        limit: 999,
        sortBy: 'name:ASC',
        'filter.roles.role.id': this.superAdminId,
      })
      .pipe(map((response) => this.buildUsers(response)));
  }

  exportLog(id: string) {
    return this.batchActionsApi.exportLog(id).pipe(tap((res) => window.open(res.url, '_blank')));
  }

  private buildUsers(response: any): ActivityLogOption[] {
    return response.data.map((item) => ({ label: item?.name, value: item?.id }));
  }

  private buildActions(response: any): PageResponse<ActivityLogItem> {
    const items = response.items.map((item) => {
      const time = format(parseISO(item?.createdDate), 'HH:mm:ss');
      const actionParams = this.buildActionParams(item);

      return {
        id: item?.id,
        date: item?.createdDate,
        time,
        user: item?.user?.name,
        action: item?.actionKey,
        actionParams,
        status: item?.status,
      };
    });

    return { ...response, items };
  }

  private buildActionParams(item: any) {
    const action = item.actionKey;
    const params = { value: item?.objectsTotalExpected };

    if (action === 'KONQUEST.FINISH_MSSION_ENROLLMENTS') {
      return {
        ...params,
        performance: Math.round((item?.actionPayload?.performance ?? 0) * 100),
      };
    }

    if (action === 'KONQUEST.UPDATE_MISSION_ENROLLMENTS_GOAL_DATE') {
      return {
        ...params,
        goalDate: this.datePipe.transform(item?.actionPayload?.new_goal_date, 'shortDate'),
      };
    }

    return params;
  }

  private buildParams(filter: ActivityLogStoreFilter): HttpParams {
    const cleanedFilter = this.removeNullableValues(filter);
    let params = new HttpParams();

    for (const [key, value] of Object.entries(cleanedFilter)) {
      const paramValue = isDate(value) ? format(value, 'yyyy-MM-dd') : value;

      params = params.append(key, paramValue);
    }

    if (!cleanedFilter.actionKey) {
      params = params.append('actionKeys', 'KONQUEST.FINISH_MSSION_ENROLLMENTS');
      params = params.append('actionKeys', 'KONQUEST.DELETE_MISSION_ENROLLMENTS');
      params = params.append('actionKeys', 'KONQUEST.UPDATE_MISSION_ENROLLMENTS_GOAL_DATE');
      params = params.append('actionKeys', 'KONQUEST.RECREATE_MISSION_ENROLLMENTS');
      params = params.append('actionKeys', 'KONQUEST.APPROVE_MISSION_ENROLLMENTS');
      params = params.append('actionKeys', 'KONQUEST.RESTART_MISSION_ENROLLMENTS');
    }

    return params;
  }

  private removeNullableValues(filter: ActivityLogStoreFilter): ActivityLogStoreFilter {
    return Object.fromEntries(Object.entries(filter).filter(([_, value]) => !!value));
  }
}
