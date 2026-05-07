import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';

import {
  AnalyticsApiFilter,
  AnalyticsApiPageFilter,
  CourseListResponse,
  KpExporterService,
  LabelValue,
  LazyResponse,
} from '@keeps-platform-frontend-workspace/kp-keeps';

import { AsyncPipe, DecimalPipe } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
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
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { KpAnalyticsChartFilterComponent } from '@keeps-platform-frontend-workspace/ui/kp-analytics-chart-filter';
import { KpAnalyticsDonutChartComponent } from '@keeps-platform-frontend-workspace/ui/kp-analytics-donut-chart';
import { KpAnalyticsFunnelChartComponent } from '@keeps-platform-frontend-workspace/ui/kp-analytics-funnel-chart';
import { KpExportFormat, KpExportMenuComponent } from '@keeps-platform-frontend-workspace/ui/kp-export-menu';
import { KpLoadingProgressShadeComponent } from '@keeps-platform-frontend-workspace/ui/kp-loading-progress-shade';
import { KpNumberToTimePipe } from '@keeps-platform-frontend-workspace/ui/kp-number-to-time';
import { KpPerformancePipe } from '@keeps-platform-frontend-workspace/ui/kp-performance';
import { KpProgressCircleComponent } from '@keeps-platform-frontend-workspace/ui/kp-progress-circle';
import { KpReplacePipe } from '@keeps-platform-frontend-workspace/ui/kp-replace';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { KpVarDirective } from '@keeps-platform-frontend-workspace/ui/kp-var';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Observable } from 'rxjs';
import { CourseTopFiveChartComponent } from '../components';
import { CourseOverviewService } from './course-overview.service';

@Component({
  selector: 'app-course-overview',
  templateUrl: './course-overview.component.html',
  styles: [
    `
      .table-container {
        min-height: 460px;
        overflow-y: auto;
        position: relative;
        display: flex;
      }
    `,
  ],
  providers: [CourseOverviewService],
  imports: [
    MatCard,
    KpAnalyticsChartFilterComponent,
    KpVarDirective,
    KpLoadingProgressShadeComponent,
    KpAnalyticsFunnelChartComponent,
    KpProgressCircleComponent,
    KpAnalyticsDonutChartComponent,
    CourseTopFiveChartComponent,
    KpTableLayoutComponent,
    KpExportMenuComponent,
    NgxSkeletonLoaderModule,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    MatTooltip,
    MatIconButton,
    RouterLink,
    MatIcon,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    AsyncPipe,
    DecimalPipe,
    TranslocoPipe,
    KpNumberToTimePipe,
    KpPerformancePipe,
    KpReplacePipe,
  ],
})
export class CourseOverviewComponent implements OnInit {
  searchTerm: string;
  pageIndex = 0;
  readonly pageSize = 10;
  readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };
  private sortActive = 'name.sortable';
  private sortDirection: 'asc' | 'desc' = 'asc';
  displayedColumns: string[];
  courses$: Observable<LazyResponse<CourseListResponse>>;

  coursesResume$: Observable<LazyResponse<LabelValue[]>>;
  courseTotals$: Observable<LazyResponse<number>>;
  coursesRating$: Observable<LazyResponse<number>>;
  coursesCompletedRatio$: Observable<LazyResponse<number>>;
  coursesContentConsumed$: Observable<LazyResponse<number>>;
  coursesContentAvailable$: Observable<LazyResponse<number>>;
  coursesContentTypes$: Observable<LazyResponse<LabelValue[]>>;
  top5CourseCategories$: Observable<LazyResponse<LabelValue[]>>;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    translateService: TranslocoService,
    private _courseService: CourseOverviewService,
    private _kpExporterService: KpExporterService,
  ) {
    this.displayedColumns = [
      'name.sortable',
      'course_category.name.sortable',
      'stats.enrollment.total',
      'stats.enrollment.completed',
      'stats.enrollment.completed_ratio',
      'stats.rating.average',
      'buttons',
    ];
    this.searchTerm = '';
    this.courses$ = _courseService.courses$;
    this.courseTotals$ = _courseService.total$;
    this.top5CourseCategories$ = _courseService.top5CourseCategories$;
    this.coursesContentTypes$ = _courseService.coursesContentTypes$;
    this.coursesResume$ = _courseService.coursesResume$;
    this.coursesCompletedRatio$ = _courseService.coursesCompletedRatio$;
    this.coursesContentConsumed$ = _courseService.coursesContentConsumed$;
    this.coursesRating$ = _courseService.coursesRating$;
    this.coursesContentAvailable$ = _courseService.coursesContentAvailable$;

    translateService.langChanges$.subscribe(() => {
      this.reloadCharts();
    });
  }

  ngOnInit(): void {
    this.reloadCharts();
    this.dataTableReload();
  }

  applyFilter(term: string): void {
    this.pageIndex = 0;
    this.searchTerm = term;
    this.dataTableReload();
  }

  onDatatableExport(format: KpExportFormat): void {
    if (format === 'pdf') {
      this.exportPDF();
      return;
    }

    KpExporterService.exportAsTabulatedData('analytics-course-list', 'coursesOverviewTable');
  }

  onPaging(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.dataTableReload();
  }

  onSort(): void {
    this.sortActive = this.sort.active;
    this.sortDirection = this.sort.direction as 'asc' | 'desc';
    this.pageIndex = 0;
    this.dataTableReload();
  }

  onFilterChart(filter: AnalyticsApiFilter): void {
    this.reloadCharts(filter);
  }

  private dataTableReload(): void {
    const filters = this.getDataTableFilters();
    this._courseService.fetchCoursesList(filters);
  }

  private getDataTableFilters(): AnalyticsApiPageFilter {
    const filters: AnalyticsApiPageFilter = {
      page: this.pageIndex,
      page_size: this.pageSize,
      search_term: this.searchTerm || '',
    };

    const direction = this.sort?.direction || this.sortDirection;
    const active = this.sort?.active || this.sortActive;
    filters.sort = (direction === 'desc' ? '-' : '') + active;

    return filters;
  }

  private reloadCharts(filter?: AnalyticsApiFilter): void {
    const params = filter || {};
    this._courseService.fetchCourseTotals(params);
    this._courseService.fetchCoursesResume(params);
    this._courseService.fetchCoursesRating(params);
    this._courseService.fetchCoursesCompletedRatio(params);
    this._courseService.fetchCoursesContentConsumed(params);
    this._courseService.fetchCoursesContentAvailable(params);
    this._courseService.fetchCoursesCategories(params);
    this._courseService.fetchCoursesContentTypes(params);
  }

  private exportPDF(): void {
    const columns = [
      'COURSE.OVERVIEW.DATATABLE.COLUMN.NAME',
      'COURSE.OVERVIEW.DATATABLE.COLUMN.CATEGORY',
      'COURSE.OVERVIEW.DATATABLE.COLUMN.ENROLLMENT',
      'COURSE.OVERVIEW.DATATABLE.COLUMN.ENROLLMENT_COMPLETED',
      'COURSE.OVERVIEW.DATATABLE.COLUMN.ENROLLMENT_RATIO',
      'COURSE.OVERVIEW.DATATABLE.COLUMN.RATING',
    ];
    this._kpExporterService.exportPDF('#coursesOverviewTable', 'analytics-course-list.pdf', columns);
  }
}
