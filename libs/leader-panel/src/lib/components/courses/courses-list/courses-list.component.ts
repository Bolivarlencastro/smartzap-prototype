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
import { Course } from '../../../models/course';
import { DataExporterService } from '../../../services/data-exporter.service';

@Component({
  selector: 'lp-courses-list',
  imports: [
    DecimalPipe,
    KpDurationPipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    PercentPipe,
    TranslocoPipe,
    MatHeaderCellDef,
    MatSort,
    MatSortHeader,
    MatIcon,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './courses-list.component.html',
  providers: [KpDurationPipe, PercentPipe, DataExporterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesListComponent {
  protected readonly displayedColumns = [
    'course_name',
    'duration',
    'enrollments_count',
    'overdue_count',
    'completion_rate',
    'average_progress',
  ];

  readonly isLoading = input<boolean>();
  readonly courses = input<Course[]>();
  readonly sort = output<Sort>();
  readonly rowClick = output<Course>();
  readonly hideTable = computed(() => this.isLoading() || !this.courses()?.length);
  readonly showEmptyState = computed(() => !this.isLoading() && !this.courses()?.length);
  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  constructor(private readonly dataExporter: DataExporterService) {}

  exportTable() {
    this.dataExporter.exportToCSV<Course>('courses.csv', this.courses(), {
      course_name: { title: 'LEADER_PANEL.COURSES.LIST.NAME' },
      duration: { title: 'LEADER_PANEL.COURSES.LIST.DURATION', pipe: KpDurationPipe },
      enrollments_count: { title: 'LEADER_PANEL.COURSES.LIST.ENROLLED_COUNT' },
      overdue_count: { title: 'LEADER_PANEL.COURSES.LIST.OVERDUE_COUNT' },
      completion_rate: { title: 'LEADER_PANEL.COURSES.LIST.CONCLUSION_RATE', pipe: PercentPipe },
      average_progress: { title: 'LEADER_PANEL.COURSES.LIST.AVERAGE_PROGRESS', pipe: PercentPipe },
    });
  }

  onSort(sort: Sort) {
    this.sort.emit(sort);
  }

  onRowClick(course: Course) {
    this.rowClick.emit(course);
  }
}
