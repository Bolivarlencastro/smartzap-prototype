import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  CourseContentFilter,
  CourseContentListResponse,
  CourseDataResponse,
  CourseSource,
  KpExporterService,
  LazyResponse,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable } from 'rxjs';
import { CONTENT_TYPE, CONTENT_TYPES, CourseContentsService } from './course-contents.service';
import { KpExportFormat, KpExportMenuComponent } from '@keeps-platform-frontend-workspace/ui/kp-export-menu';
import { KpVarDirective } from '@keeps-platform-frontend-workspace/ui/kp-var';
import { AsyncPipe, DecimalPipe, NgStyle, UpperCasePipe } from '@angular/common';
import { KpLoadingProgressShadeComponent } from '@keeps-platform-frontend-workspace/ui/kp-loading-progress-shade';
import { MatCard } from '@angular/material/card';
import { MatIconAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
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
import { TranslocoPipe } from '@jsverse/transloco';
import { KpContentIconColorPipe } from '@keeps-platform-frontend-workspace/ui/kp-content-icon-color';
import { KpContentIconName } from '@keeps-platform-frontend-workspace/ui/kp-content-icon-name';
import { KpNumberToTimePipe } from '@keeps-platform-frontend-workspace/ui/kp-number-to-time';
import { KpPerformancePipe } from '@keeps-platform-frontend-workspace/ui/kp-performance';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-course-contents',
  templateUrl: './course-contents.component.html',
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
  providers: [CourseContentsService],
  imports: [
    KpVarDirective,
    RouterLink,
    KpLoadingProgressShadeComponent,
    KpTableLayoutComponent,
    KpExportMenuComponent,
    NgxSkeletonLoaderModule,
    MatCard,
    MatIconAnchor,
    MatIcon,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    NgStyle,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    MatTooltip,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    AsyncPipe,
    UpperCasePipe,
    DecimalPipe,
    TranslocoPipe,
    KpContentIconColorPipe,
    KpContentIconName,
    KpNumberToTimePipe,
    KpPerformancePipe,
  ],
})
export class CourseContentsComponent implements OnInit {
  pageIndex = 0;
  readonly pageSize = 10;
  readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };

  contentTypes = Object.values(CONTENT_TYPES);

  courseId!: string | null;

  response$: Observable<LazyResponse<CourseDataResponse>>;
  courseData$: Observable<CourseSource | null>;

  contentList$: Observable<LazyResponse<CourseContentListResponse>>;
  listTypeFilter!: CONTENT_TYPE;
  listSearchTerm!: string;
  listDisplayedColumns: string[] = [
    'icon',
    'content_name.sortable',
    'stats.activities.total_views',
    'stats.activities.total_seconds',
    'stats.enrollments.engagement_rate',
  ];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _service: CourseContentsService,
    private _route: ActivatedRoute,
    private exporterService: KpExporterService,
  ) {
    this.response$ = _service.response$;
    this.courseData$ = _service.courseData$;
    this.contentList$ = _service.contentList$;
  }

  ngOnInit(): void {
    this.courseId = this._route.snapshot.paramMap.get('id');
    this.reloadCourseData();
    this.reloadContentsDatatable();
  }

  reloadCourseData(): void {
    if (this.courseId) {
      this._service.fetchCourseData(this.courseId);
    }
  }

  reloadContentsDatatable(): void {
    const filters: CourseContentFilter = {
      page: this.pageIndex,
      page_size: this.pageSize,
    };

    if (this.listSearchTerm) {
      filters.search_term = this.listSearchTerm;
    }

    if (this.listTypeFilter) {
      filters.type = this.listTypeFilter.key;
    }

    if (this.sort?.direction) {
      filters.sort = (this.sort.direction === 'desc' ? '-' : '') + this.sort.active;
    }

    if (this.courseId) {
      this._service.fetchCourseContents(this.courseId, filters);
    }
  }

  applyFilter(term: string): void {
    this.pageIndex = 0;
    this.listSearchTerm = term;
    this.reloadContentsDatatable();
  }

  onDatatableTypeFilter(change: MatSelectChange): void {
    this.pageIndex = 0;
    this.listTypeFilter = change.value;
    this.reloadContentsDatatable();
  }

  onPaging(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.reloadContentsDatatable();
  }

  onDatatableSortChanged(): void {
    this.pageIndex = 0;
    this.reloadContentsDatatable();
  }

  onDatatableExport(format: KpExportFormat): void {
    if (format === 'pdf') {
      this.exportPDF();
      return;
    }
    KpExporterService.exportAsTabulatedData('analytics-course-contents', 'course-contents-table');
  }

  private exportPDF(): void {
    const columns = [
      'COURSE.CONTENTS.DATATABLE.COLUMN.NAME',
      'COURSE.CONTENTS.DATATABLE.COLUMN.QUANTITY',
      'COURSE.CONTENTS.DATATABLE.COLUMN.VIEW_TIME',
      'COURSE.CONTENTS.DATATABLE.COLUMN.ENGAGEMENT',
    ];
    this.exporterService.exportPDF('#course-contents-table', 'analytics-course-contents.pdf', columns);
  }
}
