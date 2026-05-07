import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import {
  AnalyticsApiFilter,
  AnalyticsResponseRange,
  KpExporterService,
  LabelValue,
  LazyResponse,
  StatsVariation,
  UserActivitiesStats,
  UserDataResponse,
  UserDataStats,
  UserSource,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { UserDetailsService } from './user-details.service';
import { KpExportFormat, KpExportMenuComponent } from '@keeps-platform-frontend-workspace/ui/kp-export-menu';
import { UserFilterService } from '../services/user-filter.service';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { KpVarDirective } from '@keeps-platform-frontend-workspace/ui/kp-var';
import { KpUserDetailsChartsComponent } from '@keeps-platform-frontend-workspace/ui/kp-user-details-charts';
import { AsyncPipe, DatePipe, PercentPipe } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
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
import { TranslocoPipe } from '@jsverse/transloco';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
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
  providers: [UserDetailsService, UserFilterService],
  imports: [
    KpVarDirective,
    KpUserDetailsChartsComponent,
    KpTableLayoutComponent,
    KpExportMenuComponent,
    NgxSkeletonLoaderModule,
    MatIconButton,
    MatIcon,
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
    PercentPipe,
    DatePipe,
    TranslocoPipe,
  ],
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  pageIndex = 0;
  readonly pageSize = 10;
  readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };
  private sortActive = 'start_date';
  private sortDirection: 'asc' | 'desc' = 'desc';

  readonly FILTER_LAST_7_DAYS = 'last_7';
  readonly FILTER_LAST_30_DAYS = 'last_30';

  readonly defaultAvatar = environment.defaultUserAvatar;

  userId!: string;
  userResponse$: Observable<LazyResponse<UserDataResponse>>;
  userData$: Observable<UserSource | null>;
  userStats$: Observable<UserDataStats | null>;
  performanceRanges$: Observable<AnalyticsResponseRange[]>;
  topEnrollmentCategories$: Observable<LabelValue[]>;
  topContentConsumed$: Observable<LabelValue[]>;
  userEnrollmentList$: Observable<LazyResponse>;

  activitiesFilter$ = new BehaviorSubject<string>(this.FILTER_LAST_30_DAYS);
  activitiesData$!: Observable<UserActivitiesStats>;

  listSearchTerm!: string | undefined;
  listDisplayedColumns: string[];

  @ViewChild(MatSort) sort!: MatSort;

  private _filterDialogSub: Subscription;

  constructor(
    private _service: UserDetailsService,
    private _route: ActivatedRoute,
    private _pdfExporterService: KpExporterService,
    private _userFilterService: UserFilterService,
  ) {
    this.userResponse$ = _service.userResponse$;
    this.userData$ = _service.userData$;
    this.userStats$ = _service.userStats$;
    this.performanceRanges$ = _service.performanceRanges$;
    this.topEnrollmentCategories$ = _service.topEnrollmentCategories$;
    this.topContentConsumed$ = _service.topContentConsumed$;

    this.userEnrollmentList$ = _service.userEnrollmentList$;
    this.listDisplayedColumns = [
      'course_name.sortable',
      'category_name.sortable',
      'start_date',
      'end_date',
      'completed_rate',
      'quizzes',
    ];

    this.buildActivitiesStats();
  }

  ngOnInit(): void {
    const userId = this._route.snapshot.paramMap.get('id');
    if (userId) {
      this.userId = userId;
    }

    this.reloadUserData();
    this.reloadUserEnrollments();
  }

  ngOnDestroy() {
    this._filterDialogSub?.unsubscribe();
  }

  onFilterChart(filter: AnalyticsApiFilter) {
    this.reloadUserData(filter);
  }

  reloadUserData(filter?: AnalyticsApiFilter): void {
    const params = filter || {};
    this._service.fetchUserData(this.userId, params);
  }

  onActivitiesFilterChanged($value: MatButtonToggleChange): void {
    this.activitiesFilter$.next($value.value);
  }

  applyFilter(searchTerm?: string): void {
    this.pageIndex = 0;
    this.listSearchTerm = searchTerm;
    this.reloadUserEnrollments();
  }

  onPaging(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.reloadUserEnrollments();
  }

  onDatatableSortChanged(): void {
    this.sortActive = this.sort.active;
    this.sortDirection = this.sort.direction as 'asc' | 'desc';
    this.pageIndex = 0;
    this.reloadUserEnrollments();
  }

  exportTable(format: KpExportFormat): void {
    if (format === 'pdf') {
      this.exportPDF();
      return;
    }

    KpExporterService.exportAsTabulatedData('analytics-user-enrollments', 'userDetailsTable');
  }

  reloadUserEnrollments(): void {
    const currentFilter = this._userFilterService.getCurrentFilter();
    const direction = this.sort?.direction || this.sortDirection;
    const active = this.sort?.active || this.sortActive;
    const filters: any = {
      page: this.pageIndex,
      page_size: this.pageSize,
      search_term: this.listSearchTerm || '',
      sort: (direction === 'desc' ? '-' : '') + active,
      ...currentFilter,
    };

    this._service.fetchUserEnrollments(this.userId, filters);
  }

  openFilters() {
    this._filterDialogSub = this._userFilterService.openFilters('details').subscribe(() => {
      this.pageIndex = 0;
      this.reloadUserEnrollments();
    });
  }

  private buildActivitiesStats(): void {
    this.activitiesData$ = combineLatest([
      this.activitiesFilter$,
      this._service.userStats$.pipe(map((stats) => stats?.activities)),
    ]).pipe(
      map(([filter, stats]) => {
        let m_current = 0;
        let m_previous = 0;
        let p_current = 0;
        let p_previous = 0;

        if (stats) {
          if (filter === this.FILTER_LAST_30_DAYS) {
            m_current = stats.courses_recent_activities.last_30_days.unique_courses.value;
            m_previous = stats.courses_recent_activities.previous_30_days.unique_courses.value;
            p_current = stats.pulses_recent_activities.last_30_days.unique_pulses.value;
            p_previous = stats.pulses_recent_activities.previous_30_days.unique_pulses.value;
          } else if (filter === this.FILTER_LAST_7_DAYS) {
            m_current = stats.courses_recent_activities.last_7_days.unique_courses.value;
            m_previous = stats.courses_recent_activities.previous_7_days.unique_courses.value;
            p_current = stats.pulses_recent_activities.last_7_days.unique_pulses.value;
            p_previous = stats.pulses_recent_activities.previous_7_days.unique_pulses.value;
          }
        }

        const activitiesStats: UserActivitiesStats = {
          missions: {
            total: m_current,
            previous: m_previous,
            variation: this.buildVariation(m_current, m_previous),
          },
          pulses: {
            total: p_current,
            previous: p_previous,
            variation: this.buildVariation(p_current, p_previous),
          },
        };

        return activitiesStats;
      }),
    );
  }

  private buildVariation(current: number, previous: number): StatsVariation {
    let rate = 0;

    if (previous) {
      rate = (current - previous) / previous;
    } else if (current) {
      rate = 1;
    }

    if (rate > 0) {
      return {
        rate,
        dir: 'inc',
        class: 'text-green-500',
        icon: 'trending_up',
      };
    }

    if (rate < 0) {
      return {
        rate,
        dir: 'dec',
        class: 'text-red-500',
        icon: 'trending_down',
      };
    }

    return {
      rate,
      dir: 'eq',
      class: 'text-gray-500',
      icon: 'trending_flat',
    };
  }

  private exportPDF(): void {
    const columns = [
      'USERS.DETAILS.DATATABLE.COLUMN.NAME',
      'USERS.DETAILS.DATATABLE.COLUMN.CATEGORY',
      'USERS.DETAILS.DATATABLE.COLUMN.START_DATE',
      'USERS.DETAILS.DATATABLE.COLUMN.COMPLETED_DATE',
      'USERS.DETAILS.DATATABLE.COLUMN.PERFORMANCE',
      'USERS.DETAILS.DATATABLE.COLUMN.QUIZZES',
    ];

    this._pdfExporterService.exportPDF('#userDetailsTable', 'analytics-user-enrollments.pdf', columns);
  }
}
