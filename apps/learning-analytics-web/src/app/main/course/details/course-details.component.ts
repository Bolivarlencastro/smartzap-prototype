import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  CourseDataResponse,
  CourseDataStats,
  CourseSource,
  EnrollmentListResponse,
  Intervals,
  KpExporterService,
  KpExportFormat,
  LabelValue,
  LazyResponse,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { DonutSlice } from '@keeps-platform-frontend-workspace/ui/kp-analytics-donut-chart';
import { NpsRow } from '@keeps-platform-frontend-workspace/ui/kp-course-nps';
import {
  KpTableColumnsComponent,
  loadFormValuesFromLocalStorage,
  saveFormValuesToLocalStorage,
  TableColumnForm,
} from '@keeps-platform-frontend-workspace/ui/kp-table-columns';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { map, Observable, startWith } from 'rxjs';
import { CourseDetailsService } from './course-details.service';
import { KpVarDirective } from '@keeps-platform-frontend-workspace/ui/kp-var';
import { KpCourseDetailsChartsComponent } from '@keeps-platform-frontend-workspace/ui/kp-course-details-charts';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { AsyncPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { MatSlideToggle } from '@angular/material/slide-toggle';
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
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpExportMenuComponent } from '@keeps-platform-frontend-workspace/ui/kp-export-menu';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { KpPerformancePipe } from '@keeps-platform-frontend-workspace/ui/kp-performance';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
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
  providers: [CourseDetailsService],
  imports: [
    KpVarDirective,
    KpCourseDetailsChartsComponent,
    KpTableLayoutComponent,
    KpExportMenuComponent,
    NgxSkeletonLoaderModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    FormsModule,
    ReactiveFormsModule,
    KpTableColumnsComponent,
    MatSlideToggle,
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
    TitleCasePipe,
    DatePipe,
    TranslocoPipe,
    KpPerformancePipe,
  ],
})
export class CourseDetailsComponent implements OnInit {
  private readonly KEY_COURSE_TABLE_COLUMN = 'KEY_COURSE_TABLE_COLUMN';

  pageIndex = 0;
  readonly pageSize = 10;
  readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };
  private sortActive = 'end_date';
  private sortDirection: 'asc' | 'desc' = 'desc';

  courseId!: string;
  response$: Observable<LazyResponse<CourseDataResponse>>;
  courseData$: Observable<CourseSource | null>;
  courseStats$: Observable<CourseDataStats | null>;
  courseNps$: Observable<NpsRow[] | null>;
  firstContentType$: Observable<string | null>;
  rankContentTypes$: Observable<DonutSlice[] | null>;
  enrollmentDistribution$: Observable<LabelValue[] | null>;

  enrollmentList$: Observable<LazyResponse<EnrollmentListResponse>>;
  listSearchTerm!: string;
  listInterval!: Intervals;
  listDisplayedColumns$: Observable<string[]>;
  columnForm: FormGroup<TableColumnForm>;
  columnDefinitions = [
    { def: 'user_name.sortable', label: marker('COURSE.DETAILS.DATATABLE.COLUMN.NAME') },
    { def: 'start_date', label: marker('COURSE.DETAILS.DATATABLE.COLUMN.START_DATE') },
    { def: 'end_date', label: marker('COURSE.DETAILS.DATATABLE.COLUMN.END_DATE') },
    { def: 'performance', label: marker('COURSE.DETAILS.DATATABLE.COLUMN.PERFORMANCE') },
    { def: 'progress', label: marker('COURSE.DETAILS.DATATABLE.COLUMN.PROGRESS') },
    { def: 'buttons', label: marker('GENERAL.MENU') },
  ];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _service: CourseDetailsService,
    private _route: ActivatedRoute,
    private exporterService: KpExporterService,
  ) {
    this.response$ = _service.response$;
    this.courseData$ = _service.courseData$;
    this.courseStats$ = _service.courseStats$;
    this.courseNps$ = _service.courseNps$;
    this.firstContentType$ = _service.firstContentType$;
    this.rankContentTypes$ = _service.rankContentTypes$;
    this.enrollmentDistribution$ = _service.enrollmentDistribution$;
    this.enrollmentList$ = _service.enrollmentList$;

    this.buildColumnForm();
  }

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.courseId = id;
    }

    this.reloadCourseData();
    this.reloadEnrollmentsDatatable();
  }

  reloadCourseData(): void {
    this._service.fetchCourseData(this.courseId);
  }

  reloadEnrollmentsDatatable(): void {
    const filters: any = {
      page: this.pageIndex,
      page_size: this.pageSize,
      search_term: this.listSearchTerm || '',
    };

    const direction = this.sort?.direction || this.sortDirection;
    const active = this.sort?.active || this.sortActive;
    filters.sort = (direction === 'desc' ? '-' : '') + active;

    this._service.fetchCourseEnrollmentList(this.courseId, this.listInterval, filters);
  }

  onDatatableIntervalFilter({ value: period }: { value: Intervals }): void {
    this.listInterval = period;
    this.pageIndex = 0;
    this.reloadEnrollmentsDatatable();
  }

  applyFilter(term: string): void {
    this.pageIndex = 0;
    this.listSearchTerm = term;
    this.reloadEnrollmentsDatatable();
  }

  onPaging(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.reloadEnrollmentsDatatable();
  }

  onDatatableSortChanged(): void {
    this.sortActive = this.sort.active;
    this.sortDirection = this.sort.direction as 'asc' | 'desc';
    this.pageIndex = 0;
    this.reloadEnrollmentsDatatable();
  }

  onDatatableExport(format: KpExportFormat): void {
    if (format === 'pdf') {
      this.exportPDF();
      return;
    }
    KpExporterService.exportAsTabulatedData('analytics-course-enrollments', 'course-details-table');
  }

  private buildColumnForm(): void {
    this.columnForm = new FormGroup({});
    const fixedColumns = ['user_name.sortable', 'performance', 'progress'];

    this.columnDefinitions.forEach((column) => {
      const control = new FormControl({ value: true, disabled: fixedColumns.includes(column.def) });
      this.columnForm.addControl(column.def, control);
    });

    loadFormValuesFromLocalStorage(this.columnForm, this.KEY_COURSE_TABLE_COLUMN);
    this.initializeDisplayedColumnsObservable();
  }

  private initializeDisplayedColumnsObservable(): void {
    this.listDisplayedColumns$ = this.columnForm.valueChanges.pipe(
      startWith(this.columnForm.getRawValue()),
      map(() => {
        const values = this.columnForm.getRawValue();
        saveFormValuesToLocalStorage(values, this.KEY_COURSE_TABLE_COLUMN);
        return this.columnDefinitions.filter((column) => values[column.def]).map((column) => column.def);
      }),
    );
  }

  private exportPDF(): void {
    const columns = [
      'COURSE.CONTENTS.DATATABLE.COLUMN.NAME',
      'COURSE.CONTENTS.DATATABLE.COLUMN.START_DATE',
      'COURSE.CONTENTS.DATATABLE.COLUMN.END_DATE',
      'COURSE.CONTENTS.DATATABLE.COLUMN.PERFORMANCE',
      'COURSE.CONTENTS.DATATABLE.COLUMN.PROGRESS',
    ];
    this.exporterService.exportPDF('#course-details-table', 'analytics-course-enrollments.pdf', columns);
  }
}
