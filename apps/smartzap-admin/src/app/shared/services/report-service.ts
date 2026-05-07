import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SmartzapAPI } from '@core/api';
import { format } from 'date-fns';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ReportType } from 'app/shared/model';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { KpWarnDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-warn-dialog';
import {
  UsersConsumptionFilterDialogComponent,
  UsersConsumptionFilterResult,
} from 'app/shared/dialogs/users-consumption-filter-dialog/users-consumption-filter-dialog.component';

@Injectable({ providedIn: 'root' })
export class ReportService {
  readonly UrlReportsSmartzap: Record<ReportType, (id?: string) => string> = {
    USERS: (_id?: string) => '/stats/user/csv',
    PROGRESS: (id?: string) => `/stats/course/${id}/enrollment/in-progress/csv`,
    COMPLETED: (id?: string) => `/stats/course/${id}/enrollment/completed/csv`,
    QUIZZES: (id?: string) => `/stats/course/${id}/quizzes/csv`,
    ACTIVITY: (id?: string) => `/stats/course/${id}/activity/csv`,
    USERS_CONSUMPTION: (id?: string) => `/stats/course/${id}/consumption/csv`,
  };

  constructor(
    private readonly _http: SmartzapAPI,
    private readonly _messageService: KpMessageService,
    private readonly _dialog: MatDialog,
  ) {}

  downloadReport(reportType: ReportType, id?: string): Observable<unknown> {
    if (reportType === 'USERS_CONSUMPTION') {
      return this._dialog
        .open(UsersConsumptionFilterDialogComponent, {
          minWidth: '400px',
          maxWidth: '90vw',
          autoFocus: 'dialog',
        })
        .afterClosed()
        .pipe(
          switchMap((filters: UsersConsumptionFilterResult | null | undefined) => {
            if (!filters) {
              return EMPTY;
            }
            return this._executeDownload(reportType, id, filters);
          }),
        );
    }

    return this._executeDownload(reportType, id);
  }

  private _executeDownload(
    reportType: ReportType,
    id?: string,
    filters?: UsersConsumptionFilterResult,
  ): Observable<unknown> {
    const reportPath = this.UrlReportsSmartzap[reportType](id);
    const params = this._buildParams(filters);

    return this._http.get(reportPath, params).pipe(
      tap(() => this._openWarnDialog()),
      catchError((error) => this.errorHandler(error, 'REPORTS.PROCESSING_ERROR')),
    );
  }

  private _buildParams(filters?: UsersConsumptionFilterResult): Record<string, string> | undefined {
    if (!filters) return undefined;

    const params: Record<string, string> = {};

    if (filters.status?.length) {
      params['status'] = filters.status.join(',');
    }
    if (filters.concluded_after) {
      params['concluded_after'] = format(filters.concluded_after, 'yyyy-MM-dd');
    }
    if (filters.concluded_before) {
      params['concluded_before'] = format(filters.concluded_before, 'yyyy-MM-dd');
    }

    return Object.keys(params).length ? params : undefined;
  }

  private _openWarnDialog(): void {
    const dialogRef = this._dialog.open(KpWarnDialogComponent);
    dialogRef.componentInstance.dialogTitle = 'REPORTS.DIALOG_TITLE';
    dialogRef.componentInstance.dialogDescription = 'REPORTS.WARN';
    dialogRef.componentInstance.icon = 'notifications_none';
  }

  private errorHandler(error: Error, message: string): Observable<never> {
    this._messageService.error(message);
    return throwError(() => error);
  }
}
