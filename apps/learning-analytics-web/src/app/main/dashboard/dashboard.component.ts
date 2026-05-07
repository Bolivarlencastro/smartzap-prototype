import { Component, OnInit } from '@angular/core';
import { WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable } from 'rxjs';
import { DashboardChartType, DashboardCourseTotals, DashboardPeriodType } from './dashboard.model';

import { DashboardService } from './dashboard.service';
import { format } from 'date-fns';
import { FuseScrollbarModule } from '@keeps-platform-frontend-workspace/layout';
import {
  ChartOverviewCardComponent,
  ChartOverviewComponent,
  KpButtonFilterGroupComponent,
  KpSlideFilterRangeComponent,
} from 'app/main/dashboard/components';
import { AsyncPipe } from '@angular/common';
import { KpLoadingProgressShadeComponent } from '@keeps-platform-frontend-workspace/ui/kp-loading-progress-shade';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'kp-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    FuseScrollbarModule,
    KpButtonFilterGroupComponent,
    ChartOverviewComponent,
    KpSlideFilterRangeComponent,
    ChartOverviewCardComponent,
    KpLoadingProgressShadeComponent,
    AsyncPipe,
    TranslocoPipe,
  ],
  providers: [DashboardService],
})
export class DashboardComponent implements OnInit {
  ragesPeriod: any;
  periodType: typeof DashboardPeriodType = DashboardPeriodType;
  selectedPeriod: DashboardPeriodType;
  selectedMonth!: number;
  selectedYear!: number;
  loading$: Observable<boolean>;

  ragesDimension: any;
  chartType: typeof DashboardChartType = DashboardChartType;
  selectedChartType: DashboardChartType;

  chartData: any;

  totalNewUsers!: number;
  targetNewUsers!: number;

  widget1: any;
  widget2: any;
  widget3: any;

  courseTotals: any;
  courseTotalsIsLoading$!: Observable<boolean>;

  constructor(
    private service: DashboardService,
    private workspaceService: WorkspaceService,
  ) {
    this.selectedPeriod = this.periodType.YEAR;
    this.selectedChartType = this.chartType.USERS;
    this.resetSliderFilterData();
    this.loading$ = service.loading;

    this.ragesDimension = {
      USERS: this.chartType.USERS,
      COURSES: this.chartType.COURSES,
    };

    this.ragesPeriod = {
      YEAR: this.periodType.YEAR,
      MONTH: this.periodType.MONTH,
    };
  }

  ngOnInit(): void {
    this.updateData();
  }

  resetSliderFilterData(): void {
    this.selectedMonth = +format(new Date(), 'MM');
    this.selectedYear = +format(new Date(), 'yyyy');
  }

  onChangePeriod(selectedPeriod: any): void {
    this.selectedPeriod = selectedPeriod;
    this.resetSliderFilterData();
    this.updateData();
  }

  onChangeChartType(selectedChartType: any): void {
    this.selectedChartType = selectedChartType;
    this.updateData();
  }

  updateData(): void {
    const { id = '' } = this.workspaceService.getCurrentWorkspace() || {};
    const filters = {
      type: this.selectedPeriod,
      chartType: this.selectedChartType,
      selectedMonth: this.selectedMonth,
      selectedYear: this.selectedYear,
      workspace_id: id,
    };

    switch (this.selectedChartType) {
      case this.chartType.COURSES:
        this.updateDataCourses(filters);
        break;

      case this.chartType.USERS:
        this.updateDataUsers(filters);
        break;

      default:
        break;
    }
  }

  onChangeSlideFilter(value: number): void {
    switch (this.selectedPeriod) {
      case DashboardPeriodType.MONTH:
        this.selectedMonth = value;
        this.updateData();
        break;

      case DashboardPeriodType.YEAR:
        this.selectedYear = value;
        this.updateData();
        break;

      default:
        break;
    }
  }

  updateDataUsers(filters: DashboardCourseTotals): void {
    this.service.getCourseActiveUsersData(filters).subscribe((data) => {
      const { chartData, widget1, widget2, widget3 } = this.service.getChartDataUsers(
        data,
        this.selectedPeriod,
        this.periodType,
      );
      const options = this.service.getChartOptions(filters);

      this.chartData = { result: chartData, options };
      this.widget1 = widget1;
      this.widget2 = widget2;
      this.widget3 = widget3;
    });
  }

  updateDataCourses(filters: DashboardCourseTotals): void {
    this.service.getCourseDashboardData(filters).subscribe((data) => {
      if (data.length > 0) {
        const { chartData, widget1, widget2, widget3 } = this.service.getChartDataCourses(
          data,
          this.selectedPeriod,
          this.periodType,
        );
        const options = this.service.getChartOptions(filters);

        this.chartData = { result: chartData, options };
        this.widget1 = widget1;
        this.widget2 = widget2;
        this.widget3 = widget3;
      }
    });
  }
}
