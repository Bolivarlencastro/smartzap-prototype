import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EnrollmentFilter } from '@core/model/enrollment.model';
import {
  BATCH_ACTION_API_KEY,
  BatchAction,
  BatchActionAPIParams,
  BatchActionsApi,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpBatchActionDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-batch-action-dialog';
import { filter, Observable, switchMap } from 'rxjs';

@Injectable()
export class BatchActionsService {
  constructor(
    private dialog: MatDialog,
    private batchActionsApi: BatchActionsApi,
  ) {}

  dispatchAction(
    action: BatchAction,
    enrollmentIds: string[],
    enrollmentFilter: EnrollmentFilter,
    count: number,
  ): Observable<unknown> {
    return this.dialog
      .open(KpBatchActionDialogComponent, {
        autoFocus: false,
        width: '350px',
        data: { action, total: count },
      })
      .afterClosed()
      .pipe(
        filter((data) => data),
        switchMap((data) => this.performAction(action, enrollmentIds, data, enrollmentFilter, count)),
      );
  }

  private performAction(
    action: BatchAction,
    enrollmentIds: string[],
    value: unknown,
    enrollmentFilter: EnrollmentFilter,
    count: number,
  ): Observable<unknown> {
    const actionKey = BATCH_ACTION_API_KEY[action];
    const params = this.createParams(actionKey, enrollmentIds, value, enrollmentFilter, count, action);
    return this.batchActionsApi.dispatchAction(params);
  }

  private createParams(
    actionKey: string,
    enrollmentIds: string[],
    value: unknown,
    enrollmentFilter: EnrollmentFilter,
    count: number,
    action: BatchAction,
  ): BatchActionAPIParams {
    const params: BatchActionAPIParams = {
      actionKey,
      objectsTotalExpected: count,
      ...(enrollmentFilter && { queryFilters: this.pickFilterProperties(enrollmentFilter) }),
      ...(enrollmentIds.length && { objectIds: enrollmentIds }),
    };

    const actionsWithPayload = [
      'APPROVE_ENROLLMENT',
      'REJECT_CERTIFICATE',
      'RESTART_ENROLLMENT',
      'RE_ENROLL_ENROLLMENT',
      'GOAL_DATE_ENROLLMENT',
    ];

    if (actionsWithPayload.includes(action)) {
      params.actionPayload = value;
    }

    return params;
  }

  private pickFilterProperties(filter: EnrollmentFilter): Partial<EnrollmentFilter> {
    const keys = [
      'performance__gte',
      'performance__lte',
      'start_date__gte',
      'start_date__lte',
      'end_date__gte',
      'end_date__lte',
      'status',
    ];
    return keys.reduce((acc, key) => {
      if (key in filter) {
        const value = filter[key];

        if (value !== null && value !== undefined) {
          if (key === 'performance__gte' || key === 'performance__lte') {
            acc[key] = Number(value);
          } else if (key === 'status' && Array.isArray(value)) {
            acc[key] = value.join(',');
          } else {
            acc[key] = value;
          }
        }
      }
      return acc;
    }, {});
  }
}
