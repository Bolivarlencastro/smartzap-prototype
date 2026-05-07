import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort, MatSort, MatSortHeader } from '@angular/material/sort';
import { filter } from 'rxjs/operators';
import { Enrollment } from 'app/main/courses/model';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import {
  CdkTable,
  CdkColumnDef,
  CdkHeaderCell,
  CdkCellDef,
  CdkCell,
  CdkHeaderRowDef,
  CdkHeaderRow,
  CdkRowDef,
  CdkRow,
  CdkNoDataRow,
} from '@angular/cdk/table';
import { MatHeaderCellDef, MatColumnDef } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { NgTemplateOutlet, UpperCasePipe, DatePipe } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { KpPhonePipe } from '@keeps-platform-frontend-workspace/ui/kp-phone';
import { KpNormalizePercentPipe } from '@keeps-platform-frontend-workspace/ui/kp-normalize-percent';
import { RouterLink } from '@angular/router';
import { KpEnrollmentStatusColorPipe } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-status-color';

@Component({
  selector: 'app-settings-enrollments-list',
  templateUrl: './enrollments-list.component.html',
  styleUrls: ['enrollments-list.component.scss'],
  imports: [
    CdkTable,
    MatSort,
    CdkColumnDef,
    MatHeaderCellDef,
    CdkHeaderCell,
    MatSortHeader,
    CdkCellDef,
    CdkCell,
    MatTooltip,
    NgTemplateOutlet,
    MatColumnDef,
    MatButton,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    CdkHeaderRowDef,
    CdkHeaderRow,
    CdkRowDef,
    CdkRow,
    CdkNoDataRow,
    UpperCasePipe,
    DatePipe,
    TranslocoPipe,
    KpCardTagComponent,
    KpPhonePipe,
    KpNormalizePercentPipe,
    RouterLink,
    KpEnrollmentStatusColorPipe,
  ],
})
export class EnrollmentsListComponent {
  @Input() datasource: Enrollment[];
  @Input() loading: boolean;
  @Output() sortChanged: EventEmitter<Sort>;
  @Output() deleteEnrollment: EventEmitter<Enrollment>;
  @Output() cancelEnrollment: EventEmitter<Enrollment>;
  @Output() reenroll: EventEmitter<Enrollment>;
  @Output() openActivities: EventEmitter<Enrollment>;
  displayedColumns: string[];
  pageSizeOptions: number[];

  constructor(private _dialog: MatDialog) {
    this.datasource = [];
    this.sortChanged = new EventEmitter();
    this.deleteEnrollment = new EventEmitter();
    this.cancelEnrollment = new EventEmitter();
    this.reenroll = new EventEmitter();
    this.openActivities = new EventEmitter();
    this.loading = false;
    this.displayedColumns = [
      'user__name',
      'course__name',
      'user__phone',
      'start_date',
      'end_date',
      'performance',
      'messages',
      'status',
      'actions',
    ];
  }

  protected readonly skeletonRows = new Array(7);
  protected readonly displayedData = () => (this.loading ? this.skeletonRows : (this.datasource ?? []));

  displayDownloadCertificate(enrollment: Enrollment) {
    return enrollment.status === EnrollmentStatuses.COMPLETED && !!enrollment?.certificate_url;
  }

  handleOpenActivities(enrollment: Enrollment): void {
    this.openActivities.emit(enrollment);
  }

  handleReenroll(enrollment: Enrollment): void {
    const dialogRef = this._dialog.open(KpConfirmDialogComponent);
    dialogRef.componentInstance.confirmTitle = 'SETTINGS.ENROLLMENTS.CONFIRM_REENROLL_TITLE';
    dialogRef.componentInstance.confirmMessage = 'SETTINGS.ENROLLMENTS.CONFIRM_REENROLL_MESSAGE';
    dialogRef
      .afterClosed()
      .pipe(filter((value) => value === true))
      .subscribe(() => this.reenroll.emit(enrollment));
  }

  handleDelete(enrollment: Enrollment): void {
    const dialogRef = this._dialog.open(KpConfirmDialogComponent);
    dialogRef.componentInstance.confirmTitle = 'SETTINGS.ENROLLMENTS.CONFIRM_DELETE_TITLE';
    dialogRef.componentInstance.confirmMessage = 'SETTINGS.ENROLLMENTS.CONFIRM_DELETE_MESSAGE';
    dialogRef
      .afterClosed()
      .pipe(filter((value) => value === true))
      .subscribe(() => this.deleteEnrollment.emit(enrollment));
  }

  handleCancel(enrollment: Enrollment): void {
    const dialogRef = this._dialog.open(KpConfirmDialogComponent);
    dialogRef.componentInstance.confirmTitle = 'SETTINGS.ENROLLMENTS.CONFIRM_CANCEL_TITLE';
    dialogRef.componentInstance.confirmMessage = 'SETTINGS.ENROLLMENTS.CONFIRM_CANCEL_MESSAGE';
    dialogRef
      .afterClosed()
      .pipe(filter((value) => value === true))
      .subscribe(() => this.cancelEnrollment.emit(enrollment));
  }

  handleSort(event: Sort): void {
    this.sortChanged.emit(event);
  }
}
