import { DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
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
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { KpCourseDevelopmentStatusTagTypePipe } from '@keeps-platform-frontend-workspace/ui/kp-course-development-status-tag-type';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Event } from '../../../models/events';
import { DataExporterService } from '../../../services/data-exporter.service';

@Component({
  selector: 'lp-events-list',
  imports: [
    DecimalPipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    TranslocoPipe,
    MatHeaderCellDef,
    MatSort,
    MatSortHeader,
    MatIcon,
    DatePipe,
    KpCardTagComponent,
    KpCourseDevelopmentStatusTagTypePipe,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './events-list.component.html',
  providers: [DatePipe, PercentPipe, DataExporterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsListComponent {
  protected readonly displayedColumns = [
    'event_name',
    'enrolled_count',
    'start_date',
    'event_status',
    'attendance_rate',
  ];
  readonly isLoading = input<boolean>();
  readonly events = input<Event[]>([]);
  readonly sort = output<Sort>();
  readonly rowClick = output<Event>();
  readonly hideTable = computed(() => this.isLoading() || !this.events()?.length);
  readonly showEmptyState = computed(() => !this.isLoading() && !this.events()?.length);
  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  constructor(private readonly dataExporter: DataExporterService) {}

  exportTable() {
    this.dataExporter.exportToCSV<Event>('events.csv', this.events(), {
      event_name: { title: 'LEADER_PANEL.EVENTS.LIST.NAME' },
      enrolled_count: { title: 'LEADER_PANEL.EVENTS.LIST.ENROLLED_COUNT' },
      start_date: { title: 'LEADER_PANEL.EVENTS.LIST.DATE', pipe: DatePipe },
      event_status: { title: 'LEADER_PANEL.EVENTS.LIST.STATUS' },
      attendance_rate: { title: 'LEADER_PANEL.EVENTS.LIST.PARTICIPATION_RATE', pipe: PercentPipe },
    });
  }

  onSort(sort: Sort) {
    this.sort.emit(sort);
  }

  onRowClick(event: Event) {
    this.rowClick.emit(event);
  }
}
