import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivityLogItem,
  ActivityLogOption,
  ActivityLogStoreFilter,
  BatchActionsApi,
  PageResponse,
  UsersV2Api,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { format, isDate, parseISO } from 'date-fns';
import { map, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActivityLogService {
  private readonly roleIds = ['77e3a833-94b5-4c37-891d-988513eabb67', 'e67234f4-957b-483d-badc-2fbcd6cd4173'];
  constructor(
    private usersApi: UsersV2Api,
    private batchActionsApi: BatchActionsApi,
  ) {}

  getData(filter: ActivityLogStoreFilter): Observable<PageResponse<ActivityLogItem>> {
    const params = this.buildParams(filter);
    return this.batchActionsApi.getActions(params).pipe(map((response) => this.buildActions(response)));
  }

  getUsers(): Observable<ActivityLogOption[]> {
    return this.usersApi
      .fetchByQuery({
        limit: 999,
        sortBy: 'name:ASC',
        'filter.roles.role.id': `$in:${this.roleIds}`,
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

      return {
        id: item?.id,
        date: item?.createdDate,
        time,
        user: item?.user?.name,
        action: this.getAction(item),
        actionParams: { value: item?.objectsTotalExpected },
        status: item?.status,
      };
    });

    return { ...response, items };
  }

  private getAction(item: any): string {
    if (item?.actionKey === 'MYACCOUNT.UPDATE_USERS_STATUS') {
      return item.actionPayload.status ? 'ACTIVATE_USERS' : 'DEACTIVATE_USERS';
    }

    return item.actionKey;
  }

  private buildParams(filter: ActivityLogStoreFilter): HttpParams {
    const cleanedFilter = this.removeNullableValues(filter);
    let params = new HttpParams();

    for (const [key, value] of Object.entries(cleanedFilter)) {
      const paramValue = isDate(value) ? format(value, 'yyyy-MM-dd') : value;

      params = params.append(key, paramValue);
    }

    if (!cleanedFilter.actionKey) {
      params = params.append('actionKeys', 'MYACCOUNT.INVITE_USERS');
      params = params.append('actionKeys', 'MYACCOUNT.UPDATE_USERS_STATUS');
    }

    return params;
  }

  private removeNullableValues(filter: ActivityLogStoreFilter): ActivityLogStoreFilter {
    return Object.fromEntries(Object.entries(filter).filter(([_, value]) => !!value));
  }
}
