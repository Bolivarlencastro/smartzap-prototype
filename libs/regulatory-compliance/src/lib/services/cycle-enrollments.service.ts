import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import {
  EnrollmentsCyclesFilter,
  EnrollmentsCyclesFilterDto,
  RegulatoryComplianceApi,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { saveAs } from 'file-saver-es';
import { map, Observable, tap } from 'rxjs';
import { CycleActionConfirmationType, CycleManagementSort } from '../models';

@Injectable()
export class CycleEnrollmentsService {
  constructor(
    private readonly messageService: KpMessageService,
    private readonly _dialog: MatDialog,
    private readonly regulatoryComplianceApi: RegulatoryComplianceApi,
  ) {}

  loadEnrollments(filter: EnrollmentsCyclesFilter, sort: CycleManagementSort) {
    const buildedFilter = this.buildEnrollmentsFilter(filter, sort);
    return this.regulatoryComplianceApi.getEnrollmentsCycles(buildedFilter);
  }

  renewEnrollment(cycleId: string, enrollmentId: string) {
    return this.regulatoryComplianceApi.renewEnrollmentCycle(cycleId, enrollmentId).pipe(
      tap({
        next: () =>
          this.messageService.success(marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.MESSAGES.RENEW_SUCCESS')),
        error: (err) => this.messageService.error(err?.error?.message),
      }),
    );
  }

  inactivateCycle(cycleId: string): Observable<any> {
    return this.regulatoryComplianceApi.disableEnrollmentCycle(cycleId).pipe(
      tap({
        next: () =>
          this.messageService.success(marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.MESSAGES.INACTIVATE_SUCCESS')),
        error: () =>
          this.messageService.error(marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.MESSAGES.INACTIVATE_FAILURE')),
      }),
    );
  }

  openConfirmationDialog(type: CycleActionConfirmationType): Observable<boolean | undefined> {
    const title =
      type === 'renew'
        ? marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.RENEW_DIALOG.TITLE')
        : marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.INACTIVATE_DIALOG.TITLE');
    const message =
      type === 'renew'
        ? marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.RENEW_DIALOG.MESSAGE')
        : marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.INACTIVATE_DIALOG.MESSAGE');

    const positiveButtonText =
      type === 'renew'
        ? marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.RENEW_DIALOG.POSITIVE_BUTTON')
        : marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.INACTIVATE_DIALOG.POSITIVE_BUTTON');

    const negativeButtonText = marker('REGULATORY_COMPLIANCE.CANCEL');

    const dialogRef = this._dialog.open(KpConfirmDialogComponent, { autoFocus: 'dialog', width: '360px' });
    dialogRef.componentInstance.confirmTitle = title;
    dialogRef.componentInstance.confirmMessage = message;
    dialogRef.componentInstance.positiveButtonLabel = positiveButtonText;
    dialogRef.componentInstance.negativeButtonLabel = negativeButtonText;

    return dialogRef.afterClosed();
  }

  generateReport(): Observable<unknown> {
    return this.regulatoryComplianceApi.generateReport().pipe(map((res) => this.saveCSV(res)));
  }

  private saveCSV(csv: string) {
    const filename = `cycle_report_${Date.now()}.csv`;
    const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(csvBlob, filename);
  }

  private buildEnrollmentsFilter(
    filter: EnrollmentsCyclesFilter,
    sort: CycleManagementSort,
  ): EnrollmentsCyclesFilterDto {
    const sortBy = this.getPageOrdering(sort);
    const buildedFilter: EnrollmentsCyclesFilterDto = {
      page: filter?.page,
      search: filter?.search ?? '',
      limit: filter?.perPage,
      ...(sortBy && { sortBy }),
      ...(filter?.complianceId && { 'filter.cycle.compliance.id': `$eq:${filter?.complianceId}` }),
      ...(filter?.learningObjectId && { 'filter.enrollment.learningObject.id': `$eq:${filter?.learningObjectId}` }),
      ...(filter?.userId && { 'filter.enrollment.user.id': `$eq:${filter?.userId}` }),
      ...(filter?.relatedUserLeaderId && {
        'filter.enrollment.user.relatedUserLeader.id': `$eq:${filter?.relatedUserLeaderId}`,
      }),
      ...(filter?.status && { 'filter.status': `$in:${filter?.status}` }),
    };

    const deadlineFilters: string[] = [];

    if (filter?.deadline) {
      deadlineFilters.push(`$eq:${filter.deadline}`);
    }

    if (filter?.deadlineLte) {
      deadlineFilters.push(`$lt:${filter.deadlineLte}`);
    }

    if (filter?.deadlineGte) {
      deadlineFilters.push(`$gt:${filter.deadlineGte}`);
    }

    if (deadlineFilters.length > 0) {
      buildedFilter['filter.deadline'] = deadlineFilters;
    }

    return buildedFilter;
  }

  private getPageOrdering(sort: CycleManagementSort) {
    if (!sort?.order) {
      return '';
    }

    return `${sort.order_by}:${sort.order.toUpperCase()}`;
  }
}
