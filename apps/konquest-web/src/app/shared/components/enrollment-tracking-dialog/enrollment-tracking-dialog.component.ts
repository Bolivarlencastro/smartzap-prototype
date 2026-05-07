import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { marker } from '@jsverse/transloco-keys-manager/marker';

import { Enrollment, EnrollmentTracking, EnrollmentTrackingCollection } from '@core/model/enrollment.model';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { KpStatusChipComponent } from '@keeps-platform-frontend-workspace/ui/kp-status-chip';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDivider } from '@angular/material/divider';
import { EnrollmentTrackingCollectionComponent } from './enrollment-tracking-collection/enrollment-tracking-collection.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPerformancePipe } from '@keeps-platform-frontend-workspace/ui/kp-performance';
import { KpEnrollmentStatusColorPipe } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-status-color';

export interface EnrollmentTrackingDialogComponentData {
  tracking: EnrollmentTracking[];
  enrollment: Enrollment;
  trackingTitle: string;
  viewText: string;
}

@Component({
  selector: 'app-enrollment-tracking-dialog',
  templateUrl: './enrollment-tracking-dialog.component.html',
  styleUrls: ['./enrollment-tracking-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatIcon,
    MatIconButton,
    MatDialogClose,
    MatDialogContent,
    KpStatusChipComponent,
    MatTooltip,
    MatDivider,
    EnrollmentTrackingCollectionComponent,
    MatDialogActions,
    MatButton,
    DecimalPipe,
    DatePipe,
    TranslocoPipe,
    KpPerformancePipe,
    KpEnrollmentStatusColorPipe,
  ],
})
export class EnrollmentTrackingDialogComponent {
  points: number;
  tracking: EnrollmentTracking[] | EnrollmentTrackingCollection[];
  enrollment: Enrollment;
  trackingTitle: string;
  viewText: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EnrollmentTrackingDialogComponentData,
    public dialogRef: MatDialogRef<EnrollmentTrackingDialogComponent>,
  ) {
    this.tracking = data.tracking;
    this.enrollment = data.enrollment;
    this.trackingTitle = data.trackingTitle;
    this.points = this.enrollment?.points;

    this.viewText =
      this.enrollment?.status === EnrollmentStatuses.EXPIRED
        ? marker('ENROLLMENT.TRACKING.REQUEST_EXTENSION')
        : data.viewText;
  }
}
