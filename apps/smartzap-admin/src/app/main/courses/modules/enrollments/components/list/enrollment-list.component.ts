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
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Sort, MatSort, MatSortHeader } from '@angular/material/sort';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Enrollment } from 'app/main/courses/model';
import { MatHeaderCellDef, MatColumnDef, MatCellDef } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { NgTemplateOutlet, UpperCasePipe, TitleCasePipe, DatePipe } from '@angular/common';
import { KpTransformInDashDirective } from '@keeps-platform-frontend-workspace/ui/kp-transform-in-dash';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpNormalizePercentPipe } from '@keeps-platform-frontend-workspace/ui/kp-normalize-percent';
import { KpPhonePipe } from '@keeps-platform-frontend-workspace/ui/kp-phone';
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { KpEnrollmentStatusColorPipe } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-status-color';

@Component({
  selector: 'app-enrollment-list',
  templateUrl: './enrollment-list.component.html',
  styleUrls: ['./enrollment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-full min-h-0',
  },
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
    MatColumnDef,
    MatCellDef,
    NgTemplateOutlet,
    KpTransformInDashDirective,
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
    TitleCasePipe,
    DatePipe,
    TranslocoPipe,
    KpNormalizePercentPipe,
    KpPhonePipe,
    KpCardTagComponent,
    KpEnrollmentStatusColorPipe,
  ],
})
export class EnrollmentListComponent {
  @Input() datasource: Enrollment[] = [];
  @Input() isLoading!: boolean;
  @Output() sortEvent = new EventEmitter<Sort>();
  @Output() removeEvent = new EventEmitter<string>();
  @Output() openActivities = new EventEmitter<Enrollment>();
  @Output() reenroll = new EventEmitter<Enrollment>();
  @Output() cancelEnrollment = new EventEmitter<Enrollment>();
  @Output() createEnrollment = new EventEmitter<void>();
  @ViewChild(CdkTable) table!: { _elementRef: ElementRef };

  displayedColumns: string[] = [
    'user__name',
    'course_version',
    'user__phone',
    'start_date',
    'end_date',
    'performance',
    'status',
    'actions',
  ];
  protected readonly skeletonRows = new Array(7);
  protected readonly displayedData = () => (this.isLoading ? this.skeletonRows : this.datasource);

  sortData(event: Sort): void {
    this.sortEvent.emit(event);
  }

  handleOpenActivities(enrollment: Enrollment): void {
    this.openActivities.emit(enrollment);
  }

  handleReenroll(enrollment: Enrollment): void {
    this.reenroll.emit(enrollment);
  }

  handleDelete(enrollment: Enrollment): void {
    this.removeEvent.emit(enrollment.id);
  }

  handleCancel(enrollment: Enrollment): void {
    this.cancelEnrollment.emit(enrollment);
  }

  handleCreateEnrollment(): void {
    this.createEnrollment.emit();
  }

  displayDownloadCertificate(enrollment: Enrollment) {
    return enrollment.status === EnrollmentStatuses.COMPLETED && !!enrollment?.certificate_url;
  }
}
