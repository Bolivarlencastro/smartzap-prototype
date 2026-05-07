import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  AnalyticsApiFilter,
  AnalyticsResponseRange,
  LabelValue,
  LazyResponse,
  UserActivitiesStats,
  UserDataResponse,
  UserDataStats,
  UserSource,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoModule } from '@jsverse/transloco';
import { constants } from '../../constants';
import { KpAnalyticsDonutChartComponent } from '../kp-analytics-donut-chart';
import { KpPerformanceDistributionChartComponent } from '../kp-performance-distribution-chart';
import { KpTopFiveChartComponent } from '../kp-top-five-chart';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { KpAnalyticsChartFilterComponent } from '../kp-analytics-chart-filter';
import { KpVarDirective } from '../../directives/kp-var/kp-var.directive';
import { KpLoadingProgressShadeComponent } from '../kp-loading-progress-shade';
import { KpNumberToTimePipe } from '../../pipes/kp-number-to-time/kp-number-to-time.pipe';
import { KpProgressCircleComponent } from '../kp-progress-circle/kp-progress-circle.component';

@Component({
  selector: 'kp-user-details-charts',
  imports: [
    CommonModule,
    MatCardModule,
    TranslocoModule,
    KpPerformanceDistributionChartComponent,
    KpTopFiveChartComponent,
    KpAnalyticsDonutChartComponent,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    KpAnalyticsChartFilterComponent,
    KpVarDirective,
    KpLoadingProgressShadeComponent,
    KpNumberToTimePipe,
    KpProgressCircleComponent,
  ],
  templateUrl: './kp-user-details-charts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpUserDetailsChartsComponent {
  @Input() userData: UserSource | null;
  @Input() userResponse: LazyResponse<UserDataResponse>;
  @Input() userStats: UserDataStats | null;
  @Input() performanceRanges: AnalyticsResponseRange[];
  @Input() activitiesData: UserActivitiesStats;
  @Input() activitiesFilter: string;
  @Input() topEnrollmentCategories: LabelValue[];
  @Input() topContentConsumed: LabelValue[];
  @Input() hideButtonHeader: boolean;

  @Output() activitiesFilterEvent = new EventEmitter<MatButtonToggleChange>();
  @Output() filter = new EventEmitter<AnalyticsApiFilter>();

  readonly defaultAvatar = constants.defaultUserAvatar;
  readonly FILTER_LAST_7_DAYS = 'last_7';
  readonly FILTER_LAST_30_DAYS = 'last_30';

  onActivitiesFilterChanged($value: MatButtonToggleChange): void {
    this.activitiesFilterEvent.emit($value);
  }

  onFilterChart(filter: AnalyticsApiFilter) {
    this.filter.emit(filter);
  }
}
