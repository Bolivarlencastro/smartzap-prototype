import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { Observable, Subscription } from 'rxjs';

import { AsyncPipe, DecimalPipe, PercentPipe, TitleCasePipe } from '@angular/common';
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
import { TranslocoPipe } from '@jsverse/transloco';
import {
  AnalyticsApiFilter,
  AnalyticsApiUsersFilter,
  KpExporterService,
  LabelValue,
  LazyResponse,
  UserListResponse,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpAnalyticsChartFilterComponent } from '@keeps-platform-frontend-workspace/ui/kp-analytics-chart-filter';
import { KpAnalyticsDonutChartComponent } from '@keeps-platform-frontend-workspace/ui/kp-analytics-donut-chart';
import { KpExportFormat, KpExportMenuComponent } from '@keeps-platform-frontend-workspace/ui/kp-export-menu';
import { KpNumberToTimePipe } from '@keeps-platform-frontend-workspace/ui/kp-number-to-time';
import { KpProgressCircleComponent } from '@keeps-platform-frontend-workspace/ui/kp-progress-circle';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { KpTopFiveChartComponent } from '@keeps-platform-frontend-workspace/ui/kp-top-five-chart';
import { KpVarDirective } from '@keeps-platform-frontend-workspace/ui/kp-var';
import { AnalyticsDualColumnsChartComponent } from 'app/shared/components/analytics-dual-columns-chart/analytics-dual-columns-chart.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { UserFilterService } from '../services/user-filter.service';
import { UsersOverviewService } from './users-overview.service';

@Component({
  selector: 'app-users-overview',
  templateUrl: './users-overview.component.html',
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
  providers: [UsersOverviewService, UserFilterService],
  imports: [
    MatCard,
    KpAnalyticsChartFilterComponent,
    KpTableLayoutComponent,
    KpExportMenuComponent,
    KpVarDirective,
    NgxSkeletonLoaderModule,
    AnalyticsDualColumnsChartComponent,
    KpProgressCircleComponent,
    MatIcon,
    KpTopFiveChartComponent,
    KpAnalyticsDonutChartComponent,
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
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    AsyncPipe,
    DecimalPipe,
    PercentPipe,
    TitleCasePipe,
    TranslocoPipe,
    KpNumberToTimePipe,
  ],
})
export class UsersOverviewComponent implements OnInit, OnDestroy {
  pageIndex = 0;
  readonly pageSize = 10;
  readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };
  private sortActive = 'name.sortable';
  private sortDirection: 'asc' | 'desc' = 'asc';

  totalUsers$: Observable<LazyResponse<number>>;
  activeUsers$: Observable<LazyResponse<number>>;
  enrollmentsDistribution$: Observable<LazyResponse>;
  engagementRate$: Observable<LazyResponse<number>>;
  contentConsumedAveragePerUser$: Observable<LazyResponse<number>>;
  usersCreators$: Observable<LazyResponse<number>>;
  activeUsersAveragePerDay$: Observable<LazyResponse<number>>;
  topEnrollmentCategories$: Observable<LazyResponse<LabelValue[]>>;
  topContentConsumed$: Observable<LazyResponse<LabelValue[]>>;

  usersList$: Observable<LazyResponse<UserListResponse>>;
  listSearchTerm!: string | undefined;
  listDisplayedColumns: string[];

  @ViewChild(MatSort) sort!: MatSort;

  private _filterDialogSub: Subscription;

  constructor(
    private _usersOverviewService: UsersOverviewService,
    private _kpExporterService: KpExporterService,
    private _userFilterService: UserFilterService,
  ) {
    this.totalUsers$ = _usersOverviewService.totalUsers$;
    this.activeUsers$ = _usersOverviewService.activeUsers$;
    this.enrollmentsDistribution$ = _usersOverviewService.enrollmentsDistribution$;
    this.engagementRate$ = _usersOverviewService.engagementRate$;
    this.contentConsumedAveragePerUser$ = _usersOverviewService.contentConsumedAveragePerUser$;
    this.usersCreators$ = _usersOverviewService.usersCreators$;
    this.activeUsersAveragePerDay$ = _usersOverviewService.activeUsersAveragePerDay$;
    this.topEnrollmentCategories$ = _usersOverviewService.topEnrollmentCategories$;
    this.topContentConsumed$ = _usersOverviewService.topContentConsumed$;

    this.usersList$ = _usersOverviewService.usersList$;
    this.listDisplayedColumns = [
      'name.sortable',
      'leader_name',
      'stats.profile.job_name',
      'stats.profile.director',
      'stats.profile.manager',
      'stats.profile.area_of_activity',
      'stats.courses.total',
      'stats.courses.completed',
      'completion_rate',
      'buttons',
    ];
  }

  ngOnInit(): void {
    this.loadChartData();
    this.reloadDatatable();
  }

  ngOnDestroy() {
    this._filterDialogSub?.unsubscribe();
  }

  onFilterChart(filter: AnalyticsApiFilter): void {
    this.loadChartData(filter);
  }

  applyFilter(searchTerm?: string): void {
    this.pageIndex = 0;
    this.listSearchTerm = searchTerm;
    this.reloadDatatable();
  }

  onPaging(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.reloadDatatable();
  }

  onDatatableSortChanged(): void {
    this.sortActive = this.sort.active;
    this.sortDirection = this.sort.direction as 'asc' | 'desc';
    this.pageIndex = 0;
    this.reloadDatatable();
  }

  exportTable(format: KpExportFormat): void {
    if (format === 'pdf') {
      this.exportPDF();
      return;
    }

    KpExporterService.exportAsTabulatedData('analytics-user-list', 'usersOverviewTable');
  }

  openFilters() {
    this._filterDialogSub = this._userFilterService.openFilters('overview').subscribe(() => {
      this.pageIndex = 0;
      this.reloadDatatable();
    });
  }

  private loadChartData(filter?: AnalyticsApiFilter): void {
    const params = filter || {};
    this._usersOverviewService.fetchAllForInterval(params);
  }

  private reloadDatatable(): void {
    const currentFilter = this._userFilterService.getCurrentFilter();
    const direction = this.sort?.direction || this.sortDirection;
    const active = this.sort?.active || this.sortActive;
    const filters: AnalyticsApiUsersFilter = {
      page: this.pageIndex,
      page_size: this.pageSize,
      search_term: this.listSearchTerm || '',
      sort: (direction === 'desc' ? '-' : '') + active,
      ...currentFilter,
    };

    this._usersOverviewService.fetchUsersList(filters);
  }

  private exportPDF(): void {
    const columns = [
      'USERS.OVERVIEW.DATATABLE.COLUMN.NAME',
      'USERS.OVERVIEW.DATATABLE.COLUMN.LEADER',
      'USERS.OVERVIEW.DATATABLE.COLUMN.JOB',
      'USERS.OVERVIEW.DATATABLE.COLUMN.DIRECTOR',
      'USERS.OVERVIEW.DATATABLE.COLUMN.MANAGER',
      'USERS.OVERVIEW.DATATABLE.COLUMN.AREA',
      'USERS.OVERVIEW.DATATABLE.COLUMN.COURSES_COMPLETED',
      'USERS.OVERVIEW.DATATABLE.COLUMN.COMPLETED_RATIO',
    ];
    this._kpExporterService.exportPDF('#usersOverviewTable', 'analytics-user-list.pdf', columns);
  }
}
