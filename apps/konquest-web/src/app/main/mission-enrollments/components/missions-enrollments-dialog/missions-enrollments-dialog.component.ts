import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { Enrollment } from '@core/model/enrollment.model';
import * as fromActions from '../../store/mission-enrollments.actions';
import { Store } from '@ngrx/store';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSort } from '@angular/material/sort';
import { MatTooltip } from '@angular/material/tooltip';
import { KpStatusChipComponent } from '@keeps-platform-frontend-workspace/ui/kp-status-chip';
import { DatePipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPerformancePipe } from '@keeps-platform-frontend-workspace/ui/kp-performance';
import { KpEnrollmentStatusColorPipe } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-status-color';

@Component({
  selector: 'app-missions-enrollments-dialog',
  templateUrl: './missions-enrollments-dialog.component.html',
  styleUrls: ['./missions-enrollments-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatIconButton,
    MatDialogClose,
    MatIcon,
    MatDialogContent,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatTooltip,
    KpStatusChipComponent,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    DatePipe,
    TranslocoPipe,
    KpPerformancePipe,
    KpEnrollmentStatusColorPipe,
  ],
})
export class MissionsEnrollmentsDialogComponent {
  displayedColumns = ['name', 'startDate', 'endDate', 'performance', 'status', 'certificate'];
  dataSource: MatTableDataSource<Enrollment> = new MatTableDataSource<Enrollment>([]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Enrollment[],
    public dialogRef: MatDialogRef<MissionsEnrollmentsDialogComponent>,
    private store: Store,
  ) {
    this.dataSource = new MatTableDataSource<Enrollment>(data);
  }

  onGenerateCertificate(id: string): void {
    this.store.dispatch(fromActions.generateCertificate({ id }));
  }
}
