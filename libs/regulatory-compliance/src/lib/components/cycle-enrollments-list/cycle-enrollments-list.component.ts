import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslocoPipe } from '@jsverse/transloco';
import { EnrollmentCycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CycleManagementSort } from '../../models';
import { CycleDurationTypePipe } from '../../pipes/cycle-duration-type.pipe';
import { CycleEnrollmentStatusColorPipe } from '../../pipes/cycle-enrollment-status-color.pipe';
import { CycleEnrollmentStatusPipe } from '../../pipes/cycle-enrollment-status.pipe';
import { CycleActionsComponent } from '../cycle-actions/cycle-actions.component';
import { CycleProgressComponent } from '../cycle-progress/cycle-progress.component';

@Component({
  selector: 'kp-cycle-enrollments-list',
  templateUrl: './cycle-enrollments-list.component.html',
  styleUrls: ['./cycle-enrollments-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatSort,
    MatSortHeader,
    CycleProgressComponent,
    CycleActionsComponent,
    DatePipe,
    TranslocoPipe,
    KpPluralizeTranslatePipe,
    CycleEnrollmentStatusPipe,
    CycleDurationTypePipe,
    CycleEnrollmentStatusColorPipe,
    NgxSkeletonLoaderModule,
  ],
})
export class CycleEnrollmentsListComponent {
  @Input() enrollments: EnrollmentCycleDto[];
  @Input() isLoading: boolean;
  @Output() sortChange = new EventEmitter<CycleManagementSort>();
  @Output() renewCycle = new EventEmitter<EnrollmentCycleDto>();
  @Output() inactivateCycle = new EventEmitter<EnrollmentCycleDto>();

  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };
  protected readonly displayedColumns: string[] = [
    'progress',
    'userName',
    'leaderName',
    'normativeName',
    'learningObjectName',
    'validity',
    'renewDate',
    'expirationDate',
    'status',
  ];

  onSortChange({ active, direction }: Sort) {
    this.sortChange.emit({ order_by: active, order: direction });
  }

  onRenewCycle(cycle: EnrollmentCycleDto) {
    this.renewCycle.emit(cycle);
  }

  onInactivateCycle(cycle: EnrollmentCycleDto) {
    this.inactivateCycle.emit(cycle);
  }
}
