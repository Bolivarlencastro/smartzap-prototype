import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  BATCH_ACTION_API_KEY,
  BatchAction,
  BatchActionAPIParams,
  BatchActionsApi,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpBatchActionDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-batch-action-dialog';
import { filter, Observable, switchMap } from 'rxjs';
import { UsersFilter } from '../users.types';

@Injectable({
  providedIn: 'root',
})
export class BatchActionsService {
  constructor(
    private dialog: MatDialog,
    private batchActionsApi: BatchActionsApi,
  ) {}

  dispatchAction(action: BatchAction, ids: string[], usersFilter: UsersFilter, count: number): Observable<unknown> {
    return this.dialog
      .open(KpBatchActionDialogComponent, {
        autoFocus: false,
        width: '350px',
        data: { action, total: count },
      })
      .afterClosed()
      .pipe(
        filter((data) => data),
        switchMap((data) => this.performAction(action, ids, data, usersFilter, count)),
      );
  }

  private performAction(
    action: BatchAction,
    ids: string[],
    value: unknown,
    usersFilter: UsersFilter,
    count: number,
  ): Observable<unknown> {
    const actionKey = BATCH_ACTION_API_KEY[action];
    const params = this.createParams(actionKey, ids, value, usersFilter, count, action);
    return this.batchActionsApi.dispatchAction(params);
  }

  private createParams(
    actionKey: string,
    ids: string[],
    value: unknown,
    usersFilter: UsersFilter,
    count: number,
    action: BatchAction,
  ): BatchActionAPIParams {
    const params: BatchActionAPIParams = {
      actionKey,
      objectsTotalExpected: count,
      ...(usersFilter && { queryFilters: this.pickFilterProperties(usersFilter) }),
      ...(ids.length && { objectIds: ids }),
    };

    console.log(this.pickFilterProperties(usersFilter));

    const actionsWithPayload = ['ACTIVATE_USERS', 'DEACTIVATE_USERS'];

    if (actionsWithPayload.includes(action)) {
      params.actionPayload = value;
    }

    return params;
  }

  private pickFilterProperties(filter: UsersFilter): Partial<UsersFilter> {
    const result: Partial<Record<string, string>> = {};

    const keyMappings: { [K in keyof UsersFilter]: string } = {
      activityAreas: 'filter.employeeInfos.areaOfActivity',
      directors: 'filter.employeeInfos.director',
      jobPositions: 'filter.employeeInfos.jobPositionId',
      managers: 'filter.employeeInfos.manager',
      roleId: 'filter.roles.role.id',
      search: 'search',
      status: 'filter.status',
    };

    for (const key in filter) {
      if (this.isNonEmpty(filter[key])) {
        const mappedKey = keyMappings[key as keyof UsersFilter];
        const value = filter[key];

        if (key === 'roleId' || key === 'jobPositions') {
          result[mappedKey] = `$in:${value.join(',')}`;
        } else if (key === 'search') {
          result[mappedKey] = value;
        } else {
          result[mappedKey] = `$eq:${value}`;
        }
      }
    }

    return result;
  }

  private isNonEmpty(value: unknown): boolean {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === 'string') {
      return !!value.trim();
    }

    if (typeof value === 'boolean') {
      return true;
    }

    return false;
  }
}
