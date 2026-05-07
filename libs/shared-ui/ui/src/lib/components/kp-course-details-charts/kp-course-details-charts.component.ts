import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import {
  CourseDataResponse,
  CourseDataStats,
  CourseSource,
  LabelValue,
  LazyResponse,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoModule } from '@jsverse/transloco';
import { DonutSlice, KpAnalyticsDonutChartComponent } from '../kp-analytics-donut-chart';
import { KpAnalyticsFunnelChartComponent } from '../kp-analytics-funnel-chart';
import { KpCourseNpsComponent, NpsRow } from '../kp-course-nps';
import { MatIconModule } from '@angular/material/icon';
import { KpLoadingProgressShadeComponent } from '../kp-loading-progress-shade';
import { KpVarDirective } from '../../directives';
import { KpProgressCircleComponent } from '../kp-progress-circle';
import { KpNumberToTimePipe } from '../../pipes';
import { KpTextCircleComponent } from '../kp-text-circle';

@Component({
  selector: 'kp-course-details-charts',
  imports: [
    CommonModule,
    TranslocoModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
    KpAnalyticsDonutChartComponent,
    KpAnalyticsFunnelChartComponent,
    KpCourseNpsComponent,
    MatIconModule,
    KpLoadingProgressShadeComponent,
    KpVarDirective,
    KpProgressCircleComponent,
    KpNumberToTimePipe,
    KpTextCircleComponent,
  ],
  templateUrl: './kp-course-details-charts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpCourseDetailsChartsComponent {
  @Input() response: LazyResponse<CourseDataResponse>;
  @Input() courseData: CourseSource | null;
  @Input() courseStats: CourseDataStats | null;
  @Input() enrollmentDistribution: LabelValue[] | null;
  @Input() courseNps: NpsRow[] | null;
  @Input() courseId: string;
  @Input() firstContentType: string | null;
  @Input() rankContentTypes: DonutSlice[] | null;
  @Input() showRouteButtons = false;
}
