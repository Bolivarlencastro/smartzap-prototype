import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  AnalyticsDetailsDialog,
  CourseDataResponse,
  CourseDataStats,
  CourseSource,
  LabelValue,
  LazyResponse,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoModule } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { CourseDetailsService } from '../../services/course-details.service';
import { getTranslocoScope } from '../../util';
import { KpCourseDetailsChartsComponent } from '@keeps-platform-frontend-workspace/ui/kp-course-details-charts';
import { NpsRow } from '@keeps-platform-frontend-workspace/ui/kp-course-nps';
import { DonutSlice } from '@keeps-platform-frontend-workspace/ui/kp-analytics-donut-chart';

@Component({
  selector: 'kp-course-details-dialog',
  template: `
    <div class="flex flex-col gap-1">
      <div class="flex items-center justify-between pt-2 pl-5 pr-2">
        <span class="text-xl">{{ 'ANALYTICS.COURSE_DETAILS_DIALOG.TITLE' | transloco }}</span>
        <button mat-icon-button (click)="closeDialog()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <span class="text-sm mb-5 px-5">{{ 'ANALYTICS.COURSE_DETAILS_DIALOG.SUBTITLE' | transloco }}</span>
      <kp-course-details-charts
        class="px-5"
        [response]="response$ | async"
        [courseData]="courseData$ | async"
        [courseStats]="courseStats$ | async"
        [enrollmentDistribution]="enrollmentDistribution$ | async"
        [courseNps]="courseNps$ | async"
        [courseId]="courseId"
        [firstContentType]="firstContentType$ | async"
        [rankContentTypes]="rankContentTypes$ | async"
      ></kp-course-details-charts>
    </div>
  `,
  imports: [CommonModule, TranslocoModule, MatButtonModule, MatIconModule, KpCourseDetailsChartsComponent],
  providers: [getTranslocoScope(), CourseDetailsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseDetailsDialogComponent implements OnInit {
  courseId: string;
  response$: Observable<LazyResponse<CourseDataResponse>>;
  courseData$: Observable<CourseSource | null>;
  courseStats$: Observable<CourseDataStats | null>;
  enrollmentDistribution$: Observable<LabelValue[] | null>;
  courseNps$: Observable<NpsRow[] | null>;
  firstContentType$: Observable<string | null>;
  rankContentTypes$: Observable<DonutSlice[] | null>;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: AnalyticsDetailsDialog,
    public _dialogRef: MatDialogRef<CourseDetailsDialogComponent>,
    private _service: CourseDetailsService,
  ) {
    this.courseId = data.id;
    this.response$ = _service.response$;
    this.courseData$ = _service.courseData$;
    this.courseStats$ = _service.courseStats$;
    this.courseNps$ = _service.courseNps$;
    this.firstContentType$ = _service.firstContentType$;
    this.rankContentTypes$ = _service.rankContentTypes$;
    this.enrollmentDistribution$ = _service.enrollmentDistribution$;
  }

  ngOnInit(): void {
    this._service.fetchCourseData(this.courseId);
  }

  closeDialog(): void {
    this._dialogRef.close();
  }
}
