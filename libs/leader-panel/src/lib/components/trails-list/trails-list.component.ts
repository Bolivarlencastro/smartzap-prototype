import { DecimalPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
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
} from '@angular/material/table';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Trail } from '../../models/trail';
import { DataExporterService } from '../../services/data-exporter.service';

@Component({
  selector: 'lp-trails-list',
  imports: [
    DecimalPipe,
    KpDurationPipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    PercentPipe,
    TranslocoPipe,
    MatHeaderCellDef,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './trails-list.component.html',
  providers: [KpDurationPipe, PercentPipe, DataExporterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrailsListComponent {
  protected readonly displayedColumns = [
    'learning_trail_name',
    'duration',
    'enrollments_count',
    'overdue_count',
    'completion_rate',
    'average_progress',
  ];

  readonly isLoading = input<boolean>();
  readonly trails = input<Trail[]>();
  readonly sort = output<Sort>();
  readonly rowClick = output<Trail>();
  readonly hideTable = computed(() => this.isLoading() || !this.trails()?.length);
  readonly showEmptyState = computed(() => !this.isLoading() && !this.trails()?.length);
  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  constructor(private readonly dataExporter: DataExporterService) {}

  exportTable() {
    this.dataExporter.exportToCSV<Trail>('trails.csv', this.trails(), {
      learning_trail_name: { title: 'LEADER_PANEL.TRAILS.LIST.NAME' },
      duration: { title: 'LEADER_PANEL.TRAILS.LIST.DURATION', pipe: KpDurationPipe },
      enrollments_count: { title: 'LEADER_PANEL.TRAILS.LIST.ENROLLED_COUNT' },
      overdue_count: { title: 'LEADER_PANEL.TRAILS.LIST.OVERDUE_COUNT' },
      completion_rate: { title: 'LEADER_PANEL.TRAILS.LIST.CONCLUSION_RATE', pipe: PercentPipe },
      average_progress: { title: 'LEADER_PANEL.TRAILS.LIST.AVERAGE_PROGRESS', pipe: PercentPipe },
    });
  }

  onSort(sort: Sort) {
    this.sort.emit(sort);
  }

  onRowClick(trail: Trail) {
    this.rowClick.emit(trail);
  }
}
